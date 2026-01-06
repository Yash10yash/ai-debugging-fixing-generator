import express from 'express';
import ErrorLog from '../models/ErrorLog.js';
import { authenticate } from '../middleware/auth.js';
import { validate, errorAnalysisSchema } from '../middleware/validation.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { analyzeError } from '../services/geminiService.js';
import { testFix } from '../services/testFixService.js';
import { updateSkillScore, updateSkillScoreFromQuiz } from '../services/skillScoreService.js';
import { generateQuizQuestions } from '../services/quizService.js';

const router = express.Router();

// Analyze error
router.post('/analyze', authenticate, aiLimiter, validate(errorAnalysisSchema), async (req, res) => {
  try {
    const { errorInput, errorType, experienceLevel, language } = req.body;
    const userId = req.user._id;

    // Get experience level and language from request or user profile
    const userExperienceLevel = experienceLevel || req.user.experienceLevel || 'beginner';
    const userLanguage = language || req.user.preferredLanguage || 'hinglish';

    console.log('Analyzing error:', { errorType, inputLength: errorInput.length, userId, experienceLevel: userExperienceLevel, language: userLanguage });

    // Call Gemini AI with experience level and language
    const aiResponse = await analyzeError(errorInput, errorType, userExperienceLevel, userLanguage);
    console.log('AI response received:', { hasResponse: !!aiResponse });

    // Save error log
    const errorLog = new ErrorLog({
      userId,
      errorInput,
      errorType,
      aiResponse,
    });
    await errorLog.save();

    // Update skill score
    const newScore = await updateSkillScore(
      userId,
      aiResponse.skill_score_delta || 5,
      aiResponse.difficulty || 'medium'
    );

    res.json({
      ...aiResponse,
      errorLogId: errorLog._id,
      updatedSkillScore: newScore,
    });
  } catch (error) {
    console.error('Error analysis error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: error.message || 'Failed to analyze error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Test fix
router.post('/test-fix', authenticate, async (req, res) => {
  try {
    const { errorLogId, errorInput, fixCode, errorType } = req.body;

    if (!errorLogId || !fixCode) {
      return res.status(400).json({ error: 'errorLogId and fixCode are required' });
    }

    // Test the fix
    const testResult = testFix(errorInput, fixCode, errorType);

    // Update error log
    await ErrorLog.findByIdAndUpdate(errorLogId, {
      'testFixResult.status': testResult.status,
      'testFixResult.message': testResult.message,
    });

    res.json(testResult);
  } catch (error) {
    console.error('Test fix error:', error);
    res.status(500).json({ error: 'Failed to test fix' });
  }
});

// Get user's error history
router.get('/history', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const errorLogs = await ErrorLog.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('errorInput errorType aiResponse.difficulty aiResponse.error_explanation createdAt testFixResult');

    const total = await ErrorLog.countDocuments({ userId });

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
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to fetch error history' });
  }
});

// Generate quiz questions
router.post('/quiz/generate', authenticate, aiLimiter, async (req, res) => {
  try {
    const { errorLogId, numQuestions, analysis } = req.body;
    const userId = req.user._id;

    if (!errorLogId || !analysis) {
      return res.status(400).json({ error: 'errorLogId and analysis are required' });
    }

    // Verify error log belongs to user
    const errorLog = await ErrorLog.findOne({
      _id: errorLogId,
      userId,
    });

    if (!errorLog) {
      return res.status(404).json({ error: 'Error log not found' });
    }

    // Generate quiz questions
    const questions = await generateQuizQuestions(analysis, numQuestions || 5);

    // Save quiz to error log
    await ErrorLog.findByIdAndUpdate(errorLogId, {
      quiz: {
        questions,
        createdAt: new Date(),
      },
    });

    res.json({ questions });
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate quiz' });
  }
});

// Submit quiz answer
router.post('/quiz/answer', authenticate, async (req, res) => {
  try {
    const { errorLogId, questionIndex, selectedAnswer, isCorrect } = req.body;
    const userId = req.user._id;

    // Verify error log belongs to user
    const errorLog = await ErrorLog.findOne({
      _id: errorLogId,
      userId,
    });

    if (!errorLog) {
      return res.status(404).json({ error: 'Error log not found' });
    }

    // Update quiz results
    if (!errorLog.quizResults) {
      errorLog.quizResults = [];
    }

    errorLog.quizResults.push({
      questionIndex,
      selectedAnswer,
      isCorrect,
      timestamp: new Date(),
    });

    await errorLog.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Quiz answer submission error:', error);
    res.status(500).json({ error: 'Failed to submit answer' });
  }
});

// Submit final quiz score and update skill score
router.post('/quiz/complete', authenticate, async (req, res) => {
  try {
    const { errorLogId, score, totalQuestions } = req.body;
    const userId = req.user._id;

    if (!errorLogId || score === undefined || !totalQuestions) {
      return res.status(400).json({ error: 'errorLogId, score, and totalQuestions are required' });
    }

    // Verify error log belongs to user
    const errorLog = await ErrorLog.findOne({
      _id: errorLogId,
      userId,
    });

    if (!errorLog) {
      return res.status(404).json({ error: 'Error log not found' });
    }

    // Calculate percentage score
    const quizScore = Math.round((score / totalQuestions) * 100);

    // Update skill score based on quiz performance
    const { newScore, skillScoreDelta } = await updateSkillScoreFromQuiz(userId, quizScore, totalQuestions);

    // Save final quiz score to error log
    if (!errorLog.quizResults) {
      errorLog.quizResults = [];
    }

    errorLog.quizResults.push({
      finalScore: quizScore,
      correctAnswers: score,
      totalQuestions: totalQuestions,
      completedAt: new Date(),
      skillScoreDelta: skillScoreDelta,
    });

    await errorLog.save();

    res.json({
      success: true,
      quizScore,
      updatedSkillScore: newScore,
      skillScoreDelta,
    });
  } catch (error) {
    console.error('Quiz completion error:', error);
    res.status(500).json({ error: 'Failed to complete quiz' });
  }
});

// Get single error log
router.get('/:id', authenticate, async (req, res) => {
  try {
    const errorLog = await ErrorLog.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!errorLog) {
      return res.status(404).json({ error: 'Error log not found' });
    }

    res.json(errorLog);
  } catch (error) {
    console.error('Get error log error:', error);
    res.status(500).json({ error: 'Failed to fetch error log' });
  }
});

export default router;

