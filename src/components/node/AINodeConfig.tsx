import React from 'react';
import { NodeData } from '../../types/node';
import { AIModelConfig, ImageGenerationConfig, TextGenerationConfig, VideoGenerationConfig, AudioGenerationConfig, Text2SpeechConfig, Model3DConfig } from '../../types/ai';

interface AINodeConfigProps {
  node: NodeData;
  onConfigChange: (config: any) => void;
}

export const AINodeConfig: React.FC<AINodeConfigProps> = ({ node, onConfigChange }) => {
  const renderTextModelConfig = (config: TextGenerationConfig) => (
    <div className="space-y-3 mt-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Model</label>
        <select
          value={config.model}
          onChange={(e) => onConfigChange({ ...config, model: e.target.value })}
          className="w-full px-2 py-1.5 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
        >
          {node.type === 'OpenAI Text' && (
            <>
              <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gpt-4o">GPT-4o</option>
            </>
          )}
          {node.type === 'Anthropic Text' && (
            <>
              <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
              <option value="claude-3-opus-20240229">Claude 3 Opus</option>
              <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
              <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
            </>
          )}
          {node.type === 'Google AI Text' && (
            <>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
              <option value="gemini-pro">Gemini Pro</option>
            </>
          )}
          {node.type === 'Perplexity Text' && (
            <>
              <option value="llama-3.1-sonar-large-128k-online">Sonar Large (Online)</option>
              <option value="llama-3.1-sonar-small-128k-online">Sonar Small (Online)</option>
              <option value="pplx-7b-online">pplx-7b Online</option>
              <option value="pplx-70b-online">pplx-70b Online</option>
            </>
          )}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Prompt</label>
        <textarea
          value={config.prompt || ''}
          onChange={(e) => onConfigChange({ ...config, prompt: e.target.value })}
          placeholder="Enter your prompt..."
          className="w-full px-2 py-1.5 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">System Prompt</label>
        <textarea
          value={config.systemPrompt || ''}
          onChange={(e) => onConfigChange({ ...config, systemPrompt: e.target.value })}
          className="w-full px-2 py-1.5 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
          rows={2}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Temperature ({config.temperature})
        </label>
        <input
          type="range" min="0" max="2" step="0.1"
          value={config.temperature}
          onChange={(e) => onConfigChange({ ...config, temperature: parseFloat(e.target.value) })}
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Max Tokens</label>
        <input
          type="number"
          value={config.maxTokens}
          onChange={(e) => onConfigChange({ ...config, maxTokens: parseInt(e.target.value) })}
          className="w-full px-2 py-1.5 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
        />
      </div>
    </div>
  );

  const renderImageConfig = (config: ImageGenerationConfig) => (
    <div className="space-y-3 mt-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Prompt</label>
        <textarea
          value={config.prompt || ''}
          onChange={(e) => onConfigChange({ ...config, prompt: e.target.value })}
          placeholder="Describe the image..."
          className="w-full px-2 py-1.5 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
          rows={3}
        />
      </div>
      {(node.type === 'Stability Image') && (
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Negative Prompt</label>
          <textarea
            value={config.negativePrompt || ''}
            onChange={(e) => onConfigChange({ ...config, negativePrompt: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
            rows={2}
          />
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Width</label>
          <input type="number" value={config.width}
            onChange={(e) => onConfigChange({ ...config, width: parseInt(e.target.value) })}
            className="w-full px-2 py-1.5 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Height</label>
          <input type="number" value={config.height}
            onChange={(e) => onConfigChange({ ...config, height: parseInt(e.target.value) })}
            className="w-full px-2 py-1.5 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" />
        </div>
      </div>
      {node.type === 'Stability Image' && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Steps</label>
            <input type="number" value={config.steps}
              onChange={(e) => onConfigChange({ ...config, steps: parseInt(e.target.value) })}
              className="w-full px-2 py-1.5 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Guidance</label>
            <input type="number" step="0.5" value={config.guidanceScale}
              onChange={(e) => onConfigChange({ ...config, guidanceScale: parseFloat(e.target.value) })}
              className="w-full px-2 py-1.5 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" />
          </div>
        </div>
      )}
    </div>
  );

  const renderVideoConfig = (config: VideoGenerationConfig) => (
    <div className="space-y-3 mt-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Prompt</label>
        <textarea
          value={config.prompt || ''}
          onChange={(e) => onConfigChange({ ...config, prompt: e.target.value })}
          placeholder="Describe the video..."
          className="w-full px-2 py-1.5 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Frames</label>
          <input type="number" value={config.numFrames || 24}
            onChange={(e) => onConfigChange({ ...config, numFrames: parseInt(e.target.value) })}
            className="w-full px-2 py-1.5 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">FPS</label>
          <input type="number" value={config.fps || 30}
            onChange={(e) => onConfigChange({ ...config, fps: parseInt(e.target.value) })}
            className="w-full px-2 py-1.5 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" />
        </div>
      </div>
    </div>
  );

  const renderAudioConfig = (config: AudioGenerationConfig) => (
    <div className="space-y-3 mt-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Prompt / Description</label>
        <textarea
          value={config.prompt || ''}
          onChange={(e) => onConfigChange({ ...config, prompt: e.target.value })}
          placeholder="Describe the audio..."
          className="w-full px-2 py-1.5 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (seconds)</label>
        <input type="number" value={config.duration || 8}
          onChange={(e) => onConfigChange({ ...config, duration: parseInt(e.target.value) })}
          className="w-full px-2 py-1.5 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" />
      </div>
    </div>
  );

  const renderTTSConfig = (config: Text2SpeechConfig) => (
    <div className="space-y-3 mt-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Text</label>
        <textarea
          value={config.text || ''}
          onChange={(e) => onConfigChange({ ...config, text: e.target.value })}
          placeholder="Enter text to speak..."
          className="w-full px-2 py-1.5 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Voice</label>
        <select value={config.voice || 'v2/en_speaker_6'}
          onChange={(e) => onConfigChange({ ...config, voice: e.target.value })}
          className="w-full px-2 py-1.5 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200">
          <option value="v2/en_speaker_6">English Speaker 6</option>
          <option value="v2/en_speaker_1">English Speaker 1</option>
          <option value="v2/en_speaker_9">English Speaker 9</option>
          <option value="v2/es_speaker_0">Spanish Speaker 0</option>
          <option value="v2/fr_speaker_0">French Speaker 0</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Speed ({config.speed || 1.0})</label>
        <input type="range" min="0.5" max="2.0" step="0.1" value={config.speed || 1.0}
          onChange={(e) => onConfigChange({ ...config, speed: parseFloat(e.target.value) })}
          className="w-full" />
      </div>
    </div>
  );

  const render3DConfig = (config: Model3DConfig) => (
    <div className="space-y-3 mt-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Prompt</label>
        <textarea
          value={config.prompt || ''}
          onChange={(e) => onConfigChange({ ...config, prompt: e.target.value })}
          placeholder="Describe the 3D model..."
          className="w-full px-2 py-1.5 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Negative Prompt</label>
        <textarea
          value={config.negativePrompt || ''}
          onChange={(e) => onConfigChange({ ...config, negativePrompt: e.target.value })}
          className="w-full px-2 py-1.5 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
          rows={2}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Steps</label>
          <input type="number" value={config.numInferenceSteps || 64}
            onChange={(e) => onConfigChange({ ...config, numInferenceSteps: parseInt(e.target.value) })}
            className="w-full px-2 py-1.5 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Guidance</label>
          <input type="number" step="0.5" value={config.guidanceScale || 15}
            onChange={(e) => onConfigChange({ ...config, guidanceScale: parseFloat(e.target.value) })}
            className="w-full px-2 py-1.5 text-sm border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" />
        </div>
      </div>
    </div>
  );

  switch (node.type) {
    case 'OpenAI Text':
    case 'Anthropic Text':
    case 'Google AI Text':
    case 'Perplexity Text':
      return renderTextModelConfig(node.config as TextGenerationConfig);
    case 'OpenAI Image':
    case 'Stability Image':
    case 'Google AI Image':
    case 'Runway Image':
      return renderImageConfig(node.config as ImageGenerationConfig);
    case 'Luma Video':
    case 'Runway Video':
      return renderVideoConfig(node.config as VideoGenerationConfig);
    case 'Audio Generation':
      return renderAudioConfig(node.config as AudioGenerationConfig);
    case 'Text to Speech':
      return renderTTSConfig(node.config as Text2SpeechConfig);
    case '3D Model Generation':
      return render3DConfig(node.config as Model3DConfig);
    case 'Model 3D Viewer':
      return (
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Connect a 3D Model output to preview it here.
        </div>
      );
    default:
      return null;
  }
};
