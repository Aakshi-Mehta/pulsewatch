import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inject JWT Token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pulsewatch_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const watchlistAPI = {
  getWatchlists: () => api.get('/watchlists'),
  createWatchlist: (data) => api.post('/watchlists', data),
  updateWatchlist: (id, data) => api.patch(`/watchlists/${id}`, data),
  deleteWatchlist: (id) => api.delete(`/watchlists/${id}`),
  addStock: (watchlistId, symbol) => api.post(`/watchlists/${watchlistId}/stocks`, { symbol }),
  removeStock: (watchlistId, symbol) => api.delete(`/watchlists/${watchlistId}/stocks/${symbol}`),
};

export const marketAPI = {
  getQuote: (symbol) => api.get(`/market/${symbol}`),
  getHistory: (symbol, timeframe) => api.get(`/market/${symbol}/history`, { params: { timeframe } }),
  searchStocks: (query) => api.get('/search/stocks', { params: { q: query } }),
  simulateShock: (data) => api.post('/market/simulate-shock', data),
};

export const changeAPI = {
  getChanges: () => api.get('/changes'),
  acknowledge: (symbols) => api.post('/session/acknowledge', { symbols }),
};

export default api;
