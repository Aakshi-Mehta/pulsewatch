const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const watchlistController = require('../controllers/watchlist.controller');
const marketController = require('../controllers/market.controller');
const changeController = require('../controllers/change.controller');

const { protect } = require('../middleware/auth.middleware');

// Public Auth Endpoints
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Protected Auth Endpoint
router.get('/auth/me', protect, authController.getMe);

// Protected Watchlist Endpoints
router.get('/watchlists', protect, watchlistController.getWatchlists);
router.post('/watchlists', protect, watchlistController.createWatchlist);
router.patch('/watchlists/:id', protect, watchlistController.updateWatchlist);
router.delete('/watchlists/:id', protect, watchlistController.deleteWatchlist);
router.post('/watchlists/:id/stocks', protect, watchlistController.addStock);
router.delete('/watchlists/:id/stocks/:symbol', protect, watchlistController.removeStock);

// Market Data Endpoints
router.get('/market/:symbol', marketController.getQuote);
router.get('/market/:symbol/history', marketController.getHistoricalData);
router.get('/search/stocks', marketController.searchStocks);
router.post('/market/simulate-shock', marketController.simulateShock);

// Return Brief & Session Acknowledgement Endpoints
router.get('/changes', protect, changeController.getChanges);
router.post('/session/acknowledge', protect, changeController.acknowledgeSession);

module.exports = router;
