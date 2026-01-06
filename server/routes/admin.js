import express from 'express';
import { authenticate, isAdmin } from '../middleware/auth.js';
import User from '../models/User.js';
import ErrorLog from '../models/ErrorLog.js';
import SkillScore from '../models/SkillScore.js';
import AdminStats from '../models/AdminStats.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(isAdmin);

// Get dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalErrors = await ErrorLog.countDocuments();

    // Calculate average skill score
    const skillScores = await SkillScore.find();
    const avgSkillScore =
      skillScores.length > 0
        ? skillScores.reduce((sum, s) => sum + s.currentScore, 0) / skillScores.length
        : 0;

    // Errors by difficulty
    const errorsByDifficulty = await ErrorLog.aggregate([
      {
        $group: {
          _id: '$aiResponse.difficulty',
          count: { $sum: 1 },
        },
      },
    ]);

    // Top error patterns (simplified)
    const recentErrors = await ErrorLog.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .select('errorInput');

    // Daily stats (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyStats = await ErrorLog.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          errorsAnalyzed: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const newUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    res.json({
      totalUsers,
      totalErrors,
      averageSkillScore: Math.round(avgSkillScore * 10) / 10,
      errorsByDifficulty: errorsByDifficulty.reduce((acc, item) => {
        acc[item._id || 'unknown'] = item.count;
        return acc;
      }, {}),
      dailyStats,
      newUsersLast30Days: newUsers,
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get all error logs
router.get('/errors', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const errorLogs = await ErrorLog.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ErrorLog.countDocuments();

    res.json({
      errorLogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get errors error:', error);
    res.status(500).json({ error: 'Failed to fetch errors' });
  }
});

export default router;

