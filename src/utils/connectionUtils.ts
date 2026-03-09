import { Connection, NodeData } from '../types/node';

export const validateConnection = (
  sourceNode: NodeData,
  targetNode: NodeData,
  sourcePortId: string,
  targetPortId: string
): boolean => {
  const sourcePort = sourceNode.outputs.find(p => p.id === sourcePortId);
  const targetPort = targetNode.inputs.find(p => p.id === targetPortId);

  if (!sourcePort || !targetPort) return false;

  return targetPort.type === 'any' || sourcePort.type === targetPort.type;
};

export const createConnection = (
  sourceNodeId: string,
  sourcePortId: string,
  targetNodeId: string,
  targetPortId: string
): Connection => ({
  id: Math.random().toString(),
  sourceNodeId,
  sourcePortId,
  targetNodeId,
  targetPortId,
});