import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getSkillScore } from '../services/skillScoreService.js';
import ErrorLog from '../models/ErrorLog.js';
import User from '../models/User.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = req.user;
    const skillScore = await getSkillScore(user._id);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skillScore: user.skillScore,
        experienceLevel: user.experienceLevel || 'beginner',
        preferredLanguage: user.preferredLanguage || 'hinglish',
      },
      skillScore: {
        currentScore: skillScore.currentScore,
        totalErrorsAnalyzed: skillScore.totalErrorsAnalyzed,
        errorsByDifficulty: skillScore.errorsByDifficulty,
        history: skillScore.history.slice(-30), // Last 30 entries
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get skill score history
router.get('/skill-score', authenticate, async (req, res) => {
  try {
    const skillScore = await getSkillScore(req.user._id);
    res.json(skillScore);
  } catch (error) {
    console.error('Get skill score error:', error);
    res.status(500).json({ error: 'Failed to fetch skill score' });
  }
});

// Update experience level
router.patch('/experience-level', authenticate, async (req, res) => {
  try {
    const { experienceLevel } = req.body;
    
    if (!['beginner', 'intermediate', 'experienced'].includes(experienceLevel)) {
      return res.status(400).json({ error: 'Invalid experience level' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { experienceLevel },
      { new: true }
    ).select('-password');

    res.json({ user, message: 'Experience level updated successfully' });
  } catch (error) {
    console.error('Update experience level error:', error);
    res.status(500).json({ error: 'Failed to update experience level' });
  }
});

// Update preferred language
router.patch('/language', authenticate, async (req, res) => {
  try {
    const { language } = req.body;
    
    const validLanguages = ['hindi', 'english', 'hinglish', 'spanish', 'french', 'german', 'chinese', 'japanese'];
    if (!validLanguages.includes(language)) {
      return res.status(400).json({ error: 'Invalid language' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferredLanguage: language },
      { new: true }
    ).select('-password');

    res.json({ user, message: 'Language preference updated successfully' });
  } catch (error) {
    console.error('Update language error:', error);
    res.status(500).json({ error: 'Failed to update language preference' });
  }
});

export default router;

