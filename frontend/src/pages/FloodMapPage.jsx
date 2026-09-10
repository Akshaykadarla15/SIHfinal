import React, { useState } from 'react';
import { useFlood } from '../context/FloodContext';
import { LeafletMap } from '../maps/LeafletMap';
import { Search, Brain, MapPin, AlertTriangle, Shield, Clock, Layers, Waves, ArrowRight } from 'lucide-react';

export const FloodMapPage = () => {
  const { dashboardData, selectedZone, setSelectedZone, setExplainZone, city } = useFlood();
  const [searchQuery, setSearchQuery] = useState('');

  const zones = dashboardData?.zones || [];

  const filteredZones = zones.filter(z =>
    z.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Top Search & Filter Bar */}
      <div className="gov-card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>
            Geospatial Flood Risk & Nowcasting Map ({city})
          </h2>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Interactive early-warning GIS overlay displaying localized waterlogging susceptibility
          </div>
        </div>

        {/* Search Box */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          padding: '6px 12px',
          borderRadius: '8px',
          width: '280px'
        }}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Search locality (e.g. Kukatpally)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.85rem',
              width: '100%',
              color: '#0f172a'
            }}
          />
        </div>
      </div>

      {/* Main Map View + Detailed Side Panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: '20px'
      }}>
        {/* Full Interactive Leaflet Map */}
        <div className="gov-card" style={{ padding: 0, overflow: 'hidden' }}>
          <LeafletMap
            zones={filteredZones}
            height="620px"
            showControls={true}
            onSelectZone={(z) => setSelectedZone(z)}
          />
        </div>

        {/* Right Side Zone Inspector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {selectedZone ? (
            <div className="gov-card" style={{
              borderLeft: `5px solid ${selectedZone.flood_probability >= 75 ? '#ef4444' : (selectedZone.flood_probability >= 50 ? '#f97316' : '#10b981')}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Zone Telemetry
                  </span>
                  <span className={`badge-${selectedZone.risk_level.toLowerCase()}`}>
                    {selectedZone.risk_level} Risk
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', color: '#0f172a', margin: '0 0 4px 0' }}>
                  {selectedZone.name}
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '14px' }}>
                  {selectedZone.city} • Lat: {selectedZone.latitude.toFixed(4)}, Lng: {selectedZone.longitude.toFixed(4)}
                </div>

                {/* Metrics Table */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: '#f8fafc', borderRadius: '6px' }}>
                    <span style={{ color: '#64748b' }}>Flood Probability:</span>
                    <strong style={{ color: selectedZone.flood_probability >= 75 ? '#dc2626' : '#0284c7', fontSize: '1rem' }}>
                      {selectedZone.flood_probability}%
                    </strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: '#f8fafc', borderRadius: '6px' }}>
                    <span style={{ color: '#64748b' }}>Expected Flooding:</span>
                    <strong style={{ color: '#991b1b' }}>{selectedZone.predicted_time}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: '#f8fafc', borderRadius: '6px' }}>
                    <span style={{ color: '#64748b' }}>Current Rainfall:</span>
                    <strong>{selectedZone.rainfall_rate} mm/hr</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: '#f8fafc', borderRadius: '6px' }}>
                    <span style={{ color: '#64748b' }}>Forecast Rainfall:</span>
                    <strong>{selectedZone.forecast_rainfall} mm/hr</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: '#f8fafc', borderRadius: '6px' }}>
                    <span style={{ color: '#64748b' }}>Drain Capacity:</span>
                    <strong>{selectedZone.drainage_capacity} mm/hr</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: '#f8fafc', borderRadius: '6px' }}>
                    <span style={{ color: '#64748b' }}>Drain Load ({selectedZone.drain_id}):</span>
                    <strong style={{ color: selectedZone.drainage_utilization > 80 ? '#dc2626' : '#0f172a' }}>
                      {selectedZone.drainage_utilization}%
                    </strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: '#f8fafc', borderRadius: '6px' }}>
                    <span style={{ color: '#64748b' }}>Terrain Elevation:</span>
                    <strong>{selectedZone.elevation} m (MSL)</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: '#f8fafc', borderRadius: '6px' }}>
                    <span style={{ color: '#64748b' }}>Water Accumulation:</span>
                    <strong style={{ color: '#ea580c' }}>{selectedZone.water_accumulation || 'Moderate'}</strong>
                  </div>
                </div>

                {/* Recommendation Box */}
                <div style={{
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '0.8rem',
                  color: '#1e3a8a',
                  lineHeight: 1.4,
                  marginBottom: '16px'
                }}>
                  <strong style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#0369a1', marginBottom: '4px' }}>
                    <Shield size={14} /> Recommended Action:
                  </strong>
                  {selectedZone.recommended_action}
                </div>
              </div>

              {/* Explainable AI trigger */}
              <button
                onClick={() => setExplainZone(selectedZone)}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '10px 14px' }}
              >
                <Brain size={16} />
                <span>Explain Risk Factors (XAI)</span>
              </button>
            </div>
          ) : (
            <div className="gov-card" style={{ padding: '30px 20px', textAlign: 'center', color: '#64748b' }}>
              <MapPin size={32} color="#94a3b8" style={{ margin: '0 auto 10px auto' }} />
              <div style={{ fontWeight: 600 }}>Click any zone pin on the map</div>
              <div style={{ fontSize: '0.78rem' }}>Inspect localized rainfall, drainage load, and AI nowcasting telemetry.</div>
            </div>
          )}

          {/* Quick Zone Directory list */}
          <div className="gov-card" style={{ padding: '14px', maxHeight: '220px', overflowY: 'auto' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
              Locality Quick Jump ({zones.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {zones.map(z => (
                <button
                  key={z.location_id}
                  onClick={() => setSelectedZone(z)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    background: selectedZone?.location_id === z.location_id ? '#e0f2fe' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>{z.name}</span>
                  <span className={`badge-${z.risk_level.toLowerCase()}`} style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                    {Math.round(z.flood_probability)}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
