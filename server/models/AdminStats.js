import mongoose from 'mongoose';

const adminStatsSchema = new mongoose.Schema({
  totalUsers: {
    type: Number,
    default: 0,
  },
  totalErrorsAnalyzed: {
    type: Number,
    default: 0,
  },
  averageSkillScore: {
    type: Number,
    default: 0,
  },
  errorsByDifficulty: {
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 },
  },
  topErrors: [{
    errorPattern: String,
    count: Number,
  }],
  dailyStats: [{
    date: Date,
    errorsAnalyzed: Number,
    newUsers: Number,
  }],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('AdminStats', adminStatsSchema);

