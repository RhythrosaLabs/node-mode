import React from 'react';
import { CheckCircle, AlertCircle, Loader2, Clock } from 'lucide-react';
import { useExecutionStore } from '../../store/executionStore';

interface NodeStatusProps {
  nodeId: string;
}

export const NodeStatus: React.FC<NodeStatusProps> = ({ nodeId }) => {
  const executionState = useExecutionStore(
    (state) => state.executionStates[nodeId]
  );

  if (!executionState) return null;

  const getExecutionTime = () => {
    if (!executionState.startTime) return '';
    const endTime = executionState.endTime || Date.now();
    const duration = Math.round((endTime - executionState.startTime) / 1000);
    return duration > 0 ? `${duration}s` : '<1s';
  };

  const getStatusTooltip = () => {
    switch (executionState.status) {
      case 'running':
        return executionState.message || 'Running...';
      case 'completed':
        return `Completed in ${getExecutionTime()}`;
      case 'error':
        return executionState.error || 'Error occurred';
      default:
        return '';
    }
  };

  const renderStatusIcon = () => {
    switch (executionState.status) {
      case 'running':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-1">
      {executionState.status === 'running' && executionState.startTime && (
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <Clock className="w-3 h-3 mr-0.5" />
          {getExecutionTime()}
        </div>
      )}
      <div 
        className="relative group"
        title={getStatusTooltip()}
      >
        {renderStatusIcon()}
        {executionState.message && (
          <div className="absolute right-0 top-6 w-48 p-2 bg-white dark:bg-gray-800 rounded shadow-lg text-xs hidden group-hover:block z-50 border border-gray-200 dark:border-gray-700">
            {executionState.message}
          </div>
        )}
      </div>
    </div>
  );
};
