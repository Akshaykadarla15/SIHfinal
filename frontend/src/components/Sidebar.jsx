import React from 'react';
import {
  LayoutDashboard,
  Map,
  CloudRain,
  Waves,
  Activity,
  Sliders,
  AlertTriangle,
  History,
  ShieldAlert,
  FileText,
  HelpCircle
} from 'lucide-react';
import { useFlood } from '../context/FloodContext';

export const Sidebar = ({ activeTab, onTabChange }) => {
  const { notificationCount } = useFlood();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Flood Risk Map', icon: Map, highlight: true },
    { id: 'rainfall', label: 'Live Rainfall', icon: CloudRain },
    { id: 'drainage', label: 'Drainage Status', icon: Waves },
    { id: 'predictions', label: 'AI Predictions', icon: Activity },
    { id: 'simulation', label: 'Scenario Simulator', icon: Sliders, badge: 'DEMO' },
    { id: 'alerts', label: 'Active Alerts', icon: AlertTriangle, count: notificationCount },
    { id: 'historical', label: 'Historical Data', icon: History },
    { id: 'public-warning', label: 'Public Portal', icon: ShieldAlert },
    { id: 'reports', label: 'Reports & Export', icon: FileText }
  ];

  return (
    <aside style={{
      width: '240px',
      background: '#ffffff',
      borderRight: '1px solid var(--border-color)',
      padding: '20px 12px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      flexShrink: 0
    }}>
      <div>
        <div style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          color: '#94a3b8',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          padding: '0 12px 10px 12px'
        }}>
          Navigation Menu
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive ? '#e0f2fe' : 'transparent',
                  color: isActive ? '#0369a1' : '#475569',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={18} color={isActive ? '#0284c7' : '#64748b'} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span style={{
                    background: '#fed7aa',
                    color: '#9a3412',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    {item.badge}
                  </span>
                )}

                {item.count > 0 && (
                  <span style={{
                    background: '#ef4444',
                    color: '#fff',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '999px'
                  }}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info / Hackathon Credential box */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '12px',
        fontSize: '0.75rem',
        color: '#64748b'
      }}>
        <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <HelpCircle size={14} color="#0284c7" />
          <span>Smart India Hackathon</span>
        </div>
        <div>Urban Flood Nowcasting System prototype designed for municipal disaster authorities.</div>
      </div>
    </aside>
  );
};
