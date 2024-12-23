import type { Position } from '../../types/graph';
import { getGroupBackground } from '../../utils/colors';

interface GroupBackgroundProps {
  groupId: string;
  positions: Position[];
  name: string;
}

export function GroupBackground({ groupId, positions, name }: GroupBackgroundProps) {
  if (positions.length === 0) return null;

  const { background, border, title } = getGroupBackground(groupId);
  const minX = Math.min(...positions.map(p => p.x)) - 40;
  const minY = Math.min(...positions.map(p => p.y)) - 40;
  const maxX = Math.max(...positions.map(p => p.x)) + 80;
  const maxY = Math.max(...positions.map(p => p.y)) + 80;

  return (
    <g style={{ overflow: 'visible' }}>
      <rect
        x={minX}
        y={minY}
        width={maxX - minX}
        height={maxY - minY}
        rx={20}
        ry={20}
        fill={background}
        stroke={border}
        strokeWidth={2}
        strokeDasharray="4 2"
        strokeOpacity={0.5}
        fillOpacity={0.15}
      />
      <text
        x={minX + 10}
        y={minY + 20}
        style={{ fill: title }}
        className="text-sm font-semibold"
      >
        {name}
      </text>
    </g>
  );
}