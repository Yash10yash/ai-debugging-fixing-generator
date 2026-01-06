import mongoose from 'mongoose';

const errorLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  errorInput: {
    type: String,
    required: true,
  },
  errorType: {
    type: String,
    enum: ['error_message', 'stack_trace', 'code_snippet'],
    required: true,
  },
  aiResponse: {
    error_explanation: String,
    root_cause: String,
    possible_causes: [{
      cause: String,
      probability: Number,
    }],
    fix: {
      code: String,
      steps: [String],
    },
    why_fix_works: String,
    visual_flow: String,
    real_world_example: String,
    learning_tip: String,
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
    },
    skill_score_delta: Number,
  },
  testFixResult: {
    status: {
      type: String,
      enum: ['not_tested', 'likely_fixed', 'still_failing'],
      default: 'not_tested',
    },
    message: String,
  },
  quiz: {
    questions: [{
      question: String,
      options: [String],
      correctAnswer: Number,
    }],
    createdAt: Date,
  },
  quizResults: [{
    questionIndex: Number,
    selectedAnswer: Number,
    isCorrect: Boolean,
    timestamp: Date,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
errorLogSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('ErrorLog', errorLogSchema);

