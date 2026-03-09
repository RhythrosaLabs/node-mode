import React from 'react';
import { NodeData } from '../types/node';
import { useNodeStore } from '../store/nodeStore';

interface NodeConfigProps {
  node: NodeData;
}

export const NodeConfig: React.FC<NodeConfigProps> = ({ node }) => {
  const updateNode = useNodeStore((state) => state.nodes);

  const renderConfigField = (key: string, value: any) => {
    if (typeof value === 'number') {
      return (
        <input
          type="range"
          min="-100"
          max="100"
          value={value}
          onChange={(e) => {
            // Implementation for updating node config
          }}
          className="w-full dark:bg-gray-700"
        />
      );
    }
    if (typeof value === 'string') {
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => {
            // Implementation for updating node config
          }}
          className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
        />
      );
    }
    return null;
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-4">{node.type} Configuration</h3>
      <div className="space-y-4">
        {Object.entries(node.config).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            {renderConfigField(key, value)}
          </div>
        ))}
      </div>
    </div>
  );
};