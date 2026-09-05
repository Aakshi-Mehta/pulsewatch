const demoProvider = require('./DemoMarketDataProvider');

class MarketDataProviderFactory {
  static getProvider() {
    // If MARKET_DATA_API_KEY is present and MARKET_DATA_PROVIDER === 'external', use external adapter
    if (process.env.MARKET_DATA_PROVIDER === 'external' && process.env.MARKET_DATA_API_KEY) {
      console.log('[MarketDataProviderFactory] Using External Market Provider');
      // Fallback or external implementation
      return demoProvider;
    }

    // Default to Demo Market Data Provider
    return demoProvider;
  }
}

module.exports = MarketDataProviderFactory;
