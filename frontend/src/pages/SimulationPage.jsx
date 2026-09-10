import React, { useState } from 'react';
import { useFlood } from '../context/FloodContext';
import { apiService } from '../services/api';
import { Sliders, Play, RotateCcw, AlertTriangle, Shield, CheckCircle, Zap, ArrowRight, Flame } from 'lucide-react';

export const SimulationPage = ({ onNavigate }) => {
  const { city } = useFlood();

  const [simParams, setSimParams] = useState({
    rainfall_intensity: 100,
    forecast_rainfall: 120,
    drainage_capacity: 50,
    drainage_blockage: 35,
    elevation: 8.5,
    historical_flood_risk: "High",
    target_city: city
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleRunSimulation = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await apiService.runSimulation({
        ...simParams,
        target_city: city
      });
      setResult(res);
    } catch (err) {
      console.error('Simulation run failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSimParams({
      rainfall_intensity: 45,
      forecast_rainfall: 55,
      drainage_capacity: 75,
      drainage_blockage: 10,
      elevation: 12.0,
      historical_flood_risk: "Medium",
      target_city: city
    });
    setResult(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Title Card */}
      <div className="gov-card" style={{ padding: '16px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#fed7aa',
              color: '#c2410c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sliders size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>
                  Flood Scenario Simulator
                </h2>
                <span style={{
                  background: '#ea580c',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  textTransform: 'uppercase'
                }}>
                  SIH Presentation Highlight
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Simulate what-if weather and infrastructure conditions to calculate instant city inundation probability
              </div>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="btn-secondary"
            style={{ fontSize: '0.8rem' }}
          >
            <RotateCcw size={14} />
            <span>Reset Baseline</span>
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '400px 1fr',
        gap: '22px'
      }}>
        {/* Left: Simulation Sliders */}
        <div className="gov-card">
          <div className="gov-card-header">
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>
              Scenario Control Parameters
            </h3>
            <span style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 600 }}>Real-time inputs</span>
          </div>

          <form onSubmit={handleRunSimulation} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 1. Rainfall Intensity */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: '#334155' }}>Rainfall Intensity:</span>
                <strong style={{ color: '#0284c7', fontSize: '0.95rem' }}>{simParams.rainfall_intensity} mm/hr</strong>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                value={simParams.rainfall_intensity}
                onChange={(e) => setSimParams({ ...simParams, rainfall_intensity: parseFloat(e.target.value) })}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8' }}>
                <span>10 mm/hr (Light)</span>
                <span>80 mm/hr (Heavy)</span>
                <span>150 mm/hr (Cloudburst)</span>
              </div>
            </div>

            {/* 2. Forecast Rainfall */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: '#334155' }}>Forecast Rainfall:</span>
                <strong style={{ color: '#0284c7', fontSize: '0.95rem' }}>{simParams.forecast_rainfall} mm/hr</strong>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                value={simParams.forecast_rainfall}
                onChange={(e) => setSimParams({ ...simParams, forecast_rainfall: parseFloat(e.target.value) })}
                style={{ width: '100%' }}
              />
            </div>

            {/* 3. Drainage Capacity */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: '#334155' }}>Drainage Design Capacity:</span>
                <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{simParams.drainage_capacity} mm/hr</strong>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                value={simParams.drainage_capacity}
                onChange={(e) => setSimParams({ ...simParams, drainage_capacity: parseFloat(e.target.value) })}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8' }}>
                <span>10 mm (Old brick sewer)</span>
                <span>80 mm (Modern culvert)</span>
                <span>150 mm (Storm canal)</span>
              </div>
            </div>

            {/* 4. Drainage Blockage */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: '#334155' }}>Drainage Blockage / Silting:</span>
                <strong style={{ color: simParams.drainage_blockage > 30 ? '#dc2626' : '#ea580c', fontSize: '0.95rem' }}>
                  {simParams.drainage_blockage}%
                </strong>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={simParams.drainage_blockage}
                onChange={(e) => setSimParams({ ...simParams, drainage_blockage: parseFloat(e.target.value) })}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8' }}>
                <span>0% (Fully desilted)</span>
                <span>50% (Heavy debris)</span>
                <span>100% (Fully clogged)</span>
              </div>
            </div>

            {/* 5. Historical Flood Frequency */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Historical Basin Vulnerability
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Low', 'Medium', 'High'].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSimParams({ ...simParams, historical_flood_risk: level })}
                    style={{
                      flex: 1,
                      padding: '7px',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: simParams.historical_flood_risk === level ? '#0284c7' : '#cbd5e1',
                      background: simParams.historical_flood_risk === level ? '#e0f2fe' : '#ffffff',
                      color: simParams.historical_flood_risk === level ? '#0369a1' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* RUN SIMULATION BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '12px',
                fontSize: '0.95rem',
                borderRadius: '8px',
                marginTop: '10px',
                boxShadow: '0 4px 10px rgba(2, 132, 199, 0.25)'
              }}
            >
              <Play size={18} />
              <span>{loading ? 'CALCULATING DYNAMICS...' : 'RUN SIMULATION'}</span>
            </button>
          </form>
        </div>

        {/* Right: Simulation Results & Impacted Zones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {result ? (
            <>
              {/* Outcome Status Banner */}
              <div className="gov-card" style={{
                borderLeft: `6px solid ${result.overall_city_risk === 'CRITICAL' ? '#ef4444' : '#f97316'}`,
                background: result.overall_city_risk === 'CRITICAL' ? '#fef2f2' : '#fff7ed'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: result.overall_city_risk === 'CRITICAL' ? '#991b1b' : '#9a3412', textTransform: 'uppercase' }}>
                    Simulation Assessment Outcome
                  </span>
                  <span className={`badge-${result.overall_city_risk.toLowerCase()}`}>
                    {result.overall_city_risk}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.4rem', color: result.overall_city_risk === 'CRITICAL' ? '#991b1b' : '#9a3412', margin: '0 0 6px 0' }}>
                  Predicted City Inundation State: {result.overall_city_risk}
                </h3>

                <p style={{ fontSize: '0.85rem', color: '#334155', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                  {result.general_recommendation}
                </p>

                {/* Quick Impact Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  <div style={{ background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Critical Basins</div>
                    <strong style={{ fontSize: '1.25rem', color: '#dc2626' }}>{result.critical_zones_count} Zones</strong>
                  </div>

                  <div style={{ background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>High Risk</div>
                    <strong style={{ fontSize: '1.25rem', color: '#ea580c' }}>{result.high_risk_zones_count} Zones</strong>
                  </div>

                  <div style={{ background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Simulated Rain</div>
                    <strong style={{ fontSize: '1.25rem', color: '#0284c7' }}>{result.simulated_rainfall} mm</strong>
                  </div>

                  <div style={{ background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Drain Blockage</div>
                    <strong style={{ fontSize: '1.25rem', color: '#dc2626' }}>{result.simulated_blockage}%</strong>
                  </div>
                </div>
              </div>

              {/* Affected Zones Table */}
              <div className="gov-card">
                <div className="gov-card-header">
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>
                    Vulnerable & Affected Municipal Basins ({result.affected_zones.length})
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Ranked by Waterlogging Probability</span>
                </div>

                <div style={{ overflowX: 'auto', maxHeight: '340px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                        <th style={{ padding: '8px 12px' }}>Area Name</th>
                        <th style={{ padding: '8px 12px' }}>Flood Prob.</th>
                        <th style={{ padding: '8px 12px' }}>Risk Level</th>
                        <th style={{ padding: '8px 12px' }}>Expected Flood Time</th>
                        <th style={{ padding: '8px 12px' }}>Drain Load</th>
                        <th style={{ padding: '8px 12px' }}>Recommended Operational Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.affected_zones.map((z, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px 12px', fontWeight: 700, color: '#0f172a' }}>{z.name}</td>
                          <td style={{ padding: '8px 12px', fontWeight: 800, color: z.flood_probability >= 75 ? '#dc2626' : '#ea580c' }}>
                            {z.flood_probability}%
                          </td>
                          <td style={{ padding: '8px 12px' }}>
                            <span className={`badge-${z.risk_level.toLowerCase()}`}>{z.risk_level}</span>
                          </td>
                          <td style={{ padding: '8px 12px', fontWeight: 600, color: '#991b1b' }}>
                            {z.predicted_time}
                          </td>
                          <td style={{ padding: '8px 12px' }}>{z.drainage_load_pct}%</td>
                          <td style={{ padding: '8px 12px', color: '#1e3a8a', fontSize: '0.78rem' }}>
                            {z.recommendation}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="gov-card" style={{ padding: '60px 30px', textAlign: 'center', color: '#64748b' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                color: '#0284c7'
              }}>
                <Zap size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '6px' }}>Ready to Run Simulation</h3>
              <p style={{ maxWidth: '420px', margin: '0 auto', fontSize: '0.85rem' }}>
                Adjust rainfall, drainage capacity, and culvert blockage levels on the left panel, then click <strong>"RUN SIMULATION"</strong> to test scenario dynamics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
