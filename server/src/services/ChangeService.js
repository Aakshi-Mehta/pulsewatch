const UserStockState = require('../models/UserStockState');
const User = require('../models/User');
const Watchlist = require('../models/Watchlist');
const marketDataService = require('./MarketDataService');
const meaningfulChangeEngine = require('./MeaningfulChangeEngine');
const { SEVERITY } = require('../config/constants');

class ChangeService {
  /**
   * Format human-readable away duration string (e.g. "8h 42m", "1d 2h", "15m")
   */
  formatAwayDuration(lastActiveDate) {
    if (!lastActiveDate) return 'First visit';
    const now = new Date();
    const diffMs = Math.max(0, now.getTime() - new Date(lastActiveDate).getTime());
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (totalMinutes < 1) return 'Just now';
    if (totalMinutes < 60) return `${totalMinutes}m`;
    
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    
    if (hours < 24) return `${hours}h ${mins}m`;
    
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    return `${days}d ${remHours}h`;
  }

  /**
   * Get personalized Return Brief for active user
   * @param {string} userId 
   */
  async getUserChanges(userId) {
    // 1. Fetch User & Active Watchlist
    const user = await User.findById(userId);
    const watchlist = await Watchlist.findOne({ userId, isDefault: true }) 
      || await Watchlist.findOne({ userId });

    const symbols = watchlist ? watchlist.symbols : [];

    // 2. Fetch UserStockStates for user
    const stockStates = await UserStockState.find({ userId });
    const stateMap = new Map(stockStates.map(st => [st.symbol, st]));

    // 3. Fetch latest market quotes for symbols
    const quotes = await marketDataService.getQuotesForSymbols(symbols);

    // 4. Calculate Change Scores using MeaningfulChangeEngine
    const changes = [];
    const summary = { significant: 0, watch: 0, normal: 0 };

    for (const quote of quotes) {
      const userState = stateMap.get(quote.symbol);
      const evalResult = meaningfulChangeEngine.evaluateChange(quote, userState);
      
      changes.push(evalResult);

      if (evalResult.severity === SEVERITY.SIGNIFICANT) summary.significant++;
      else if (evalResult.severity === SEVERITY.WATCH) summary.watch++;
      else summary.normal++;
    }

    // Sort changes by changeScore descending (most critical changes top)
    changes.sort((a, b) => b.changeScore - a.changeScore);

    const lastActive = user ? user.lastActiveAt : new Date(Date.now() - 8.7 * 3600 * 1000);
    const awayDuration = this.formatAwayDuration(lastActive);

    return {
      since: lastActive ? lastActive.toISOString() : new Date().toISOString(),
      awayDuration,
      watchlistName: watchlist ? watchlist.name : 'Default Watchlist',
      totalStocks: symbols.length,
      summary,
      changes,
    };
  }

  /**
   * Acknowledge/Mark current changes as seen for user session
   * @param {string} userId 
   * @param {string[]} specificSymbols Optional subset of symbols to acknowledge
   */
  async acknowledgeSession(userId, specificSymbols = null) {
    const watchlist = await Watchlist.findOne({ userId, isDefault: true })
      || await Watchlist.findOne({ userId });

    const symbols = specificSymbols && specificSymbols.length > 0 
      ? specificSymbols 
      : (watchlist ? watchlist.symbols : []);

    const now = new Date();
    const updatedStates = [];

    for (const symbol of symbols) {
      const quote = await marketDataService.getQuote(symbol);
      const updatedState = await UserStockState.findOneAndUpdate(
        { userId, symbol: symbol.toUpperCase() },
        {
          userId,
          symbol: symbol.toUpperCase(),
          lastSeenPrice: quote.price,
          lastSeenAt: now,
          lastSeenVolume: quote.volume,
          acknowledgedAt: now,
        },
        { upsert: true, new: true }
      );
      updatedStates.push(updatedState);
    }

    // Update user's lastActiveAt timestamp
    await User.findByIdAndUpdate(userId, { lastActiveAt: now });

    return {
      success: true,
      acknowledgedCount: updatedStates.length,
      timestamp: now.toISOString(),
    };
  }
}

module.exports = new ChangeService();
