import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FloodProvider, useFlood } from './context/FloodContext';
import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DemoBanner } from './components/DemoBanner';
import { ExplainableModal } from './components/ExplainableModal';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { FloodMapPage } from './pages/FloodMapPage';
import { RainfallPage } from './pages/RainfallPage';
import { DrainagePage } from './pages/DrainagePage';
import { PredictionsPage } from './pages/PredictionsPage';
import { SimulationPage } from './pages/SimulationPage';
import { AlertsPage } from './pages/AlertsPage';
import { PublicWarningPage } from './pages/PublicWarningPage';
import { HistoricalPage } from './pages/HistoricalPage';
import { ReportsPage } from './pages/ReportsPage';
import { LoginPage } from './pages/LoginPage';
import { FieldInspectionsPage } from './pages/FieldInspectionsPage';
import { ReportWaterloggingPage } from './pages/ReportWaterloggingPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ErrorBoundary } from './components/ErrorBoundary';

export const ROLE_PERMISSIONS = {
  admin: {
    home: 'dashboard',
    allowed: ['landing', 'dashboard', 'map', 'rainfall', 'drainage', 'predictions', 'simulation', 'alerts', 'historical', 'reports', 'login']
  },
  officer: {
    home: 'dashboard',
    allowed: ['landing', 'dashboard', 'map', 'drainage', 'alerts', 'field-inspections', 'login']
  },
  public: {
    home: 'public-warning',
    allowed: ['landing', 'public-warning', 'map', 'report-waterlogging', 'reports', 'login']
  }
};

const MainContent = () => {
  const { currentUser } = useAuth();
  const role = currentUser?.role || 'admin';
  const roleConfig = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.admin;

  const [activeTab, setActiveTab] = useState(() => roleConfig.home);
  const { explainZone, setExplainZone } = useFlood();

  // Route gating: if role changes or activeTab is not allowed, redirect to role home
  useEffect(() => {
    if (!roleConfig.allowed.includes(activeTab)) {
      setActiveTab(roleConfig.home);
    }
  }, [role, roleConfig]);

  const handleNavigate = (tab) => {
    if (roleConfig.allowed.includes(tab)) {
      setActiveTab(tab);
    } else {
      setActiveTab(roleConfig.home);
    }
  };

  const renderActivePage = () => {
    // Gate activeTab against allowed set even if state was manually altered
    const currentTab = roleConfig.allowed.includes(activeTab) ? activeTab : roleConfig.home;

    switch (currentTab) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'map':
        return <FloodMapPage />;
      case 'rainfall':
        return <RainfallPage />;
      case 'drainage':
        return <DrainagePage />;
      case 'predictions':
        return <PredictionsPage />;
      case 'simulation':
        return <SimulationPage onNavigate={handleNavigate} />;
      case 'alerts':
        return <AlertsPage />;
      case 'public-warning':
        return <PublicWarningPage onNavigate={handleNavigate} />;
      case 'historical':
        return <HistoricalPage />;
      case 'reports':
        return <ReportsPage />;
      case 'field-inspections':
        return <FieldInspectionsPage />;
      case 'report-waterlogging':
        return <ReportWaterloggingPage />;
      case 'login':
        return <LoginPage onLoginSuccess={() => setActiveTab(roleConfig.home)} />;
      default:
        return <NotFoundPage activeTab={activeTab} onNavigate={handleNavigate} defaultTab={roleConfig.home} />;
    }
  };

  return (
    <div className="app-layout">
      <Header
        onOpenAlerts={() => handleNavigate('alerts')}
        onOpenLogin={() => handleNavigate('login')}
      />

      <DemoBanner />

      <div className="main-body">
        <Sidebar activeTab={activeTab} onTabChange={handleNavigate} />

        <main className="content-container">
          <ErrorBoundary onReset={() => setActiveTab(roleConfig.home)}>
            {renderActivePage()}
          </ErrorBoundary>
        </main>
      </div>

      {/* Explainable AI Modal */}
      <ExplainableModal
        zone={explainZone}
        isOpen={Boolean(explainZone)}
        onClose={() => setExplainZone(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <FloodProvider>
          <MainContent />
        </FloodProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
