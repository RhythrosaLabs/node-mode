import { TextGenerationConfig } from '../../types/ai';
import { useSettingsStore } from '../../store/settingsStore';

interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AnthropicResponse {
  content: Array<{
    text: string;
    type: 'text';
  }>;
  role: 'assistant';
  model: string;
  stop_reason?: 'end_turn' | 'max_tokens' | 'stop_sequence';
  error?: {
    type: string;
    message: string;
  };
}

export class AnthropicService {
  private static async getApiKey(): Promise<string> {
    const settings = useSettingsStore.getState().apiSettings.anthropic;
    if (!settings?.enabled || !settings?.apiKey) {
      throw new Error('Anthropic API is not configured');
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

      config.onProgress?.('Starting text generation with Claude...');
      
      try {
        const messages: AnthropicMessage[] = [
          { role: 'user', content: config.prompt }
        ];

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2024-01-01',
          },
          body: JSON.stringify({
            model: config.model || 'claude-3-opus-20240229',
            messages,
            system: config.systemPrompt,
            max_tokens: config.maxTokens,
            temperature: config.temperature,
            top_p: config.topP,
          }),
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json() as AnthropicResponse;
        
        if (data.error) {
          throw new Error(`${data.error.type}: ${data.error.message}`);
        }

        if (!data.content?.[0]?.text) {
          throw new Error('Invalid response format from Anthropic API');
        }

        if (data.stop_reason === 'max_tokens') {
          config.onProgress?.('Warning: Response was truncated due to max tokens limit');
        }

        config.onProgress?.('Text generation completed');
        return data.content[0].text;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Text generation was aborted');
        }
        throw error;
      }
    });
  }
}
