import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Zap, BarChart3, AlertCircle, ArrowUpRight, ArrowDownRight, Activity, Info, ArrowRight } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';

export const SignificantChangeCard = ({ change }) => {
  const { setSelectedSymbol } = useWatchlist();
  const [showTooltip, setShowTooltip] = useState(false);

  const isPositive = change.priceChangePercent >= 0;
  const isSignificant = change.severity === 'SIGNIFICANT';

  const lastSeen = change.lastSeenPrice || change.previousClose;
  const currentPrice = change.price;

  return (
    <div
      onClick={() => setSelectedSymbol(change.symbol)}
      className={`glass-card glass-card-hover rounded-2xl p-6 border cursor-pointer relative overflow-hidden transition-all duration-300 ${
        isSignificant
          ? 'border-red-200 hover:border-red-300 glow-significant bg-gradient-to-br from-white via-white to-red-50/30'
          : 'border-amber-200 hover:border-amber-300 glow-watch bg-gradient-to-br from-white via-white to-amber-50/30'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        
        {/* Symbol & Title */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border shadow-xs ${
            isSignificant ? 'bg-red-50 text-red-600 border-red-200' : 'bg-amber-50 text-amber-600 border-amber-200'
          }`}>
            {change.symbol.slice(0, 3)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-xl text-slate-900 group-hover:text-brand-600 transition">
                {change.symbol}
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border shadow-2xs ${
                isSignificant 
                  ? 'bg-red-50 text-red-700 border-red-200' 
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {isSignificant ? '🔴 SIGNIFICANT' : '🟡 WORTH WATCHING'}
              </span>
            </div>
            
            {/* Price Shift ₹4,207 → ₹3,962 */}
            <div className="text-xs text-slate-500 font-mono font-medium mt-0.5">
              ₹{lastSeen?.toLocaleString('en-IN', { maximumFractionDigits: 2 })} → ₹{currentPrice?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Change % and Score */}
        <div className="text-right">
          <div className={`font-mono text-base font-bold flex items-center justify-end gap-1 ${
            isPositive ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{isPositive ? '+' : ''}{change.priceChangePercent?.toFixed(2)}%</span>
          </div>

          {/* Change Score with Info Tooltip */}
          <div className="relative inline-block mt-1">
            <div 
              className="flex items-center gap-1 font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200 cursor-help"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={(e) => { e.stopPropagation(); setShowTooltip(!showTooltip); }}
            >
              <span>Score: <strong className="text-slate-900">{change.changeScore}</strong>/100</span>
              <Info className="w-3 h-3 text-slate-400" />
            </div>

            {/* Info Tooltip */}
            {showTooltip && (
              <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-slate-900 text-white text-[11px] rounded-xl shadow-2xl z-30 font-sans leading-relaxed">
                Change Score estimates how meaningful a stock's movement is using price movement, volatility, volume anomalies and other available signals.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* WHY THIS MATTERS Section */}
      <div className="pt-4 border-t border-slate-100">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-brand-600" /> Why this matters:
        </div>

        <ul className="space-y-2">
          {change.reasons && change.reasons.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                isSignificant ? 'bg-red-500' : 'bg-amber-500'
              }`} />
              <span className="leading-snug">{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* View Details Action */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">PulseWatch Intelligence</span>
        <button className="text-brand-600 font-semibold hover:text-brand-700 flex items-center gap-1 group-hover:translate-x-0.5 transition">
          View Details <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
