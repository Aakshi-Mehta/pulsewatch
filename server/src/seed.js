const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const User = require('./models/User');
const Watchlist = require('./models/Watchlist');
const UserStockState = require('./models/UserStockState');
const demoProvider = require('./providers/DemoMarketDataProvider');

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('[Seed Script] Starting PulseWatch Database Seed...');
    await connectDB();

    const email = 'demo@pulsewatch.io';
    const password = 'Password123!';

    // Clean existing seed user data if present
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await UserStockState.deleteMany({ userId: existingUser._id });
      await Watchlist.deleteMany({ userId: existingUser._id });
      await User.deleteOne({ _id: existingUser._id });
      console.log('[Seed Script] Cleaned old seed user data.');
    }

    // Reset all shocks to baseline normal state
    demoProvider.resetShock();

    // Set last active to 2 hours ago
    const twoHoursAgo = new Date(Date.now() - 2 * 3600 * 1000);

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({
      name: 'Trader',
      email,
      passwordHash,
      lastActiveAt: twoHoursAgo,
    });

    console.log(`[Seed Script] Created default user: ${email} / ${password}`);

    // Create Default Watchlist with the 5 core stocks
    const symbols = ['TCS', 'ITC', 'ICICIBANK', 'RELIANCE', 'PAYTM'];
    const watchlist = await Watchlist.create({
      userId: user._id,
      name: 'Primary Watchlist',
      isDefault: true,
      symbols,
    });

    console.log(`[Seed Script] Created default watchlist with ${symbols.length} stocks.`);

    // Seed prior stock baseline states matching normal daily prices
    const baselines = [
      { symbol: 'TCS', lastSeenPrice: 4207.66, lastSeenChangeScore: 15 },
      { symbol: 'ITC', lastSeenPrice: 433.77, lastSeenChangeScore: 12 },
      { symbol: 'ICICIBANK', lastSeenPrice: 1099.03, lastSeenChangeScore: 6 },
      { symbol: 'RELIANCE', lastSeenPrice: 2903.12, lastSeenChangeScore: 4 },
      { symbol: 'PAYTM', lastSeenPrice: 682.27, lastSeenChangeScore: 2 },
    ];

    for (const base of baselines) {
      await UserStockState.create({
        userId: user._id,
        symbol: base.symbol,
        lastSeenPrice: base.lastSeenPrice,
        lastSeenAt: twoHoursAgo,
        lastSeenChangeScore: base.lastSeenChangeScore,
        lastSeenVolume: 3100000,
        acknowledgedAt: twoHoursAgo,
      });
    }

    console.log('[Seed Script] Initialized baseline state (All 5 stocks in NORMAL state).');
    console.log('[Seed Script] Database seed successfully completed! 🎉');
    
    process.exit(0);
  } catch (error) {
    console.error('[Seed Script] Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
