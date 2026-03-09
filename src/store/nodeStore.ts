import { create } from 'zustand';
import { NodeData, Connection } from '../types/node';
import { createNodeTemplate } from '../utils/nodeTemplates';
import { toast } from 'sonner';

interface NodeState {
  nodes: NodeData[];
  connections: Connection[];
  history: Array<{ nodes: NodeData[]; connections: Connection[] }>;
  historyIndex: number;
  selectedNodeId: string | null;
  addNode: (type: string, position: { x: number; y: number }) => void;
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;
  addConnection: (connection: Connection) => void;
  removeConnection: (id: string) => void;
  deleteNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  undo: () => void;
  redo: () => void;
  updateNodeConfig: (id: string, config: any) => void;
}

// Singleton pattern for zustand store to prevent re-initialization on HMR
let storeInstance: ReturnType<typeof create<NodeState>> | undefined;

if (!storeInstance) {
  storeInstance = create<NodeState>((set, get) => ({
    nodes: [],
    connections: [],
    history: [],
    historyIndex: -1,
    selectedNodeId: null,

    selectNode: (id) => {
      set({ selectedNodeId: id });
    },

    deleteNode: (id) => {
      set((state) => {
        const newNodes = state.nodes.filter((n) => n.id !== id);
        const newConnections = state.connections.filter(
          (c) => c.sourceNodeId !== id && c.targetNodeId !== id
        );
        return {
          nodes: newNodes,
          connections: newConnections,
          selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
          history: [
            ...state.history.slice(0, state.historyIndex + 1),
            { nodes: state.nodes, connections: state.connections },
          ],
          historyIndex: state.historyIndex + 1,
        };
      });
      toast.success('Node deleted');
    },

    addNode: (type, position) => {
      try {
        const newNode = createNodeTemplate(type, position);
        set((state) => {
          const newState = {
            nodes: [...state.nodes, newNode],
            connections: state.connections,
            history: [...state.history.slice(0, state.historyIndex + 1), { nodes: state.nodes, connections: state.connections }],
            historyIndex: state.historyIndex + 1,
          };
          return newState;
        });
        toast.success(`Added ${type} node`);
      } catch (error) {
        toast.error(error.message);
      }
    },

    updateNodeConfig: (id, config) => {
      set((state) => ({
        nodes: state.nodes.map((node) =>
          node.id === id ? { ...node, config } : node
        ),
        history: [
          ...state.history.slice(0, state.historyIndex + 1),
          { nodes: state.nodes, connections: state.connections }
        ],
        historyIndex: state.historyIndex + 1,
      }));
    },

    updateNodePosition: (id, position) => {
      set((state) => ({
        nodes: state.nodes.map((node) =>
          node.id === id ? { ...node, position } : node
        ),
        history: [...state.history.slice(0, state.historyIndex + 1), { nodes: state.nodes, connections: state.connections }],
        historyIndex: state.historyIndex + 1,
      }));
    },

    addConnection: (connection) => {
      console.log('addConnection called with:', connection);
      set((state) => ({
        connections: [...state.connections, connection],
        history: [...state.history.slice(0, state.historyIndex + 1), { nodes: state.nodes, connections: state.connections }],
        historyIndex: state.historyIndex + 1,
      }));
    },

    removeConnection: (id) => {
      set((state) => ({
        connections: state.connections.filter((conn) => conn.id !== id),
        history: [...state.history.slice(0, state.historyIndex + 1), { nodes: state.nodes, connections: state.connections }],
        historyIndex: state.historyIndex + 1,
      }));
    },

    undo: () => {
      const { historyIndex, history } = get();
      if (historyIndex > 0) {
        const previousState = history[historyIndex - 1];
        set({
          nodes: previousState.nodes,
          connections: previousState.connections,
          historyIndex: historyIndex - 1,
        });
      }
    },

    redo: () => {
      const { historyIndex, history } = get();
      if (historyIndex < history.length - 1) {
        const nextState = history[historyIndex + 1];
        set({
          nodes: nextState.nodes,
          connections: nextState.connections,
          historyIndex: historyIndex + 1,
        });
      }
    },
  }));
}

export const useNodeStore = storeInstance!;
