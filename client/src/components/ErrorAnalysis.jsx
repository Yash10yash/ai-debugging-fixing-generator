import { useState } from 'react';
import { testFix as testFixAPI } from '../services/api';
import ErrorFlowChart from './ErrorFlowChart';
import ErrorQuiz from './ErrorQuiz';

const ErrorAnalysis = ({ analysis, errorLogId, errorInput, errorType, onQuizComplete }) => {
  const [activeTab, setActiveTab] = useState('explanation');
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const handleTestFix = async () => {
    if (!analysis?.fix?.code) return;
    setTesting(true);
    try {
      const result = await testFixAPI(
        errorLogId,
        errorInput,
        analysis.fix.code,
        errorType
      );
      setTestResult(result);
    } catch (error) {
      setTestResult({
        status: 'still_failing',
        message: 'Failed to test fix',
      });
    } finally {
      setTesting(false);
    }
  };

  if (!analysis) return null;

  const tabs = [
    { id: 'explanation', label: 'Explanation' },
    { id: 'fix', label: 'Fix' },
    { id: 'why', label: 'Why Fix Works' },
    { id: 'flow', label: 'Visual Flow' },
    { id: 'quiz', label: 'Practice Quiz' },
  ];

  return (
    <div className="glass rounded-2xl shadow-2xl p-8 hover-lift border border-cyber-red/40 bg-white/80 animate-slideIn">
      <div className="mb-6">
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl border border-cyber-red/40 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 font-mono font-bold text-sm rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-red-gradient text-white shadow-lg transform scale-105 cyber-glow'
                  : 'text-gray-700 hover:text-white hover:bg-gray-200 border border-cyber-red/30'
              }`}
            >
              [{tab.label.toUpperCase()}]
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'explanation' && (
          <div className="space-y-6 animate-fadeIn">
              <div className="bg-cyber-gray rounded-xl p-6 border border-cyber-red/40">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center font-mono">
                <span className="mr-2 text-cyber-red">[</span>
                ERROR_EXPLANATION
                <span className="ml-2 text-cyber-red">]</span>
              </h3>
              <p className="text-gray-300 leading-relaxed text-base font-mono">
                {'>'} {analysis.error_explanation}
              </p>
            </div>
            
              <div className="bg-cyber-gray rounded-xl p-6 border border-cyber-red/40">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center font-mono">
                <span className="mr-2 text-cyber-red">[</span>
                ROOT_CAUSE
                <span className="ml-2 text-cyber-red">]</span>
              </h3>
              <p className="text-gray-300 leading-relaxed text-base font-mono">
                {'>'} {analysis.root_cause}
              </p>
            </div>
            
            {analysis.possible_causes && analysis.possible_causes.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center font-mono">
                  <span className="mr-2 text-cyber-red">[</span>
                  POSSIBLE_CAUSES
                  <span className="ml-2 text-cyber-red">]</span>
                </h3>
                <div className="space-y-3">
                  {analysis.possible_causes.map((cause, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-cyber-black rounded-xl border-2 border-cyber-red/50 hover:border-cyber-red hover:shadow-md transition-all hover-lift"
                    >
                      <span className="text-gray-300 font-mono flex-1">{'>'} {cause.cause}</span>
                      <div className="ml-4 flex items-center space-x-2">
                        <div className="w-24 bg-cyber-black rounded-full h-2 border border-cyber-red/40">
                          <div 
                            className="bg-red-gradient h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${cause.probability}%` }}
                          ></div>
                        </div>
                        <span className="text-cyber-red font-bold text-lg w-12 text-right font-mono">
                          {cause.probability}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {analysis.real_world_example && (
              <div className="bg-cyber-gray rounded-xl p-6 border border-cyber-red/40">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center font-mono">
                  <span className="mr-2 text-cyber-red">[</span>
                  REAL_WORLD_EXAMPLE
                  <span className="ml-2 text-cyber-red">]</span>
                </h3>
                <p className="text-gray-300 leading-relaxed italic text-base font-mono">
                  {'>'} {analysis.real_world_example}
                </p>
              </div>
            )}
            {analysis.learning_tip && (
              <div className="bg-red-gradient rounded-xl p-6 text-white shadow-lg cyber-glow">
                <p className="text-white text-base font-mono flex items-start">
                  <span className="text-2xl mr-3">[💡]</span>
                  <span>
                    <strong className="block mb-1">[LEARNING_TIP]:</strong>
                    {'>'} {analysis.learning_tip}
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'fix' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center font-mono">
                <span className="mr-2 text-cyber-red">[</span>
                FIX_CODE
                <span className="ml-2 text-cyber-red">]</span>
              </h3>
              <div className="relative group">
                <pre className="terminal text-cyber-red p-6 rounded-xl overflow-x-auto shadow-2xl">
                  <code className="text-sm leading-relaxed font-mono">{analysis.fix?.code || '[NO_FIX_CODE]'}</code>
                </pre>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(analysis.fix?.code || '');
                    alert('[CODE_COPIED]');
                  }}
                  className="absolute top-4 right-4 bg-cyber-red hover:bg-cyber-red-light text-white px-3 py-2 rounded-lg text-sm font-mono opacity-0 group-hover:opacity-100 transition-opacity cyber-glow"
                >
                  [COPY]
                </button>
              </div>
            </div>
            {analysis.fix?.steps && analysis.fix.steps.length > 0 && (
              <div className="bg-cyber-gray rounded-xl p-6 border border-cyber-red/40">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center font-mono">
                  <span className="mr-2 text-cyber-red">[</span>
                  FIX_STEPS
                  <span className="ml-2 text-cyber-red">]</span>
                </h3>
                <ol className="space-y-3">
                  {analysis.fix.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="flex-shrink-0 w-8 h-8 bg-cyber-red text-white rounded-full flex items-center justify-center font-bold mr-3 mt-0.5 font-mono cyber-glow">
                        {idx + 1}
                      </span>
                      <span className="text-gray-300 leading-relaxed pt-1 font-mono">{'>'} {step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            <div className="flex items-center space-x-4 flex-wrap">
              <button
                onClick={handleTestFix}
                disabled={testing || !analysis.fix?.code}
                className="bg-red-gradient text-white px-8 py-3 rounded-xl font-mono font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 cyber-glow disabled:cyber-glow-none flex items-center space-x-2"
              >
                {testing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>[TESTING...]</span>
                  </>
                ) : (
                  <>
                    <span className="text-cyber-red">[</span>
                    <span>TEST_FIX</span>
                    <span className="text-cyber-red">]</span>
                  </>
                )}
              </button>
              {testResult && (
                <div
                  className={`px-6 py-3 rounded-xl font-mono font-bold shadow-md animate-fadeIn cyber-glow ${
                    testResult.status === 'likely_fixed'
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                      : 'bg-red-gradient text-white'
                  }`}
                >
                  {testResult.status === 'likely_fixed' ? '[✓]' : '[✗]'} {testResult.message}
                </div>
              )}
            </div>
            <div className="mt-6 flex items-center space-x-4 flex-wrap">
              <div className={`px-4 py-2 rounded-full font-mono font-bold text-sm shadow-md cyber-glow ${
                analysis.difficulty === 'easy'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                  : analysis.difficulty === 'medium'
                  ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white'
                  : 'bg-red-gradient text-white'
              }`}>
                [DIFFICULTY: {analysis.difficulty?.toUpperCase()}]
              </div>
              {analysis.skill_score_delta && (
                <div className="px-4 py-2 rounded-full font-mono font-bold text-sm bg-red-gradient text-white shadow-md cyber-glow">
                  [SKILL: {analysis.skill_score_delta > 0 ? '+' : ''}{analysis.skill_score_delta}]
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'why' && (
          <div className="animate-fadeIn">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center font-mono">
              <span className="mr-2 text-cyber-red">[</span>
              WHY_FIX_WORKS
              <span className="ml-2 text-cyber-red">]</span>
            </h3>
              <div className="bg-cyber-gray rounded-xl p-6 border border-cyber-red/40">
              <p className="text-gray-300 leading-relaxed whitespace-pre-line text-base font-mono">
                {'>'} {analysis.why_fix_works}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'flow' && (
          <div className="animate-fadeIn space-y-6">
            <ErrorFlowChart analysis={analysis} />
            {analysis.visual_flow && (
              <div className="bg-cyber-gray rounded-xl p-6 border border-cyber-red/40">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center font-mono">
                  <span className="mr-2 text-cyber-red">[</span>
                  TEXT_FLOW_DESCRIPTION
                  <span className="ml-2 text-cyber-red">]</span>
                </h3>
                <div className="terminal p-6 rounded-xl">
                  <pre className="text-cyber-red whitespace-pre-line font-mono text-sm leading-relaxed">
                    {analysis.visual_flow}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="animate-fadeIn">
            <ErrorQuiz errorLogId={errorLogId} analysis={analysis} onQuizComplete={onQuizComplete} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorAnalysis;

