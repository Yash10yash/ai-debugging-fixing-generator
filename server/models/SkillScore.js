import mongoose from 'mongoose';

const skillScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  currentScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  history: [{
    score: Number,
    date: {
      type: Date,
      default: Date.now,
    },
    errorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ErrorLog',
    },
  }],
  totalErrorsAnalyzed: {
    type: Number,
    default: 0,
  },
  errorsByDifficulty: {
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 },
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('SkillScore', skillScoreSchema);

