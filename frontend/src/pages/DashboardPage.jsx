import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminDashboardPage } from './AdminDashboardPage';
import { OfficerDashboardPage } from './OfficerDashboardPage';
import { PublicDashboardPage } from './PublicDashboardPage';

export const DashboardPage = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const role = currentUser?.role || 'admin';

  if (role === 'officer') {
    return <OfficerDashboardPage onNavigate={onNavigate} />;
  }

  if (role === 'public') {
    return <PublicDashboardPage onNavigate={onNavigate} />;
  }

  return <AdminDashboardPage onNavigate={onNavigate} />;
};
