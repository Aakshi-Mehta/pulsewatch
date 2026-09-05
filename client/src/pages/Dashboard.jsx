import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { ReturnBriefHeader } from '../components/ReturnBriefHeader';
import { AttentionPills } from '../components/AttentionPills';
import { SignificantChangeCard } from '../components/SignificantChangeCard';
import { WatchlistTable } from '../components/WatchlistTable';
import { StockDetailModal } from '../components/StockDetailModal';
import { DemoControlBar } from '../components/DemoControlBar';
import { useWatchlist } from '../context/WatchlistContext';
import { Plus, X, Search, Activity, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { marketAPI } from '../api/client';

export const Dashboard = () => {
  const { changesBrief, filterSeverity, addStock } = useWatchlist();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [addSearchQuery, setAddSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [addingSymbol, setAddingSymbol] = useState('');

  const handleOpenAddModal = (presetSymbol = '') => {
    if (presetSymbol) {
      setAddSearchQuery(presetSymbol);
      handleSearch(presetSymbol);
    } else {
      setAddSearchQuery('');
      handleSearch('');
    }
    setShowAddModal(true);
  };

  const handleSearch = async (query) => {
    setAddSearchQuery(query);
    try {
      const res = await marketAPI.searchStocks(query);
      if (res.data.success) {
        setSearchResults(res.data.results);
      }
    } catch (err) {
      console.error('Add stock search error:', err);
    }
  };

  const handleAddStock = async (symbol) => {
    setAddingSymbol(symbol);
    try {
      await addStock(symbol);
      setShowAddModal(false);
      setAddSearchQuery('');
    } catch (err) {
      alert(`Could not add stock: ${err.message}`);
    } finally {
      setAddingSymbol('');
    }
  };

  // Filter stocks that require attention (SIGNIFICANT or WATCH)
  const highlightedChanges = changesBrief?.changes?.filter(c => {
    if (filterSeverity === 'SIGNIFICANT') return c.severity === 'SIGNIFICANT';
    if (filterSeverity === 'WATCH') return c.severity === 'WATCH';
    if (filterSeverity === 'NORMAL') return c.severity === 'NORMAL';
    return c.severity === 'SIGNIFICANT' || c.severity === 'WATCH';
  }) || [];

  return (
    <div className="min-h-screen bg-background text-slate-900 flex flex-col pb-16">
      
      {/* Top Navbar */}
      <Navbar onOpenAddModal={handleOpenAddModal} />

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* 1. Return Brief Hero Section */}
        <ReturnBriefHeader />

        {/* 2. Attention Level Pills */}
        <AttentionPills />

        {/* 3. WHAT DESERVES YOUR ATTENTION (Visible only when meaningful changes exist) */}
        {highlightedChanges.length > 0 ? (
          <div className="mb-10">
            <div className="flex flex-col mb-4">
              <h2 className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-2 uppercase">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                WHAT DESERVES YOUR ATTENTION
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Meaningful changes since your last check
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {highlightedChanges.map((change) => (
                <SignificantChangeCard key={change.symbol} change={change} />
              ))}
            </div>
          </div>
        ) : (
          /* Normal State: Nothing needs your attention right now */
          <div className="glass-card rounded-2xl p-8 text-center border border-slate-200 mb-10 bg-white shadow-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-200">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Nothing needs your attention right now</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
              All tracked stocks are moving within their expected ranges.
            </p>
          </div>
        )}

        {/* 4. Complete Watchlist Table */}
        <WatchlistTable onOpenAddModal={handleOpenAddModal} />

      </main>

      {/* Stock Detail / Why Modal */}
      <StockDetailModal />

      {/* Hackathon Demo Control Bar */}
      <DemoControlBar />

      {/* Add Stock Popup Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-brand-600" /> Add Stock to Watchlist
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative mb-3">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search recognized stocks (e.g. ZOMATO, PAYTM, SBIN, WIPRO)..."
                value={addSearchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-500 transition"
              />
            </div>

            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
              {searchResults.length > 0 ? (
                searchResults.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="p-3 hover:bg-slate-50 rounded-xl flex items-center justify-between cursor-pointer transition"
                    onClick={() => handleAddStock(stock.symbol)}
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        {stock.symbol}
                        <span className="text-[10px] text-slate-500 font-normal px-1.5 py-0.5 rounded bg-slate-100">
                          {stock.exchange || 'NSE'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">{stock.name}</div>
                    </div>
                    <button
                      disabled={addingSymbol === stock.symbol}
                      className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs"
                    >
                      {addingSymbol === stock.symbol ? 'Adding...' : '+ Add'}
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-500">
                  No recognized stock found matching "{addSearchQuery}".
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
