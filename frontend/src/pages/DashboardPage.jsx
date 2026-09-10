import React from 'react';
import { useFlood } from '../context/FloodContext';
import { useAuth } from '../context/AuthContext';
import { RiskCard } from '../components/RiskCard';
import { LeafletMap } from '../maps/LeafletMap';
import { RainfallTrendChart } from '../charts/RainfallTrendChart';
import {
  CloudRain,
  CloudLightning,
  AlertTriangle,
  Flame,
  Waves,
  Shield,
  Activity,
  ArrowUpRight,
  Brain,
  Clock,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

export const DashboardPage = ({ onNavigate }) => {
  const { dashboardData, loading, selectedZone, setSelectedZone, setExplainZone, city } = useFlood();
  const { currentUser } = useAuth();

  if (loading || !dashboardData) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading city hydrological telemetry for {city}...</div>
      </div>
    );
  }

  const { metrics, rainfall_trend, active_alerts, zones, warning_banner } = dashboardData;

  // Variant helper for city risk
  const getRiskVariant = (risk) => {
    if (risk === 'CRITICAL') return 'critical';
    if (risk === 'HIGH') return 'high';
    if (risk === 'MODERATE') return 'moderate';
    return 'safe';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Warning Banner if heavy rainfall */}
      {warning_banner && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fca5a5',
          borderRadius: '10px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#991b1b',
          fontSize: '0.86rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={18} color="#dc2626" />
            <strong style={{ fontWeight: 700 }}>{warning_banner}</strong>
          </div>
          <button
            onClick={() => onNavigate('alerts')}
            style={{
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '4px 12px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Review Alerts
          </button>
        </div>
      )}

      {/* 6 Key KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px'
      }}>
        <RiskCard
          title="Current Rainfall"
          value={metrics.current_rainfall}
          subtitle="Monitored across AWS gauges"
          icon={CloudRain}
          variant="default"
        />

        <RiskCard
          title="Max Forecast"
          value={metrics.max_rainfall_forecast}
          subtitle="Next 1-3 hour horizon"
          icon={CloudLightning}
          variant="default"
        />

        <RiskCard
          title="High-Risk Zones"
          value={metrics.high_risk_zones}
          subtitle="50% - 75% Flood Probability"
          icon={AlertTriangle}
          variant="high"
          badge="High"
        />

        <RiskCard
          title="Critical Zones"
          value={metrics.critical_zones}
          subtitle="> 75% Severe Waterlogging"
          icon={Flame}
          variant="critical"
          badge="Critical"
        />

        <RiskCard
          title="Drainage Capacity"
          value={metrics.drainage_capacity}
          subtitle="City-wide average headroom"
          icon={Waves}
          variant={metrics.drainage_available_pct < 30 ? 'critical' : 'safe'}
        />

        <RiskCard
          title="Overall City Risk"
          value={metrics.overall_city_risk}
          subtitle={`${city} Consolidated Assessment`}
          icon={Shield}
          variant={getRiskVariant(metrics.overall_city_risk)}
          badge={metrics.overall_city_risk}
        />
      </div>

      {/* Main Grid: Interactive Map (Left) & Inspector + Trend (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: '20px'
      }}>
        {/* Left Column: Interactive Map Preview */}
        <div className="gov-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="gov-card-header">
            <div>
              <h2 style={{ fontSize: '1.15rem', color: '#0f172a', margin: 0 }}>
                Live Geospatial Flood Risk Map
              </h2>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Real-time colored risk circles (Green Safe, Yellow Moderate, Orange High, Red Critical)
              </div>
            </div>
            <button
              onClick={() => onNavigate('map')}
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '5px 12px' }}
            >
              <span>Full Screen Map</span>
              <ExternalLink size={14} />
            </button>
          </div>

          <div style={{ flex: 1, minHeight: '420px' }}>
            <LeafletMap zones={zones} height="420px" showControls={true} onSelectZone={(z) => setSelectedZone(z)} />
          </div>
        </div>

        {/* Right Column: Selected Zone Details & Rainfall Trend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Selected Zone Inspector */}
          {selectedZone && (
            <div className="gov-card" style={{ borderLeft: `4px solid ${selectedZone.flood_probability >= 75 ? '#ef4444' : (selectedZone.flood_probability >= 50 ? '#f97316' : '#10b981')}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Inspected Municipal Zone</div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>{selectedZone.name}</h3>
                </div>
                <span className={`badge-${selectedZone.risk_level.toLowerCase()}`}>
                  {selectedZone.risk_level} Risk
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.82rem', marginBottom: '12px' }}>
                <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#64748b', fontSize: '0.72rem' }}>Flood Probability</div>
                  <strong style={{ fontSize: '1.15rem', color: selectedZone.flood_probability >= 75 ? '#dc2626' : '#0284c7' }}>
                    {selectedZone.flood_probability}%
                  </strong>
                </div>

                <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#64748b', fontSize: '0.72rem' }}>Predicted Inundation</div>
                  <strong style={{ fontSize: '0.92rem', color: '#1e293b' }}>
                    {selectedZone.predicted_time}
                  </strong>
                </div>

                <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#64748b', fontSize: '0.72rem' }}>Rainfall Rate</div>
                  <strong style={{ fontSize: '0.92rem', color: '#1e293b' }}>
                    {selectedZone.rainfall_rate} mm/hr
                  </strong>
                </div>

                <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#64748b', fontSize: '0.72rem' }}>Drain Load ({selectedZone.drain_id})</div>
                  <strong style={{ fontSize: '0.92rem', color: selectedZone.drainage_utilization > 80 ? '#dc2626' : '#1e293b' }}>
                    {selectedZone.drainage_utilization}%
                  </strong>
                </div>
              </div>

              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '10px', fontSize: '0.78rem', color: '#1e3a8a', marginBottom: '12px' }}>
                <strong>Recommendation:</strong> {selectedZone.recommended_action}
              </div>

              <button
                onClick={() => setExplainZone(selectedZone)}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem', padding: '8px 12px' }}
              >
                <Brain size={15} />
                <span>Why is this area at risk? (Explainable AI)</span>
              </button>
            </div>
          )}

          {/* Rainfall Trend Chart */}
          <div className="gov-card">
            <div className="gov-card-header" style={{ marginBottom: '8px' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', margin: 0, color: '#0f172a' }}>
                  Rainfall Trend & Forecast Curve
                </h3>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  Progression towards torrential risk threshold
                </div>
              </div>
              <button
                onClick={() => onNavigate('rainfall')}
                style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
              >
                View Gauges →
              </button>
            </div>

            <RainfallTrendChart data={rainfall_trend} height={190} />
          </div>
        </div>
      </div>

      {/* Active Alerts Table */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="#ea580c" />
            <h2 style={{ fontSize: '1.1rem', color: '#0f172a', margin: 0 }}>
              Active Flood Warnings & Advisories ({active_alerts?.length || 0})
            </h2>
          </div>
          <button
            onClick={() => onNavigate('alerts')}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '5px 12px' }}
          >
            Manage All Alerts
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                <th style={{ padding: '10px 14px' }}>Severity</th>
                <th style={{ padding: '10px 14px' }}>Location</th>
                <th style={{ padding: '10px 14px' }}>Flood Risk</th>
                <th style={{ padding: '10px 14px' }}>Expected Time</th>
                <th style={{ padding: '10px 14px' }}>Reason</th>
                <th style={{ padding: '10px 14px' }}>Recommended Action</th>
              </tr>
            </thead>
            <tbody>
              {active_alerts && active_alerts.map((a, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px' }}>
                    <span className={`badge-${a.severity.toLowerCase()}`}>{a.severity}</span>
                  </td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0f172a' }}>
                    {a.location_name}
                  </td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: a.flood_probability >= 75 ? '#dc2626' : '#ea580c' }}>
                    {a.flood_probability}%
                  </td>
                  <td style={{ padding: '10px 14px', color: '#334155' }}>
                    {a.expected_time}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#475569', maxWidth: '320px' }}>
                    {a.reason}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#1e3a8a', fontWeight: 500, maxWidth: '320px' }}>
                    {a.recommended_action}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
