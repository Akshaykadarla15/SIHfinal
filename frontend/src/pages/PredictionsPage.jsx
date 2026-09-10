import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { NowcastingLineChart } from '../charts/NowcastingLineChart';
import {
  Cpu,
  Brain,
  CheckCircle,
  Clock,
  Shield,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Sliders,
  Info,
  BookOpen,
  ChevronDown,
  ChevronUp,
  BarChart2
} from 'lucide-react';

export const PredictionsPage = () => {
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
  const [showMethodology, setShowMethodology] = useState(false);

  // Global feature importances from model metadata
  const [globalImportances, setGlobalImportances] = useState({
    rainfall_intensity: 30.81,
    drainage_utilization: 22.82,
    forecast_rainfall: 18.60,
    water_accumulation: 13.86,
    cumulative_rainfall: 7.13,
    drainage_capacity: 1.64,
    elevation: 1.49,
    impervious_surface: 1.07,
    historical_flood_frequency: 0.95,
    drainage_blockage: 0.87,
    slope: 0.76
  });

  const [prediction, setPrediction] = useState({
    flood_probability: 82.0,
    uncertainty: 5.8,
    confidence_band: "± 5.8%",
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
    global_feature_importances: null,
    nowcast_timeline: [
      { window: "0-15 min", probability: 74.0, risk_level: "High" },
      { window: "15-30 min", probability: 82.0, risk_level: "Critical" },
      { window: "30-60 min", probability: 89.0, risk_level: "Critical" },
      { window: "1-2 hours", probability: 92.5, risk_level: "Critical" },
      { window: "2-3 hours", probability: 88.0, risk_level: "Critical" }
    ]
  });

  useEffect(() => {
    // Fetch global model feature importances from backend
    fetch('http://127.0.0.1:8000/api/predictions/feature-importances')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object') {
          setGlobalImportances(data);
        }
      })
      .catch(() => {});
  }, []);

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiService.predict(inputs);
      setPrediction(res);
      if (res.global_feature_importances) {
        setGlobalImportances(res.global_feature_importances);
      }
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const featureLabels = {
    rainfall_intensity: "Rainfall Intensity (mm/hr)",
    drainage_utilization: "Drainage Utilization (%)",
    forecast_rainfall: "Forecast Rainfall (mm/hr)",
    water_accumulation: "Surface Ponding Accumulation (%)",
    cumulative_rainfall: "Antecedent Cumulative Rainfall",
    drainage_capacity: "Culvert Capacity (mm/hr)",
    elevation: "DEM Elevation (meters MSL)",
    impervious_surface: "Impervious Concrete Cover (%)",
    historical_flood_frequency: "Historical Susceptibility Score",
    drainage_blockage: "Culvert Silt Blockage (%)",
    slope: "Terrain Gradient Slope (%)"
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Page Heading & Methodology Toggle */}
      <div className="gov-card" style={{ padding: '16px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
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

          <button
            onClick={() => setShowMethodology(!showMethodology)}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <BookOpen size={15} color="#0284c7" />
            <span>Modeling Methodology & Scale Limitations</span>
            {showMethodology ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Collapsible Methodology Panel */}
        {showMethodology && (
          <div style={{
            marginTop: '16px',
            padding: '16px 18px',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            fontSize: '0.82rem',
            color: '#334155',
            lineHeight: 1.6
          }}>
            <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '8px', fontSize: '0.92rem' }}>
              🔬 Hydrological Physics & ML Architecture Overview
            </div>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>1. Rational Method Runoff ($Q = C \cdot I \cdot A$):</strong> Surface peak runoff is estimated using the civil engineering Rational Method. Concretized districts have high impervious runoff coefficients ($C \approx 0.85$), which directly surge into storm conduits. When inflow exceeds conduit capacity adjusted for blockage, pipe surcharge occurs.
            </p>
            <p style={{ margin: '0 0 10px 0' }}>
              <strong>2. Random Forest Ensemble:</strong> 120 bagging trees evaluate non-linear correlations across 11 hydraulic dimensions. Prediction uncertainty is calculated across individual decision tree variance ($\sigma / \sqrt{N}$), displayed as a confidence band (e.g., $82\% \pm 6\%$).
            </p>
            <p style={{ margin: 0, color: '#b91c1c' }}>
              <strong>⚠️ Known Scale Limitations:</strong> At municipal scale, lumped sub-catchments simplify full 2D hydrodynamic Saint-Venant shallow water equations. Micro-topographical backwater jumps and curb-level debris clogging may produce localized variations.
            </p>
          </div>
        )}
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
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>POST /api/predictions/predict</span>
          </div>

          <form onSubmit={handlePredict} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '3px' }}>
                  Rainfall Rate (mm/hr)
                </label>
                <input
                  type="number"
                  min="0"
                  max="300"
                  value={inputs.rainfall_intensity}
                  onChange={(e) => setInputs({ ...inputs, rainfall_intensity: parseFloat(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '3px' }}>
                  Forecast Rate (mm/hr)
                </label>
                <input
                  type="number"
                  min="0"
                  max="300"
                  value={inputs.forecast_rainfall}
                  onChange={(e) => setInputs({ ...inputs, forecast_rainfall: parseFloat(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '3px' }}>
                  Drain Capacity (mm/hr)
                </label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={inputs.drainage_capacity}
                  onChange={(e) => setInputs({ ...inputs, drainage_capacity: parseFloat(e.target.value) || 5 })}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '3px' }}>
                  Drain Utilization (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="150"
                  value={inputs.drainage_utilization}
                  onChange={(e) => setInputs({ ...inputs, drainage_utilization: parseFloat(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '3px' }}>
                  Drain Blockage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={inputs.drainage_blockage}
                  onChange={(e) => setInputs({ ...inputs, drainage_blockage: parseFloat(e.target.value) || 0 })}
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
                  onChange={(e) => setInputs({ ...inputs, elevation: parseFloat(e.target.value) || 0 })}
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
                  onChange={(e) => setInputs({ ...inputs, slope: parseFloat(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '3px' }}>
                  Impervious Cover (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={inputs.impervious_surface}
                  onChange={(e) => setInputs({ ...inputs, impervious_surface: parseFloat(e.target.value) || 0 })}
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
                  onChange={(e) => setInputs({ ...inputs, historical_flood_frequency: parseFloat(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '3px' }}>
                  Ponding Level (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={inputs.water_accumulation}
                  onChange={(e) => setInputs({ ...inputs, water_accumulation: parseFloat(e.target.value) || 0 })}
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
              <span>{loading ? 'Running Random Forest Ensemble...' : 'Calculate AI Flood Prediction'}</span>
            </button>
          </form>
        </div>

        {/* Right: Prediction Output & Nowcasting Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Result Card with Uncertainty */}
          <div className="gov-card" style={{ borderLeft: `5px solid ${prediction.risk_level === 'Critical' ? '#ef4444' : (prediction.risk_level === 'High' ? '#f97316' : '#10b981')}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                AI Model Prediction Result & Uncertainty
              </span>
              <span className={`badge-${prediction.risk_level.toLowerCase()}`}>
                {prediction.risk_level} Risk
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '14px' }}>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Flood Probability</div>
                <div style={{ fontSize: '1.55rem', fontWeight: 800, color: prediction.flood_probability >= 75 ? '#dc2626' : '#0284c7' }}>
                  {prediction.flood_probability}% <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>± {prediction.uncertainty || 5.4}%</span>
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

            <NowcastingLineChart timeline={prediction.nowcast_timeline} height={190} />
          </div>
        </div>
      </div>

      {/* DUAL EXPLAINABILITY SECTION: Global Model Feature Importances vs Situational Factor Breakdown */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 1fr',
        gap: '22px'
      }}>
        {/* Left: Global Feature Importances from Random Forest Training */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Learned Statistical Weights
              </div>
              <h3 style={{ margin: '2px 0 0 0', fontSize: '1.05rem', color: '#0f172a' }}>
                Model Feature Importance (Global)
              </h3>
            </div>
            <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
              Gini Impurity (120 Trees)
            </span>
          </div>

          <div style={{ padding: '4px 0', fontSize: '0.78rem', color: '#64748b', marginBottom: '12px' }}>
            Overall predictive weight across the 7,500 sample training dataset. Represents general hydrological drivers across all monsoon storms.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries(globalImportances)
              .sort((a, b) => b[1] - a[1])
              .map(([key, value]) => (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px' }}>
                    <span style={{ color: '#334155', fontWeight: 600 }}>{featureLabels[key] || key}</span>
                    <strong style={{ color: '#0f172a' }}>{value}%</strong>
                  </div>
                  <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.min(100, value * 2.8)}%`,
                      height: '100%',
                      background: value > 20 ? '#0284c7' : (value > 10 ? '#0ea5e9' : '#94a3b8'),
                      borderRadius: '3px'
                    }} />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Right: Situational Factor Breakdown for THIS Specific Prediction */}
        <div className="gov-card">
          <div className="gov-card-header">
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Real-Time Physical Stress
              </div>
              <h3 style={{ margin: '2px 0 0 0', fontSize: '1.05rem', color: '#0f172a' }}>
                Situational Factor Breakdown (This Prediction)
              </h3>
            </div>
            <span style={{ fontSize: '0.72rem', background: '#fff7ed', color: '#c2410c', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
              Query-Specific Pressure
            </span>
          </div>

          <div style={{ padding: '4px 0', fontSize: '0.78rem', color: '#64748b', marginBottom: '12px' }}>
            Attribution of why this particular zone is at risk right now based on current rainfall, drainage surcharge, and terrain.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'Heavy Rainfall Surcharge', val: prediction.xai_factors?.heavy_rainfall || 85, desc: 'Current & forecast precipitation rate relative to 75 mm/hr threshold', color: '#0284c7' },
              { label: 'Drainage Conduit Overload', val: prediction.xai_factors?.drainage_overload || 78, desc: 'Utilization load plus culvert trash/silt blockage factor', color: '#ea580c' },
              { label: 'Low Terrain & Flat Slope', val: prediction.xai_factors?.low_elevation || 84, desc: 'Low elevation relative to basin and flat runoff gradient', color: '#d97706' },
              { label: 'Historical Susceptibility', val: prediction.xai_factors?.historical_risk || 88, desc: 'Empirical recurrence frequency in past monsoonal flash floods', color: '#7c3aed' },
              { label: 'Impervious Concrete Surface', val: prediction.xai_factors?.impervious_surface || 78, desc: 'Runoff coefficient C based on urban land cover fraction', color: '#475569' }
            ].map(factor => (
              <div key={factor.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '3px' }}>
                  <div>
                    <strong style={{ color: '#0f172a' }}>{factor.label}</strong>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{factor.desc}</div>
                  </div>
                  <span style={{ fontWeight: 800, color: factor.color, fontSize: '0.92rem' }}>{factor.val}%</span>
                </div>
                <div style={{ height: '7px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', marginTop: '4px' }}>
                  <div style={{
                    width: `${Math.min(100, factor.val)}%`,
                    height: '100%',
                    background: factor.color,
                    borderRadius: '4px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
