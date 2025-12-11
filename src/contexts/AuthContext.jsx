import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'light';
  });

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const userData = localStorage.getItem('userData');
    const savedTheme = localStorage.getItem('app-theme') || 'light';

    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const login = async (username, password) => {
    // MOCK LOGIN FOR FRONTEND DEV
    console.log("Mocking login for:", username);

    // Create a mock user based on username or default to Admin
    const mockUser = {
      id: 1,
      username: username || 'admin',
      fullName: 'Quantum Admin',
      role: 'Admin', // Default to Admin to allow access to everything
      email: 'admin@quantum.tech'
    };

    // Fake token
    const mockToken = "mock-jwt-token-for-dev";

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      localStorage.setItem('jwt', mockToken);
      localStorage.setItem('userData', JSON.stringify(mockUser));

      api.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;

      setUser(mockUser);
      setIsAuthenticated(true);

      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Mock login error:', error);
      return {
        success: false,
        message: 'Mock login failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userData');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const isAdmin = () => hasRole('Admin');
  const isManager = () => hasRole('Manager');
  const isSales = () => hasRole('Sales');
  const isAdminOrManager = () => isAdmin() || isManager();

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    hasRole,
    isAdmin,
    isManager,
    isSales,
    isAdminOrManager,
    theme,
    toggleTheme
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};