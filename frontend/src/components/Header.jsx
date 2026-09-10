import React, { useState, useEffect } from 'react';
import { useFlood } from '../context/FloodContext';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { CloudRain, Bell, MapPin, Shield, Zap, RotateCcw, ChevronDown, UserCheck, AlertTriangle } from 'lucide-react';

export const Header = ({ onOpenAlerts, onOpenLogin }) => {
  const { city, setCity, notificationCount, isSimulatingRainfall, triggerHeavyRainfall, resetSimulation } = useFlood();
  const { currentUser, switchRole } = useAuth();
  const [currentTime, setCurrentTime] = useState('');
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) + ' IST');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const cities = [
    { name: 'Hyderabad', label: 'Hyderabad, Telangana' },
    { name: 'Mumbai', label: 'Mumbai, Maharashtra' },
    { name: 'Delhi', label: 'New Delhi, NCR' },
    { name: 'Chennai', label: 'Chennai, Tamil Nadu' }
  ];

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid var(--border-color)',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
    }}>
      {/* Brand Logo & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 4px 8px rgba(2, 132, 199, 0.25)'
        }}>
          <CloudRain size={24} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              Urban Flood Nowcasting System
            </h1>
            <span style={{
              background: '#e0f2fe',
              color: '#0369a1',
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '999px',
              border: '1px solid #bae6fd',
              textTransform: 'uppercase'
            }}>
              SIH 2024 AI Prototype
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Live Early Warning & Flash Flood Nowcasting</span>
            <span>•</span>
            <span style={{ fontWeight: 600, color: '#334155' }}>{currentTime}</span>
          </div>
        </div>
      </div>

      {/* Center Controls: City Selector & Simulation Trigger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* City Selector */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          padding: '6px 12px',
          borderRadius: '8px'
        }}>
          <MapPin size={16} color="#0284c7" />
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>City:</span>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: '#0f172a',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {cities.map(c => (
              <option key={c.name} value={c.name}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Demo Heavy Rain Toggle Button */}
        {!isSimulatingRainfall ? (
          <button
            onClick={triggerHeavyRainfall}
            title="Simulates severe cloudburst (105 mm/hr) across the city to demonstrate instant AI nowcasting"
            style={{
              background: '#fff7ed',
              border: '1px solid #fdba74',
              color: '#c2410c',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <Zap size={15} color="#ea580c" />
            <span>Simulate Heavy Rainfall</span>
          </button>
        ) : (
          <button
            onClick={resetSimulation}
            style={{
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              color: '#b91c1c',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RotateCcw size={15} color="#dc2626" />
            <span>Reset Simulation</span>
          </button>
        )}
      </div>

      {/* Right Controls: Notifications & Role Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Persistent "Viewing as" Role Chip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '999px',
          fontSize: '0.74rem',
          fontWeight: 700,
          background: currentUser?.role === 'admin' ? '#e0f2fe' : (currentUser?.role === 'officer' ? '#ccfbf1' : '#dcfce7'),
          border: `1px solid ${currentUser?.role === 'admin' ? '#bae6fd' : (currentUser?.role === 'officer' ? '#99f6e4' : '#bbf7d0')}`,
          color: currentUser?.role === 'admin' ? '#0369a1' : (currentUser?.role === 'officer' ? '#0f766e' : '#15803d')
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: currentUser?.role === 'admin' ? '#0284c7' : (currentUser?.role === 'officer' ? '#0d9488' : '#16a34a')
          }} />
          <span>
            Viewing as: <strong>{currentUser?.role === 'admin' ? 'Admin Authority' : (currentUser?.role === 'officer' ? 'Field Officer' : 'Public Citizen')}</strong>
          </span>
        </div>

        {/* Alerts Bell */}
        <button
          onClick={onOpenAlerts}
          style={{
            position: 'relative',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="View Emergency Alerts"
        >
          <Bell size={18} color="#475569" />
          {notificationCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#ef4444',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 800,
              borderRadius: '999px',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {notificationCount}
            </span>
          )}
        </button>

        {/* User Role Switcher */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#f1f5f9',
              border: `1px solid ${currentUser?.role === 'admin' ? '#bae6fd' : (currentUser?.role === 'officer' ? '#99f6e4' : '#bbf7d0')}`,
              padding: '5px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: currentUser?.role === 'admin' ? '#0284c7' : (currentUser?.role === 'officer' ? '#0d9488' : '#16a34a'),
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.75rem'
            }}>
              {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                {currentUser?.name || 'Demo User'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'capitalize', fontWeight: 600 }}>
                {currentUser?.badge || (currentUser?.role === 'admin' ? 'Authority (Admin)' : (currentUser?.role === 'officer' ? 'Field Officer' : 'Public Citizen'))}
              </div>
            </div>
            <ChevronDown size={14} color="#64748b" />
          </button>

          {/* Quick Role Menu Dropdown */}
          {isRoleMenuOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '45px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              width: '250px',
              padding: '8px',
              zIndex: 200
            }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, padding: '4px 8px', textTransform: 'uppercase' }}>
                Switch Demo Role:
              </div>
              {Object.entries(DEMO_ACCOUNTS).map(([key, acc]) => {
                const isSelected = currentUser?.role === key;
                const roleColor = key === 'admin' ? '#0284c7' : (key === 'officer' ? '#0d9488' : '#16a34a');
                const roleBg = key === 'admin' ? '#e0f2fe' : (key === 'officer' ? '#ccfbf1' : '#dcfce7');

                return (
                  <button
                    key={key}
                    onClick={() => {
                      switchRole(key);
                      setIsRoleMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: isSelected ? roleBg : 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isSelected ? roleColor : '#0f172a' }}>{acc.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{acc.badge}</div>
                    </div>
                    {isSelected && <UserCheck size={16} color={roleColor} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
