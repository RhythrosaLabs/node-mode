import { ImageGenerationConfig, ImageEditConfig } from '../../types/ai';
import { useSettingsStore } from '../../store/settingsStore';

interface StabilityAIResponse {
  artifacts: Array<{
    base64: string;
    finishReason: 'SUCCESS' | 'ERROR' | 'CONTENT_FILTERED';
    seed: number;
  }>;
  error?: {
    message: string;
    name: string;
  };
}

export class StabilityAIService {
  private static async getApiKey(): Promise<string> {
    const settings = useSettingsStore.getState().apiSettings.stabilityAI;
    if (!settings?.enabled || !settings?.apiKey) {
      throw new Error('Stability AI API is not configured');
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

  static async generateImage(config: ImageGenerationConfig): Promise<string> {
    return this.withRetry(async () => {
      const apiKey = await this.getApiKey();
      const controller = new AbortController();
      
      if (config.abortSignal) {
        config.abortSignal.addEventListener('abort', () => controller.abort());
      }

      config.onProgress?.('Starting image generation...');
      
      try {
        const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            text_prompts: [
              {
                text: config.prompt,
                weight: 1
              },
              ...(config.negativePrompt ? [{
                text: config.negativePrompt,
                weight: -1
              }] : [])
            ],
            cfg_scale: config.guidanceScale || 7,
            height: config.height || 1024,
            width: config.width || 1024,
            steps: config.steps || 30,
            samples: 1,
            seed: config.seed,
          }),
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json() as StabilityAIResponse;
        
        if (data.error) {
          throw new Error(data.error.message);
        }

        if (!data.artifacts?.[0]?.base64) {
          throw new Error('Invalid response format from Stability AI API');
        }

        if (data.artifacts[0].finishReason === 'CONTENT_FILTERED') {
          throw new Error('Content was filtered by safety system');
        }

        config.onProgress?.('Image generation completed');
        return `data:image/png;base64,${data.artifacts[0].base64}`;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Image generation was aborted');
        }
        throw error;
      }
    });
  }

  static async editImage(config: ImageEditConfig): Promise<string> {
    return this.withRetry(async () => {
      const apiKey = await this.getApiKey();
      const controller = new AbortController();
      
      if (config.abortSignal) {
        config.abortSignal.addEventListener('abort', () => controller.abort());
      }

      config.onProgress?.('Starting image edit...');
      
      try {
        const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            init_image: config.image,
            mask: config.mask,
            text_prompts: [
              {
                text: config.prompt,
                weight: 1
              }
            ],
            image_strength: config.strength || 0.35,
            steps: 30,
            samples: 1,
          }),
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json() as StabilityAIResponse;
        
        if (data.error) {
          throw new Error(data.error.message);
        }

        if (!data.artifacts?.[0]?.base64) {
          throw new Error('Invalid response format from Stability AI API');
        }

        if (data.artifacts[0].finishReason === 'CONTENT_FILTERED') {
          throw new Error('Content was filtered by safety system');
        }

        config.onProgress?.('Image edit completed');
        return `data:image/png;base64,${data.artifacts[0].base64}`;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Image edit was aborted');
        }
        throw error;
      }
    });
  }
}
