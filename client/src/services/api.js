import axios from 'axios';

// Use environment variable for production, fallback to proxy for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Configure axios defaults
axios.defaults.timeout = 30000; // 30 second timeout
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor for debugging and auth
axios.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const backendUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    
    // Handle network errors
    if (error.code === 'ECONNREFUSED' || 
        error.message?.includes('Network Error') || 
        error.message?.includes('Failed to fetch') ||
        error.code === 'ERR_NETWORK') {
      
      // Check if it's a Render service (might be sleeping)
      if (backendUrl.includes('render.com')) {
        error.message = `Cannot connect to backend. The Render service might be sleeping (free tier). Please wait 30-60 seconds and try again, or check https://ai-debugging-fixing-generator.onrender.com/api/health`;
      } else {
        error.message = `Cannot connect to server. Make sure the backend is running at ${backendUrl}.`;
      }
    }
    
    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      error.message = `Request timed out. The backend might be slow to respond. Please try again.`;
    }
    
    // Handle CORS errors
    if (error.message?.includes('CORS') || error.response?.status === 0) {
      error.message = `CORS error. The backend might not be allowing requests from this origin. Check backend CORS configuration.`;
    }
    
    console.error('[API] Response error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
      backendUrl: backendUrl
    });
    
    return Promise.reject(error);
  }
);

export const analyzeError = async (errorInput, errorType, experienceLevel = 'beginner', language = 'hinglish') => {
  const response = await axios.post(`${API_BASE_URL}/error/analyze`, {
    errorInput,
    errorType,
    experienceLevel,
    language,
  });
  return response.data;
};

export const testFix = async (errorLogId, errorInput, fixCode, errorType) => {
  const response = await axios.post(`${API_BASE_URL}/error/test-fix`, {
    errorLogId,
    errorInput,
    fixCode,
    errorType,
  });
  return response.data;
};

export const getErrorHistory = async (page = 1, limit = 10) => {
  const response = await axios.get(`${API_BASE_URL}/error/history`, {
    params: { page, limit },
  });
  return response.data;
};

export const getUserProfile = async () => {
  const response = await axios.get(`${API_BASE_URL}/user/profile`);
  return response.data;
};

export const getSkillScore = async () => {
  const response = await axios.get(`${API_BASE_URL}/user/skill-score`);
  return response.data;
};

export const getAdminDashboard = async () => {
  const response = await axios.get(`${API_BASE_URL}/admin/dashboard`);
  return response.data;
};

export const getAdminUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/admin/users`);
  return response.data;
};

export const getAdminErrors = async (page = 1, limit = 50) => {
  const response = await axios.get(`${API_BASE_URL}/admin/errors`, {
    params: { page, limit },
  });
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
  return response.data;
};

export const signupUser = async (name, email, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/signup`, { name, email, password });
  return response.data;
};

export const logoutUser = async () => {
  const response = await axios.post(`${API_BASE_URL}/auth/logout`);
  return response.data;
};

export const checkAuth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/check`);
    return response.data;
  } catch (error) {
    return { isAuthenticated: false, user: null };
  }
};

export const getHealthStatus = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 10000, // 10 second timeout for health check
    });
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    const backendUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    
    let message = 'Backend unreachable';
    if (backendUrl.includes('render.com')) {
      message = 'Backend might be sleeping (Render free tier). First request may take 30-60 seconds to wake up.';
    } else if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
      message = 'Cannot connect to backend server';
    } else if (error.code === 'ECONNABORTED') {
      message = 'Backend is taking too long to respond';
    }
    
    return { 
      status: 'error', 
      message,
      error: error.message,
      backendUrl: backendUrl
    };
  }
};

export const generateQuiz = async (errorLogId, numQuestions, analysis) => {
  const response = await axios.post(`${API_BASE_URL}/error/quiz/generate`, {
    errorLogId,
    numQuestions,
    analysis,
  });
  return response.data.questions;
};

export const submitQuizAnswer = async (errorLogId, questionIndex, selectedAnswer, isCorrect) => {
  const response = await axios.post(`${API_BASE_URL}/error/quiz/answer`, {
    errorLogId,
    questionIndex,
    selectedAnswer,
    isCorrect,
  });
  return response.data;
};

export const completeQuiz = async (errorLogId, score, totalQuestions) => {
  const response = await axios.post(`${API_BASE_URL}/error/quiz/complete`, {
    errorLogId,
    score,
    totalQuestions,
  });
  return response.data;
};

export const updateExperienceLevel = async (experienceLevel) => {
  const response = await axios.patch(`${API_BASE_URL}/user/experience-level`, {
    experienceLevel,
  });
  return response.data;
};

export const updateLanguage = async (language) => {
  const response = await axios.patch(`${API_BASE_URL}/user/language`, {
    language,
  });
  return response.data;
};
