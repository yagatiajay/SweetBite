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
      colors: ['#b67824', '#e2a348', '#382015', '#faeed9']
    });
    return data;
  };

  const register = async (arg1, emailArg, passwordArg, phoneArg = '', addressArg = '') => {
    let payload;
    if (typeof arg1 === 'object' && arg1 !== null) {
      payload = arg1;
    } else {
      payload = {
        fullName: arg1,
        email: emailArg,
        password: passwordArg,
        phone: phoneArg,
        address: addressArg
      };
    }
    const data = await registerUser(payload);
    setUser(data.user);
    setToken(data.token);
    setIsAuthModalOpen(false);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#b67824', '#e2a348', '#382015', '#fef3e7']
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

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
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
        openAuthModal,
        closeAuthModal,
        isOrdersModalOpen,
        setIsOrdersModalOpen,
        isAdminModalOpen,
        setIsAdminModalOpen,
        authTab,
        setAuthTab
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
