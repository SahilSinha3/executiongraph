import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GraphData } from './types/graph'; // Import the GraphData interface

console.log("------------------------Initiated---------------------------");

// Define the ExecutionGraph Web Component
class ExecutionGraph extends HTMLElement {
  private root?: ReactDOM.Root; // Track the React root instance

  static get observedAttributes(): string[] {
    return ['flow-json']; // Observe changes to the flow-json attribute
  }

  connectedCallback(): void {
    this.renderApp();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (name === 'flow-json' && oldValue !== newValue) {
      this.renderApp(); // Re-render when the flow-json attribute changes
    }
  }

  disconnectedCallback(): void {
    if (this.root) {
      this.root.unmount();
    }
  }

  renderApp(): void {
    const flowJSON = this.getAttribute('flow-json');

    if (!flowJSON) {
      console.warn('ExecutionGraph: Missing "flow-json" attribute');
      return;
    }

    let parsedFlowJSON: GraphData;
    try {
      parsedFlowJSON = JSON.parse(flowJSON) as GraphData;
    } catch (error) {
      console.error('ExecutionGraph: Invalid JSON in "flow-json" attribute:', flowJSON);
      return;
    }

    if (!this.root) {
      this.root = ReactDOM.createRoot(this);
    }
    this.root.render(
      <React.StrictMode>
        <App flowJSON={parsedFlowJSON} /> {/* Pass the parsed JSON to App */}
      </React.StrictMode>
    );
  }
}

// Register the custom element
customElements.define('execution-graph', ExecutionGraph);
