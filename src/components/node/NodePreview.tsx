import React from 'react';
import { NodeData } from '../../types/node';
import { Model3DViewer } from './Model3DViewer';
import { useExecutionStore } from '../../store/executionStore';

interface NodePreviewProps {
  node: NodeData;
}

export const NodePreview: React.FC<NodePreviewProps> = ({ node }) => {
  const executionState = useExecutionStore(
    (state) => state.executionStates[node.id]
  );

  if (!executionState?.result) return null;

  const renderPreview = () => {
    const result = executionState.result;

    switch (node.type) {
      case 'MODEL_3D_VIEWER':
        return <Model3DViewer node={node} />;
      
      case 'OpenAI Text':
      case 'Anthropic Text':
      case 'Google AI Text':
      case 'Perplexity Text':
        return (
          <div className="max-h-48 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {result}
            </p>
          </div>
        );
      
      case 'OpenAI Image':
      case 'Stability Image':
      case 'Google AI Image':
      case 'Runway Image':
        return (
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <img
              src={result}
              alt="Generated"
              className="w-full h-full object-cover"
            />
          </div>
        );
      
      case 'Luma Video':
      case 'Runway Video':
        return (
          <video
            src={result}
            controls
            className="w-full rounded-lg"
            style={{ maxHeight: '200px' }}
          />
        );
      
      case 'Audio Generation':
      case 'Text to Speech':
        return (
          <audio controls className="w-full">
            <source src={result} />
          </audio>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="mt-4 space-y-2">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Output Preview
      </h4>
      {renderPreview()}
    </div>
  );
};