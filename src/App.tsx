import React from 'react';
import { ExecutionGraph } from './components/Graph/ExecutionGraph';
import { GraphData } from './types/graph';

interface AppProps {
  flowJSON: GraphData;
}

const App: React.FC<AppProps> = ({ flowJSON }) => {
  const handleNodeClick = (nodeId: string) => {
    console.log('Node clicked:', nodeId);
  };

  return (
    <div className="p-6" style={{ height: '100vh' }}>
      <ExecutionGraph
        data={flowJSON}
        onNodeClick={handleNodeClick}
      />
    </div>
  );
};

export default App;
