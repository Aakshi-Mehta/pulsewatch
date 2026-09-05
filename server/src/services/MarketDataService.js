const MarketDataProviderFactory = require('../providers/MarketDataProviderFactory');
const cacheService = require('./CacheService');
const { FRESHNESS_MS, FRESHNESS_LABELS, CACHE } = require('../config/constants');

class MarketDataService {
  constructor() {
    this.provider = MarketDataProviderFactory.getProvider();
  }

  /**
   * Determine data freshness tag based on quote timestamp age
   * @param {Date|string} timestamp 
   */
  calculateFreshness(timestamp) {
    const ageMs = Math.max(0, Date.now() - new Date(timestamp).getTime());
    
    if (ageMs <= FRESHNESS_MS.LIVE) {
      return { freshness: FRESHNESS_LABELS.LIVE, ageMinutes: Math.round(ageMs / 6000) / 10, isStale: false };
    }
    if (ageMs <= FRESHNESS_MS.RECENT) {
      return { freshness: FRESHNESS_LABELS.RECENT, ageMinutes: Math.round(ageMs / 60000), isStale: false };
    }
    if (ageMs <= FRESHNESS_MS.DELAYED) {
      return { freshness: FRESHNESS_LABELS.DELAYED, ageMinutes: Math.round(ageMs / 60000), isStale: false };
    }
    return { freshness: FRESHNESS_LABELS.STALE, ageMinutes: Math.round(ageMs / 60000), isStale: true };
  }

  /**
   * Validate raw quote data
   * @param {object} quote 
   */
  validateQuote(quote) {
    if (!quote || typeof quote !== 'object') return false;
    if (!quote.symbol || typeof quote.symbol !== 'string') return false;
    if (typeof quote.price !== 'number' || isNaN(quote.price) || quote.price <= 0) return false;
    if (typeof quote.volume !== 'number' || quote.volume < 0) return false;
    if (!quote.timestamp || isNaN(new Date(quote.timestamp).getTime())) return false;
    return true;
  }

  /**
   * Get normalized market quote for symbol
   * @param {string} symbol 
   */
  async getQuote(symbol) {
    const sym = symbol.toUpperCase();
    const cacheKey = `market:${sym}`;

    // 1. Check Cache
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      const freshnessInfo = this.calculateFreshness(cached.timestamp);
      return { ...cached, ...freshnessInfo };
    }

    // 2. Fetch from Provider
    try {
      const rawQuote = await this.provider.getQuote(sym);
      
      // 3. Validation
      if (!this.validateQuote(rawQuote)) {
        throw new Error(`Invalid market data received for symbol ${sym}`);
      }

      const freshnessInfo = this.calculateFreshness(rawQuote.timestamp);
      const normalized = {
        symbol: rawQuote.symbol,
        name: rawQuote.name || sym,
        exchange: rawQuote.exchange || 'NSE',
        price: rawQuote.price,
        previousClose: rawQuote.previousClose,
        change: rawQuote.change,
        changePercent: rawQuote.changePercent,
        volume: rawQuote.volume,
        avgVolume20D: rawQuote.avgVolume20D || 5000000,
        volatility: rawQuote.volatility || 0.02,
        dayHigh: rawQuote.dayHigh,
        dayLow: rawQuote.dayLow,
        high52W: rawQuote.high52W,
        low52W: rawQuote.low52W,
        timestamp: rawQuote.timestamp,
        source: rawQuote.source || 'DEMO_DATA_PROVIDER',
        isMarketOpen: rawQuote.isMarketOpen !== undefined ? rawQuote.isMarketOpen : true,
        ...freshnessInfo
      };

      // 4. Save to Cache
      await cacheService.set(cacheKey, normalized, CACHE.MARKET_DATA_TTL_SEC);
      return normalized;

    } catch (err) {
      console.error(`[MarketDataService] Error fetching quote for ${sym}:`, err.message);
      // Fallback object to prevent server crash
      return {
        symbol: sym,
        name: sym,
        price: 1000.0,
        previousClose: 1000.0,
        change: 0,
        changePercent: 0,
        volume: 0,
        avgVolume20D: 5000000,
        volatility: 0.02,
        timestamp: new Date().toISOString(),
        source: 'FALLBACK_SERVICE',
        freshness: FRESHNESS_LABELS.STALE,
        isStale: true,
        isMarketOpen: false,
        error: 'Market data temporarily unavailable'
      };
    }
  }

  /**
   * Batch fetch quotes for multiple symbols with deduplication
   * @param {string[]} symbols 
   */
  async getQuotesForSymbols(symbols) {
    if (!symbols || !Array.isArray(symbols)) return [];
    const uniqueSymbols = [...new Set(symbols.map(s => s.toUpperCase()))];
    const quotes = await Promise.all(uniqueSymbols.map(sym => this.getQuote(sym)));
    return quotes;
  }

  /**
   * Get historical chart data
   */
  async getHistoricalData(symbol, timeframe) {
    return await this.provider.getHistoricalData(symbol.toUpperCase(), timeframe);
  }

  /**
   * Search stock directory
   */
  async searchStocks(query) {
    return await this.provider.searchStocks(query);
  }
}

module.exports = new MarketDataService();
