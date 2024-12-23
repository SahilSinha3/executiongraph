import type { Node, Position, GraphData } from '../types/graph';

export const calculateNodePositions = (
  nodes: Node[],
  width: number,
  height: number,
  graphData: GraphData
): Record<string, Position> => {
  const positions: Record<string, Position> = {};
  const nodesPerRow = 4; // Maximum number of nodes per row
  const horizontalSpacing = width / (nodesPerRow + 1);
  const verticalSpacing = 200;
  const startX = 100;
  const startY = 80;

  // Sort nodes to ensure control nodes are positioned correctly
  const sortedNodes = [...nodes].sort((a, b) => {
    if (a.type === 'start') return -1;
    if (b.type === 'start') return 1;
    if (a.type === 'end') return 1;
    if (b.type === 'end') return -1;
    return 0;
  });

  let lastRowY = startY; // Track the Y-coordinate of the last row
  let lastRowCount = 0; // Track the number of nodes in the last row

  sortedNodes.forEach((node, index) => {
    const row = Math.floor(index / nodesPerRow);
    const isEvenRow = row % 2 === 0;
    let col = index % nodesPerRow;

    // Reverse column order for odd rows (zigzag pattern)
    if (!isEvenRow) {
      col = nodesPerRow - 1 - col;
    }

    // Special positioning for start node
    if (node.type === 'start') {
      positions[node.id] = {
        x: startX,
        y: startY,
      };
    } else if (node.type === 'end') {
      // End node placement logic (dynamically at the end of the last row)
      const lastNodePosition = Object.values(positions).reduce(
        (acc, pos) => (pos.y > acc.y || (pos.y === acc.y && pos.x > acc.x) ? pos : acc),
        { x: 0, y: 0 }
      );

      positions[node.id] = {
        x: Math.min(lastNodePosition.x + horizontalSpacing, width - horizontalSpacing),
        y: lastNodePosition.y + (lastRowCount < nodesPerRow ? 0 : verticalSpacing),
      };
    } else {
      // Adjust first node after start to be closer
      const isFirstNode = node.id === graphData.flowCode.controlNodes.start.connections.next[0];
      if (isFirstNode) {
        positions[node.id] = {
          x: startX + horizontalSpacing * 0.8,
          y: startY,
        };
      } else {
        positions[node.id] = {
          x: startX + col * horizontalSpacing,
          y: startY + row * verticalSpacing,
        };
      }

      // Update last row tracking
      lastRowY = startY + row * verticalSpacing;
      lastRowCount = col + 1;
    }
  });

  return positions;
};