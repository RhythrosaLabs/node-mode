export interface NodeData {
  id: string;
  type: string;
  position: { x: number; y: number };
  inputs: NodePort[];
  outputs: NodePort[];
  config: Record<string, any>;
}

export interface NodePort {
  id: string;
  name: string;
  type: string;
  data?: any;
}

export interface Connection {
  id: string;
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
}