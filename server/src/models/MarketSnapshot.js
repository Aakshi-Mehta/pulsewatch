const mongoose = require('mongoose');

const marketSnapshotSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
    },
    previousClose: {
      type: Number,
      required: true,
    },
    change: {
      type: Number,
      required: true,
    },
    changePercent: {
      type: Number,
      required: true,
    },
    volume: {
      type: Number,
      required: true,
    },
    avgVolume20D: {
      type: Number,
      default: 5000000,
    },
    dayHigh: {
      type: Number,
    },
    dayLow: {
      type: Number,
    },
    high52W: {
      type: Number,
    },
    low52W: {
      type: Number,
    },
    volatility: {
      type: Number,
      default: 0.02,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    source: {
      type: String,
      default: 'DEMO_PROVIDER',
    },
    isMarketOpen: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

marketSnapshotSchema.index({ symbol: 1, timestamp: -1 });

module.exports = mongoose.model('MarketSnapshot', marketSnapshotSchema);
