import React from 'react';

export const Grid: React.FC = () => (
  <div className="absolute inset-0 grid grid-cols-[repeat(40,minmax(20px,1fr))] grid-rows-[repeat(40,minmax(20px,1fr))] opacity-10 pointer-events-none">
    {Array.from({ length: 1600 }).map((_, i) => (
      <div key={i} className="border-r border-b border-gray-200 dark:border-gray-700" />
    ))}
  </div>
);