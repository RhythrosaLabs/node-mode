import React from 'react';
import { Settings } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

export const SettingsButton: React.FC = () => {
  const toggleSettings = useSettingsStore((state) => state.toggleSettings);

  return (
    <button
      onClick={toggleSettings}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
    </button>
  );
};