import React, { useState, useEffect } from 'react';
import { useFlood } from '../context/FloodContext';
import { apiService } from '../services/api';
import { HistoricalChart } from '../charts/HistoricalChart';
import { History, Filter, Search, Calendar, Waves, AlertCircle } from 'lucide-react';

export const HistoricalPage = () => {
  const { city } = useFlood();

  const [historicalData, setHistoricalData] = useState(null);
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

      const res = await apiService.getHistoricalData(city, filters);
      setHistoricalData(res);
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
