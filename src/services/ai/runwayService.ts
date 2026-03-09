import { VideoGenerationConfig, ImageGenerationConfig } from '../../types/ai';
import { useSettingsStore } from '../../store/settingsStore';

interface RunwayVideoResponse {
  status: 'succeeded' | 'failed';
  output?: {
    url: string;
  };
  error?: string;
}

interface RunwayImageResponse {
  status: 'succeeded' | 'failed';
  output?: Array<{
    url: string;
  }>;
  error?: string;
}

export class RunwayService {
  private static async getApiKey(): Promise<string> {
    const settings = useSettingsStore.getState().apiSettings.runway;
    if (!settings?.enabled || !settings?.apiKey) {
      throw new Error('Runway API is not configured');
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

  static async generateVideo(config: VideoGenerationConfig): Promise<string> {
    return this.withRetry(async () => {
      const apiKey = await this.getApiKey();
      const controller = new AbortController();
      
      if (config.abortSignal) {
        config.abortSignal.addEventListener('abort', () => controller.abort());
      }

      config.onProgress?.('Starting video generation...');
      
      try {
        const response = await fetch('https://api.runwayml.com/v1/generations', {
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

        const data = await response.json() as RunwayVideoResponse;
        
        if (data.status === 'failed' || data.error) {
          throw new Error(data.error || 'Video generation failed');
        }

        if (!data.output?.url) {
          throw new Error('Invalid response format from Runway API');
        }

        config.onProgress?.('Video generation completed');
        return data.output.url;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Video generation was aborted');
        }
        throw error;
      }
    });
  }

  static async generateImage(config: ImageGenerationConfig): Promise<string> {
    return this.withRetry(async () => {
      const apiKey = await this.getApiKey();
      const controller = new AbortController();
      
      if (config.abortSignal) {
        config.abortSignal.addEventListener('abort', () => controller.abort());
      }

      config.onProgress?.('Starting image generation...');
      
      try {
        const response = await fetch('https://api.runwayml.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            prompt: config.prompt,
            negative_prompt: config.negativePrompt,
            width: config.width || 1024,
            height: config.height || 1024,
            num_outputs: 1,
            guidance_scale: config.guidanceScale || 7.5,
          }),
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json() as RunwayImageResponse;
        
        if (data.status === 'failed' || data.error) {
          throw new Error(data.error || 'Image generation failed');
        }

        if (!data.output?.[0]?.url) {
          throw new Error('Invalid response format from Runway API');
        }

        config.onProgress?.('Image generation completed');
        return data.output[0].url;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Image generation was aborted');
        }
        throw error;
      }
    });
  }
}
