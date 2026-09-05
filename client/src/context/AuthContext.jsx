import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('pulsewatch_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await authAPI.getMe();
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Auth validation failed, logging out:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.token) {
      localStorage.setItem('pulsewatch_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    if (res.data.token) {
      localStorage.setItem('pulsewatch_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res.data;
  };

  const demoLogin = async () => {
    try {
      return await login('demo@pulsewatch.io', 'Password123!');
    } catch (err) {
      // If demo user doesn't exist yet, register demo user
      return await register('Demo Trader', 'demo@pulsewatch.io', 'Password123!');
    }
  };

  const logout = () => {
    localStorage.removeItem('pulsewatch_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
