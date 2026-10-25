import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('sahrdaya_auth_user');
      return savedUser && savedUser !== 'undefined' ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('sahrdaya_auth_token');
      if (token) {
        try {
          const res = await authService.getProfile();
          if (res.user) {
            setUser(res.user);
            localStorage.setItem('sahrdaya_auth_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('[AuthContext] Session expired or invalid token:', err.message);
          localStorage.removeItem('sahrdaya_auth_token');
          localStorage.removeItem('sahrdaya_auth_user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    setError(null);
    try {
      const res = await authService.login(credentials);
      if (res.token) {
        localStorage.setItem('sahrdaya_auth_token', res.token);
      }
      if (res.user) {
        localStorage.setItem('sahrdaya_auth_user', JSON.stringify(res.user));
        setUser(res.user);
      }
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const res = await authService.register(userData);
      if (res.token) {
        localStorage.setItem('sahrdaya_auth_token', res.token);
      }
      if (res.user) {
        localStorage.setItem('sahrdaya_auth_user', JSON.stringify(res.user));
        setUser(res.user);
      }
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('sahrdaya_auth_token');
    localStorage.removeItem('sahrdaya_auth_user');
    setUser(null);
    setError(null);
  };

  const updateProfile = async (data) => {
    try {
      const res = await authService.updateProfile(data);
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('sahrdaya_auth_user', JSON.stringify(res.user));
      }
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const isOrganizer = user?.role === 'organizer' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        isOrganizer,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
