import { Vector3 } from 'three';

export interface BaseConfig {
  abortSignal?: AbortSignal;
  onProgress?: (message: string) => void;
}

export interface AIModelConfig extends BaseConfig {
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface ImageGenerationConfig extends BaseConfig {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  steps?: number;
  seed?: number;
  guidanceScale?: number;
}

export interface TextGenerationConfig extends AIModelConfig {
  prompt: string;
  systemPrompt?: string;
}

export interface ImageEditConfig extends BaseConfig {
  image: string;
  mask?: string;
  prompt: string;
  strength?: number;
}

export interface VideoGenerationConfig extends BaseConfig {
  prompt: string;
  negativePrompt?: string;
  numFrames?: number;
  fps?: number;
  width?: number;
  height?: number;
  seed?: number;
}

export interface AudioGenerationConfig extends BaseConfig {
  prompt: string;
  duration?: number;
  model?: string;
}

export interface Text2SpeechConfig extends BaseConfig {
  text: string;
  voice?: string;
  language?: string;
  speed?: number;
}

export interface Model3DConfig extends BaseConfig {
  prompt: string;
  negativePrompt?: string;
  numInferenceSteps?: number;
  guidanceScale?: number;
  seed?: number;
}

export interface Model3DRefinementConfig extends BaseConfig {
  model: string;
  prompt: string;
  position?: Vector3;
  rotation?: Vector3;
  scale?: Vector3;
}

export type AINodeConfig = 
  | TextGenerationConfig 
  | ImageGenerationConfig 
  | ImageEditConfig
  | VideoGenerationConfig
  | AudioGenerationConfig
  | Text2SpeechConfig
  | Model3DConfig
  | Model3DRefinementConfig;
