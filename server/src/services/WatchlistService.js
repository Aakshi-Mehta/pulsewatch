const Watchlist = require('../models/Watchlist');
const marketDataService = require('./MarketDataService');
const { DEFAULT_STOCKS } = require('../config/constants');

class WatchlistService {
  /**
   * Get all watchlists for a user (ensures default watchlist exists)
   * @param {string} userId 
   */
  async getUserWatchlists(userId) {
    let watchlists = await Watchlist.find({ userId }).sort({ createdAt: 1 });
    
    if (watchlists.length === 0) {
      // Create default watchlist with initial stocks
      const defaultWatchlist = await Watchlist.create({
        userId,
        name: 'My Watchlist',
        isDefault: true,
        symbols: ['INFY', 'TCS', 'RELIANCE', 'HDFCBANK', 'ICICIBANK', 'ITC'],
      });
      watchlists = [defaultWatchlist];
    }
    
    return watchlists;
  }

  /**
   * Create new custom watchlist
   */
  async createWatchlist(userId, name, symbols = []) {
    const existing = await Watchlist.findOne({ userId, name });
    if (existing) {
      throw new Error(`Watchlist with name '${name}' already exists.`);
    }

    const isFirst = (await Watchlist.countDocuments({ userId })) === 0;

    const watchlist = await Watchlist.create({
      userId,
      name,
      isDefault: isFirst,
      symbols: symbols.map(s => s.toUpperCase()),
    });

    return watchlist;
  }

  /**
   * Update watchlist name or default status
   */
  async updateWatchlist(userId, watchlistId, updates) {
    const watchlist = await Watchlist.findOne({ _id: watchlistId, userId });
    if (!watchlist) throw new Error('Watchlist not found');

    if (updates.name) watchlist.name = updates.name;
    if (updates.isDefault) {
      await Watchlist.updateMany({ userId }, { isDefault: false });
      watchlist.isDefault = true;
    }

    await watchlist.save();
    return watchlist;
  }

  /**
   * Delete watchlist
   */
  async deleteWatchlist(userId, watchlistId) {
    const watchlist = await Watchlist.findOne({ _id: watchlistId, userId });
    if (!watchlist) throw new Error('Watchlist not found');
    if (watchlist.isDefault) throw new Error('Cannot delete default watchlist');

    await Watchlist.deleteOne({ _id: watchlistId, userId });
    return { success: true, deletedId: watchlistId };
  }

  /**
   * Add stock to watchlist
   */
  async addStock(userId, watchlistId, symbol) {
    const sym = symbol.toUpperCase();
    
    // Verify symbol exists via market service
    const quote = await marketDataService.getQuote(sym);
    if (!quote || quote.error) {
      throw new Error(`Stock symbol '${sym}' not found.`);
    }

    const watchlist = await Watchlist.findOne({ _id: watchlistId, userId });
    if (!watchlist) throw new Error('Watchlist not found');

    if (!watchlist.symbols.includes(sym)) {
      watchlist.symbols.push(sym);
      await watchlist.save();
    }

    return watchlist;
  }

  /**
   * Remove stock from watchlist
   */
  async removeStock(userId, watchlistId, symbol) {
    const sym = symbol.toUpperCase();
    const watchlist = await Watchlist.findOne({ _id: watchlistId, userId });
    if (!watchlist) throw new Error('Watchlist not found');

    watchlist.symbols = watchlist.symbols.filter(s => s !== sym);
    await watchlist.save();

    return watchlist;
  }
}

module.exports = new WatchlistService();
