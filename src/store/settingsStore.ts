import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { APISettings } from '../types/settings';

interface SettingsState {
  apiSettings: APISettings;
  updateAPISettings: (provider: keyof APISettings, settings: Partial<APISettings[keyof APISettings]>) => void;
  isSettingsOpen: boolean;
  toggleSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      apiSettings: {
        stabilityAI: { apiKey: '', enabled: false },
        anthropic: { apiKey: '', enabled: false },
        luma: { apiKey: '', enabled: false },
        runway: { apiKey: '', enabled: false },
        openAI: { apiKey: '', enabled: false },
        perplexity: { apiKey: '', enabled: false },
        googleAI: { apiKey: '', enabled: false },
      },
      isSettingsOpen: false,
      updateAPISettings: (provider, settings) =>
        set((state) => ({
          apiSettings: {
            ...state.apiSettings,
            [provider]: { ...state.apiSettings[provider], ...settings },
          },
        })),
      toggleSettings: () =>
        set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
    }),
    {
      name: 'settings-storage',
    }
  )
);