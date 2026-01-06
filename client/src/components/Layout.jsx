import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen relative">
      {/* Navbar */}
      <nav className="glass shadow-lg border-b border-cyber-red/40 backdrop-blur-lg relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-extrabold font-mono gradient-text hover:scale-105 transition-transform cyber-glow-text">
                <span className="text-cyber-red">[</span>AI_DEBUG_MENTOR<span className="text-cyber-red">]</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 font-mono">
                <span className="text-sm text-white">[SKILL]:</span>
                <span className="font-bold text-cyber-red cyber-glow-text">
                  {user?.skillScore || 0}/100
                </span>
              </div>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-mono font-bold ${
                    location.pathname === '/admin'
                      ? 'bg-cyber-red text-white cyber-glow'
                      : 'text-white hover:text-cyber-red hover:bg-cyber-gray border border-cyber-red/40'
                  }`}
                >
                  [ADMIN]
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-mono font-bold text-white hover:text-cyber-red hover:bg-cyber-gray rounded-md border border-cyber-red/40 hover:border-cyber-red transition-all"
              >
                [LOGOUT]
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

