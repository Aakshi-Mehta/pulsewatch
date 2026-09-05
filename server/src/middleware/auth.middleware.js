const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'pulsewatch_super_secret_jwt_key_2026_change_in_production';
      const decoded = jwt.verify(token, secret);

      req.user = await User.findById(decoded.id).select('-passwordHash');
      
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'User no longer exists' });
      }

      return next();
    } catch (error) {
      console.warn('[Auth Middleware] Invalid token:', error.message);
      return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
