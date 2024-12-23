export interface Position {
  x: number;
  y: number;
}

export interface Connection {
  condition?: string;
  target: string;
}

export interface NodeConnections {
  next: string[];
  conditions?: Connection[];
  error?: string[];
}

export interface SearchProvider {
  name: string;
  icon: string;
}

export interface SearchMetadata {
  providers: SearchProvider[];
  searchCount: number;
}

export interface LLMMetadata {
  model: string;
  icon: string;
  tokenCount?: number;
}

export interface NodeMetadata {
  icon?: string;
  model?: string;
  time_taken?: string;
  time_spent?: string;
  token_count?: number;
  shape?: 'circle' | 'rectangle' | 'hexagon';
  order?: number;
  color?: string;
  search?: SearchMetadata;
  llm?: LLMMetadata;
}

export interface Node {
  id: string;
  type: 'start' | 'process' | 'end' | 'agent';
  label: string;
  group?: string;
  metadata?: NodeMetadata;
  connections: NodeConnections;
}

export interface Edge {
  source: string;
  target: string;
  type: 'normal' | 'error' | 'condition';
}

export interface GroupMetadata {
  icon: string;
  color: string;
  borderColor: string;
}

export interface Group {
  id: string;
  name: string;
  metadata: GroupMetadata;
  nodes: Node[];
}

export interface ControlNodes {
  start: Node;
  end: Node;
}

export interface FlowCode {
  groups: Record<string, Group>;
  controlNodes: ControlNodes;
  metadata: {
    flowType: string;
    version: string;
    supportedFeatures: string[];
  };
}

export interface GraphData {
  flowId: string;
  flowCode: FlowCode;
}