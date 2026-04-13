import { verifyToken } from '../utils/jwtUtils.js';
import User from '../models/User.js';

// Authentication middleware - works for BOTH Admin and SalesUser
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Admin-only route protection
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};

// Sales user-only route protection
export const salesUserOnly = (req, res, next) => {
  if (req.user && req.user.role === 'SalesUser') {
    next();
  } else {
    res.status(403).json({ error: 'Sales user access required' });
  }
};
