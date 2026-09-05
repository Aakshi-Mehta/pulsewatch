const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Watchlist = require('../models/Watchlist');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'pulsewatch_super_secret_jwt_key_2026_change_in_production';
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide name, email and password' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' });
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({
      name,
      email,
      passwordHash,
      lastActiveAt: new Date(Date.now() - 8.7 * 3600 * 1000), // Initialize away time so Return Brief shows on 1st login!
    });

    // Create default initial watchlist
    await Watchlist.create({
      userId: user._id,
      name: 'My Watchlist',
      isDefault: true,
      symbols: ['INFY', 'TCS', 'RELIANCE', 'HDFCBANK', 'ICICIBANK', 'ITC'],
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        lastActiveAt: user.lastActiveAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        lastActiveAt: user.lastActiveAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
