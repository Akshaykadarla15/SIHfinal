import React from 'react';
import { useFlood } from '../context/FloodContext';
import { Zap, RotateCcw, AlertTriangle, Info } from 'lucide-react';

export const DemoBanner = () => {
  const { isSimulatingRainfall, triggerHeavyRainfall, resetSimulation, city } = useFlood();

  return (
    <div style={{
      background: isSimulatingRainfall ? '#fef2f2' : '#f0f9ff',
      borderBottom: `1px solid ${isSimulatingRainfall ? '#fca5a5' : '#bae6fd'}`,
      padding: '8px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '0.82rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{
          background: isSimulatingRainfall ? '#ef4444' : (city === 'Hyderabad' ? '#059669' : '#0284c7'),
          color: '#ffffff',
          fontWeight: 800,
          fontSize: '0.68rem',
          padding: '2px 8px',
          borderRadius: '4px',
          letterSpacing: '0.04em'
        }}>
          {isSimulatingRainfall ? 'SIMULATION ACTIVE' : (city === 'Hyderabad' ? 'LIVE TELEMETRY' : 'DEMO MODE')}
        </span>

        <span style={{ color: isSimulatingRainfall ? '#991b1b' : '#0369a1', fontWeight: 600 }}>
          {isSimulatingRainfall
            ? `Active Scenario: Extreme 105 mm/hr Cloudburst simulated across ${city}. AI nowcasting recalculated risks.`
            : (city === 'Hyderabad'
                ? 'Hyderabad: Live weather data (Open-Meteo API) · Mumbai / Delhi / Chennai: Calibrated synthetic demo data'
                : `${city}: Calibrated synthetic demo data · Hyderabad: Live weather data (Open-Meteo API)`)}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {!isSimulatingRainfall ? (
          <button
            onClick={triggerHeavyRainfall}
            style={{
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '5px 12px',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 4px rgba(2, 132, 199, 0.2)'
            }}
          >
            <Zap size={13} />
            <span>Simulate Heavy Rainfall (105 mm/hr)</span>
          </button>
        ) : (
          <button
            onClick={resetSimulation}
            style={{
              background: '#ffffff',
              color: '#b91c1c',
              border: '1px solid #fca5a5',
              borderRadius: '6px',
              padding: '5px 12px',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RotateCcw size={13} />
            <span>Reset to Baseline</span>
          </button>
        )}
      </div>
    </div>
  );
};
