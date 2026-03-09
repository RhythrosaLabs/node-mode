import React from 'react';
import { Connection, NodeData } from '../../types/node';

interface ConnectionLineProps {
  connection: Connection;
  sourceNode: NodeData;
  targetNode: NodeData;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  connection,
  sourceNode,
  targetNode,
}) => {
  const startX = sourceNode.position.x + 256;
  const startY = sourceNode.position.y + 40;
  const endX = targetNode.position.x;
  const endY = targetNode.position.y + 40;
  
  const controlPoint1X = startX + (endX - startX) * 0.5;
  const controlPoint2X = startX + (endX - startX) * 0.5;
  
  return (
    <path
      d={`M ${startX} ${startY} C ${controlPoint1X} ${startY}, ${controlPoint2X} ${endY}, ${endX} ${endY}`}
      stroke="#94a3b8"
      strokeWidth="2"
      fill="none"
      className="dark:stroke-gray-600"
    />
  );
};