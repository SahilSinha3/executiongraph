import React from 'react';
import type { Node as NodeType } from '../../types/graph';

interface NodeLabelProps {
  node: NodeType;
}

export function NodeLabel({ node }: NodeLabelProps) {
  const timeValue = node.metadata?.time_taken || node.metadata?.time_spent;

  // Replace "Scrape" with "Research" in the label
  const updatedLabel = node.label?.replace(/Scrape/gi, 'Research');

  return (
    <div className="absolute left-1/2 -translate-x-1/2 w-40 text-center" style={{ top: '5.5rem' }}>
      <div className="text-sm font-medium text-gray-800 truncate bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
        {updatedLabel}
      </div>
      {timeValue && (
        <div className="text-xs text-gray-600 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full mt-1 shadow-sm">
          {timeValue}
          {node.metadata?.token_count !== undefined && (
            <span className="ml-1 text-gray-500">
              • {node.metadata.token_count} tokens
            </span>
          )}
        </div>
      )}
    </div>
  );
}
