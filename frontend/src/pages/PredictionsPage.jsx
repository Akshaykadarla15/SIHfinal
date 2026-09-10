import React, { useState } from 'react';
import { apiService } from '../services/api';
import { NowcastingLineChart } from '../charts/NowcastingLineChart';
import { Cpu, Brain, CheckCircle, Clock, Shield, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';

export const PredictionsPage = () => {
  // Interactive test inputs
  const [inputs, setInputs] = useState({
    rainfall_intensity: 55,
    forecast_rainfall: 70,
    drainage_capacity: 80,
    drainage_utilization: 82,
    elevation: 8.2,
    slope: 1.5,
    impervious_surface: 78,
    historical_flood_frequency: 8,
    water_accumulation: 65,
    drainage_blockage: 20
  });

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState({
    flood_probability: 82.0,
    risk_level: "Critical",
    predicted_time: "30-45 minutes",
    recommended_action: "Clear nearby drainage channels, divert vehicular traffic, and issue high-priority local warning.",
    confidence_score: 94.6,
    xai_factors: {
      heavy_rainfall: 85.0,
      drainage_overload: 78.0,
      low_elevation: 84.0,
      historical_risk: 88.0,
      impervious_surface: 78.0
    },
    nowcast_timeline: [
      { window: "0-15 min", probability: 74.0, risk_level: "High" },
      { window: "15-30 min", probability: 82.0, risk_level: "Critical" },
      { window: "30-60 min", probability: 89.0, risk_level: "Critical" },
      { window: "1-2 hours", probability: 92.5, risk_level: "Critical" },
      { window: "2-3 hours", probability: 88.0, risk_level: "Critical" }
    ]
  });

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiService.predict(inputs);
      setPrediction(res);
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Page Heading */}
      <div className="gov-card" style={{ padding: '16px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: '#e0f2fe',
            color: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Cpu size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>
              AI Flood Nowcasting & Machine Learning Inference Engine
            </h2>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Scikit-learn Random Forest Model (120 Estimators) trained on urban runoff hydrodynamics
            </div>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.25fr',
        gap: '22px'
      }}>
        {/* Left: Input Form */}
        <div className="gov-card">
          <div className="gov-card-header">
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>
              Hydrological Feature Inputs
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>POST /predict</span>
          </div>

          <form onSubmit={handlePredict} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '3px' }}>
                  Rainfall Rate (mm/hr)
                </label>
                <input
                  type="number"
                  value={inputs.rainfall_intensity}
                  onChange={(e) => setInputs({ ...inputs, rainfall_intensity: parseFloat(e.target.value) })}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '3px' }}>
                  Forecast Rate (mm/hr)
                </label>
                <input
                  type="number"
                  value={inputs.forecast_rainfall}
                  onChange={(e) => setInputs({ ...inputs, forecast_rainfall: parseFloat(e.target.value) })}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '3px' }}>
                  Drain Capacity (mm/hr)
                </label>
                <input
                  type="number"
                  value={inputs.drainage_capacity}
                  onChange={(e) => setInputs({ ...inputs, drainage_capacity: parseFloat(e.target.value) })}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '3px' }}>
                  Drain Utilization (%)
                </label>
                <input
                  type="number"
                  value={inputs.drainage_utilization}
                  onChange={(e) => setInputs({ ...inputs, drainage_utilization: parseFloat(e.target.value) })}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '3px' }}>
                  Elevation (meters MSL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.elevation}
                  onChange={(e) => setInputs({ ...inputs, elevation: parseFloat(e.target.value) })}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '3px' }}>
                  Terrain Slope (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.slope}
                  onChange={(e) => setInputs({ ...inputs, slope: parseFloat(e.target.value) })}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '3px' }}>
                  Impervious Cover (%)
                </label>
                <input
                  type="number"
                  value={inputs.impervious_surface}
                  onChange={(e) => setInputs({ ...inputs, impervious_surface: parseFloat(e.target.value) })}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '3px' }}>
                  Historical Flood Score (0-10)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={inputs.historical_flood_frequency}
                  onChange={(e) => setInputs({ ...inputs, historical_flood_frequency: parseFloat(e.target.value) })}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
            >
              {loading ? <RefreshCw size={16} className="pulse-critical" /> : <Activity size={16} />}
              <span>{loading ? 'Running Random Forest Model...' : 'Calculate AI Flood Prediction'}</span>
            </button>
          </form>
        </div>

        {/* Right: Prediction Output & Nowcasting Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Result Card */}
          <div className="gov-card" style={{ borderLeft: `5px solid ${prediction.risk_level === 'Critical' ? '#ef4444' : (prediction.risk_level === 'High' ? '#f97316' : '#10b981')}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                AI Model Prediction Result
              </span>
              <span className={`badge-${prediction.risk_level.toLowerCase()}`}>
                {prediction.risk_level} Risk
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '14px' }}>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Flood Probability</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: prediction.flood_probability >= 75 ? '#dc2626' : '#0284c7' }}>
                  {prediction.flood_probability}%
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Expected Time</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b', marginTop: '6px' }}>
                  {prediction.predicted_time}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Model Confidence</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669', marginTop: '6px' }}>
                  {prediction.confidence_score}%
                </div>
              </div>
            </div>

            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px', fontSize: '0.82rem', color: '#1e3a8a' }}>
              <strong>Public Safety Recommendation:</strong> {prediction.recommended_action}
            </div>
          </div>

          {/* Nowcasting Progression Line Chart */}
          <div className="gov-card">
            <div className="gov-card-header">
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>
                  Short-Term Nowcasting Timeline (0m to 3 Hours)
                </h3>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Dynamic waterlogging risk forecast across short operational decision windows
                </div>
              </div>
            </div>

            <NowcastingLineChart timeline={prediction.nowcast_timeline} height={220} />
          </div>
        </div>
      </div>
    </div>
  );
};
