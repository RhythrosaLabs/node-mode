import React, { useState, useRef } from 'react';
import { NodePort as NodePortType } from '../../types/node';

interface NodePortProps {
  port: NodePortType;
  isInput: boolean;
  onConnect: (portId: string, isInput: boolean) => void;
}

export const NodePort: React.FC<NodePortProps> = ({ port, isInput, onConnect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLButtonElement>(null);

  return (
    <div className={`flex items-center gap-2 ${isInput ? '' : 'justify-end'}`}>
      {isInput && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onConnect(port.id, true);
          }}
          className="w-3 h-3 rounded-full bg-blue-500 hover:bg-blue-600"
        />
      )}
    <span className="text-sm text-gray-600 dark:text-gray-300">{port.name}</span>
    {!isInput && (
      <button
        ref={dragRef}
        onMouseDown={(e) => {
          e.stopPropagation();
          setIsDragging(true);
        }}
        onMouseUp={(e) => {
          e.stopPropagation();
          setIsDragging(false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onConnect(port.id, false);
        }}
        className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-transform duration-150 transform hover:scale-125"
      />
    )}
  </div>
);
}
