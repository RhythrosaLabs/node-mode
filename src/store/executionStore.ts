import { create } from 'zustand';
import { ExecutionState, ExecutionQueue } from '../types/execution';
import { validateNodeInputs } from '../utils/validationUtils';
import { executeNode } from '../utils/executionUtils';
import { useNodeStore } from './nodeStore';
import { useFileStore } from './fileStore';
import { NodeData, Connection } from '../types/node';

interface ExecutionStoreState {
  executionStates: Record<string, ExecutionState>;
  queue: ExecutionQueue[];
  isExecuting: boolean;
  executeGraph: (rootNodeId?: string) => Promise<void>;
  abortExecution: () => void;
  clearExecutionStates: () => void;
  saveWorkflow: () => Promise<{
    nodes: NodeData[];
    connections: Connection[];
    version: string;
    savedAt: string;
  }>;
  loadWorkflow: (workflow: {
    nodes: NodeData[];
    connections: Connection[];
    version: string;
  }) => Promise<void>;
}

export const useExecutionStore = create<ExecutionStoreState>((set, get) => {
  let abortController: AbortController | null = null;

  return {
    executionStates: {},
    queue: [],
    isExecuting: false,

    executeGraph: async (rootNodeId?: string) => {
      if (get().isExecuting) return;

      set({ isExecuting: true, executionStates: {} });
      abortController = new AbortController();

      try {
        const { nodes, connections } = useNodeStore.getState();
        if (nodes.length === 0) {
          throw new Error('No nodes on the canvas. Add some nodes first.');
        }

        // If no rootNodeId given, find terminal nodes (sinks — nodes with no outgoing connections)
        let targetNodeIds: string[];
        if (rootNodeId && nodes.find(n => n.id === rootNodeId)) {
          targetNodeIds = [rootNodeId];
        } else {
          const sourceNodeIds = new Set(connections.map(c => c.sourceNodeId));
          targetNodeIds = nodes
            .filter(n => !sourceNodeIds.has(n.id))
            .map(n => n.id);
          // If all nodes are sources (no sinks), just run all nodes
          if (targetNodeIds.length === 0) {
            targetNodeIds = nodes.map(n => n.id);
          }
        }

        // Build a unified topological queue from all targets
        const queue = buildExecutionQueueMulti(targetNodeIds);
        set({ queue });

        for (const item of queue) {
          if (abortController.signal.aborted) break;

          const node = useNodeStore.getState().nodes.find(n => n.id === item.nodeId);
          set((state) => ({
            executionStates: {
              ...state.executionStates,
              [item.nodeId]: { 
                status: 'running', 
                startTime: Date.now(),
                message: `Starting ${node?.type || 'node'} execution...`
              }
            }
          }));

          try {
            const inputs = await collectNodeInputs(item.nodeId);
            
            set((state) => ({
              executionStates: {
                ...state.executionStates,
                [item.nodeId]: {
                  ...state.executionStates[item.nodeId],
                  message: 'Validating inputs...'
                }
              }
            }));
            
            await validateNodeInputs(item.nodeId, inputs);
            
            set((state) => ({
              executionStates: {
                ...state.executionStates,
                [item.nodeId]: {
                  ...state.executionStates[item.nodeId],
                  message: 'Executing node...'
                }
              }
            }));

            const result = await executeNode(item.nodeId, {
              inputs,
              config: useNodeStore.getState().nodes.find(n => n.id === item.nodeId)?.config || {},
              abortSignal: abortController.signal,
              onProgress: (message: string) => {
                set((state) => ({
                  executionStates: {
                    ...state.executionStates,
                    [item.nodeId]: {
                      ...state.executionStates[item.nodeId],
                      message
                    }
                  }
                }));
              }
            });

            // Save output files
            if (typeof result === 'string' && (result.startsWith('data:') || result.startsWith('http'))) {
              set((state) => ({
                executionStates: {
                  ...state.executionStates,
                  [item.nodeId]: {
                    ...state.executionStates[item.nodeId],
                    message: 'Saving generated file...'
                  }
                }
              }));

              const node = useNodeStore.getState().nodes.find(n => n.id === item.nodeId);
              const fileName = `${node?.type || 'output'}_${new Date().toISOString().slice(0,19).replace(/[:-]/g, '')}`; 
              
              await useFileStore.getState().addFile({
                name: fileName,
                type: 'output',
                mimeType: getMimeType(result),
                size: 0,
                url: result,
              });
            }

            set((state) => ({
              executionStates: {
                ...state.executionStates,
                [item.nodeId]: {
                  status: 'completed',
                  result,
                  startTime: state.executionStates[item.nodeId].startTime,
                  endTime: Date.now(),
                  message: 'Execution completed successfully'
                }
              }
            }));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            set((state) => ({
              executionStates: {
                ...state.executionStates,
                [item.nodeId]: {
                  status: 'error',
                  error: errorMessage,
                  startTime: state.executionStates[item.nodeId].startTime,
                  endTime: Date.now(),
                  message: `Error: ${errorMessage}`
                }
              }
            }));
            break;
          }
        }
      } finally {
        set({ isExecuting: false });
        abortController = null;
      }
    },

    abortExecution: () => {
      if (abortController) {
        abortController.abort();
      }
    },

    clearExecutionStates: () => {
      set({ executionStates: {}, queue: [] });
    },

    saveWorkflow: async () => {
      const { nodes, connections } = useNodeStore.getState();
      return {
        nodes,
        connections,
        version: '1.0.0',
        savedAt: new Date().toISOString(),
      };
    },

    loadWorkflow: async (workflow) => {
      if (!workflow.version || !workflow.nodes || !workflow.connections) {
        throw new Error('Invalid workflow file');
      }

      useNodeStore.setState({
        nodes: workflow.nodes,
        connections: workflow.connections,
      });
    },
  };
});

