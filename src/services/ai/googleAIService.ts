import { TextGenerationConfig } from '../../types/ai';
import { useSettingsStore } from '../../store/settingsStore';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class GoogleAIService {
  private static async getApiKey(): Promise<string> {
    const settings = useSettingsStore.getState().apiSettings.googleAI;
    if (!settings?.enabled || !settings?.apiKey) {
      throw new Error('Google AI API is not configured');
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
        
        if (error instanceof Error && error.message.includes('rate limit')) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
          continue;
        }
        
        throw error;
      }
    }
    
    throw lastError!;
  }

  static async generateText(config: TextGenerationConfig): Promise<string> {
    return this.withRetry(async () => {
      const apiKey = await this.getApiKey();
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: config.model || 'gemini-pro' });

      const controller = new AbortController();
      if (config.abortSignal) {
        config.abortSignal.addEventListener('abort', () => controller.abort());
      }

      const generationConfig = {
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens,
        topP: config.topP,
      };

      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [{ text: config.prompt }]
        }],
        generationConfig,
        safetySettings: []
      }, {
        signal: controller.signal
      });

      if (!result.response) {
        throw new Error('No response from Google AI');
      }

      const text = result.response.text();
      if (!text) {
        throw new Error('Empty response from Google AI');
      }

      return text;
    });
  }

  static async generateImage(): Promise<string> {
    // Note: Gemini doesn't support image generation yet, fallback to Imagen when available
    throw new Error('Image generation is not yet supported by Google AI');
  }
}
