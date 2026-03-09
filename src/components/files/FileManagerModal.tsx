import React from 'react';
import { X, Download, Trash2 } from 'lucide-react';
import { useFileStore } from '../../store/fileStore';

interface FileManagerModalProps {
  onClose: () => void;
}

export const FileManagerModal: React.FC<FileManagerModalProps> = ({ onClose }) => {
  const { files, removeFile } = useFileStore();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            File Manager
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">
                    {file.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)} • {file.type} •{' '}
                    {new Date(file.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={file.url}
                    download={file.name}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <Download className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </a>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};