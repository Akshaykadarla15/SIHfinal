import React from 'react';
import { X, Brain, CheckCircle2, AlertTriangle, Shield, Clock, HelpCircle } from 'lucide-react';

export const ExplainableModal = ({ zone, isOpen, onClose }) => {
  if (!isOpen || !zone) return null;

  const xai = zone.xai_factors || {
    heavy_rainfall: 75.0,
    drainage_overload: 68.0,
    low_elevation: 64.0,
    historical_risk: 72.0,
    impervious_surface: 70.0
  };

  const factorItems = [
    { label: "Heavy Rainfall Deluge", value: xai.heavy_rainfall, description: `Current intensity: ${zone.rainfall_rate} mm/hr (Forecast: ${zone.forecast_rainfall} mm/hr)`, color: "#0284c7" },
    { label: "Drainage Overload Saturation", value: xai.drainage_overload, description: `Utilization: ${zone.drainage_utilization}% (Blockage: ${zone.drainage_blockage || 0}%)`, color: "#ea580c" },
    { label: "Low Terrain Elevation & Slope", value: xai.low_elevation, description: `Elevation: ${zone.elevation}m above sea level (Slope: ${zone.slope || 1.5}%)`, color: "#d97706" },
    { label: "Historical Flood Susceptibility", value: xai.historical_risk, description: "Frequency of past waterlogging incidents in monsoon records", color: "#7c3aed" },
    { label: "Impervious Concrete Surface Cover", value: xai.impervious_surface, description: "High runoff coefficient due to dense urban development", color: "#475569" }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '14px',
        width: '100%',
        maxWidth: '620px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Brain size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>
                Why is {zone.name} at risk?
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Explainable AI (XAI) Hydrological Factor Attribution
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '22px 24px', maxHeight: '75vh', overflowY: 'auto' }}>
          {/* Quick Metrics Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '20px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '12px 16px'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Flood Probability</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: zone.flood_probability >= 75 ? '#dc2626' : (zone.flood_probability >= 50 ? '#ea580c' : '#0284c7') }}>
                {zone.flood_probability}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Risk Level</div>
              <div style={{ marginTop: '2px' }}>
                <span className={`badge-${zone.risk_level.toLowerCase()}`}>
                  {zone.risk_level}
                </span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Expected Time</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                <Clock size={14} />
                <span>{zone.predicted_time}</span>
              </div>
            </div>
          </div>

          {/* Factor Breakdown Bars */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Primary Risk Contribution Drivers</span>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 400 }}>(Random Forest Feature Impact)</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {factorItems.map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>{item.label}</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: item.color }}>{item.value}%</span>
                  </div>
                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${item.value}%`,
                      height: '100%',
                      background: item.color,
                      borderRadius: '4px',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                    {item.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendation Section */}
          <div style={{
            background: zone.risk_level === 'Critical' ? '#fef2f2' : (zone.risk_level === 'High' ? '#fff7ed' : '#eff6ff'),
            border: `1px solid ${zone.risk_level === 'Critical' ? '#fca5a5' : (zone.risk_level === 'High' ? '#fdba74' : '#bfdbfe')}`,
            borderRadius: '10px',
            padding: '14px 16px'
          }}>
            <div style={{
              fontWeight: 700,
              fontSize: '0.85rem',
              color: zone.risk_level === 'Critical' ? '#991b1b' : (zone.risk_level === 'High' ? '#9a3412' : '#1e40af'),
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Shield size={16} />
              <span>Recommended Authority Action</span>
            </div>
            <div style={{
              fontSize: '0.82rem',
              color: zone.risk_level === 'Critical' ? '#7f1d1d' : (zone.risk_level === 'High' ? '#7c2d12' : '#1e3a8a'),
              lineHeight: 1.4
            }}>
              {zone.recommended_action}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '12px 24px',
          borderTop: '1px solid #e2e8f0',
          background: '#f8fafc',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ fontSize: '0.85rem' }}
          >
            Close Explanation
          </button>
        </div>
      </div>
    </div>
  );
};
