import React from 'react';
import { Clock, ShieldAlert, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';

export const ReturnBriefHeader = () => {
  const { user } = useAuth();
  const { changesBrief } = useWatchlist();

  if (!changesBrief) return null;

  const { awayDuration, summary, totalStocks } = changesBrief;
  const totalAttentionCount = summary.significant + summary.watch;
  const userName = user?.name || 'Trader';
  const currentDateStr = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="relative overflow-hidden rounded-2xl glass-card p-6 md:p-8 mb-8 border border-slate-200 shadow-sm bg-white">
      {/* Subtle Background Accent Gradients */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        
        {/* Left Column: Professional Greeting & Away Duration */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 px-2.5 py-1 rounded-full bg-brand-50 border border-brand-200 flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" /> Market Briefing
            </span>
            <span className="text-xs text-slate-500 font-mono font-medium">
              {currentDateStr}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 flex items-center gap-1 font-mono font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Away for {awayDuration || '2h 0m'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Welcome back, {userName}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed font-medium">
            {totalAttentionCount > 0 ? (
              <>
                <span className="font-bold text-slate-900">{totalAttentionCount} stock{totalAttentionCount > 1 ? 's' : ''} need your attention.</span> PulseWatch detected unusual movement since your last check.
              </>
            ) : (
              <>
                <span className="font-bold text-slate-900">Nothing needs your attention right now.</span> All {totalStocks || 5} stocks in your watchlist are moving within their expected ranges.
              </>
            )}
          </p>
        </div>

        {/* Right Column: Quick Stat Cards */}
        <div className="flex items-center gap-3">
          
          {/* Significant Count Pill */}
          <div className={`flex-1 sm:flex-none px-4 py-3 rounded-xl border flex items-center gap-3 ${
            summary.significant > 0 
              ? 'bg-red-50 border-red-200 text-red-700 shadow-sm' 
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-600" />
            <div>
              <div className="text-lg font-bold leading-none font-mono text-slate-900">{summary.significant}</div>
              <div className="text-[11px] font-semibold tracking-wide uppercase mt-1 text-slate-500">Significant</div>
            </div>
          </div>

          {/* Watch Count Pill */}
          <div className={`flex-1 sm:flex-none px-4 py-3 rounded-xl border flex items-center gap-3 ${
            summary.watch > 0 
              ? 'bg-amber-50 border-amber-200 text-amber-800 shadow-sm' 
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600" />
            <div>
              <div className="text-lg font-bold leading-none font-mono text-slate-900">{summary.watch}</div>
              <div className="text-[11px] font-semibold tracking-wide uppercase mt-1 text-slate-500">Worth Watch</div>
            </div>
          </div>

          {/* Normal Count Pill */}
          <div className="flex-1 sm:flex-none px-4 py-3 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-800 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <div>
              <div className="text-lg font-bold leading-none font-mono text-slate-900">{summary.normal}</div>
              <div className="text-[11px] font-semibold tracking-wide uppercase mt-1 text-slate-500">Normal</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
