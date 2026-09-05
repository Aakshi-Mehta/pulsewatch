/**
 * PulseWatch System Constants & Configurable Thresholds
 */

module.exports = {
  THRESHOLDS: {
    HIGH_CHANGE_THRESHOLD: 70,       // 70–100 SIGNIFICANT severity
    MEANINGFUL_CHANGE_THRESHOLD: 30, // 30–69 WORTH WATCHING severity
    // 0–29 NORMAL severity
    VOLUME_ANOMALY_THRESHOLD: 1.8,   // 1.8x 20-day average volume ratio
    PRICE_ZSCORE_THRESHOLD: 2.0,     // 2.0 standard deviations from mean
    VOLATILITY_EXPANSION_RATIO: 1.5, // 1.5x intraday high-low expansion
  },

  SEVERITY: {
    SIGNIFICANT: 'SIGNIFICANT',
    WATCH: 'WATCH',
    NORMAL: 'NORMAL',
  },

  FRESHNESS_MS: {
    LIVE: 60 * 1000,
    RECENT: 5 * 60 * 1000,
    DELAYED: 15 * 60 * 1000,
  },

  FRESHNESS_LABELS: {
    LIVE: 'LIVE',
    RECENT: 'RECENT',
    DELAYED: 'DELAYED',
    STALE: 'STALE',
  },

  CACHE: {
    MARKET_DATA_TTL_SEC: 30,
  },

  // Recognized Market Instruments Directory (Indian Equities)
  DEMO_STOCKS: [
    { symbol: 'TCS', name: 'Tata Consultancy Services', exchange: 'NSE', category: 'Information Technology', baselineVolatility: 0.018, avgVolume20D: 3100000, basePrice: 4207.66 },
    { symbol: 'ITC', name: 'ITC Limited', exchange: 'NSE', category: 'FMCG', baselineVolatility: 0.014, avgVolume20D: 9800000, basePrice: 433.77 },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Limited', exchange: 'NSE', category: 'Banking & Financials', baselineVolatility: 0.020, avgVolume20D: 7200000, basePrice: 1099.03 },
    { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', exchange: 'NSE', category: 'Energy & Telecom', baselineVolatility: 0.017, avgVolume20D: 6400000, basePrice: 2903.12 },
    { symbol: 'PAYTM', name: 'One97 Communications (Paytm)', exchange: 'NSE', category: 'Fintech', baselineVolatility: 0.025, avgVolume20D: 18200000, basePrice: 682.27 },
    { symbol: 'INFY', name: 'Infosys Limited', exchange: 'NSE', category: 'Information Technology', baselineVolatility: 0.021, avgVolume20D: 5200000, basePrice: 1575.50 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Limited', exchange: 'NSE', category: 'Banking & Financials', baselineVolatility: 0.019, avgVolume20D: 8900000, basePrice: 1742.00 },
    { symbol: 'TATAMOTORS', name: 'Tata Motors Limited', exchange: 'NSE', category: 'Automobiles', baselineVolatility: 0.026, avgVolume20D: 11200000, basePrice: 985.40 },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel Limited', exchange: 'NSE', category: 'Telecommunications', baselineVolatility: 0.016, avgVolume20D: 4800000, basePrice: 1220.10 },
    { symbol: 'ZOMATO', name: 'Zomato Limited', exchange: 'NSE', category: 'Consumer Tech', baselineVolatility: 0.031, avgVolume20D: 24500000, basePrice: 242.80 },
    { symbol: 'WIPRO', name: 'Wipro Limited', exchange: 'NSE', category: 'Information Technology', baselineVolatility: 0.022, avgVolume20D: 6100000, basePrice: 512.40 },
    { symbol: 'SBIN', name: 'State Bank of India', exchange: 'NSE', category: 'Public Sector Banking', baselineVolatility: 0.023, avgVolume20D: 14200000, basePrice: 815.30 },
    { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.', exchange: 'NSE', category: 'Automobiles', baselineVolatility: 0.020, avgVolume20D: 1800000, basePrice: 12450.00 },
    { symbol: 'TITAN', name: 'Titan Company Limited', exchange: 'NSE', category: 'Consumer Durables', baselineVolatility: 0.021, avgVolume20D: 2200000, basePrice: 3450.75 },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.', exchange: 'NSE', category: 'FMCG', baselineVolatility: 0.015, avgVolume20D: 2900000, basePrice: 2680.00 },
    { symbol: 'ASIANPAINT', name: 'Asian Paints Limited', exchange: 'NSE', category: 'Consumer Goods', baselineVolatility: 0.019, avgVolume20D: 1900000, basePrice: 2890.10 },
    { symbol: 'AXISBANK', name: 'Axis Bank Limited', exchange: 'NSE', category: 'Banking', baselineVolatility: 0.022, avgVolume20D: 8400000, basePrice: 1180.60 },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', exchange: 'NSE', category: 'Banking', baselineVolatility: 0.018, avgVolume20D: 4100000, basePrice: 1790.25 },
    { symbol: 'HCLTECH', name: 'HCL Technologies Ltd.', exchange: 'NSE', category: 'Information Technology', baselineVolatility: 0.020, avgVolume20D: 3800000, basePrice: 1725.00 },
    { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries', exchange: 'NSE', category: 'Pharmaceuticals', baselineVolatility: 0.017, avgVolume20D: 3200000, basePrice: 1810.00 },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance Limited', exchange: 'NSE', category: 'NBFC & Financials', baselineVolatility: 0.025, avgVolume20D: 2600000, basePrice: 6920.00 },
    { symbol: 'LT', name: 'Larsen & Toubro Limited', exchange: 'NSE', category: 'Infrastructure & Engineering', baselineVolatility: 0.019, avgVolume20D: 3500000, basePrice: 3640.00 },
    { symbol: 'TATASTEEL', name: 'Tata Steel Limited', exchange: 'NSE', category: 'Metals & Mining', baselineVolatility: 0.027, avgVolume20D: 28500000, basePrice: 154.20 }
  ]
};
