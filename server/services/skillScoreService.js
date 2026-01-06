import SkillScore from '../models/SkillScore.js';

export const updateSkillScore = async (userId, skillScoreDelta, difficulty) => {
  try {
    let skillScore = await SkillScore.findOne({ userId });

    if (!skillScore) {
      skillScore = new SkillScore({
        userId,
        currentScore: 0,
        totalErrorsAnalyzed: 0,
      });
    }

    // Calculate new score
    const newScore = Math.max(0, Math.min(100, skillScore.currentScore + skillScoreDelta));

    // Update history
    skillScore.history.push({
      score: newScore,
      date: new Date(),
    });

    // Update stats
    skillScore.currentScore = newScore;
    skillScore.totalErrorsAnalyzed += 1;
    skillScore.errorsByDifficulty[difficulty] = (skillScore.errorsByDifficulty[difficulty] || 0) + 1;
    skillScore.lastUpdated = new Date();

    await skillScore.save();

    // Also update user's skillScore field
    const User = (await import('../models/User.js')).default;
    await User.findByIdAndUpdate(userId, { skillScore: newScore });

    return newScore;
  } catch (error) {
    console.error('Error updating skill score:', error);
    throw error;
  }
};

export const updateSkillScoreFromQuiz = async (userId, quizScore, totalQuestions) => {
  try {
    let skillScore = await SkillScore.findOne({ userId });

    if (!skillScore) {
      skillScore = new SkillScore({
        userId,
        currentScore: 0,
        totalErrorsAnalyzed: 0,
      });
    }

    // Calculate skill score delta based on quiz performance
    // Score is a percentage (0-100)
    let skillScoreDelta = 0;
    
    if (quizScore >= 90) {
      // Excellent performance: +8 to +10 points
      skillScoreDelta = 8 + Math.floor((quizScore - 90) / 10 * 2);
    } else if (quizScore >= 70) {
      // Good performance: +5 to +7 points
      skillScoreDelta = 5 + Math.floor((quizScore - 70) / 20 * 2);
    } else if (quizScore >= 50) {
      // Average performance: +2 to +4 points
      skillScoreDelta = 2 + Math.floor((quizScore - 50) / 20 * 2);
    } else if (quizScore >= 30) {
      // Below average: +1 point (still learning)
      skillScoreDelta = 1;
    } else {
      // Poor performance: -1 to 0 points (no penalty, just no gain)
      skillScoreDelta = 0;
    }

    // Calculate new score
    const newScore = Math.max(0, Math.min(100, skillScore.currentScore + skillScoreDelta));

    // Update history
    skillScore.history.push({
      score: newScore,
      date: new Date(),
      source: 'quiz',
      quizScore: quizScore,
    });

    // Update stats
    skillScore.currentScore = newScore;
    skillScore.totalQuizzesCompleted = (skillScore.totalQuizzesCompleted || 0) + 1;
    skillScore.lastUpdated = new Date();

    await skillScore.save();

    // Also update user's skillScore field
    const User = (await import('../models/User.js')).default;
    await User.findByIdAndUpdate(userId, { skillScore: newScore });

    return { newScore, skillScoreDelta };
  } catch (error) {
    console.error('Error updating skill score from quiz:', error);
    throw error;
  }
};

export const getSkillScore = async (userId) => {
  try {
    let skillScore = await SkillScore.findOne({ userId });

    if (!skillScore) {
      skillScore = new SkillScore({
        userId,
        currentScore: 0,
        totalErrorsAnalyzed: 0,
      });
      await skillScore.save();
    }

    return skillScore;
  } catch (error) {
    console.error('Error getting skill score:', error);
    throw error;
  }
};

