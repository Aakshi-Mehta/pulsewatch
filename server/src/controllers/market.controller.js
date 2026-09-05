const marketDataService = require('../services/MarketDataService');
const demoProvider = require('../providers/DemoMarketDataProvider');

exports.getQuote = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const quote = await marketDataService.getQuote(symbol);
    res.json({ success: true, quote });
  } catch (error) {
    next(error);
  }
};

exports.getHistoricalData = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const timeframe = req.query.timeframe || '1M';
    const history = await marketDataService.getHistoricalData(symbol, timeframe);
    res.json({ success: true, history });
  } catch (error) {
    next(error);
  }
};

exports.searchStocks = async (req, res, next) => {
  try {
    const query = req.query.q || '';
    const results = await marketDataService.searchStocks(query);
    res.json({ success: true, count: results.length, results });
  } catch (error) {
    next(error);
  }
};

exports.simulateShock = async (req, res, next) => {
  try {
    const { symbol, priceChangePercent = 5.2, volumeMultiplier = 2.1, reset = false } = req.body;

    if (reset) {
      demoProvider.resetShock(symbol);
      return res.json({ success: true, message: 'Market shock reset to baseline' });
    }

    if (!symbol) {
      return res.status(400).json({ success: false, error: 'Symbol is required' });
    }

    const updatedQuote = demoProvider.injectShock(symbol, {
      priceChangePercent: parseFloat(priceChangePercent),
      volumeMultiplier: parseFloat(volumeMultiplier),
    });

    res.json({
      success: true,
      message: `Simulated shock injected into ${symbol.toUpperCase()} (${priceChangePercent}% price, ${volumeMultiplier}x volume)`,
      quote: updatedQuote,
    });
  } catch (error) {
    next(error);
  }
};
