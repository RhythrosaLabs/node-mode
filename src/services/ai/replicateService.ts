import { VideoGenerationConfig, AudioGenerationConfig, Model3DConfig, Text2SpeechConfig } from '../../types/ai';
import { useSettingsStore } from '../../store/settingsStore';

interface ReplicateVideoOutput {
  [index: number]: string;  // Array of video URLs
}

interface ReplicateAudioOutput {
  audio: string;
}

interface Replicate3DModelOutput {
  glb: string;
}

type ReplicateOutput = ReplicateVideoOutput | ReplicateAudioOutput | Replicate3DModelOutput;

interface ReplicatePrediction {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  output?: ReplicateOutput;
  error?: string;
  metrics?: {
    predict_time?: number;
  };
}

type ProgressCallback = (message: string) => void;

export class ReplicateService {
  private static async getApiKey(): Promise<string> {
    const settings = useSettingsStore.getState().apiSettings.replicate;
    if (!settings?.enabled || !settings?.apiKey) {
      throw new Error('Replicate API is not configured');
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

  private static async createPrediction(
    version: string, 
    input: Record<string, unknown>,
    signal?: AbortSignal
  ): Promise<string> {
    const apiKey = await this.getApiKey();
    
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      signal,
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version,
        input,
      }),
    });

    const prediction = await response.json();
    return prediction.id;
  }

  private static async getPredictionResult(
    id: string,
    signal?: AbortSignal,
    onProgress?: ProgressCallback
  ): Promise<ReplicateOutput> {
    const apiKey = await this.getApiKey();
    
    while (true) {
      const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
        signal,
        headers: {
          'Authorization': `Token ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const prediction = await response.json() as ReplicatePrediction;
      
      switch (prediction.status) {
        case 'succeeded':
          if (!prediction.output) {
            throw new Error('Prediction succeeded but no output was returned');
          }
          return prediction.output;
        case 'failed':
          throw new Error(prediction.error || 'Prediction failed');
        case 'canceled':
          throw new Error('Prediction was canceled');
        case 'processing':
          onProgress?.(`Processing... ${prediction.metrics?.predict_time ? `(${Math.round(prediction.metrics.predict_time)}s)` : ''}`);
          break;
        case 'starting':
          onProgress?.('Starting prediction...');
          break;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  static async generateVideo(config: VideoGenerationConfig): Promise<string> {
    return this.withRetry(async () => {
      const id = await this.createPrediction(
      'anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351',
      {
        prompt: config.prompt,
        negative_prompt: config.negativePrompt,
        num_frames: config.numFrames || 24,
        fps: config.fps || 8,
        width: config.width || 1024,
        height: config.height || 576,
        seed: config.seed,
      }
    );

      const result = await this.getPredictionResult(
        id,
        config.abortSignal,
        config.onProgress
      );
      
      if (!Array.isArray(result) || !result[0]) {
        throw new Error('Invalid video generation result');
      }

      return result[0];
    });
  }

  static async generateAudio(config: AudioGenerationConfig): Promise<string> {
    return this.withRetry(async () => {
      const id = await this.createPrediction(
      'meta/musicgen:7a76a8258b23fae65c5a22debb8841d1d7e816b75c2f24218cd2bd8573787906',
      {
        prompt: config.prompt,
        duration: config.duration || 8,
        model_version: config.model || 'melody',
      }
    );

      const result = await this.getPredictionResult(
        id,
        config.abortSignal,
        config.onProgress
      ) as { audio?: string };

      if (!result?.audio) {
        throw new Error('Invalid audio generation result');
      }

      return result.audio;
    });
  }

  static async generate3DModel(config: Model3DConfig): Promise<string> {
    return this.withRetry(async () => {
      const id = await this.createPrediction(
      'cjwbw/shap-e:5957069d5c509126a73c7cb68abcddbb985aeefa4d318e7c63ec1352ce6da68c',
      {
        prompt: config.prompt,
        negative_prompt: config.negativePrompt,
        num_inference_steps: config.numInferenceSteps || 64,
        guidance_scale: config.guidanceScale || 15.0,
        seed: config.seed,
      }
    );

      const result = await this.getPredictionResult(
        id,
        config.abortSignal,
        config.onProgress
      ) as { glb?: string };

      if (!result?.glb) {
        throw new Error('Invalid 3D model generation result');
      }

      return result.glb;
    });
  }

  static async textToSpeech(config: Text2SpeechConfig): Promise<string> {
    return this.withRetry(async () => {
      const id = await this.createPrediction(
      'suno-ai/bark:b76242b40d67c76ab6742e987628478ed2fb5765883507ac0256c15f33c10e47',
      {
        prompt: config.text,
        voice_preset: config.voice || 'v2/en_speaker_6',
        language: config.language || 'en',
        speed: config.speed || 1.0,
      }
    );

      const result = await this.getPredictionResult(
        id,
        config.abortSignal,
        config.onProgress
      ) as { audio?: string };

      if (!result?.audio) {
        throw new Error('Invalid text-to-speech result');
      }

      return result.audio;
    });
  }
}
