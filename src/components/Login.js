import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/proposals';
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(username, password);
      
      if (result.success) {
        window.location.href = '/proposals';
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const credentials = {
      Admin: { username: 'admin', password: 'admin123' },
      Sales: { username: 'salesuser', password: 'sales123' },
      Manager: { username: 'manager', password: 'manager123' }
    };
    
    const cred = credentials[role];
    if (cred) {
      setUsername(cred.username);
      setPassword(cred.password);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-logo">
          <div className="logo-section">
            <img src="/logo-agaron.jpg" alt="Agaron Solutions & Technology" className="logo" />
            <div className="company-info">
              <h1>AGARON CHAT SALE</h1>
              <p>SOLUTION & TECHNOLOGY</p>
            </div>
          </div>
        </div>
        
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
          
          {error && (
            <div className="error-message" style={{ marginTop: '16px' }}>
              {error}
            </div>
          )}
        </form>

        {/* Demo Login Buttons #### ******* it should be removed after tests */}
       
        <div className="demo-login-section">
          <h3>Demo Accounts</h3>
          <div className="demo-buttons">
            <button
              type="button"
              className="btn-demo admin"
              onClick={() => handleDemoLogin('Admin')}
              disabled={isLoading}
            >
              Admin Demo
            </button>
            <button
              type="button"
              className="btn-demo manager"
              onClick={() => handleDemoLogin('Manager')}
              disabled={isLoading}
            >
              Manager Demo
            </button>
            <button
              type="button"
              className="btn-demo sales"
              onClick={() => handleDemoLogin('Sales')}
              disabled={isLoading}
            >
              Sales Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;