import React from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import { Plus, Trash2, ExternalLink, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';

export const WatchlistTable = ({ onOpenAddModal }) => {
  const { changesBrief, filterSeverity, setSelectedSymbol, removeStock } = useWatchlist();

  if (!changesBrief || !changesBrief.changes) return null;

  const filteredChanges = changesBrief.changes.filter(item => {
    if (filterSeverity === 'ALL') return true;
    return item.severity === filterSeverity;
  });

  return (
    <div className="glass-card rounded-2xl border border-slate-200 overflow-hidden mb-12 shadow-sm">
      
      {/* Table Header */}
      <div className="p-5 border-b border-slate-200 bg-white flex items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-600" />
            {changesBrief.watchlistName || 'My Watchlist'}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Showing {filteredChanges.length} of {changesBrief.totalStocks} tracked stocks
          </p>
        </div>

        <button
          onClick={() => onOpenAddModal()}
          className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-brand-600/20 transition"
        >
          <Plus className="w-4 h-4" /> Add Stock
        </button>
      </div>

      {/* Table Content */}
      {filteredChanges.length === 0 ? (
        <div className="p-12 text-center text-slate-500">
          <p className="text-sm font-medium mb-1">No stocks match the selected filter ({filterSeverity}).</p>
          <p className="text-xs text-slate-400">Try switching to "All Stocks" or add a new stock symbol.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Symbol</th>
                <th className="py-3.5 px-5">Current Price</th>
                <th className="py-3.5 px-5">Today's Move</th>
                <th className="py-3.5 px-5">Change Score</th>
                <th className="py-3.5 px-5">Severity Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm bg-white">
              {filteredChanges.map((item) => {
                const isPositive = item.priceChangePercent >= 0;
                return (
                  <tr
                    key={item.symbol}
                    className="hover:bg-slate-50 transition cursor-pointer group"
                    onClick={() => setSelectedSymbol(item.symbol)}
                  >
                    {/* Symbol */}
                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-900 group-hover:text-brand-600 transition flex items-center gap-2">
                        {item.symbol}
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-600 transition opacity-0 group-hover:opacity-100" />
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-5 font-mono font-bold text-slate-900">
                      ₹{item.price?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Today's Move */}
                    <td className="py-4 px-5 font-mono text-xs font-bold">
                      <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ${
                        isPositive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        <span>{isPositive ? '+' : ''}{item.priceChangePercent?.toFixed(2)}%</span>
                      </div>
                    </td>

                    {/* Score */}
                    <td className="py-4 px-5 font-mono text-xs font-semibold text-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.changeScore >= 70 ? 'bg-red-500' : item.changeScore >= 40 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${item.changeScore}%` }}
                          />
                        </div>
                        <span>{item.changeScore}/100</span>
                      </div>
                    </td>

                    {/* Severity Tag */}
                    <td className="py-4 px-5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-2xs ${
                        item.severity === 'SIGNIFICANT'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : item.severity === 'WATCH'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {item.severity === 'SIGNIFICANT' && '🔴 SIGNIFICANT'}
                        {item.severity === 'WATCH' && '🟡 WORTH WATCHING'}
                        {item.severity === 'NORMAL' && '🟢 NORMAL'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => removeStock(item.symbol)}
                        title="Remove stock from watchlist"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
