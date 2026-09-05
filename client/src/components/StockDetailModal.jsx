import React, { useState, useEffect } from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import { marketAPI } from '../api/client';
import { X, TrendingUp, TrendingDown, Clock, ShieldCheck, AlertTriangle, Zap, Activity, BarChart2, Info, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const StockDetailModal = () => {
  const { selectedSymbol, setSelectedSymbol, changesBrief } = useWatchlist();

  const [quote, setQuote] = useState(null);
  const [history, setHistory] = useState([]);
  const [timeframe, setTimeframe] = useState('1M');
  const [loading, setLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  const activeChangeInfo = changesBrief?.changes?.find(c => c.symbol === selectedSymbol);

  useEffect(() => {
    if (!selectedSymbol) return;

    const fetchDetailData = async () => {
      setLoading(true);
      try {
        const [quoteRes, histRes] = await Promise.all([
          marketAPI.getQuote(selectedSymbol),
          marketAPI.getHistory(selectedSymbol, timeframe),
        ]);

        if (quoteRes.data.success) setQuote(quoteRes.data.quote);
        if (histRes.data.success) setHistory(histRes.data.history.bars);
      } catch (err) {
        console.error('Error loading stock details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailData();
  }, [selectedSymbol, timeframe]);

  if (!selectedSymbol) return null;

  const isPositive = quote ? quote.changePercent >= 0 : true;
  const isShockedOrSignificant = activeChangeInfo && activeChangeInfo.changeScore >= 30;

  const renderFreshnessPill = () => {
    if (!quote) return null;
    const { freshness, ageMinutes } = quote;

    if (freshness === 'LIVE') {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> LIVE
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1.5 shadow-2xs">
        <Clock className="w-3 h-3" /> Updated {ageMinutes || 2}m ago
      </span>
    );
  };

  const signals = activeChangeInfo?.marketSignals || {
    priceDeviation: 'Low',
    volumeAnomaly: 'Normal',
    volatility: 'Normal',
    historicalRange: 'Normal',
    newsSignal: 'None',
  };

  const verdict = activeChangeInfo?.verdict || 'No unusual behavior detected.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xl my-8">
        
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="font-bold text-2xl text-slate-900 tracking-tight">{quote?.symbol || selectedSymbol}</h2>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-semibold">
                {quote?.exchange || 'NSE'}
              </span>
              {renderFreshnessPill()}
            </div>
            <p className="text-sm text-slate-500 font-medium">{quote?.name}</p>
          </div>

          <button
            onClick={() => setSelectedSymbol(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Price & Change Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">Current Price</div>
              <div className="font-mono text-3xl font-bold text-slate-900">
                ₹{quote?.price?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">24h Price Movement</div>
              <div className={`font-mono text-base font-bold flex items-center gap-1 ${
                isPositive ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{isPositive ? '+' : ''}{quote?.changePercent?.toFixed(2)}%</span>
                <span className="text-xs text-slate-400 font-normal">
                  ({isPositive ? '+' : ''}₹{Math.abs(quote?.change || 0).toFixed(2)})
                </span>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold flex items-center gap-1">
                <span>Change Score</span>
                <Info 
                  className="w-3.5 h-3.5 text-slate-400 cursor-pointer"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                />
              </div>

              {showTooltip && (
                <div className="absolute right-8 top-24 w-64 p-3 bg-slate-900 text-white text-[11px] rounded-xl shadow-2xl z-30 leading-relaxed font-sans">
                  Change Score estimates how meaningful a stock's movement is using price movement, volatility, volume anomalies and other available signals.
                </div>
              )}

              <div className="font-mono text-2xl font-bold text-slate-900 flex items-center gap-2">
                <span>{activeChangeInfo?.changeScore || 15} / 100</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
                  activeChangeInfo?.severity === 'SIGNIFICANT' ? 'bg-red-50 text-red-700 border border-red-200' :
                  activeChangeInfo?.severity === 'WATCH' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {activeChangeInfo?.severity || 'NORMAL'}
                </span>
              </div>
            </div>
          </div>

          {/* MARKET SIGNALS CHECKLIST & VERDICT */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-600" /> MARKET SIGNALS
            </h3>

            <div className="space-y-2.5 text-xs mb-5">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="font-semibold text-slate-700">Price Deviation</span>
                <span className={`font-mono font-bold ${signals.priceDeviation === 'High' ? 'text-red-600' : signals.priceDeviation === 'Moderate' ? 'text-amber-600' : 'text-slate-600'}`}>
                  {signals.priceDeviation}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="font-semibold text-slate-700">Volume Anomaly</span>
                <span className={`font-mono font-bold ${signals.volumeAnomaly !== 'Normal' ? 'text-amber-600' : 'text-slate-600'}`}>
                  {signals.volumeAnomaly}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="font-semibold text-slate-700">Volatility</span>
                <span className={`font-mono font-bold ${signals.volatility.includes('Elevated') ? 'text-red-600' : 'text-slate-600'}`}>
                  {signals.volatility}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="font-semibold text-slate-700">Historical Deviation</span>
                <span className={`font-mono font-bold ${signals.historicalRange.includes('Outside') ? 'text-red-600' : 'text-slate-600'}`}>
                  {signals.historicalRange}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="font-semibold text-slate-700">News / Event Signal</span>
                <span className={`font-mono font-bold ${signals.newsSignal === 'Detected' ? 'text-red-600' : 'text-slate-600'}`}>
                  {signals.newsSignal}
                </span>
              </div>
            </div>

            {/* PULSEWATCH VERDICT */}
            <div className={`p-4 rounded-xl border ${
              isShockedOrSignificant ? 'bg-red-50/70 border-red-200 text-red-900' : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            }`}>
              <div className="text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> PulseWatch Verdict
              </div>
              <p className="text-sm font-bold leading-snug">
                "{verdict}"
              </p>
            </div>
          </div>

          {/* Interactive Recharts Chart */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-brand-600" /> Price History
              </h3>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {['1D', '1W', '1M', '3M', '1Y'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition ${
                      timeframe === tf ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-60 w-full pt-4 bg-slate-50/60 rounded-xl border border-slate-200">
              {loading ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">Loading chart data...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isPositive ? '#059669' : '#DC2626'} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={isPositive ? '#059669' : '#DC2626'} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#64748B" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} domain={['auto', 'auto']} tickFormatter={(v) => `₹${v}`} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                      formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Price']}
                    />
                    <Area type="monotone" dataKey="price" stroke={isPositive ? '#059669' : '#DC2626'} strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
