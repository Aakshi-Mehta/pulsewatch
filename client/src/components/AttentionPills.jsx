import React from 'react';
import { useWatchlist } from '../context/WatchlistContext';

export const AttentionPills = () => {
  const { filterSeverity, setFilterSeverity, changesBrief } = useWatchlist();

  if (!changesBrief) return null;

  const { summary } = changesBrief;

  const filters = [
    { id: 'ALL', label: 'All Stocks', count: summary.significant + summary.watch + summary.normal },
    { id: 'SIGNIFICANT', label: '🔴 Significant', count: summary.significant },
    { id: 'WATCH', label: '🟡 Worth Watching', count: summary.watch },
    { id: 'NORMAL', label: '🟢 Normal', count: summary.normal },
  ];

  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2 hidden sm:inline">
        Your Attention:
      </span>
      {filters.map((f) => {
        const isActive = filterSeverity === f.id;
        return (
          <button
            key={f.id}
            onClick={() => setFilterSeverity(f.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap border shadow-sm ${
              isActive
                ? 'bg-brand-600 text-white border-brand-700 shadow-md shadow-brand-500/20'
                : 'bg-white text-slate-700 border-slate-200 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <span>{f.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {f.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
