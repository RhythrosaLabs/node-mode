import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { NodeData } from '../../types/node';
import { GripHorizontal, Trash2 } from 'lucide-react';
import { NodePort } from './NodePort';
import { NodeStatus } from './NodeStatus';
import { NodePreview } from './NodePreview';
import { useNodeStore } from '../../store/nodeStore';

interface NodeProps {
  node: NodeData;
  onConnect: (nodeId: string, portId: string, isInput: boolean) => void;
  onSelect: () => void;
  isSelected: boolean;
}

export const Node: React.FC<NodeProps> = ({ node, onConnect, onSelect, isSelected }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: node.id,
  });
  const deleteNode = useNodeStore((state) => state.deleteNode);

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div 
      ref={setNodeRef}
      className={`absolute bg-white dark:bg-gray-900 rounded-lg shadow-lg border ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900' : 'border-gray-200 dark:border-gray-700'
      } w-64`}
      style={{
        left: node.position.x,
        top: node.position.y,
        ...style,
      }}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
    >
      <div 
        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-t-lg border-b border-gray-200 dark:border-gray-700 cursor-move"
        {...attributes}
        {...listeners}
      >
        <h3 className="font-medium text-gray-800 dark:text-gray-200 text-sm truncate">{node.type}</h3>
        <div className="flex items-center gap-1.5 shrink-0">
          <NodeStatus nodeId={node.id} />
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }}
            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete node"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
          </button>
          <GripHorizontal className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        </div>
      </div>
      
      <div className="p-3 group">
        <div className="space-y-2">
          {node.inputs.map((input) => (
            <NodePort
              key={input.id}
              port={input}
              isInput={true}
              onConnect={(portId, isInput) => onConnect(node.id, portId, isInput)}
            />
          ))}
        </div>
        
        {node.inputs.length > 0 && node.outputs.length > 0 && (
          <div className="my-2 border-t border-gray-100 dark:border-gray-800" />
        )}

        <div className="space-y-2">
          {node.outputs.map((output) => (
            <NodePort
              key={output.id}
              port={output}
              isInput={false}
              onConnect={(portId, isInput) => onConnect(node.id, portId, isInput)}
            />
          ))}
        </div>

        {isSelected && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
            Configure in the right panel →
          </p>
        )}

        <NodePreview node={node} />
      </div>
    </div>
  );
};
