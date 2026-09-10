import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { FloodProvider, useFlood } from './context/FloodContext';
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

const MainContent = () => {
  const [activeTab, setActiveTab] = useState('landing');
  const { explainZone, setExplainZone } = useFlood();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage onNavigate={(tab) => setActiveTab(tab)} />;
      case 'dashboard':
        return <DashboardPage onNavigate={(tab) => setActiveTab(tab)} />;
      case 'map':
        return <FloodMapPage />;
      case 'rainfall':
        return <RainfallPage />;
      case 'drainage':
        return <DrainagePage />;
      case 'predictions':
        return <PredictionsPage />;
      case 'simulation':
        return <SimulationPage onNavigate={(tab) => setActiveTab(tab)} />;
      case 'alerts':
        return <AlertsPage />;
      case 'public-warning':
        return <PublicWarningPage />;
      case 'historical':
        return <HistoricalPage />;
      case 'reports':
        return <ReportsPage />;
      case 'login':
        return <LoginPage onLoginSuccess={() => setActiveTab('dashboard')} />;
      default:
        return <DashboardPage onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="app-layout">
      <Header
        onOpenAlerts={() => setActiveTab('alerts')}
        onOpenLogin={() => setActiveTab('login')}
      />

      <DemoBanner />

      <div className="main-body">
        <Sidebar activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

        <main className="content-container">
          {renderActivePage()}
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
      <FloodProvider>
        <MainContent />
      </FloodProvider>
    </AuthProvider>
  );
}
