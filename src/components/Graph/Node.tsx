import React, { useState } from 'react';
import { NodeLabel } from './NodeLabel';
import type { Node as NodeType } from '../../types/graph';
import { getNodeColor, getNodeBorder } from '../../utils/colors';
import { getIconForNode } from '../../utils/icons';

const EXCLUDED_KEYS = ['iconType', 'color', 'shape', 'icon'];

interface NodeProps {
  node: NodeType;
  selected: boolean;
  onClick: (id: string) => void;
}

function isUrl(str: string) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

// Recursive renderer for metadata
function renderMetadata(key: string, value: any, depth = 0): JSX.Element {
  const indent = { paddingLeft: `${depth * 10}px` };

  // Helper function to format keys
  const formatKey = (str: string) =>
    str
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  if (key === 'search' && value.providers && Array.isArray(value.providers)) {
    const maxVisible = 5;
    const visibleProviders = value.providers.slice(0, maxVisible);
    const remainingCount = value.providers.length - maxVisible;

    return (
      <div key={key} style={indent} className="mb-2">
        <strong>Research Tools:</strong>
        <div className="flex flex-wrap mt-1">
          {visibleProviders.map((provider, index) => (
            <div key={index} className="flex items-center mr-3 mb-2">
              {provider.icon && (
                <img
                  src={provider.icon}
                  alt={provider.name}
                  className="w-5 h-5 rounded-full mr-2"
                />
              )}
              <span className="text-sm text-gray-800">{provider.name}</span>
            </div>
          ))}
          {remainingCount > 0 && (
            <div className="text-sm text-gray-500 mt-1">
              +{remainingCount} more
            </div>
          )}
        </div>
      </div>
    );
  }

  if (key === 'llm' && value.model && value.icon) {
    // Custom rendering for LLM
    return (
      <div key={key} style={indent} className="mb-2">
        <strong>LLM:</strong>
        <div className="flex items-center mt-1">
          {value.icon && (
            <img
              src={value.icon}
              alt={value.model}
              className="w-5 h-5 rounded-full mr-2"
            />
          )}
          <span className="text-sm text-gray-800">{value.model}</span>
        </div>
      </div>
    );
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    // Render object metadata recursively
    return (
      <div key={key} style={indent} className="mb-1">
        <strong>{formatKey(key)}:</strong>
        <div className="ml-2">
          {Object.entries(value).map(([k, v]) => renderMetadata(k, v, depth + 1))}
        </div>
      </div>
    );
  } else if (Array.isArray(value)) {
    // Render array metadata
    return (
      <div key={key} style={indent} className="mb-1">
        <strong>{formatKey(key)}:</strong>
        {value.length === 0 ? (
          <span className="ml-2">[]</span>
        ) : (
          <div className="ml-2">
            {value.map((item, idx) => renderMetadata(`${key}[${idx}]`, item, depth + 1))}
          </div>
        )}
      </div>
    );
  } else {
    // Render primitive values
    return (
      <div key={key} style={indent} className="mb-1">
        <strong>{formatKey(key)}:</strong> {String(value)}
      </div>
    );
  }
}

function renderIcon(icon: string | undefined, label: string) {
  if (!icon) {
    // Fallback to first letter of the label
    return (
      <div className="text-2xl font-bold text-gray-700">
        {label.charAt(0).toUpperCase()}
      </div>
    );
  }

  if (isUrl(icon)) {
    // Render as an image if it's a URL
    return <img src={icon} alt={label} className="w-8 h-8" />;
  }

  if (icon.startsWith('fa ')) {
    // Render as a Font Awesome icon
    return <i className={`${icon} text-2xl`} aria-hidden="true"></i>;
  }

  if (icon.startsWith('<svg')) {
    // Render as inline SVG
    return (
      <div
        className="w-8 h-8"
        dangerouslySetInnerHTML={{ __html: icon }}
      ></div>
    );
  }

  // Fallback to text if the icon type is not recognized
  return (
    <div className="text-2xl font-bold text-gray-700">
      {label.charAt(0).toUpperCase()}
    </div>
  );
}

