import React, { useEffect } from 'react';
import { Canvas } from './components/Canvas';
import { ThemeToggle } from './components/ThemeToggle';
import { SettingsButton } from './components/settings/SettingsButton';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { ExecutionControls } from './components/ExecutionControls';
import { useThemeStore } from './store/themeStore';
import { Toaster } from 'sonner';

function App() {
  const isDark = useThemeStore((state) => state.isDark);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className={`w-full h-screen ${isDark ? 'dark' : ''}`}>
      <div className="h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Node Mode</h1>
        <div className="flex items-center gap-2">
          <SettingsButton />
          <ThemeToggle />
        </div>
      </div>
      <Canvas />
      <ExecutionControls />
      <SettingsPanel />
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-gray-200',
          style: { background: 'var(--toast-bg)', color: 'var(--toast-color)' },
        }}
      />
    </div>
  );
}

export default App;