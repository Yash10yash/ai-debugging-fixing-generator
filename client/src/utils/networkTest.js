// Network connectivity test utility
export const testNetworkConnection = async () => {
  const results = {
    backend: false,
    apiHealth: false,
    error: null,
  };

  try {
    // Test backend connection
    const response = await fetch('http://localhost:5000/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      results.backend = true;
      results.apiHealth = data.status === 'ok';
      results.mongodb = data.mongodb;
    } else {
      results.error = `Backend returned status: ${response.status}`;
    }
  } catch (error) {
    results.error = error.message;
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      results.error = 'Cannot connect to backend server. Make sure the server is running on port 5000.';
    } else if (error.message.includes('CORS')) {
      results.error = 'CORS error. Check server CORS configuration.';
    }
  }

  return results;
};

export const getNetworkStatus = async () => {
  const status = await testNetworkConnection();
  
  if (!status.backend) {
    return {
      connected: false,
      message: status.error || 'Backend server is not reachable',
      suggestion: 'Make sure the backend server is running: cd server && npm start',
    };
  }

  if (!status.apiHealth) {
    return {
      connected: false,
      message: 'Backend is reachable but API is not healthy',
      suggestion: 'Check server logs for errors',
    };
  }

  return {
    connected: true,
    message: 'Network connection is working',
    mongodb: status.mongodb,
  };
};