function getMimeType(url: string): string {
  if (url.startsWith('data:')) {
    const match = url.match(/^data:([^;]+);/);
    return match ? match[1] : 'application/octet-stream';
  }
  
  const extension = url.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'gif': return 'image/gif';
    case 'mp4': return 'video/mp4';
    case 'mp3': return 'audio/mpeg';
    case 'wav': return 'audio/wav';
    case 'glb': return 'model/gltf-binary';
    default: return 'application/octet-stream';
  }
}

function buildExecutionQueue(rootNodeId: string): ExecutionQueue[] {
  const { connections } = useNodeStore.getState();
  const queue: ExecutionQueue[] = [];
  const visited = new Set<string>();

  function visit(nodeId: string) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const dependencies = connections
      .filter(c => c.targetNodeId === nodeId)
      .map(c => c.sourceNodeId);

    for (const depId of dependencies) {
      visit(depId);
    }

    queue.push({
      nodeId,
      dependencies,
      status: 'idle'
    });
  }

  visit(rootNodeId);
  return queue;
}

function buildExecutionQueueMulti(rootNodeIds: string[]): ExecutionQueue[] {
  const { connections } = useNodeStore.getState();
  const queue: ExecutionQueue[] = [];
  const visited = new Set<string>();

  function visit(nodeId: string) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const dependencies = connections
      .filter(c => c.targetNodeId === nodeId)
      .map(c => c.sourceNodeId);

    for (const depId of dependencies) {
      visit(depId);
    }

    queue.push({
      nodeId,
      dependencies,
      status: 'idle'
    });
  }

  for (const id of rootNodeIds) {
    visit(id);
  }
  return queue;
}

async function collectNodeInputs(nodeId: string): Promise<Record<string, unknown>> {
  const { nodes, connections } = useNodeStore.getState();
  const { executionStates } = useExecutionStore.getState();
  
  const node = nodes.find(n => n.id === nodeId);
  if (!node) throw new Error('Node not found');

  const inputs: Record<string, unknown> = {};
  
  for (const input of node.inputs) {
    const connection = connections.find(c => c.targetNodeId === nodeId && c.targetPortId === input.id);
    if (connection) {
      const sourceNode = nodes.find(n => n.id === connection.sourceNodeId);
      if (!sourceNode) throw new Error('Source node not found');

      const sourceExecution = executionStates[sourceNode.id];
      if (!sourceExecution || sourceExecution.status !== 'completed') {
        throw new Error(`Source node ${sourceNode.type} has not completed execution`);
      }

      inputs[input.id] = sourceExecution.result;
    }
  }

  return inputs;
}
