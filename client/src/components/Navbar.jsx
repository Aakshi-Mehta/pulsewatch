import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { Activity, Search, RefreshCw, CheckCheck, LogOut, User as UserIcon, Plus } from 'lucide-react';
import { marketAPI } from '../api/client';

export const Navbar = ({ onOpenAddModal }) => {
  const { user, logout } = useAuth();
  const { fetchChanges, acknowledgeChanges, changesBrief, loading } = useWatchlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    setIsSearching(true);
    setShowSearchDropdown(true);
    try {
      const res = await marketAPI.searchStocks(val);
      if (res.data.success) {
        setSearchResults(res.data.results);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const hasUnread = changesBrief && (changesBrief.summary.significant > 0 || changesBrief.summary.watch > 0);

  return (
    <nav className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-accent p-0.5 shadow-md shadow-brand-500/10">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-brand-600 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900">PulseWatch</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-600 border border-brand-200">
                  Pro Edition
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Know what changed. Know what matters.
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search stocks (e.g. INFY, TCS, ZOMATO, PAYTM, SBIN)..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition shadow-inner"
              />
            </div>

            {/* Search Dropdown Results */}
            {showSearchDropdown && (
              <div 
                className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-50 max-h-72 overflow-y-auto"
                onMouseLeave={() => setShowSearchDropdown(false)}
              >
                {isSearching ? (
                  <div className="p-4 text-center text-xs text-slate-500">Searching market directory...</div>
                ) : searchResults.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {searchResults.map((stock) => (
                      <div
                        key={stock.symbol}
                        onClick={() => {
                          setShowSearchDropdown(false);
                          setSearchQuery('');
                          if (onOpenAddModal) onOpenAddModal(stock.symbol);
                        }}
                        className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition"
                      >
                        <div>
                          <div className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                            {stock.symbol}
                            <span className="text-[10px] text-slate-500 font-normal px-1.5 py-0.5 rounded bg-slate-100">
                              {stock.exchange || 'NSE'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              {stock.category}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500">{stock.name}</div>
                        </div>
                        <button className="p-1.5 rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-100 text-xs flex items-center gap-1 font-medium border border-brand-100 transition">
                          <Plus className="w-3.5 h-3.5" /> Add
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500">No recognized stock found matching "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons & Profile */}
          <div className="flex items-center gap-3">
            
            {/* Session Acknowledge Button */}
            {hasUnread && (
              <button
                onClick={() => acknowledgeChanges()}
                title="Mark all changes as reviewed for this session"
                className="px-3.5 py-1.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-600 hover:bg-brand-100 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
              >
                <CheckCheck className="w-4 h-4 text-brand-600" />
                <span className="hidden sm:inline">Acknowledge All</span>
              </button>
            )}

            {/* Refresh Data */}
            <button
              onClick={fetchChanges}
              disabled={loading}
              title="Refresh Market Data"
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-600' : ''}`} />
            </button>

            {/* User Profile / Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-brand-600 font-bold text-xs border border-slate-200">
                {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-slate-800">{user?.name || 'Trader'}</div>
                <div className="text-[10px] text-slate-500">{user?.email || 'Logged in'}</div>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </nav>
  );
};
