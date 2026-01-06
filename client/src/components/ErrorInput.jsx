import { useState, useEffect } from 'react';
import { updateExperienceLevel, updateLanguage } from '../services/api';

const ErrorInput = ({ onAnalyze, loading, experienceLevel: defaultExperienceLevel = 'beginner', preferredLanguage: defaultLanguage = 'hinglish' }) => {
  const [errorInput, setErrorInput] = useState('');
  const [errorType, setErrorType] = useState('error_message');
  const [experienceLevel, setExperienceLevel] = useState(defaultExperienceLevel);
  const [language, setLanguage] = useState(defaultLanguage);

  useEffect(() => {
    setExperienceLevel(defaultExperienceLevel);
  }, [defaultExperienceLevel]);

  useEffect(() => {
    setLanguage(defaultLanguage);
  }, [defaultLanguage]);

  const handleExperienceLevelChange = async (level) => {
    setExperienceLevel(level);
    // Save preference to backend
    try {
      await updateExperienceLevel(level);
    } catch (error) {
      console.error('Failed to update experience level:', error);
    }
  };

  const handleLanguageChange = async (lang) => {
    setLanguage(lang);
    // Save preference to backend
    try {
      await updateLanguage(lang);
    } catch (error) {
      console.error('Failed to update language:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (errorInput.trim().length >= 10) {
      onAnalyze(errorInput, errorType, experienceLevel, language);
    }
  };

  return (
    <div className="glass rounded-2xl shadow-2xl p-8 hover-lift border border-cyber-red/40 animate-fadeIn">
      <div className="flex items-center mb-6">
        <div className="bg-cyber-red p-3 rounded-xl mr-4 cyber-glow">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white font-mono">
            <span className="text-cyber-red">[</span>ANALYZE_ERROR<span className="text-cyber-red">]</span>
          </h2>
          <p className="text-sm text-gray-300 font-mono">{'>'} Get instant AI-powered explanations</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-mono font-semibold text-cyber-red mb-4">
            <span className="flex items-center">
              <span className="mr-2 text-cyber-red">[</span>
              ERROR_TYPE
              <span className="ml-2 text-cyber-red">]</span>
            </span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="radiogroup" aria-label="Error Type Selection">
            <button
              type="button"
              role="radio"
              aria-checked={errorType === 'error_message'}
              onClick={() => setErrorType('error_message')}
              className={`px-6 py-5 rounded-xl font-mono font-bold text-sm transition-all transform hover:scale-105 active:scale-95 border-2 relative overflow-hidden group cursor-pointer ${
                errorType === 'error_message'
                  ? 'bg-red-gradient text-white border-cyber-red shadow-xl ring-2 ring-cyber-red ring-offset-2 ring-offset-cyber-black cyber-glow'
                  : 'bg-cyber-gray text-gray-300 border-cyber-red/40 hover:border-cyber-red/70 hover:bg-cyber-black hover:shadow-lg'
              }`}
            >
              {errorType === 'error_message' && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                  <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full cyber-glow"></div>
                </>
              )}
              <div className="flex flex-col items-center space-y-2 relative z-10">
                <span className="text-3xl transform group-hover:scale-110 transition-transform">🔴</span>
                <span className="text-xs">[ERROR_MESSAGE]</span>
              </div>
            </button>
            
            <button
              type="button"
              role="radio"
              aria-checked={errorType === 'stack_trace'}
              onClick={() => setErrorType('stack_trace')}
              className={`px-6 py-5 rounded-xl font-mono font-bold text-sm transition-all transform hover:scale-105 active:scale-95 border-2 relative overflow-hidden group cursor-pointer ${
                errorType === 'stack_trace'
                  ? 'bg-red-gradient text-white border-cyber-red shadow-xl ring-2 ring-cyber-red ring-offset-2 ring-offset-cyber-black cyber-glow'
                  : 'bg-cyber-gray text-gray-300 border-cyber-red/40 hover:border-cyber-red/70 hover:bg-cyber-black hover:shadow-lg'
              }`}
            >
              {errorType === 'stack_trace' && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                  <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full cyber-glow"></div>
                </>
              )}
              <div className="flex flex-col items-center space-y-2 relative z-10">
                <span className="text-3xl transform group-hover:scale-110 transition-transform">📜</span>
                <span className="text-xs">[STACK_TRACE]</span>
              </div>
            </button>
            
            <button
              type="button"
              role="radio"
              aria-checked={errorType === 'code_snippet'}
              onClick={() => setErrorType('code_snippet')}
              className={`px-6 py-5 rounded-xl font-mono font-bold text-sm transition-all transform hover:scale-105 active:scale-95 border-2 relative overflow-hidden group cursor-pointer ${
                errorType === 'code_snippet'
                  ? 'bg-red-gradient text-white border-cyber-red shadow-xl ring-2 ring-cyber-red ring-offset-2 ring-offset-cyber-black cyber-glow'
                  : 'bg-cyber-gray text-gray-300 border-cyber-red/40 hover:border-cyber-red/70 hover:bg-cyber-black hover:shadow-lg'
              }`}
            >
              {errorType === 'code_snippet' && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                  <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full cyber-glow"></div>
                </>
              )}
              <div className="flex flex-col items-center space-y-2 relative z-10">
                <span className="text-3xl transform group-hover:scale-110 transition-transform">💻</span>
                <span className="text-xs">[CODE_SNIPPET]</span>
              </div>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-mono font-semibold text-cyber-red mb-2">
            <span className="flex items-center">
              <span className="mr-2 text-cyber-red">[</span>
              EXPERIENCE_LEVEL
              <span className="ml-2 text-cyber-red">]</span>
            </span>
          </label>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => handleExperienceLevelChange('beginner')}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all border-2 ${
                experienceLevel === 'beginner'
                  ? 'bg-cyber-red text-white border-cyber-red'
                  : 'bg-cyber-gray text-gray-300 border-cyber-red/40 hover:border-cyber-red/70'
              }`}
            >
              Beginner
            </button>
            <button
              type="button"
              onClick={() => handleExperienceLevelChange('intermediate')}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all border-2 ${
                experienceLevel === 'intermediate'
                  ? 'bg-cyber-red text-white border-cyber-red'
                  : 'bg-cyber-gray text-gray-300 border-cyber-red/40 hover:border-cyber-red/70'
              }`}
            >
              Intermediate
            </button>
            <button
              type="button"
              onClick={() => handleExperienceLevelChange('experienced')}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all border-2 ${
                experienceLevel === 'experienced'
                  ? 'bg-cyber-red text-white border-cyber-red'
                  : 'bg-cyber-gray text-gray-300 border-cyber-red/40 hover:border-cyber-red/70'
              }`}
            >
              Experienced
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-mono font-semibold text-cyber-red mb-2">
            <span className="flex items-center">
              <span className="mr-2 text-cyber-red">[</span>
              PASTE_ERROR
              <span className="ml-2 text-cyber-red">]</span>
            </span>
          </label>
          <textarea
            value={errorInput}
            onChange={(e) => setErrorInput(e.target.value)}
            placeholder="> Paste your error message, stack trace, or code snippet here...

> Example:
> TypeError: Cannot read property 'map' of undefined
>     at processData (app.js:15:23)"
            className="w-full h-56 px-4 py-4 border-2 border-cyber-red/40 bg-cyber-black text-cyber-red rounded-xl focus:outline-none focus:ring-2 focus:ring-cyber-red focus:border-cyber-red font-mono text-sm hover:border-cyber-red/60 transition-all resize-none terminal"
            required
            minLength={10}
          />
          <div className="mt-2 flex items-center justify-between text-xs font-mono">
            <span className={errorInput.length >= 10 ? 'text-cyber-red' : 'text-gray-400'}>
              {errorInput.length >= 10 ? '[READY]' : `[MIN_${10 - errorInput.length}_CHARS]`}
            </span>
            <span className="text-cyber-red">[{errorInput.length}_CHARS]</span>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading || errorInput.trim().length < 10}
          className="w-full bg-red-gradient text-white py-4 px-6 rounded-xl font-mono font-bold text-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] cyber-glow disabled:cyber-glow-none flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>[ANALYZING...]</span>
            </>
          ) : (
            <>
              <span className="text-cyber-red">[</span>
              <span>EXECUTE_ANALYSIS</span>
              <span className="text-cyber-red">]</span>
            </>
          )}
        </button>
      </form>

      {/* Language Selector - After the main form box */}
      <div className="mt-6">
        <label className="block text-sm font-mono font-semibold text-cyber-red mb-2">
          <span className="flex items-center">
            <span className="mr-2 text-cyber-red">[</span>
            PREFERRED_LANGUAGE
            <span className="ml-2 text-cyber-red">]</span>
          </span>
        </label>
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="w-full px-4 py-3 border-2 border-cyber-red/40 bg-cyber-gray text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-cyber-red focus:border-cyber-red font-mono text-sm hover:border-cyber-red/60 transition-all"
          style={{ color: '#ffffff', backgroundColor: '#1a1a1a' }}
        >
          <option value="hindi" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>🇮🇳 Hindi</option>
          <option value="english" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>🇺🇸 English</option>
          <option value="hinglish" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>🌐 Hinglish</option>
          <option value="spanish" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>🇪🇸 Spanish</option>
          <option value="french" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>🇫🇷 French</option>
          <option value="german" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>🇩🇪 German</option>
          <option value="chinese" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>🇨🇳 Chinese</option>
          <option value="japanese" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>🇯🇵 Japanese</option>
        </select>
      </div>
    </div>
  );
};

export default ErrorInput;

