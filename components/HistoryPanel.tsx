import React from 'react';
import { getHistory, HistoryItem } from '../services/historyService';

interface HistoryPanelProps {
  onLoadHistory: (item: HistoryItem) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ onLoadHistory }) => {
  const [history, setHistory] = React.useState<HistoryItem[]>([]);
  
  React.useEffect(() => {
      setHistory(getHistory());
  }, []);

  const handleRefresh = () => {
    setHistory(getHistory());
  }
  
  // This is a bit of a hack to make the history panel reactive
  // to new history entries without a full state management solution.
  // We check for new history on mount and when a history item is loaded.
  React.useEffect(() => {
    const handleStorageChange = () => {
        handleRefresh();
    }
    window.addEventListener('storage', handleStorageChange)
    return () => {
        window.removeEventListener('storage', handleStorageChange)
    }
  }, [])
  

  if (history.length === 0) {
    return (
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 text-center">
        <h3 className="text-lg font-semibold text-slate-100">Run History</h3>
        <p className="text-sm text-slate-400 mt-2">No history yet. Analyze a requirement to start.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Run History</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {history.map((item) => (
          <div 
            key={item.id}
            className="p-3 bg-slate-900/50 rounded-md border border-slate-700 hover:bg-slate-700/50 cursor-pointer"
            onClick={() => {
                onLoadHistory(item)
                handleRefresh()
            }}
          >
            <p className="text-sm font-semibold text-sky-400 truncate">{item.analyzedRequirement.requirement_id}</p>
            <p className="text-xs text-slate-400 truncate">{item.requirementText}</p>
            <p className="text-xs text-slate-500 mt-1">{new Date(item.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;
