import { useState, useEffect, useRef } from 'react';
import { Node } from './Node';
import { Edge } from './Edge';
import { GroupBackground } from './GroupBackground';
import { calculateNodePositions } from '../../utils/graphLayout';
import { transformGraphData } from '../../utils/graphTransform';
import { resetColorIndex } from '../../utils/colors';
import type { GraphData, Position } from '../../types/graph';

interface ExecutionGraphProps {
  data: GraphData;
  onNodeClick?: (nodeId: string) => void;
}

export function ExecutionGraph({ data, onNodeClick }: ExecutionGraphProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const [transform, setTransform] = useState({ scale: 1, translateX: 0, translateY: 0 });
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const { nodes, edges } = transformGraphData(data);

  useEffect(() => {
    // Reset color index so each new instance starts fresh
    resetColorIndex();
    // Calculate positions for nodes once
    const newPositions = calculateNodePositions(nodes, 1600, 800, data);
    setPositions(newPositions);
  }, [data, nodes]);

  useEffect(() => {
    // Adjust the view to fit the nodes just once (or if container changes size)
    const adjustGraphToFit = () => {
      const container = containerRef.current;
      if (!container) return;

      // Calculate bounding box of all nodes
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

      // Include node positions
      nodes.forEach((node) => {
        const pos = positions[node.id];
        if (!pos) return;
        const isControlNode = node.type === 'start' || node.type === 'end';
        const nodeWidth = isControlNode ? 120 : 80;
        const nodeHeight = isControlNode ? 60 : 80;

        if (pos.x < minX) minX = pos.x;
        if (pos.y < minY) minY = pos.y;
        if (pos.x + nodeWidth > maxX) maxX = pos.x + nodeWidth;
        if (pos.y + nodeHeight > maxY) maxY = pos.y + nodeHeight;
      });

      // Include edge positions for some padding
      edges.forEach(({ source, target }) => {
        const startPos = positions[source];
        const endPos = positions[target];
        if (!startPos || !endPos) return;
        const edgePadding = 20;
        minX = Math.min(minX, startPos.x - edgePadding, endPos.x - edgePadding);
        minY = Math.min(minY, startPos.y - edgePadding, endPos.y - edgePadding);
        maxX = Math.max(maxX, startPos.x + edgePadding, endPos.x + edgePadding);
        maxY = Math.max(maxY, startPos.y + edgePadding, endPos.y + edgePadding);
      });

      const contentWidth = maxX - minX;
      const contentHeight = maxY - minY;
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      const scaleX = containerWidth / contentWidth;
      const scaleY = containerHeight / contentHeight;
      const scale = Math.min(scaleX, scaleY);

      const translateX = -minX * scale + (containerWidth - contentWidth * scale) / 2;
      const translateY = -minY * scale + (containerHeight - contentHeight * scale) / 2;

      setTransform({ scale, translateX, translateY });
      setSvgDimensions({ width: contentWidth, height: contentHeight });
    };

    // Run once right after positions are set
    adjustGraphToFit();

    // If you do NOT want to recalc on every window resize, you can remove below:
    window.addEventListener('resize', adjustGraphToFit);
    return () => window.removeEventListener('resize', adjustGraphToFit);
  }, [nodes, edges, positions]);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    onNodeClick?.(nodeId);
  };

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <div
        className="absolute top-0 left-0 transform-gpu"
        style={{
          transform: `translate(${transform.translateX}px, ${transform.translateY}px) scale(${transform.scale})`,
          transformOrigin: '0 0',
        }}
      >
        <svg
          className="absolute top-0 left-0 pointer-events-none"
          style={{
            width: `${svgDimensions.width + 100}px`,
            height: `${svgDimensions.height + 100}px`,
            left: 15,
            top: 15,
          }}
        >
          <defs>
            {['normal', 'error', 'condition'].map((type) => (
              <marker
                key={type}
                id={`${type}-arrow`}
                markerWidth="10"
                markerHeight="7"
                refX="8"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 8 3.5, 0 7"
                  fill={
                    type === 'error'
                      ? '#EF4444'
                      : type === 'condition'
                      ? '#8B5CF6'
                      : '#94A3B8'
                  }
                />
              </marker>
            ))}
          </defs>

          {/* Group Backgrounds */}
          {Object.entries(data.flowCode.groups).map(([groupId, group]) => {
            const groupName = group.name;
            // Positions of all nodes in this group
            return (
              <GroupBackground
                key={groupId}
                groupId={groupId}
                name={groupName}
                positions={nodes
                  .filter((n) => n.group === groupId)
                  .map((n) => positions[n.id])
                  .filter(Boolean) as Position[]}
              />
            );
          })}

          {/* Edges */}
          {edges.map((edge) => {
            const startPos = positions[edge.source];
            const endPos = positions[edge.target];
            if (!startPos || !endPos) return null;
            return (
              <Edge
                key={`${edge.source}-${edge.target}`}
                start={startPos}
                end={endPos}
                type={edge.type}
                animated={selectedNode === edge.source}
                isStartConnection={edge.source === 'start'}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => {
          const position = positions[node.id];
          if (!position) return null;

          return (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                transform: `translate(${position.x}px, ${position.y}px)`,
              }}
            >
              <Node
                node={node}
                selected={selectedNode === node.id}
                onClick={handleNodeClick}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
