// Pastel background colors for nodes
const nodeBackgroundColors = [
  '#E9F5F5', // Soft Mint (calming green tone)
  '#FDF6E3', // Warm Ivory (neutral, soft cream)
  '#F9F1FF', // Lavender Blush (light purple-pink)
  '#F5F7FA', // Light Gray (clean and modern)
  '#FFF1F2', // Rose Quartz (delicate pink)
  '#E5F4FF', // Sky Mist (light cyan-blue)
  '#EAF0FF', // Periwinkle Glow (light pastel blue)
  '#FFEFE5', // Apricot Whisper (warm peach)
  '#F4FBF3', // Soft Spring Green (very light green)
  '#FDF5E6', // Cream White (classic light cream)
];



// Vibrant border colors
const nodeBorderColors = [
  '#ffffff',
];

let currentColorIndex = 0;

// Group colors with reduced opacity for better visibility
const groupColors = {
  'pre-agent': {
    background: '#F0F9FF',
    border: '#0EA5E9',
    title: '#0369A1'
  },
  'post-agent': {
    background: '#F0FDF4',
    border: '#10B981',
    title: '#047857'
  }
};

// Control node colors
const controlNodeColors = {
  start: {
    background: '#C3EBB4', 
    border: '#C3EBB4'      
  },
  end: {
    background: '#D9D9D9', 
    border: '#D9D9D9'      
  }
};

export const resetColorIndex = () => {
  currentColorIndex = 0;
};

export const getNextNodeColors = () => {
  const background = nodeBackgroundColors[currentColorIndex];
  const border = nodeBorderColors[currentColorIndex];
  currentColorIndex = (currentColorIndex + 1) % nodeBackgroundColors.length;
  return { background, border };
};

export const getNodeColor = (type: string, group?: string): string => {
  if (type === 'start') return controlNodeColors.start.background;
  if (type === 'end') return controlNodeColors.end.background;
  return getNextNodeColors().background;
};

export const getNodeBorder = (type: string, group?: string): string => {
  if (type === 'start') return controlNodeColors.start.border;
  if (type === 'end') return controlNodeColors.end.border;
  return getNextNodeColors().border;
};

export const getEdgeColor = (type: string): string => {
  switch (type) {
    case 'error':
      return '#EF4444';
    case 'condition':
      return '#8B5CF6';
    default:
      return '#94A3B8';
  }
};

export const getGroupBackground = (groupId: string): { 
  background: string;
  border: string;
  title: string;
} => {
  return groupColors[groupId] || {
    background: '#F8FAFC',
    border: '#94A3B8',
    title: '#475569'
  };
};