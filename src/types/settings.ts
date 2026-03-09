export interface APISettings {
  stabilityAI?: {
    apiKey: string;
    enabled: boolean;
  };
  anthropic?: {
    apiKey: string;
    enabled: boolean;
  };
  luma?: {
    apiKey: string;
    enabled: boolean;
  };
  runway?: {
    apiKey: string;
    enabled: boolean;
  };
  openAI?: {
    apiKey: string;
    enabled: boolean;
  };
  perplexity?: {
    apiKey: string;
    enabled: boolean;
  };
  googleAI?: {
    apiKey: string;
    enabled: boolean;
  };
  replicate?: {
    apiKey: string;
    enabled: boolean;
  };
}
