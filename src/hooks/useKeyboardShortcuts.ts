import { useEffect } from 'react';

interface KeyboardShortcutHandlers {
  onUndo: () => void;
  onRedo: () => void;
  onDelete?: () => void;
}

export const useKeyboardShortcuts = ({ onUndo, onRedo, onDelete }: KeyboardShortcutHandlers) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't fire shortcuts when typing in inputs/textareas
      const target = e.target as HTMLElement;
      const isEditing = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          onRedo();
        } else {
          onUndo();
        }
      }

      if (!isEditing && (e.key === 'Delete' || e.key === 'Backspace')) {
        onDelete?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUndo, onRedo, onDelete]);
};