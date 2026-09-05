const mongoose = require('mongoose');

const userStockStateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    lastSeenPrice: {
      type: Number,
      required: true,
    },
    lastSeenAt: {
      type: Date,
      default: Date.now,
    },
    lastSeenChangeScore: {
      type: Number,
      default: 0,
    },
    lastSeenVolume: {
      type: Number,
      default: 0,
    },
    acknowledgedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user & symbol lookups
userStockStateSchema.index({ userId: 1, symbol: 1 }, { unique: true });

module.exports = mongoose.model('UserStockState', userStockStateSchema);
