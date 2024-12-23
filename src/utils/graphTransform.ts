import type { GraphData, Node, Edge } from '../types/graph';

export const transformGraphData = (data: GraphData): { nodes: Node[], edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  if (!data?.flowCode?.controlNodes) {
    throw new Error('Invalid graph data structure');
  }

  // Add control nodes
  const startNode = {
    ...data.flowCode.controlNodes.start,
    label: 'Execute Workflow',
    type: 'start' as const
  };
  
  const endNode = {
    ...data.flowCode.controlNodes.end,
    label: 'Execution Complete',
    type: 'end' as const
  };
  
  nodes.push(startNode);
  nodes.push(endNode);

  // Add start node connection
  if (startNode.connections?.next?.length > 0) {
    startNode.connections.next.forEach(targetId => {
      edges.push({
        source: startNode.id,
        target: targetId,
        type: 'normal'
      });
    });
  }

  // Process groups and their nodes
  Object.entries(data.flowCode.groups).forEach(([groupKey, group]) => {
    group.nodes.forEach(node => {
      const processedNode = {
        ...node,
        group: groupKey
      };
      nodes.push(processedNode);

      // Process connections
      if (node.connections) {
        // Normal connections
        if (node.connections.next) {
          node.connections.next.forEach(targetId => {
            edges.push({
              source: node.id,
              target: targetId,
              type: 'normal'
            });
          });
        }

        // Conditional connections
        if (node.connections.conditions) {
          node.connections.conditions.forEach(condition => {
            edges.push({
              source: node.id,
              target: condition.target,
              type: 'condition'
            });
          });
        }

        // Error connections
        if (node.connections.error) {
          node.connections.error.forEach(targetId => {
            edges.push({
              source: node.id,
              target: targetId,
              type: 'error'
            });
          });
        }
      }
    });
  });

  return { nodes, edges };
};