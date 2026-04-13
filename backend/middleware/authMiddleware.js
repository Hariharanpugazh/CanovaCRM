// AUTH DISABLED (frontend login removed)
// Requirement: do not block requests with 401 due to missing/invalid tokens.
// Original implementation is kept below for easy re-enable.
export const authMiddleware = async (req, res, next) => {
  req.user = {
    _id: '000000000000000000000001',
    name: 'Admin',
    email: 'admin@local',
    role: 'Admin',
    status: 'Active'
  };
  next();
};

/*
import { verifyToken } from '../utils/jwtUtils.js';
import User from '../models/User.js';

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
    res.status(500).json({ error: 'Authentication failed' });
  }
};
*/

export const adminOnly = (req, res, next) => {
  next();
};

export const salesUserOnly = (req, res, next) => {
  next();
};
