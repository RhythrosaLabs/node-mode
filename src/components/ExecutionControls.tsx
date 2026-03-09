import React, { useState, useEffect } from 'react';
import { Play, StopCircle, Clock, Files, Save, Download, Loader2 } from 'lucide-react';
import { useExecutionStore } from '../store/executionStore';
import { useSchedulerStore } from '../store/schedulerStore';
import { ScheduleModal } from './scheduler/ScheduleModal';
import { FileManagerModal } from './files/FileManagerModal';
import { useFileStore } from '../store/fileStore';
import { toast } from 'sonner';

export const ExecutionControls: React.FC = () => {
  const { executeGraph, abortExecution, isExecuting, saveWorkflow, loadWorkflow, queue, executionStates } = useExecutionStore();
  const { schedules } = useSchedulerStore();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showFileManager, setShowFileManager] = useState(false);
  const { addFile } = useFileStore();

  const handleExecute = async () => {
    try {
      toast.info('Starting execution...');
      await executeGraph();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Execution failed');
    }
  };

  const handleAbort = () => {
    abortExecution();
    toast.info('Execution aborted');
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to execute
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !isExecuting) {
        handleExecute();
      }
      // Esc to abort
      if (e.key === 'Escape' && isExecuting) {
        handleAbort();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isExecuting]);

  const getExecutionProgress = () => {
    if (!queue.length) return 0;
    const completed = queue.filter(item => 
      executionStates[item.nodeId]?.status === 'completed'
    ).length;
    return Math.round((completed / queue.length) * 100);
  };

  const getCurrentNodeStatus = () => {
    const runningNode = queue.find(item => 
      executionStates[item.nodeId]?.status === 'running'
    );
    if (runningNode) {
      return executionStates[runningNode.nodeId]?.message || 'Processing...';
    }
    return '';
  };

  const handleSaveWorkflow = async () => {
    try {
      const workflow = await saveWorkflow();
      const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' });
      addFile({
        name: `workflow_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`,
        type: 'output',
        mimeType: 'application/json',
        size: blob.size,
        url: URL.createObjectURL(blob),
      });
      toast.success('Workflow saved successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save workflow');
    }
  };

  const handleLoadWorkflow = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const reader = new FileReader();
          reader.onload = async (e) => {
            const content = e.target?.result as string;
            await loadWorkflow(JSON.parse(content));
            toast.success('Workflow loaded successfully');
          };
          reader.readAsText(file);
        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Failed to load workflow');
        }
      }
    };
    input.click();
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 flex items-center justify-between z-50">
      <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 relative">
        {isExecuting && (
          <div className="absolute left-0 bottom-0 h-1 bg-blue-500 transition-all duration-300" style={{ width: `${getExecutionProgress()}%` }} />
        )}
        <div className="flex items-center gap-2">
          {isExecuting ? (
            <>
              <button
                onClick={handleAbort}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <StopCircle className="w-4 h-4" />
                <span>Stop</span>
              </button>
              <div className="flex items-center gap-2 px-4 py-2 text-gray-500 dark:text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">{getCurrentNodeStatus()}</span>
              </div>
            </>
          ) : (
            <button
              onClick={handleExecute}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isExecuting}
              title="Run (Ctrl/Cmd + Enter)"
            >
              <Play className="w-4 h-4" />
              <span>Run</span>
            </button>
          )}
        </div>

        <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2" />

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isExecuting}
          >
            <Clock className="w-4 h-4" />
            <span>Schedule</span>
            {schedules.length > 0 && (
              <span className="px-2 py-0.5 bg-blue-600 rounded-full text-xs">
                {schedules.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setShowFileManager(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isExecuting}
          >
            <Files className="w-4 h-4" />
            <span>Files</span>
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2" />

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveWorkflow}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isExecuting}
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>

          <button
            onClick={handleLoadWorkflow}
            className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isExecuting}
          >
            <Download className="w-4 h-4" />
            <span>Load</span>
          </button>
        </div>
      </div>

      {showScheduleModal && (
        <ScheduleModal onClose={() => setShowScheduleModal(false)} />
      )}

      {showFileManager && (
        <FileManagerModal onClose={() => setShowFileManager(false)} />
      )}
    </div>
  );
};
