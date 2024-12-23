import type { Position } from '../../types/graph';
import { getEdgeColor } from '../../utils/colors';

interface EdgeProps {
  start: Position;
  end: Position;
  type?: 'normal' | 'error' | 'condition';
  animated?: boolean;
  isStartConnection?: boolean;
}

export function Edge({ start, end, type = 'normal', animated = false, isStartConnection = false }: EdgeProps) {
  const edgeColor = getEdgeColor(type);
  
  // Calculate the angle and distance between nodes
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const angle = Math.atan2(dy, dx);
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Larger semi-circle radius
  const semiCircleRadius = 12;
  
  // Calculate start and end points with offset for larger semi-circles
  const startX = start.x + 20;
  const startY = start.y + 20;
  const endX = end.x + 20;
  const endY = end.y + 20;
  
  // Calculate control points for curved paths
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  // Create path string based on connection type
  let pathString;
  if (type === 'error' || type === 'condition') {
    const curvature = type === 'error' ? -0.2 : 0.2;
    const controlX = midX - dy * curvature;
    const controlY = midY + dx * curvature;
    pathString = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
  } else {
    const curvature = isStartConnection ? 0.05 : 0.1;
    const controlX = midX;
    const controlY = midY - distance * curvature;
    pathString = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
  }

  return (
    <g style={{ overflow: 'visible' }}>
      {/* Main path with larger rounded dots */}
      <path
        d={pathString}
        stroke={edgeColor}
        strokeLinecap="round"
        strokeDasharray="2 8"
        strokeWidth="4"
        fill="none"
        className="edge-path"
        style={{
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
        }}
      />

      {/* Start semi-circle connector - larger and more prominent */}
      <path
        d={`
          M ${startX - semiCircleRadius} ${startY}
          a ${semiCircleRadius} ${semiCircleRadius} 0 0 1 ${semiCircleRadius * 2} 0
        `}
        fill={edgeColor}
        transform={`rotate(${(angle * 180) / Math.PI}, ${startX}, ${startY})`}
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}
      />

      {/* End semi-circle connector - larger and more prominent */}
      <path
        d={`
          M ${endX - semiCircleRadius} ${endY}
          a ${semiCircleRadius} ${semiCircleRadius} 0 0 1 ${semiCircleRadius * 2} 0
        `}
        fill={edgeColor}
        transform={`rotate(${(angle * 180) / Math.PI}, ${endX}, ${endY})`}
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}
      />
    </g>
  );
}