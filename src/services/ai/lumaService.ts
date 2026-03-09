import { VideoGenerationConfig } from '../../types/ai';
import { useSettingsStore } from '../../store/settingsStore';

interface LumaVideoResponse {
  status: 'succeeded' | 'failed' | 'processing';
  output?: {
    url: string;
  };
  error?: string;
  progress?: number;
}

export class LumaService {
  private static async getApiKey(): Promise<string> {
    const settings = useSettingsStore.getState().apiSettings.luma;
    if (!settings?.enabled || !settings?.apiKey) {
      throw new Error('Luma API is not configured');
    }
    return settings.apiKey;
  }

  private static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (error instanceof Error && 
            (error.message.includes('rate limit') || error.message.includes('429'))) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
          continue;
        }
        
        throw error;
      }
    }
    
    throw lastError!;
  }

  private static async pollGenerationStatus(
    id: string,
    apiKey: string,
    signal?: AbortSignal,
    onProgress?: (message: string) => void
  ): Promise<string> {
    while (true) {
      const response = await fetch(`https://api.lumalabs.ai/v1/videos/generations/${id}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as LumaVideoResponse;

      switch (data.status) {
        case 'succeeded':
          if (!data.output?.url) {
            throw new Error('Invalid response format from Luma API');
          }
          return data.output.url;
        case 'failed':
          throw new Error(data.error || 'Video generation failed');
        case 'processing':
          onProgress?.(`Processing video... ${data.progress ? `${Math.round(data.progress * 100)}%` : ''}`);
          break;
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  static async generateVideo(config: VideoGenerationConfig): Promise<string> {
    return this.withRetry(async () => {
      const apiKey = await this.getApiKey();
      const controller = new AbortController();
      
      if (config.abortSignal) {
        config.abortSignal.addEventListener('abort', () => controller.abort());
      }

      config.onProgress?.('Starting video generation...');
      
      try {
        const response = await fetch('https://api.lumalabs.ai/v1/videos/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            prompt: config.prompt,
            negative_prompt: config.negativePrompt,
            num_frames: config.numFrames || 24,
            fps: config.fps || 30,
            width: config.width || 1024,
            height: config.height || 576,
          }),
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json() as { id: string };
        
        if (!data.id) {
          throw new Error('Invalid response format from Luma API');
        }

        const url = await this.pollGenerationStatus(
          data.id,
          apiKey,
          controller.signal,
          config.onProgress
        );

        config.onProgress?.('Video generation completed');
        return url;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Video generation was aborted');
        }
        throw error;
      }
    });
  }
}
