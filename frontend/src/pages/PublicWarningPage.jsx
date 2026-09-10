import React, { useState } from 'react';
import { useFlood } from '../context/FloodContext';
import { ShieldAlert, Search, AlertTriangle, CheckCircle, MapPin, ExternalLink, HelpCircle, PhoneCall } from 'lucide-react';

export const PublicWarningPage = () => {
  const { dashboardData, city } = useFlood();
  const zones = dashboardData?.zones || [];

  const [selectedZoneName, setSelectedZoneName] = useState(zones[0]?.name || 'Kukatpally');

  const currentZone = zones.find(z => z.name === selectedZoneName) || zones[0] || {
    name: 'Kukatpally',
    risk_level: 'High',
    flood_probability: 78.0,
    predicted_time: '30 to 60 minutes',
    rainfall_rate: 52.0,
    reason: 'Heavy rainfall and overloaded drainage system.'
  };

  const isCritical = currentZone.risk_level === 'Critical';
  const isHigh = currentZone.risk_level === 'High';
  const isSafe = currentZone.risk_level === 'Safe';

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Search Your Locality Bar */}
      <div className="gov-card" style={{ padding: '18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: '0 0 4px 0' }}>
              Citizen Flood Early Warning & Safety Portal
            </h2>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Check live localized waterlogging advisory for your home, office, or commute in {city}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} color="#0284c7" />
            <select
              value={selectedZoneName}
              onChange={(e) => setSelectedZoneName(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#0f172a',
                background: '#ffffff',
                cursor: 'pointer'
              }}
            >
              {zones.map(z => (
                <option key={z.name} value={z.name}>{z.name} ({z.risk_level})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Public Warning Banner */}
      <div className="gov-card" style={{
        borderLeft: `6px solid ${isCritical ? '#ef4444' : (isHigh ? '#f97316' : (isSafe ? '#10b981' : '#eab308'))}`,
        padding: '24px 28px',
        background: isCritical ? '#fff8f8' : (isHigh ? '#fffaf5' : '#ffffff')
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: isCritical ? '#fef2f2' : (isHigh ? '#fff7ed' : '#ecfdf5'),
            color: isCritical ? '#dc2626' : (isHigh ? '#ea580c' : '#059669'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              Official Citizen Public Advisory
            </div>
            <h3 style={{ margin: 0, fontSize: '1.45rem', color: '#0f172a' }}>
              ⚠️ FLOOD RISK STATUS: {currentZone.name.toUpperCase()}
            </h3>
          </div>
        </div>

        {/* Status Callout Box */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '16px 20px',
          marginBottom: '20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: '0.9rem', color: '#334155', marginBottom: '12px', lineHeight: 1.6 }}>
            Your area <strong>{currentZone.name}</strong> currently has:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '12px' }}>
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Flood Risk Level</div>
              <div style={{ marginTop: '2px' }}>
                <span className={`badge-${currentZone.risk_level.toLowerCase()}`} style={{ fontSize: '0.85rem', padding: '4px 10px' }}>
                  {currentZone.risk_level.toUpperCase()}
                </span>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Expected Waterlogging</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#dc2626', marginTop: '2px' }}>
                {currentZone.predicted_time}
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Calculated Probability</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: currentZone.flood_probability >= 75 ? '#dc2626' : '#0284c7' }}>
                {currentZone.flood_probability}%
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.84rem', color: '#475569' }}>
            <strong>Reason:</strong> Heavy rainfall ({currentZone.rainfall_rate} mm/hr) and overloaded municipal drainage network.
          </div>
        </div>

        {/* Safety Recommendations Checklist */}
        <div>
          <h4 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={18} color="#059669" />
            <span>Essential Citizen Safety Precautions</span>
          </h4>

          <ul style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            fontSize: '0.88rem',
            color: '#1e293b',
            listStyle: 'none',
            padding: 0
          }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#dc2626', fontWeight: 800 }}>⛔</span>
              <span><strong>Avoid low-lying roads and subways:</strong> Water accumulates rapidly in railway underpasses.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#dc2626', fontWeight: 800 }}>🚗</span>
              <span><strong>Do not drive through standing water:</strong> 6 inches of moving water can knock you off your feet; 12 inches can float vehicles.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#0284c7', fontWeight: 800 }}>⚡</span>
              <span><strong>Stay clear of electrical junctions:</strong> Avoid open transformer boxes and submerged power cables.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#059669', fontWeight: 800 }}>📻</span>
              <span><strong>Follow official traffic advisories:</strong> Rely solely on verified municipal disaster management bulletins.</span>
            </li>
          </ul>
        </div>

        {/* Emergency Helpline Box */}
        <div style={{
          marginTop: '20px',
          background: '#f1f5f9',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.82rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
            <PhoneCall size={16} color="#0284c7" />
            <span>Disaster Emergency Operations Helpline: <strong>1070 / 112</strong></span>
          </div>
          <span style={{ color: '#64748b' }}>Municipal Monsoon Control Room 24x7</span>
        </div>
      </div>
    </div>
  );
};
