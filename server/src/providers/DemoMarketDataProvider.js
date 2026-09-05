const MarketDataProviderInterface = require('./MarketDataProviderInterface');
const { DEMO_STOCKS } = require('../config/constants');

class DemoMarketDataProvider extends MarketDataProviderInterface {
  constructor() {
    super();
    this.stockMap = new Map();
    this.customShocks = new Map();

    DEMO_STOCKS.forEach(stock => {
      const basePrice = stock.basePrice || 1000.00;
      this.stockMap.set(stock.symbol, {
        symbol: stock.symbol,
        name: stock.name,
        exchange: stock.exchange,
        category: stock.category,
        price: basePrice,
        previousClose: Math.round(basePrice * (1 + (Math.random() * 0.02 - 0.01)) * 100) / 100,
        avgVolume20D: stock.avgVolume20D,
        volatility: stock.baselineVolatility,
        high52W: Math.round(basePrice * 1.25 * 100) / 100,
        low52W: Math.round(basePrice * 0.78 * 100) / 100,
        lastUpdated: new Date()
      });
    });
  }

  injectShock(symbol, shockOpts) {
    const sym = symbol.toUpperCase();
    const stock = this.stockMap.get(sym);
    if (!stock) return null;

    const priceMultiplier = 1 + (shockOpts.priceChangePercent / 100);
    const newPrice = Math.round(stock.previousClose * priceMultiplier * 100) / 100;
    const newVolume = Math.round(stock.avgVolume20D * (shockOpts.volumeMultiplier || 1.5));

    this.customShocks.set(sym, {
      price: newPrice,
      volume: newVolume,
      priceChangePercent: shockOpts.priceChangePercent,
      volumeMultiplier: shockOpts.volumeMultiplier || 1.5,
      timestamp: new Date()
    });

    return this.getQuote(sym);
  }

  resetShock(symbol) {
    if (symbol) {
      this.customShocks.delete(symbol.toUpperCase());
    } else {
      this.customShocks.clear();
    }
  }

  async getQuote(symbol) {
    const sym = symbol.toUpperCase();
    const stock = this.stockMap.get(sym);

    if (!stock) {
      return {
        symbol: sym,
        name: sym,
        price: 0,
        previousClose: 0,
        change: 0,
        changePercent: 0,
        volume: 0,
        avgVolume20D: 5000000,
        volatility: 0.02,
        timestamp: new Date().toISOString(),
        source: 'DEMO_DATA_PROVIDER',
        isMarketOpen: false,
        error: `Symbol '${sym}' is not a recognized market instrument`
      };
    }

    const shock = this.customShocks.get(sym);
    let currentPrice = stock.price;
    let currentVolume = stock.avgVolume20D;

    if (shock) {
      currentPrice = shock.price;
      currentVolume = shock.volume;
    } else {
      const fluctuation = (Math.sin(Date.now() / 10000 + sym.charCodeAt(0)) * 0.003);
      currentPrice = Math.round((stock.price * (1 + fluctuation)) * 100) / 100;
      currentVolume = Math.round(stock.avgVolume20D * (1 + (Math.cos(Date.now() / 15000) * 0.1)));
    }

    const change = Math.round((currentPrice - stock.previousClose) * 100) / 100;
    const changePercent = Math.round(((change / stock.previousClose) * 100) * 100) / 100;

    return {
      symbol: stock.symbol,
      name: stock.name,
      exchange: stock.exchange,
      price: currentPrice,
      previousClose: stock.previousClose,
      change,
      changePercent,
      volume: currentVolume,
      avgVolume20D: stock.avgVolume20D,
      volatility: stock.volatility,
      dayHigh: Math.max(currentPrice, stock.previousClose * 1.01),
      dayLow: Math.min(currentPrice, stock.previousClose * 0.99),
      high52W: stock.high52W,
      low52W: stock.low52W,
      timestamp: shock ? shock.timestamp.toISOString() : new Date().toISOString(),
      source: 'DEMO_DATA_PROVIDER',
      isMarketOpen: true
    };
  }

  async getHistoricalData(symbol, timeframe = '1M') {
    const quote = await this.getQuote(symbol);
    const bars = [];
    const now = new Date();
    
    let points = 30;
    let stepMs = 24 * 3600 * 1000;

    switch (timeframe) {
      case '1D':
        points = 24;
        stepMs = 15 * 60 * 1000;
        break;
      case '1W':
        points = 7;
        stepMs = 24 * 3600 * 1000;
        break;
      case '1M':
        points = 30;
        stepMs = 24 * 3600 * 1000;
        break;
      case '3M':
        points = 90;
        stepMs = 24 * 3600 * 1000;
        break;
      case '1Y':
        points = 52;
        stepMs = 7 * 24 * 3600 * 1000;
        break;
      default:
        points = 30;
        stepMs = 24 * 3600 * 1000;
    }

    let runningPrice = (quote.price || 100) * 0.85;
    const trend = ((quote.price || 100) - runningPrice) / points;

    for (let i = points; i >= 0; i--) {
      const time = new Date(now.getTime() - i * stepMs);
      const noise = (Math.sin(i * 0.5 + symbol.charCodeAt(0)) * (quote.price || 100) * 0.015);
      const pricePoint = i === 0 ? quote.price : Math.max(1, Math.round((runningPrice + noise) * 100) / 100);
      runningPrice += trend;

      bars.push({
        timestamp: time.toISOString(),
        date: time.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        price: pricePoint,
        volume: Math.round((quote.avgVolume20D || 5000000) * (0.8 + Math.random() * 0.4))
      });
    }

    return {
      symbol: quote.symbol,
      timeframe,
      bars
    };
  }

  async getMarketStatus() {
    return {
      isOpen: true,
      exchange: 'NSE',
      timezone: 'Asia/Kolkata',
      timestamp: new Date().toISOString()
    };
  }

  async searchStocks(query) {
    if (!query || query.trim() === '') return DEMO_STOCKS.slice(0, 10);
    const q = query.toLowerCase().trim();
    
    // Filter strictly against real recognized market stocks
    return DEMO_STOCKS.filter(
      stock => stock.symbol.toLowerCase().includes(q) || stock.name.toLowerCase().includes(q)
    );
  }
}

module.exports = new DemoMarketDataProvider();
