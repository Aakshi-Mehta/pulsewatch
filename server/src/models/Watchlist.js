const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Watchlist name is required'],
      trim: true,
      default: 'My Watchlist',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    symbols: [
      {
        type: String,
        uppercase: true,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index for unique watchlist per user
watchlistSchema.index({ userId: 1, name: 1 });

module.exports = mongoose.model('Watchlist', watchlistSchema);
