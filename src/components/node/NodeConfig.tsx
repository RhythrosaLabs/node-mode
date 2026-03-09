import React from 'react';
import { X } from 'lucide-react';
import { NodeData } from '../../types/node';
import { AINodeConfig } from './AINodeConfig';
import { useNodeStore } from '../../store/nodeStore';

interface NodeConfigProps {
  node: NodeData;
}

export const NodeConfig: React.FC<NodeConfigProps> = ({ node }) => {
  const { updateNodeConfig, selectNode } = useNodeStore();

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-[calc(100vh-5rem)] overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{node.type}</h3>
        <button
          onClick={() => selectNode(null)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
        >
          <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      <AINodeConfig
        node={node}
        onConfigChange={(config) => updateNodeConfig(node.id, config)}
      />
    </div>
  );
};