import { useState, useEffect } from 'react';
import { analyzeError, getUserProfile } from '../services/api';
import ErrorInput from '../components/ErrorInput';
import ErrorAnalysis from '../components/ErrorAnalysis';
import SkillChart from '../components/SkillChart';
import GlitchText from '../components/GlitchText';

const Dashboard = () => {
  const [analysis, setAnalysis] = useState(null);
  const [errorLogId, setErrorLogId] = useState(null);
  const [errorInput, setErrorInput] = useState('');
  const [errorType, setErrorType] = useState('error_message');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [updatedSkillScore, setUpdatedSkillScore] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getUserProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleQuizComplete = async (newSkillScore) => {
    // Reload profile to get updated skill score after quiz
    await loadProfile();
  };

  const handleAnalyze = async (input, type, experienceLevel, language) => {
    setLoading(true);
    setErrorInput(input);
    setErrorType(type);
    setAnalysis(null);

    try {
      const result = await analyzeError(input, type, experienceLevel, language);
      setAnalysis(result);
      setErrorLogId(result.errorLogId);
      if (result.updatedSkillScore !== undefined) {
        setUpdatedSkillScore(result.updatedSkillScore);
        // Reload profile to get updated skill score
        await loadProfile();
      }
    } catch (error) {
      console.error('Analysis error:', error);
      
      let errorMessage = 'Failed to analyze error. ';
      
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error') || error.message?.includes('Failed to fetch')) {
        errorMessage += 'Cannot connect to server. Make sure the backend is running on port 5000.';
      } else if (error.response?.status === 401) {
        errorMessage += 'Authentication failed. Please login again.';
      } else if (error.response?.status === 429) {
        errorMessage += 'Too many requests. Please wait a moment and try again.';
      } else if (error.response?.status === 500) {
        errorMessage += error.response?.data?.error || 'Server error. Check server logs.';
      } else {
        errorMessage += error.response?.data?.error || error.message || 'Unknown error occurred.';
      }
      
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-12 relative z-10">
      <div className="space-y-6 animate-fadeIn">
        {/* Header with cyber theme */}
        <div className="glass rounded-2xl shadow-2xl p-8 hover-lift border border-cyber-red/40">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-extrabold gradient-text mb-3 cyber-glow-text cyber-pulse font-mono">
                <span className="text-cyber-red">[</span>
                <GlitchText text="AI DEBUG MENTOR" />
                <span className="text-cyber-red">]</span>
              </h1>
              <p className="text-gray-300 text-lg font-mono">
                {'>'} Transform errors into learning opportunities with AI-powered explanations
              </p>
            </div>
            {loading && (
              <div className="flex items-center space-x-2 text-cyber-red cyber-glow-text">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyber-red"></div>
                <span className="font-mono font-medium">[ANALYZING...]</span>
              </div>
            )}
          </div>
          
          {profile && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-cyber-gray rounded-xl p-4 border border-cyber-red/40 hover-lift">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-mono font-medium text-cyber-red mb-1">[SKILL_SCORE]</p>
                    <p className="text-3xl font-bold text-white font-mono">
                      {profile.user.skillScore}
                      <span className="text-lg text-cyber-red">/100</span>
                    </p>
                  </div>
                  <div className="text-3xl">⚡</div>
                </div>
                <div className="mt-2 w-full bg-cyber-black rounded-full h-2 border border-cyber-red/40">
                  <div 
                    className="bg-red-gradient h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${profile.user.skillScore}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-cyber-gray rounded-xl p-4 border border-cyber-red/40 hover-lift">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-mono font-medium text-cyber-red mb-1">[ERRORS_ANALYZED]</p>
                    <p className="text-3xl font-bold text-white font-mono">
                      {profile.skillScore?.totalErrorsAnalyzed || 0}
                    </p>
                  </div>
                  <div className="text-3xl">🔍</div>
                </div>
                <p className="text-xs text-cyber-red mt-2 font-mono">[KEEP_LEARNING]</p>
              </div>
              
              <div className="bg-cyber-gray rounded-xl p-4 border border-cyber-red/40 hover-lift">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-mono font-medium text-cyber-red mb-1">[LEVEL]</p>
                    <p className="text-2xl font-bold text-white font-mono">
                      {profile.user.skillScore >= 80 ? 'EXPERT' : 
                       profile.user.skillScore >= 50 ? 'INTERMEDIATE' : 
                       profile.user.skillScore >= 25 ? 'BEGINNER' : 'NOVICE'}
                    </p>
                  </div>
                  <div className="text-3xl">
                    {profile.user.skillScore >= 80 ? '🏆' : 
                     profile.user.skillScore >= 50 ? '⭐' : 
                     profile.user.skillScore >= 25 ? '🌱' : '🌿'}
                  </div>
                </div>
                <p className="text-xs text-cyber-red mt-2 font-mono">[YOUR_PROGRESS]</p>
              </div>
            </div>
          )}
        </div>

      {/* Error Input */}
      <ErrorInput 
        onAnalyze={handleAnalyze} 
        loading={loading} 
        experienceLevel={profile?.user?.experienceLevel || 'beginner'}
        preferredLanguage={profile?.user?.preferredLanguage || 'hinglish'}
      />

      {/* Analysis Result */}
      {analysis && (
        <div className="animate-slideIn">
          <ErrorAnalysis
            analysis={analysis}
            errorLogId={errorLogId}
            errorInput={errorInput}
            errorType={errorType}
          />
        </div>
      )}

      {/* Skill Chart */}
      {profile?.skillScore?.history && profile.skillScore.history.length > 0 && (
        <div className="animate-fadeIn">
          <SkillChart skillScoreHistory={profile.skillScore.history} />
        </div>
      )}
    </div>
    </div>
  );
};

export default Dashboard;

