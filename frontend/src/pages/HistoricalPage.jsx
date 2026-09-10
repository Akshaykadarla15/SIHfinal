import React, { useState, useEffect } from 'react';
import { useFlood } from '../context/FloodContext';
import { apiService } from '../services/api';
import { HistoricalChart } from '../charts/HistoricalChart';
import { History, Filter, Search, Calendar, Waves, AlertCircle, Award, CheckCircle2, ShieldAlert, Cpu, Clock, Target } from 'lucide-react';

export const HistoricalPage = () => {
  const { city } = useFlood();

  const [historicalData, setHistoricalData] = useState(null);
  const [accuracyData, setAccuracyData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filterSeverity, setFilterSeverity] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [minRainfall, setMinRainfall] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (filterSeverity) filters.severity = filterSeverity;
      if (searchLocation) filters.location = searchLocation;
      if (minRainfall) filters.min_rainfall = parseFloat(minRainfall);

      const [histRes, accRes] = await Promise.all([
        apiService.getHistoricalData(city, filters),
        apiService.getHistoricalAccuracy(city)
      ]);
      setHistoricalData(histRes);
      setAccuracyData(accRes);
    } catch (err) {
      console.error('Failed to load historical data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [city, filterSeverity, minRainfall]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header & Filter Controls */}
      <div className="gov-card" style={{ padding: '16px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>
              Historical Inundation & Cloudburst Archives ({city})
            </h2>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Empirical historical deluge database used to calibrate the machine learning baseline
            </div>
          </div>

          {/* Quick Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} color="#64748b" />
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
              >
                <option value="">All Severities</option>
                <option value="Severe">Severe (Water depth &gt; 1.5m)</option>
                <option value="High">High (Water depth 0.8–1.5m)</option>
                <option value="Moderate">Moderate (&lt; 0.8m)</option>
              </select>
            </div>

            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                placeholder="Filter area..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', width: '150px' }}
              />
              <button type="submit" className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.8rem' }}>
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* AI Backtesting & Historical Accuracy Card */}
      {accuracyData && (
        <div className="gov-card" style={{ padding: '20px 24px', borderLeft: '5px solid #0284c7' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={20} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>
                  AI Backtesting & Historical Validation ({accuracyData.model_version})
                </h3>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                Validated against {accuracyData.total_backtested_events} historical monsoon inundation records ({accuracyData.validation_period})
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: '#ecfdf5',
                color: '#065f46',
                border: '1px solid #a7f3d0',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <CheckCircle2 size={14} color="#059669" />
                <span>Model Calibrated for {city}</span>
              </span>
            </div>
          </div>

          {/* 4 Performance KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Overall Accuracy</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0284c7', margin: '3px 0' }}>
                {accuracyData.metrics.overall_accuracy}%
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>10-fold temporal cross-validation</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Recall / Flood Capture</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#16a34a', margin: '3px 0' }}>
                {accuracyData.metrics.recall}%
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Critical inundation capture rate</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Precision Rate</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '3px 0' }}>
                {accuracyData.metrics.precision}%
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Low municipal false alarms</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Mean Actionable Lead Time</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ea580c', margin: '3px 0' }}>
                {accuracyData.metrics.mean_lead_time_minutes} min
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Advance warning before road closure</div>
            </div>
          </div>

          {/* Grid: Confusion Matrix & Lead Time Distribution */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', marginBottom: '20px' }}>
            {/* Confusion Matrix */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>
                Backtested Confusion Matrix (n = {accuracyData.total_backtested_events} Ground Events)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '10px' }}>
                  <div style={{ fontSize: '0.68rem', color: '#166534', fontWeight: 700 }}>TRUE POSITIVE (TP)</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#15803d' }}>
                    {accuracyData.confusion_matrix.true_positive}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#4b5563' }}>Floods correctly warned</div>
                </div>

                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '10px' }}>
                  <div style={{ fontSize: '0.68rem', color: '#991b1b', fontWeight: 700 }}>FALSE POSITIVE (FP)</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#b91c1c' }}>
                    {accuracyData.confusion_matrix.false_positive}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#4b5563' }}>False alerts triggered</div>
                </div>

                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '10px' }}>
                  <div style={{ fontSize: '0.68rem', color: '#991b1b', fontWeight: 700 }}>FALSE NEGATIVE (FN)</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#b91c1c' }}>
                    {accuracyData.confusion_matrix.false_negative}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#4b5563' }}>Floods missed</div>
                </div>

                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '10px' }}>
                  <div style={{ fontSize: '0.68rem', color: '#166534', fontWeight: 700 }}>TRUE NEGATIVE (TN)</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#15803d' }}>
                    {accuracyData.confusion_matrix.true_negative}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#4b5563' }}>Safe conditions confirmed</div>
                </div>
              </div>
            </div>

            {/* Advance Lead Time Distribution */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={15} color="#0284c7" />
                <span>Advance Warning Lead Time Distribution</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {accuracyData.lead_time_distribution.map((item, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '3px' }}>
                      <span style={{ fontWeight: 600, color: '#334155' }}>{item.range}</span>
                      <strong style={{ color: '#0284c7' }}>{item.percentage}%</strong>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${item.percentage}%`, height: '100%', background: '#0284c7', borderRadius: '4px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Historical Storm Backtest Table */}
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              Individual Storm Event Backtesting Verification
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', color: '#475569', textAlign: 'left' }}>
                    <th style={{ padding: '8px 10px' }}>Historical Storm</th>
                    <th style={{ padding: '8px 10px' }}>Date</th>
                    <th style={{ padding: '8px 10px' }}>Locality</th>
                    <th style={{ padding: '8px 10px' }}>Rainfall</th>
                    <th style={{ padding: '8px 10px' }}>Actual Inundation</th>
                    <th style={{ padding: '8px 10px' }}>AI Predicted</th>
                    <th style={{ padding: '8px 10px' }}>Lead Time</th>
                    <th style={{ padding: '8px 10px' }}>Validation Status</th>
                  </tr>
                </thead>
                <tbody>
                  {accuracyData.recent_storm_evaluations.map((st, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0f172a' }}>{st.event_name}</td>
                      <td style={{ padding: '8px 10px', color: '#64748b' }}>{st.date}</td>
                      <td style={{ padding: '8px 10px', color: '#334155' }}>{st.locality}</td>
                      <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0284c7' }}>{st.recorded_rainfall}</td>
                      <td style={{ padding: '8px 10px', fontWeight: 700, color: '#dc2626' }}>{st.actual_inundation}</td>
                      <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0284c7' }}>{st.predicted_inundation}</td>
                      <td style={{ padding: '8px 10px', color: '#16a34a', fontWeight: 600 }}>{st.lead_time}</td>
                      <td style={{ padding: '8px 10px' }}>
                        <span style={{
                          background: '#ecfdf5',
                          color: '#065f46',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          fontSize: '0.72rem'
                        }}>
                          ✓ {st.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Comparative Historical Chart */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>
              Historical Events: Precipitation (mm) vs Peak Water Level (m)
            </h3>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Demonstrates strong correlation between monsoonal volume and localized basin backflow
            </div>
          </div>
        </div>

        {historicalData?.chart_data ? (
          <HistoricalChart data={historicalData.chart_data} height={280} />
        ) : (
          <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            Loading historical curves...
          </div>
        )}
      </div>

      {/* Historical Records Table */}
      <div className="gov-card">
        <div className="gov-card-header">
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>
            Documented Monsoon Inundation Events ({historicalData?.events?.length || 0})
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                <th style={{ padding: '10px 14px' }}>Date</th>
                <th style={{ padding: '10px 14px' }}>Locality</th>
                <th style={{ padding: '10px 14px' }}>Rainfall (mm)</th>
                <th style={{ padding: '10px 14px' }}>Peak Water Depth</th>
                <th style={{ padding: '10px 14px' }}>Flood Duration</th>
                <th style={{ padding: '10px 14px' }}>Severity</th>
                <th style={{ padding: '10px 14px' }}>Drainage Behavior</th>
                <th style={{ padding: '10px 14px' }}>Recorded Damage</th>
              </tr>
            </thead>
            <tbody>
              {historicalData?.events && historicalData.events.map((ev, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#64748b' }}>{ev.event_date}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0f172a' }}>{ev.location_name}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284c7' }}>{ev.rainfall_mm} mm</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#dc2626' }}>{ev.peak_water_level} m</td>
                  <td style={{ padding: '10px 14px' }}>{ev.flood_duration_hours} hrs</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span className={ev.severity === 'Severe' ? 'badge-critical' : (ev.severity === 'High' ? 'badge-high' : 'badge-moderate')}>
                      {ev.severity}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', color: '#334155' }}>{ev.drainage_performance}</td>
                  <td style={{ padding: '10px 14px', color: '#475569', maxWidth: '280px' }}>{ev.damage_reported}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
