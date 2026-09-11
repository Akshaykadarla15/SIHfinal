import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext();

export const DEMO_ACCOUNTS = {
  admin: {
    email: 'admin@flood.ai',
    password: 'admin123',
    role: 'admin',
    name: 'Shri R. K. Sharma',
    badge: 'Municipal Disaster Authority Lead'
  },
  officer: {
    email: 'officer@flood.ai',
    password: 'officer123',
    role: 'officer',
    name: 'Insp. Vikram Rao',
    badge: 'Zonal Field Response Unit'
  },
  public: {
    email: 'user@flood.ai',
    password: 'user123',
    role: 'public',
    name: 'Ananya Reddy',
    badge: 'Resident / Citizen'
  }
};

export const AuthProvider = ({ children }) => {
  // Start with Admin role for full administrative demonstration
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('flood_user');
    return saved ? JSON.parse(saved) : DEMO_ACCOUNTS.admin;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('flood_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const user = await apiService.login(email, password);
      setCurrentUser(user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const switchRole = (roleKey) => {
    if (DEMO_ACCOUNTS[roleKey]) {
      setCurrentUser(DEMO_ACCOUNTS[roleKey]);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('flood_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, switchRole, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
