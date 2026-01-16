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
    <div className="min-h-screen relative bg-white">
      {/* Navbar */}
      <nav className="shadow-lg border-b border-gray-200 backdrop-blur-lg relative z-10 bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-extrabold font-mono gradient-text hover:scale-105 transition-transform text-green-600">
                <span className="text-green-600">[</span>AI_DEBUG_MENTOR<span className="text-green-600">]</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 font-mono">
                <span className="text-sm text-gray-700">[SKILL]:</span>
                <span className="font-bold text-green-600">
                  {user?.skillScore || 0}/100
                </span>
              </div>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-mono font-bold ${
                    location.pathname === '/admin'
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'text-gray-700 hover:text-white hover:bg-green-600 border border-green-300'
                  }`}
                >
                  [ADMIN]
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-mono font-bold text-gray-700 hover:text-white hover:bg-green-600 rounded-md border border-green-300 hover:border-green-600 transition-all"
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

