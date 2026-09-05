import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/api';
import confetti from 'canvas-confetti';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sweetbite_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('sweetbite_token') || '';
    } catch {
      return '';
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register'

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('sweetbite_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('sweetbite_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    try {
      if (token) {
        localStorage.setItem('sweetbite_token', token);
      } else {
        localStorage.removeItem('sweetbite_token');
      }
    } catch (e) {
      console.error(e);
    }
  }, [token]);

  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    setUser(data.user);
    setToken(data.token);
    setIsAuthModalOpen(false);
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#b67c26', '#d64069', '#3d2314']
    });
    return data;
  };

  const register = async (fullName, email, password, phone = '', address = '') => {
    const data = await registerUser({ fullName, email, password, phone, address });
    setUser(data.user);
    setToken(data.token);
    setIsAuthModalOpen(false);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#b67c26', '#d64069', '#3d2314', '#ffe1db']
    });
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken('');
    setIsOrdersModalOpen(false);
    setIsAdminModalOpen(false);
  };

  const openAuthModal = (tab = 'login') => {
    setAuthTab(tab);
    setIsAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'Admin',
        login,
        register,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isOrdersModalOpen,
        setIsOrdersModalOpen,
        isAdminModalOpen,
        setIsAdminModalOpen,
        authTab,
        setAuthTab,
        openAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
