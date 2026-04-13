import User from '../models/User.js';
import { generateToken } from '../utils/jwtUtils.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);
    
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const user = new User({
      name,
      email,
      password,
      role: 'SalesUser'
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    res.json({
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        status: req.user.status,
        languages: req.user.languages,
        assignedLeads: req.user.assignedLeads,
        closedLeads: req.user.closedLeads
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { name, email, password } = req.body;

    // Validate inputs
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email: email, _id: { $ne: req.user._id } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    // Update user
    req.user.name = name;
    req.user.email = email;

    // Update password if provided
    if (password && password.length > 0) {
      req.user.password = password; // Will be hashed by pre-save middleware
    }

    await req.user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        status: req.user.status
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
