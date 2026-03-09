import React from 'react';
import { X } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { APISettings } from '../../types/settings';

export const SettingsPanel: React.FC = () => {
  const { apiSettings, updateAPISettings, isSettingsOpen, toggleSettings } = useSettingsStore();

  const providers: Array<{ key: keyof APISettings; name: string }> = [
    { key: 'stabilityAI', name: 'Stability AI' },
    { key: 'anthropic', name: 'Anthropic' },
    { key: 'luma', name: 'Luma' },
    { key: 'runway', name: 'Runway' },
    { key: 'openAI', name: 'OpenAI' },
    { key: 'perplexity', name: 'Perplexity' },
    { key: 'googleAI', name: 'Google AI' },
  ];

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Settings</h2>
          <button
            onClick={toggleSettings}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {providers.map(({ key, name }) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {name}
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={apiSettings[key]?.enabled}
                    onChange={(e) =>
                      updateAPISettings(key, { enabled: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex gap-4">
                <input
                  type="password"
                  placeholder="API Key"
                  value={apiSettings[key]?.apiKey || ''}
                  onChange={(e) =>
                    updateAPISettings(key, { apiKey: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleSettings}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};