function NodeComponent({ node, selected, onClick }: NodeProps) {
  const [hovered, setHovered] = useState(false);
  const isControlNode = node.type === 'start' || node.type === 'end';
  const isStartNode = node.type === 'start';
  const isEndNode = node.type === 'end';
  const backgroundColor = getNodeColor(node.type, node.group);
  const borderColor = getNodeBorder(node.type, node.group);
  const customIcon = getIconForNode(node.id);

  /* Removed heavy "transition-all duration-300" to reduce CPU usage on hover. 
     If you want a slight hover effect, you can keep a shorter or simpler transition. */
  const baseClasses = `
    cursor-pointer 
    flex items-center justify-center
    ${selected ? 'ring-4 ring-blue-400 ring-opacity-50 scale-105' : 'hover:scale-105'}
    shadow-lg hover:shadow-xl
    relative
  `;

  const shapeClasses = isStartNode
    ? 'w-28 h-20 rounded-l-full' 
    : isEndNode
      ? 'w-28 h-20 rounded-r-full z-10' 
      : 'w-20 h-20 rounded-full';

  return (
    <div
      className={`${baseClasses} ${shapeClasses}`}
      onClick={() => onClick(node.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor,
        border: `3px solid ${borderColor}`,
        boxShadow: `0 4px 8px rgba(0, 0, 0, 0.2)`,
      }}
    >
      {/* Render Icon */}
      <div
        className="w-12 h-12 flex items-center justify-center rounded-full shadow-md"
        style={{
          boxShadow: isControlNode ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
        }}
      >
        {renderIcon(customIcon || node.metadata?.icon, node.label)}
      </div>

      {/* Search Provider Icons */}
      {node.metadata?.search?.providers && (
        <div className="absolute -top-2 -right-2 flex space-x-1">
          {node.metadata.search.providers.slice(0, 2).map((provider, index) => (
            <img
              key={provider.name}
              src={provider.icon}
              alt={provider.name}
              className="w-6 h-6 rounded-full bg-white shadow-sm"
              style={{
                transform: `translateX(${index * -8}px)`,
                zIndex: 20 - index,
              }}
            />
          ))}
          {node.metadata.search.providers.length > 2 && (
            <div
              className="w-5 h-5 rounded-full bg-gray-300 text-xs text-gray-800 flex items-center justify-center shadow-sm"
              style={{
                transform: `translateX(-16px)`,
                zIndex: 18,
              }}
            >
              +{node.metadata.search.providers.length - 2}
            </div>
          )}
        </div>
      )}

      {/* Search Count Indicator */}
      {node.metadata?.search?.searchCount > 0 && (
        <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
          {node.metadata.search.searchCount}+
        </div>
      )}

      {/* LLM Indicator */}
      {node.metadata?.llm && (
        <div className="absolute -bottom-1 -right-1">
          <img
            src={node.metadata.llm.icon}
            alt={node.metadata.llm.model}
            className="w-6 h-6 rounded-full bg-white shadow-sm"
          />
        </div>
      )}

      {/* Metadata Tooltip */}
      {hovered && (
        <div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-4 bg-white border border-gray-300 rounded-lg shadow-xl text-sm w-56 max-w-xs z-100"
          style={{
            background: 'linear-gradient(to bottom, #FFFFFF, #F9FAFB)',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
          }}
        >
          <div className="font-semibold text-gray-800 mb-2 border-b pb-2 border-gray-200">
            {node.label}
          </div>
          <div className="text-gray-600">
            {Object.keys(node.metadata || {})
              .filter((key) => !EXCLUDED_KEYS.includes(key))
              .map((key) => renderMetadata(key, node.metadata![key]))}
          </div>
        </div>
      )}

      {/* Node Label */}
      <NodeLabel node={node} />
    </div>
  );
}

/* Memoize the Node component to avoid unnecessary re-renders */
export const Node = React.memo(NodeComponent);
