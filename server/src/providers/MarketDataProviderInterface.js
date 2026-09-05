/**
 * MarketDataProviderInterface
 * Standard contract for any market data provider (Demo, AlphaVantage, YahooFinance, etc.)
 */

class MarketDataProviderInterface {
  async getQuote(symbol) {
    throw new Error('Method getQuote() must be implemented');
  }

  async getHistoricalData(symbol, timeframe) {
    throw new Error('Method getHistoricalData() must be implemented');
  }

  async getMarketStatus() {
    throw new Error('Method getMarketStatus() must be implemented');
  }

  async searchStocks(query) {
    throw new Error('Method searchStocks() must be implemented');
  }
}

module.exports = MarketDataProviderInterface;
