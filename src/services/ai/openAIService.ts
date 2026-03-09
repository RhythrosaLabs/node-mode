import { TextGenerationConfig, ImageGenerationConfig } from '../../types/ai';
import { useSettingsStore } from '../../store/settingsStore';

export class OpenAIService {
  private static async getApiKey(): Promise<string> {
    const settings = useSettingsStore.getState().apiSettings.openAI;
    if (!settings?.enabled || !settings?.apiKey) {
      throw new Error('OpenAI API is not configured');
    }
    return settings.apiKey;
  }

  static async generateText(config: TextGenerationConfig): Promise<string> {
    const apiKey = await this.getApiKey();
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: config.model || 'gpt-4-turbo-preview',
        messages: [
          ...(config.systemPrompt ? [{ role: 'system', content: config.systemPrompt }] : []),
          { role: 'user', content: config.prompt }
        ],
        temperature: config.temperature ?? 0.7,
        max_tokens: config.maxTokens,
        top_p: config.topP,
        frequency_penalty: config.frequencyPenalty,
        presence_penalty: config.presencePenalty,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  }

  static async generateImage(config: ImageGenerationConfig): Promise<string> {
    const apiKey = await this.getApiKey();
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: config.prompt,
        n: 1,
        size: `${config.width || 1024}x${config.height || 1024}`,
        quality: 'standard',
      }),
    });

    const data = await response.json();
    return data.data[0].url;
  }
}