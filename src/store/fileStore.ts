import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FileData {
  id: string;
  name: string;
  type: 'input' | 'output';
  mimeType: string;
  size: number;
  url: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}

interface FileState {
  files: FileData[];
  addFile: (file: Omit<FileData, 'id' | 'createdAt'>) => void;
  removeFile: (id: string) => void;
  updateFile: (id: string, updates: Partial<FileData>) => void;
}

export const useFileStore = create<FileState>()(
  persist(
    (set) => ({
      files: [],
      addFile: (file) =>
        set((state) => ({
          files: [
            ...state.files,
            {
              ...file,
              id: Math.random().toString(),
              createdAt: new Date(),
            },
          ],
        })),
      removeFile: (id) =>
        set((state) => ({
          files: state.files.filter((f) => f.id !== id),
        })),
      updateFile: (id, updates) =>
        set((state) => ({
          files: state.files.map((f) =>
            f.id === id ? { ...f, ...updates } : f
          ),
        })),
    }),
    {
      name: 'file-storage',
    }
  )
);