import React from 'react';
import { ExecutionGraph } from './components/Graph/ExecutionGraph';
import { GraphData } from './types/graph'; // Import the GraphData interface

interface AppProps {
  flowJSON: GraphData; // Expect the GraphData interface for flowJSON
}

const App: React.FC<AppProps> = ({ flowJSON }) => {
  const handleNodeClick = (nodeId: string) => {
    console.log('Node clicked:', nodeId);
  };

  return (
        <div className="p-6" style={{ height: '100vh' }}>
          <ExecutionGraph 
            data={flowJSON} // Pass the dynamic JSON data
            onNodeClick={handleNodeClick} // Handle node interactions
          />
        </div>
  );
};

export default App;
