import { useState, useEffect } from 'react';
import { generateQuiz, submitQuizAnswer, completeQuiz } from '../services/api';

const ErrorQuiz = ({ errorLogId, analysis }) => {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);
  const [quizStarted, setQuizStarted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleStartQuiz = async () => {
    setLoading(true);
    try {
      const questions = await generateQuiz(errorLogId, numQuestions, analysis);
      setQuizQuestions(questions);
      setQuizStarted(true);
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowResult(false);
      setAnsweredQuestions([]);
    } catch (error) {
      console.error('Failed to generate quiz:', error);
      alert('[ERROR]: Failed to generate quiz questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer !== null) return; // Already answered
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null) return;

    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isAnswerCorrect = selectedAnswer === currentQuestion.correctAnswer;

    setIsCorrect(isAnswerCorrect);
    if (isAnswerCorrect) {
      setScore(score + 1);
    }

    // Save answered question
    setAnsweredQuestions([
      ...answeredQuestions,
      {
        question: currentQuestion.question,
        selectedAnswer,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect: isAnswerCorrect,
      },
    ]);

    // Submit to backend
    try {
      await submitQuizAnswer(errorLogId, currentQuestionIndex, selectedAnswer, isAnswerCorrect);
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }

    // Move to next question after delay
    setTimeout(async () => {
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        // Quiz completed - submit final score and update skill score
        // Calculate final score (current score + 1 if last answer was correct)
        const finalScore = isAnswerCorrect ? score + 1 : score;
        try {
          const result = await completeQuiz(errorLogId, finalScore, quizQuestions.length);
          setSkillScoreUpdate({
            newScore: result.updatedSkillScore,
            delta: result.skillScoreDelta,
          });
          if (onQuizComplete) {
            onQuizComplete(result.updatedSkillScore);
          }
        } catch (error) {
          console.error('Failed to complete quiz:', error);
        }
        setShowResult(true);
      }
    }, 2000);
  };

  const handleResetQuiz = () => {
    setQuizStarted(false);
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setAnsweredQuestions([]);
    setIsCorrect(null);
  };

  if (!quizStarted && !showResult) {
    return (
      <div className="bg-cyber-gray rounded-xl p-6 border border-cyber-red/40 animate-fadeIn">
        <h3 className="text-xl font-bold text-white mb-4 font-mono flex items-center">
          <span className="text-cyber-red mr-2">[</span>
          PRACTICE_QUIZ
          <span className="text-cyber-red ml-2">]</span>
        </h3>
        <p className="text-gray-300 mb-6 font-mono">
          {'>'} Test your understanding with MCQ questions related to this error!
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-mono font-semibold text-cyber-red mb-2">
              [NUMBER_OF_QUESTIONS]
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="3"
                max="10"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                className="flex-1 h-2 bg-cyber-black rounded-lg appearance-none cursor-pointer accent-cyber-red"
              />
              <span className="text-cyber-red font-mono font-bold text-lg w-12 text-center">
                {numQuestions}
              </span>
            </div>
          </div>
          <button
            onClick={handleStartQuiz}
            disabled={loading}
            className="w-full bg-red-gradient text-white py-4 px-6 rounded-xl font-mono font-bold text-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] cyber-glow disabled:cyber-glow-none flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>[GENERATING_QUESTIONS...]</span>
              </>
            ) : (
              <>
                <span className="text-cyber-red">[</span>
                <span>START_QUIZ</span>
                <span className="text-cyber-red">]</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const getPerformanceMessage = () => {
      if (percentage >= 90) return { text: 'EXCELLENT!', color: 'text-green-500' };
      if (percentage >= 70) return { text: 'GREAT JOB!', color: 'text-green-400' };
      if (percentage >= 50) return { text: 'GOOD EFFORT!', color: 'text-yellow-400' };
      return { text: 'KEEP PRACTICING!', color: 'text-cyber-red' };
    };
    const performance = getPerformanceMessage();

    return (
      <div className="bg-cyber-gray rounded-xl p-6 border border-cyber-red/40 animate-fadeIn">
        <h3 className="text-xl font-bold text-white mb-4 font-mono flex items-center">
          <span className="text-cyber-red mr-2">[</span>
          QUIZ_RESULTS
          <span className="text-cyber-red ml-2">]</span>
        </h3>
        <div className="text-center mb-6">
          <div className="text-6xl font-bold font-mono mb-2" style={{ color: performance.color }}>
            {percentage}%
          </div>
          <div className={`text-2xl font-bold font-mono mb-4 ${performance.color}`}>
            {performance.text}
          </div>
          <div className="text-gray-300 font-mono">
            Score: <span className="text-cyber-red font-bold">{score}</span> / {quizQuestions.length}
          </div>
          {skillScoreUpdate && (
            <div className="mt-4 p-4 bg-cyber-black rounded-xl border border-cyber-green/40">
              <p className="text-cyber-green font-mono font-bold text-sm mb-1">
                [SKILL_SCORE_UPDATED]
              </p>
              <p className="text-white font-mono">
                New Score: <span className="text-cyber-green font-bold">{skillScoreUpdate.newScore}</span> / 100
              </p>
              {skillScoreUpdate.delta > 0 && (
                <p className="text-cyber-green font-mono text-xs mt-1">
                  +{skillScoreUpdate.delta} points
                </p>
              )}
            </div>
          )}
        </div>
        <div className="space-y-3 mb-6">
          {answeredQuestions.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border-2 ${
                item.isCorrect
                  ? 'bg-green-900/20 border-green-500/50'
                  : 'bg-red-900/20 border-red-500/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-mono text-sm font-bold">
                  Q{idx + 1}: {item.question}
                </span>
                <span className={`font-mono text-sm font-bold ${
                  item.isCorrect ? 'text-green-400' : 'text-red-400'
                }`}>
                  {item.isCorrect ? '[✓]' : '[✗]'}
                </span>
              </div>
              {!item.isCorrect && (
                <div className="text-gray-400 font-mono text-xs mt-2">
                  Correct Answer: Option {item.correctAnswer + 1}
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={handleResetQuiz}
          className="w-full bg-red-gradient text-white py-3 px-6 rounded-xl font-mono font-bold hover:opacity-90 transition-all transform hover:scale-[1.02] active:scale-[0.98] cyber-glow"
        >
          [TRY_AGAIN]
        </button>
      </div>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];

  return (
    <div className="bg-cyber-gray rounded-xl p-6 border border-cyber-red/40 animate-fadeIn">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-white font-mono flex items-center">
          <span className="text-cyber-red mr-2">[</span>
          QUESTION_{currentQuestionIndex + 1}_OF_{quizQuestions.length}
          <span className="text-cyber-red ml-2">]</span>
        </h3>
        <div className="text-cyber-red font-mono font-bold">
          Score: <span className="text-white">{score}</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="w-full bg-cyber-black rounded-full h-2 border border-cyber-red/40">
          <div
            className="bg-red-gradient h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-white font-mono text-lg mb-4">{'>'} {currentQuestion?.question}</p>
        <div className="space-y-3">
          {currentQuestion?.options?.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswerSelect(idx)}
              disabled={selectedAnswer !== null}
              className={`w-full text-left p-4 rounded-xl font-mono transition-all border-2 ${
                selectedAnswer === idx
                  ? isCorrect === true
                    ? 'bg-green-900/30 border-green-500 text-green-400 cyber-glow'
                    : isCorrect === false
                    ? 'bg-red-900/30 border-red-500 text-red-400'
                    : 'bg-cyber-red/20 border-cyber-red text-white'
                  : selectedAnswer !== null && idx === currentQuestion.correctAnswer
                  ? 'bg-green-900/20 border-green-500/50 text-green-400'
                  : 'bg-cyber-black border-cyber-red/40 text-gray-300 hover:border-cyber-red/70 hover:bg-cyber-gray'
              } ${selectedAnswer === null ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            >
              <span className="font-bold mr-2">[{String.fromCharCode(65 + idx)}]</span>
              {option}
            </button>
          ))}
        </div>
      </div>

      {selectedAnswer !== null && (
        <div className={`mb-4 p-4 rounded-xl border-2 ${
          isCorrect
            ? 'bg-green-900/20 border-green-500/50 text-green-400'
            : 'bg-red-900/20 border-red-500/50 text-red-400'
        }`}>
          <p className="font-mono font-bold text-center">
            {isCorrect ? '[✓ CORRECT!]' : '[✗ INCORRECT]'}
          </p>
          {!isCorrect && (
            <p className="font-mono text-sm mt-2 text-center">
              Correct Answer: {currentQuestion.options[currentQuestion.correctAnswer]}
            </p>
          )}
        </div>
      )}

      <button
        onClick={handleSubmitAnswer}
        disabled={selectedAnswer === null}
        className="w-full bg-red-gradient text-white py-3 px-6 rounded-xl font-mono font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] cyber-glow disabled:cyber-glow-none"
      >
        {currentQuestionIndex < quizQuestions.length - 1 ? '[NEXT_QUESTION]' : '[VIEW_RESULTS]'}
      </button>
    </div>
  );
};

export default ErrorQuiz;

