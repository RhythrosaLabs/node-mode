import { NodeExecutionContext } from '../types/execution';
import { useNodeStore } from '../store/nodeStore';
import { OpenAIService } from '../services/ai/openAIService';
import { AnthropicService } from '../services/ai/anthropicService';
import { StabilityAIService } from '../services/ai/stabilityAIService';
import { ReplicateService } from '../services/ai/replicateService';
import { GoogleAIService } from '../services/ai/googleAIService';
import { PerplexityService } from '../services/ai/perplexityService';
import { LumaService } from '../services/ai/lumaService';
import { RunwayService } from '../services/ai/runwayService';

export async function executeNode(
  nodeId: string,
  context: NodeExecutionContext
): Promise<unknown> {
  const node = useNodeStore.getState().nodes.find(n => n.id === nodeId);
  if (!node) throw new Error('Node not found');

  switch (node.type) {
    case 'OpenAI Text': {
      context.onProgress?.('Generating text with OpenAI...');
      return OpenAIService.generateText({
        ...node.config,
        prompt: (context.inputs[node.inputs[0]?.id] as string) || node.config.prompt || '',
        abortSignal: context.abortSignal,
      });
    }

    case 'Anthropic Text': {
      context.onProgress?.('Generating text with Claude...');
      return AnthropicService.generateText({
        ...node.config,
        prompt: (context.inputs[node.inputs[0]?.id] as string) || node.config.prompt || '',
        abortSignal: context.abortSignal,
        onProgress: context.onProgress,
      });
    }

    case 'OpenAI Image': {
      context.onProgress?.('Generating image with DALL·E...');
      return OpenAIService.generateImage({
        ...node.config,
        prompt: (context.inputs[node.inputs[0]?.id] as string) || node.config.prompt || '',
        abortSignal: context.abortSignal,
      });
    }

    case 'Stability Image': {
      context.onProgress?.('Generating image with Stability AI...');
      return StabilityAIService.generateImage({
        ...node.config,
        prompt: (context.inputs[node.inputs[0]?.id] as string) || node.config.prompt || '',
        negativePrompt: (context.inputs[node.inputs[1]?.id] as string) || node.config.negativePrompt || '',
        abortSignal: context.abortSignal,
        onProgress: context.onProgress,
      });
    }

    case 'Google AI Text': {
      context.onProgress?.('Generating text with Google AI...');
      return GoogleAIService.generateText({
        ...node.config,
        prompt: (context.inputs[node.inputs[0]?.id] as string) || node.config.prompt || '',
        abortSignal: context.abortSignal,
        model: node.config.model || 'gemini-pro',
      });
    }

    case 'Google AI Image':
      context.onProgress?.('Generating image with Google AI...');
      return GoogleAIService.generateImage({
        ...node.config,
        prompt: (context.inputs[node.inputs[0]?.id] as string) || node.config.prompt || '',
        abortSignal: context.abortSignal,
      });

    case 'Perplexity Text': {
      context.onProgress?.('Generating text with Perplexity...');
      return PerplexityService.generateText({
        ...node.config,
        prompt: (context.inputs[node.inputs[0]?.id] as string) || node.config.prompt || '',
        abortSignal: context.abortSignal,
        model: node.config.model || 'pplx-7b-online',
      });
    }

    case 'Luma Video':
      context.onProgress?.('Generating video with Luma...');
      return LumaService.generateVideo({
        ...node.config,
        prompt: (context.inputs[node.inputs[0]?.id] as string) || node.config.prompt || '',
        abortSignal: context.abortSignal,
      });

    case 'Runway Video':
      context.onProgress?.('Generating video with Runway...');
      return RunwayService.generateVideo({
        ...node.config,
        prompt: (context.inputs[node.inputs[0]?.id] as string) || node.config.prompt || '',
        abortSignal: context.abortSignal,
      });

    case 'Runway Image':
      context.onProgress?.('Generating image with Runway...');
      return RunwayService.generateImage({
        ...node.config,
        prompt: (context.inputs[node.inputs[0]?.id] as string) || node.config.prompt || '',
        abortSignal: context.abortSignal,
      });

    case '3D Model Generation':
      context.onProgress?.('Generating 3D model...');
      return ReplicateService.generate3DModel({
        ...node.config,
        prompt: (context.inputs[node.inputs[0]?.id] as string) || node.config.prompt || '',
        abortSignal: context.abortSignal,
      });

    case 'Audio Generation':
      context.onProgress?.('Generating audio...');
      return ReplicateService.generateAudio({
        ...node.config,
        prompt: (context.inputs[node.inputs[0]?.id] as string) || node.config.prompt || '',
        abortSignal: context.abortSignal,
      });

    case 'Text to Speech':
      context.onProgress?.('Converting text to speech...');
      return ReplicateService.textToSpeech({
        ...node.config,
        text: (context.inputs[node.inputs[0]?.id] as string) || node.config.text || '',
        abortSignal: context.abortSignal,
      });

    case 'Model 3D Viewer':
      // Viewer nodes don't execute, they just display
      return context.inputs[node.inputs[0]?.id];

    default:
      throw new Error(`Unsupported node type: ${node.type}`);
  }
}
