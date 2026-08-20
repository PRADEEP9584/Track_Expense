import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/me');
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.error("Fetch current user error:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/user/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (name, email, password) => {
    const res = await api.post('/user/register', { name, email, password });
    if (res.data.success) {
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  const updateProfile = async (name, email) => {
    const res = await api.put('/user/profile', { name, email });
    if (res.data.success) {
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Profile update failed');
  };

  const updatePassword = async (currentPassword, newPassword) => {
    const res = await api.put('/user/password', { currentPassword, newPassword });
    if (res.data.success) {
      return res.data;
    }
    throw new Error(res.data.message || 'Password update failed');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      updateProfile,
      updatePassword,
      refreshUser: fetchCurrentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
