import React, { useState, useEffect } from 'react';
import { useFlood } from '../context/FloodContext';
import { apiService } from '../services/api';
import { RainfallTrendChart } from '../charts/RainfallTrendChart';
import { CloudRain, AlertTriangle, TrendingUp, Gauge, Compass, Activity } from 'lucide-react';

export const RainfallPage = () => {
  const { city } = useFlood();
  const [rainfallData, setRainfallData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRainfall = async () => {
      setLoading(true);
      try {
        const res = await apiService.getRainfall(city);
        setRainfallData(res);
      } catch (err) {
        console.error('Failed to load rainfall:', err);
      } finally {
        setLoading(false);
      }
    };
    loadRainfall();
  }, [city]);

  if (loading || !rainfallData) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading rainfall telemetry for {city}...</div>;
  }

  const { summary, time_chart, stations } = rainfallData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Rapid Increase Alert Banner */}
      {summary.is_critical && (
        <div style={{
          background: '#fff7ed',
          border: '1px solid #fdba74',
          borderRadius: '10px',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#9a3412',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <AlertTriangle size={22} color="#ea580c" />
          <div>
            <strong style={{ fontSize: '0.95rem' }}>CRITICAL PRECIPITATION SURGE: {summary.trend_signal}</strong>
            <div style={{ fontSize: '0.8rem', color: '#c2410c' }}>
              Highest intensity detected at {summary.max_station} reaching {summary.current_rainfall}. Waterlogging probability escalating rapidly.
            </div>
          </div>
        </div>
      )}

      {/* Summary KPI Highlights */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        <div className="gov-card">
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Current Peak Inundation Rate</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0284c7', margin: '4px 0' }}>{summary.current_rainfall}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Station: {summary.max_station}</div>
        </div>

        <div className="gov-card">
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Active Rain Gauges</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>{stations.length} Units</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Connected via Municipal Telemetry</div>
        </div>

        <div className="gov-card">
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Observed Inflow Trend</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ea580c', margin: '8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={20} />
            <span>{summary.trend_signal}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>IMD Doppler Radar Cross-Verification</div>
        </div>
      </div>

      {/* Time-Series Curve */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>
              Rainfall Progression & Forecast Trend (Time vs mm/hr)
            </h3>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Shows continuous precipitation ramp-up as an early flood warning signal
            </div>
          </div>
          <span className="badge-high">Increasing Rapidly</span>
        </div>

        <RainfallTrendChart data={time_chart} height={280} />
      </div>

      {/* Rain Station Data Table */}
      <div className="gov-card">
        <div className="gov-card-header">
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>
            Municipal Rainfall Stations Network ({city})
          </h3>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Updated every 5 minutes</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                <th style={{ padding: '10px 14px' }}>Station ID</th>
                <th style={{ padding: '10px 14px' }}>Location</th>
                <th style={{ padding: '10px 14px' }}>Current Rate</th>
                <th style={{ padding: '10px 14px' }}>Last 1 Hour</th>
                <th style={{ padding: '10px 14px' }}>Last 3 Hours</th>
                <th style={{ padding: '10px 14px' }}>Last 6 Hours</th>
                <th style={{ padding: '10px 14px' }}>Forecast Rate</th>
                <th style={{ padding: '10px 14px' }}>Intensity Status</th>
                <th style={{ padding: '10px 14px' }}>Trend Signal</th>
              </tr>
            </thead>
            <tbody>
              {stations.map((stn, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#64748b' }}>{stn.station_id}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0f172a' }}>{stn.location_name}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 800, color: stn.current_rainfall > 45 ? '#dc2626' : '#0284c7' }}>
                    {stn.current_rainfall} mm/hr
                  </td>
                  <td style={{ padding: '10px 14px' }}>{stn.rainfall_last_1h || round(stn.current_rainfall * 0.8)} mm</td>
                  <td style={{ padding: '10px 14px' }}>{stn.rainfall_last_3h || round(stn.current_rainfall * 2.2)} mm</td>
                  <td style={{ padding: '10px 14px' }}>{stn.rainfall_last_6h || round(stn.current_rainfall * 3.5)} mm</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#ea580c' }}>
                    {stn.forecast_rainfall} mm/hr
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span className={stn.current_rainfall > 50 ? 'badge-critical' : (stn.current_rainfall > 35 ? 'badge-high' : 'badge-safe')}>
                      {stn.intensity_status || 'Moderate'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', color: '#b91c1c', fontWeight: 600 }}>
                    {stn.trend}
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

const round = (val) => Math.round(val * 10) / 10;
