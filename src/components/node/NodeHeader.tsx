import React from 'react';
import { GripHorizontal } from 'lucide-react';

interface NodeHeaderProps {
  title: string;
  attributes: any;
  listeners: any;
}

export const NodeHeader: React.FC<NodeHeaderProps> = ({ title, attributes, listeners }) => (
  <div 
    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-t-lg border-b border-gray-200 dark:border-gray-700"
    {...attributes}
    {...listeners}
  >
    <h3 className="font-medium text-gray-800 dark:text-gray-200">{title}</h3>
    <GripHorizontal className="w-5 h-5 text-gray-500 dark:text-gray-400 cursor-move" />
  </div>
);