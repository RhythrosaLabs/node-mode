import { NodeData, Connection } from '../types/node';
import { useNodeStore } from '../store/nodeStore';

export function validateNodeInputs(nodeId: string, inputs: Record<string, any>): void {
  const node = useNodeStore.getState().nodes.find(n => n.id === nodeId);
  if (!node) throw new Error('Node not found');

  // Only validate that connected inputs have data.
  // Unconnected inputs can use values set directly in the node config.
  for (const input of node.inputs) {
    const hasConnection = useNodeStore.getState().connections.some(
      c => c.targetNodeId === nodeId && c.targetPortId === input.id
    );
    if (hasConnection && !inputs[input.id]) {
      throw new Error(`Missing required input: ${input.name}`);
    }
  }
}

export function validateConnection(
  sourceNode: NodeData,
  targetNode: NodeData,
  sourcePortId: string,
  targetPortId: string
): boolean {
  const sourcePort = sourceNode.outputs.find(p => p.id === sourcePortId);
  const targetPort = targetNode.inputs.find(p => p.id === targetPortId);

  if (!sourcePort || !targetPort) return false;

  // Check for cycles
  if (wouldCreateCycle(sourceNode.id, targetNode.id)) {
    return false;
  }

  return targetPort.type === 'any' || sourcePort.type === targetPort.type;
}

function wouldCreateCycle(sourceId: string, targetId: string): boolean {
  const visited = new Set<string>();

  function visit(nodeId: string): boolean {
    if (nodeId === sourceId) return true;
    if (visited.has(nodeId)) return false;
    visited.add(nodeId);

    const connections = useNodeStore.getState().connections;
    const nextNodes = connections
      .filter(c => c.sourceNodeId === nodeId)
      .map(c => c.targetNodeId);

    return nextNodes.some(visit);
  }

  return visit(targetId);
}