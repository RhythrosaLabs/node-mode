import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { NodeData } from '../types/node';
import { GripHorizontal } from 'lucide-react';

interface NodeProps {
  node: NodeData;
  onConnect: (portId: string, isInput: boolean) => void;
  onSelect: () => void;
  isSelected: boolean;
}

export const Node: React.FC<NodeProps> = ({ node, onConnect, onSelect, isSelected }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: node.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div 
      ref={setNodeRef}
      className={`absolute bg-white dark:bg-gray-900 rounded-lg shadow-lg border ${
        isSelected ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'
      } w-64`}
      style={{
        left: node.position.x,
        top: node.position.y,
        ...style,
      }}
      onClick={onSelect}
    >
      <div 
        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-t-lg border-b border-gray-200 dark:border-gray-700"
        {...attributes}
        {...listeners}
      >
        <h3 className="font-medium text-gray-800 dark:text-gray-200">{node.type}</h3>
        <GripHorizontal className="w-5 h-5 text-gray-500 dark:text-gray-400 cursor-move" />
      </div>
      
      <div className="p-4">
        <div className="space-y-2">
          {node.inputs.map((input) => (
            <div key={input.id} className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onConnect(input.id, true);
                }}
                className="w-3 h-3 rounded-full bg-blue-500 hover:bg-blue-600"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">{input.name}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 space-y-2">
          {node.outputs.map((output) => (
            <div key={output.id} className="flex items-center justify-end gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">{output.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onConnect(output.id, false);
                }}
                className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};