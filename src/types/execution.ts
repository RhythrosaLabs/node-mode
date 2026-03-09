export type ExecutionStatus = 'idle' | 'running' | 'completed' | 'error';

export interface ExecutionState {
  status: ExecutionStatus;
  error?: string;
  result?: unknown;
  startTime?: number;
  endTime?: number;
  message?: string;
}

export interface ExecutionQueue {
  nodeId: string;
  dependencies: string[];
  status: ExecutionStatus;
}

export interface NodeExecutionContext {
  inputs: Record<string, unknown>;
  config: Record<string, unknown>;
  abortSignal?: AbortSignal;
  onProgress?: (message: string) => void;
}
