import { NodeData } from '../types/node';

export const calculateNodePosition = (
  nodes: NodeData[],
  basePosition: { x: number; y: number }
): { x: number; y: number } => {
  const GRID_SIZE = 20;
  const occupied = new Set(
    nodes.map(node => `${Math.round(node.position.x / GRID_SIZE)},${Math.round(node.position.y / GRID_SIZE)}`)
  );

  let x = Math.round(basePosition.x / GRID_SIZE) * GRID_SIZE;
  let y = Math.round(basePosition.y / GRID_SIZE) * GRID_SIZE;

  while (occupied.has(`${x / GRID_SIZE},${y / GRID_SIZE}`)) {
    x += GRID_SIZE;
    if (x > window.innerWidth - 300) {
      x = GRID_SIZE;
      y += GRID_SIZE;
    }
  }

  return { x, y };
};