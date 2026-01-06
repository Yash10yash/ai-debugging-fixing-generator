import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black flex items-center justify-center px-4 relative z-10" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(220, 20, 60, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(220, 20, 60, 0.1) 0%, transparent 50%)'}}>
      <div className="max-w-md w-full glass rounded-2xl shadow-2xl p-8 border border-cyber-red/40 animate-fadeIn relative z-10">
        <div className="text-center mb-8">
          <div className="bg-cyber-red p-4 rounded-2xl inline-block mb-4 cyber-glow">
            <span className="text-4xl">⚡</span>
          </div>
          <h1 className="text-4xl font-extrabold font-mono text-white mb-2 cyber-glow-text">
            <span className="text-cyber-red">[</span>AI_DEBUG_MENTOR<span className="text-cyber-red">]</span>
          </h1>
          <p className="text-gray-300 font-mono">{'>'} Login to continue learning</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-gradient backdrop-blur-sm border border-cyber-red text-white rounded-xl shadow-lg animate-fadeIn cyber-glow">
            <div className="flex items-center font-mono">
              <span className="mr-2">[✗]</span>
              <span className="font-bold">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              📧 Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-cyber-red/30 bg-cyber-gray backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-cyber-red focus:border-cyber-red text-white placeholder-gray-500 transition-all font-mono"
              placeholder="> your@email.com"
              style={{ color: '#ffffff' }}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              🔒 Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-cyber-red/30 bg-cyber-gray backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-cyber-red focus:border-cyber-red text-white placeholder-gray-500 transition-all font-mono"
              placeholder="> ••••••••"
              style={{ color: '#ffffff' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-gradient text-white py-3 px-4 rounded-xl font-mono font-bold text-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 cyber-glow disabled:cyber-glow-none flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>[LOGGING_IN...]</span>
              </>
            ) : (
              <>
                <span className="text-cyber-red">[</span>
                <span>LOGIN</span>
                <span className="text-cyber-red">]</span>
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-300 font-mono">
          {'>'} Don't have an account?{' '}
          <Link to="/signup" className="text-cyber-red font-bold hover:underline hover:text-cyber-red-light transition-colors cyber-glow-text">
            [SIGN_UP]
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

