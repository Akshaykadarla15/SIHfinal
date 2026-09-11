import React, { useState, useEffect } from 'react';
import { useFlood } from '../context/FloodContext';
import { useAuth } from '../context/AuthContext';
import { LeafletMap } from '../maps/LeafletMap';
import { Search, Brain, MapPin, AlertTriangle, Shield, Clock, Layers, Waves, ArrowRight, Camera } from 'lucide-react';
import axios from 'axios';

export const FloodMapPage = () => {
  const { dashboardData, selectedZone, setSelectedZone, setExplainZone, city } = useFlood();
  const { currentUser } = useAuth();
  const isPublic = currentUser?.role === 'public';

  const [searchQuery, setSearchQuery] = useState('');
  const [citizenReports, setCitizenReports] = useState([
    {
      id: 101,
      city: 'Hyderabad',
      location_name: 'Begumpet Underpass',
      latitude: 17.4447,
      longitude: 78.4664,
      water_depth: 'Waist-deep (> 2 ft)',
      description: 'Rasoolpura underpass submerged. Municipal pumps actively draining.',
      reporter_name: 'Citizen Vikram',
      status: 'verified'
    },
    {
      id: 102,
      city: 'Hyderabad',
      location_name: 'Kukatpally Culvert',
      latitude: 17.4933,
      longitude: 78.3914,
      water_depth: 'Knee-deep (1-2 ft)',
      description: 'Water overflowing near metro entrance.',
      reporter_name: 'Resident Suresh',
      status: 'verified'
    }
  ]);

  useEffect(() => {
    // Fetch live citizen waterlogging reports from backend
    axios.get(`${import.meta.env.VITE_API_URL}/reports/waterlogging?city=${encodeURIComponent(city)}`)
      .then(res => {
        if (res.data && res.data.length > 0) {
          setCitizenReports(res.data);
        }
      })
      .catch(() => {
        // Fallback to initial seeds
      });
  }, [city]);

  const zones = dashboardData?.zones || [];

  const filteredZones = zones.filter(z =>
    z.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Top Search & Filter Bar */}
      <div className="gov-card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>
              Geospatial Flood Risk & Nowcasting Map ({city})
            </h2>
            {isPublic && (
              <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '999px' }}>
                CITIZEN PORTAL (READ-ONLY)
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            {isPublic
              ? 'Locate your neighborhood, view road waterlogging susceptibility, and see crowdsourced citizen reports'
              : 'Interactive early-warning GIS overlay displaying localized waterlogging susceptibility and citizen hazard pins'}
          </div>
        </div>

        {/* Search Box */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '5px 10px',
            borderRadius: '6px',
            fontWeight: 700
          }}>
            <Camera size={14} color="#16a34a" />
            <span>{citizenReports.length} Citizen Pins Active</span>
          </div>
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
            citizenReports={citizenReports}
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px', fontSize: '0.8rem' }}>
                  <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Flood Probability</div>
                    <strong style={{ fontSize: '1.15rem', color: selectedZone.flood_probability >= 75 ? '#dc2626' : '#0284c7' }}>
                      {selectedZone.flood_probability}%
                    </strong>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Predicted Inundation</div>
                    <strong style={{ fontSize: '0.88rem', color: '#1e293b' }}>
                      {selectedZone.predicted_time}
                    </strong>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Rainfall Intensity</div>
                    <strong style={{ fontSize: '0.88rem', color: '#1e293b' }}>
                      {selectedZone.rainfall_rate} mm/hr
                    </strong>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Drain Load ({selectedZone.drain_id})</div>
                    <strong style={{ fontSize: '0.88rem', color: selectedZone.drainage_utilization > 80 ? '#dc2626' : '#1e293b' }}>
                      {selectedZone.drainage_utilization}%
                    </strong>
                  </div>
                </div>

                {/* Recommended action */}
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
              <div style={{ fontWeight: 600 }}>Click any zone pin or camera icon</div>
              <div style={{ fontSize: '0.78rem' }}>Inspect localized rainfall, drainage load, or citizen hazard reports.</div>
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
