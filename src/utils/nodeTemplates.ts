import { NodeData } from '../types/node';
import { AIModelConfig, ImageGenerationConfig, TextGenerationConfig, VideoGenerationConfig, AudioGenerationConfig, Model3DConfig, Text2SpeechConfig, ImageEditConfig } from '../types/ai';

export const NODE_TYPES = {
  // Text Generation
  OPENAI_TEXT: 'OpenAI Text',
  ANTHROPIC_TEXT: 'Anthropic Text',
  GOOGLE_TEXT: 'Google AI Text',
  PERPLEXITY_TEXT: 'Perplexity Text',
  
  // Image Generation
  OPENAI_IMAGE: 'OpenAI Image',
  STABILITY_IMAGE: 'Stability Image',
  GOOGLE_IMAGE: 'Google AI Image',
  RUNWAY_IMAGE: 'Runway Image',
  
  // Video Generation
  LUMA_VIDEO: 'Luma Video',
  RUNWAY_VIDEO: 'Runway Video',
  
  // Audio
  AUDIO_GENERATION: 'Audio Generation',
  TEXT_TO_SPEECH: 'Text to Speech',
  
  // 3D
  MODEL_3D: '3D Model Generation',
  MODEL_3D_VIEWER: 'Model 3D Viewer',
} as const;

export const createNodeTemplate = (type: string, position: { x: number; y: number }): NodeData => {
  const id = Math.random().toString(36).substr(2, 9);

  const baseTextConfig: TextGenerationConfig = {
    model: '',
    prompt: '',
    temperature: 0.7,
    maxTokens: 1024,
    topP: 0.95,
    systemPrompt: '',
  };

  const baseImageConfig: ImageGenerationConfig = {
    prompt: '',
    negativePrompt: '',
    width: 1024,
    height: 1024,
    steps: 30,
    guidanceScale: 7.5,
    seed: Math.floor(Math.random() * 1000000)
  };

  const templates: Record<string, Omit<NodeData, 'id' | 'position'>> = {
    'OpenAI Text': {
      type: 'OpenAI Text',
      inputs: [{ id: `${id}-in1`, name: 'Prompt', type: 'text' }],
      outputs: [{ id: `${id}-out1`, name: 'Generated Text', type: 'text' }],
      config: { ...baseTextConfig, model: 'gpt-4-turbo-preview' },
    },

    'Anthropic Text': {
      type: 'Anthropic Text',
      inputs: [{ id: `${id}-in1`, name: 'Prompt', type: 'text' }],
      outputs: [{ id: `${id}-out1`, name: 'Generated Text', type: 'text' }],
      config: { ...baseTextConfig, model: 'claude-3-opus-20240229' },
    },

    'Google AI Text': {
      type: 'Google AI Text',
      inputs: [{ id: `${id}-in1`, name: 'Prompt', type: 'text' }],
      outputs: [{ id: `${id}-out1`, name: 'Generated Text', type: 'text' }],
      config: { ...baseTextConfig, model: 'gemini-pro' },
    },

    'Perplexity Text': {
      type: 'Perplexity Text',
      inputs: [{ id: `${id}-in1`, name: 'Prompt', type: 'text' }],
      outputs: [{ id: `${id}-out1`, name: 'Generated Text', type: 'text' }],
      config: { ...baseTextConfig, model: 'pplx-7b-online' },
    },

    'OpenAI Image': {
      type: 'OpenAI Image',
      inputs: [{ id: `${id}-in1`, name: 'Prompt', type: 'text' }],
      outputs: [{ id: `${id}-out1`, name: 'Generated Image', type: 'image' }],
      config: { ...baseImageConfig },
    },

    'Stability Image': {
      type: 'Stability Image',
      inputs: [
        { id: `${id}-in1`, name: 'Prompt', type: 'text' },
        { id: `${id}-in2`, name: 'Negative Prompt', type: 'text' }
      ],
      outputs: [{ id: `${id}-out1`, name: 'Generated Image', type: 'image' }],
      config: { ...baseImageConfig },
    },

    'Google AI Image': {
      type: 'Google AI Image',
      inputs: [{ id: `${id}-in1`, name: 'Prompt', type: 'text' }],
      outputs: [{ id: `${id}-out1`, name: 'Generated Image', type: 'image' }],
      config: { ...baseImageConfig },
    },

    'Runway Image': {
      type: 'Runway Image',
      inputs: [{ id: `${id}-in1`, name: 'Prompt', type: 'text' }],
      outputs: [{ id: `${id}-out1`, name: 'Generated Image', type: 'image' }],
      config: { ...baseImageConfig },
    },

    'Luma Video': {
      type: 'Luma Video',
      inputs: [{ id: `${id}-in1`, name: 'Prompt', type: 'text' }],
      outputs: [{ id: `${id}-out1`, name: 'Generated Video', type: 'video' }],
      config: {
        prompt: '',
        numFrames: 24,
        fps: 30,
        width: 1024,
        height: 576,
      } as VideoGenerationConfig,
    },

    'Runway Video': {
      type: 'Runway Video',
      inputs: [{ id: `${id}-in1`, name: 'Prompt', type: 'text' }],
      outputs: [{ id: `${id}-out1`, name: 'Generated Video', type: 'video' }],
      config: {
        prompt: '',
        numFrames: 24,
        fps: 30,
        width: 1024,
        height: 576,
      } as VideoGenerationConfig,
    },

    'Audio Generation': {
      type: 'Audio Generation',
      inputs: [{ id: `${id}-in1`, name: 'Prompt', type: 'text' }],
      outputs: [{ id: `${id}-out1`, name: 'Generated Audio', type: 'audio' }],
      config: {
        prompt: '',
        duration: 8,
        model: 'melody',
      } as AudioGenerationConfig,
    },

    'Text to Speech': {
      type: 'Text to Speech',
      inputs: [{ id: `${id}-in1`, name: 'Text', type: 'text' }],
      outputs: [{ id: `${id}-out1`, name: 'Generated Speech', type: 'audio' }],
      config: {
        text: '',
        voice: 'v2/en_speaker_6',
        language: 'en',
        speed: 1.0,
      } as Text2SpeechConfig,
    },

    '3D Model Generation': {
      type: '3D Model Generation',
      inputs: [
        { id: `${id}-in1`, name: 'Prompt', type: 'text' },
        { id: `${id}-in2`, name: 'Negative Prompt', type: 'text' }
      ],
      outputs: [{ id: `${id}-out1`, name: 'Generated Model', type: '3d' }],
      config: {
        prompt: '',
        negativePrompt: '',
        numInferenceSteps: 64,
        guidanceScale: 15.0,
        seed: Math.floor(Math.random() * 1000000)
      } as Model3DConfig,
    },

    'Model 3D Viewer': {
      type: 'Model 3D Viewer',
      inputs: [{ id: `${id}-in1`, name: 'Model', type: '3d' }],
      outputs: [],
      config: {},
    },
  };

  const template = templates[type];
  if (!template) {
    throw new Error(`Unknown node type: ${type}`);
  }

  return { id, position, ...template };
};