import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X, ChevronRight } from 'lucide-react';
import { useNodeStore } from '../store/nodeStore';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { toast } from 'sonner';

const categories = {
  'Text Generation': ['OpenAI Text', 'Anthropic Text', 'Google AI Text', 'Perplexity Text'],
  'Image Generation': ['OpenAI Image', 'Stability Image', 'Google AI Image', 'Runway Image'],
  'Video Generation': ['Luma Video', 'Runway Video'],
  'Audio & Speech': ['Audio Generation', 'Text to Speech'],
  '3D Models': ['3D Model Generation', 'Model 3D Viewer'],
};

export const NodeSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const addNode = useNodeStore((state) => state.addNode);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddNode = (type: string) => {
    try {
      const position = { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 };
      addNode(type, position);
      toast.success(`Added ${type} node`);
      setIsOpen(false);
      setSearch('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add node');
    }
  };

  const filteredTypes = Object.entries(categories).reduce((acc, [category, types]) => {
    const filtered = types.filter((type) =>
      type.toLowerCase().includes(search.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div ref={searchRef} className="absolute top-4 left-4 z-10">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
      >
        <Plus className="w-4 h-4 dark:text-gray-300" />
        <span className="dark:text-gray-300">Add Node</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-12 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded">
                <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search nodes..."
                  className="bg-transparent w-full outline-none text-sm dark:text-gray-300"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  >
                    <X className="w-3 h-3 text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {Object.entries(filteredTypes).map(([category, types]) => (
                <div key={category} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <button
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                    className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {category}
                    </span>
                    <motion.div
                      animate={{ rotate: selectedCategory === category ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {selectedCategory === category && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {types.map((type) => (
                          <motion.button
                            key={type}
                            whileHover={{ x: 4 }}
                            onClick={() => handleAddNode(type)}
                            className="w-full px-6 py-2 text-left text-sm text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          >
                            {type}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};