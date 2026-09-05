const watchlistService = require('../services/WatchlistService');

exports.getWatchlists = async (req, res, next) => {
  try {
    const watchlists = await watchlistService.getUserWatchlists(req.user.id);
    res.json({ success: true, count: watchlists.length, watchlists });
  } catch (error) {
    next(error);
  }
};

exports.createWatchlist = async (req, res, next) => {
  try {
    const { name, symbols } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'Name is required' });

    const watchlist = await watchlistService.createWatchlist(req.user.id, name, symbols);
    res.status(201).json({ success: true, watchlist });
  } catch (error) {
    next(error);
  }
};

exports.updateWatchlist = async (req, res, next) => {
  try {
    const watchlist = await watchlistService.updateWatchlist(req.user.id, req.params.id, req.body);
    res.json({ success: true, watchlist });
  } catch (error) {
    next(error);
  }
};

exports.deleteWatchlist = async (req, res, next) => {
  try {
    const result = await watchlistService.deleteWatchlist(req.user.id, req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.addStock = async (req, res, next) => {
  try {
    const { symbol } = req.body;
    if (!symbol) return res.status(400).json({ success: false, error: 'Symbol is required' });

    const watchlist = await watchlistService.addStock(req.user.id, req.params.id, symbol);
    res.json({ success: true, watchlist });
  } catch (error) {
    next(error);
  }
};

exports.removeStock = async (req, res, next) => {
  try {
    const watchlist = await watchlistService.removeStock(req.user.id, req.params.id, req.params.symbol);
    res.json({ success: true, watchlist });
  } catch (error) {
    next(error);
  }
};
