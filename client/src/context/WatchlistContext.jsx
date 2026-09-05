import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { watchlistAPI, changeAPI, marketAPI } from '../api/client';
import { useAuth } from './AuthContext';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const { user } = useAuth();

  const [watchlists, setWatchlists] = useState([]);
  const [activeWatchlist, setActiveWatchlist] = useState(null);
  const [changesBrief, setChangesBrief] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState(null); // Active stock for detail modal
  const [filterSeverity, setFilterSeverity] = useState('ALL'); // 'ALL', 'SIGNIFICANT', 'WATCH', 'NORMAL'

  const fetchWatchlists = useCallback(async () => {
    if (!user) return;
    try {
      const res = await watchlistAPI.getWatchlists();
      if (res.data.success) {
        setWatchlists(res.data.watchlists);
        const def = res.data.watchlists.find(w => w.isDefault) || res.data.watchlists[0];
        setActiveWatchlist(def);
      }
    } catch (err) {
      console.error('Error fetching watchlists:', err);
    }
  }, [user]);

  const fetchChanges = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await changeAPI.getChanges();
      setChangesBrief(res.data);
    } catch (err) {
      console.error('Error fetching changes brief:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchWatchlists();
      fetchChanges();
    } else {
      setWatchlists([]);
      setChangesBrief(null);
    }
  }, [user, fetchWatchlists, fetchChanges]);

  const acknowledgeChanges = async (symbols = null) => {
    try {
      await changeAPI.acknowledge(symbols);
      await fetchChanges();
    } catch (err) {
      console.error('Error acknowledging changes:', err);
    }
  };

  const addStock = async (symbol) => {
    if (!activeWatchlist) return;
    try {
      const res = await watchlistAPI.addStock(activeWatchlist._id, symbol);
      if (res.data.success) {
        await fetchWatchlists();
        await fetchChanges();
      }
    } catch (err) {
      console.error('Error adding stock:', err);
      throw err;
    }
  };

  const removeStock = async (symbol) => {
    if (!activeWatchlist) return;
    try {
      const res = await watchlistAPI.removeStock(activeWatchlist._id, symbol);
      if (res.data.success) {
        await fetchWatchlists();
        await fetchChanges();
      }
    } catch (err) {
      console.error('Error removing stock:', err);
    }
  };

  const simulateShock = async (symbol, priceChangePercent, volumeMultiplier, reset = false) => {
    try {
      await marketAPI.simulateShock({ symbol, priceChangePercent, volumeMultiplier, reset });
      await fetchChanges();
    } catch (err) {
      console.error('Error simulating shock:', err);
    }
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlists,
        activeWatchlist,
        setActiveWatchlist,
        changesBrief,
        loading,
        selectedSymbol,
        setSelectedSymbol,
        filterSeverity,
        setFilterSeverity,
        fetchChanges,
        acknowledgeChanges,
        addStock,
        removeStock,
        simulateShock,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);
