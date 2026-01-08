import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validate, signupSchema, loginSchema } from '../middleware/validation.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Signup
router.post('/signup', authLimiter, validate(signupSchema), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const user = new User({ name, email, password });
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skillScore: user.skillScore,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// Login
router.post('/login', authLimiter, validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skillScore: user.skillScore,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Check authentication status
router.get('/check', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.json({ isAuthenticated: false, user: null });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return res.json({ isAuthenticated: false, user: null });
      }

      res.json({
        isAuthenticated: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          skillScore: user.skillScore,
          experienceLevel: user.experienceLevel || 'beginner',
          preferredLanguage: user.preferredLanguage || 'hinglish',
        },
      });
    } catch (jwtError) {
      // Invalid or expired token
      return res.json({ isAuthenticated: false, user: null });
    }
  } catch (error) {
    console.error('Auth check error:', error);
    res.json({ isAuthenticated: false, user: null });
  }
});

// Logout (optional - mainly for server-side session management)
router.post('/logout', async (req, res) => {
  // Since we're using JWT tokens, logout is handled client-side by removing the token
  // This endpoint is here for consistency and future session-based auth
  res.json({ message: 'Logout successful' });
});

export default router;

