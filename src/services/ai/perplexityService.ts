import { TextGenerationConfig } from '../../types/ai';
import { useSettingsStore } from '../../store/settingsStore';

interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  error?: {
    message: string;
  };
}

export class PerplexityService {
  private static async getApiKey(): Promise<string> {
    const settings = useSettingsStore.getState().apiSettings.perplexity;
    if (!settings?.enabled || !settings?.apiKey) {
      throw new Error('Perplexity API is not configured');
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

  static async generateText(config: TextGenerationConfig): Promise<string> {
    return this.withRetry(async () => {
      const apiKey = await this.getApiKey();
      const controller = new AbortController();
      
      if (config.abortSignal) {
        config.abortSignal.addEventListener('abort', () => controller.abort());
      }

      try {
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: config.model || 'pplx-7b-online',
            messages: [
              ...(config.systemPrompt ? [{ role: 'system', content: config.systemPrompt }] : []),
              { role: 'user', content: config.prompt }
            ],
            temperature: config.temperature ?? 0.7,
            max_tokens: config.maxTokens,
            top_p: config.topP,
          }),
          signal: controller.signal
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json() as PerplexityResponse;
        
        if (data.error) {
          throw new Error(data.error.message);
        }

        if (!data.choices?.[0]?.message?.content) {
          throw new Error('Invalid response format from Perplexity API');
        }

        return data.choices[0].message.content;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request was aborted');
        }
        throw error;
      }
    });
  }
}
