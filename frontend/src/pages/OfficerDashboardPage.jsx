import React, { useState } from 'react';
import { useFlood } from '../context/FloodContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import {
  ClipboardCheck,
  AlertTriangle,
  Waves,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  UserCheck,
  ChevronRight,
  Flame,
  Search
} from 'lucide-react';

export const OfficerDashboardPage = ({ onNavigate }) => {
  const { dashboardData, loading, setSelectedZone, city } = useFlood();
  const { currentUser } = useAuth();
  const [acknowledgedList, setAcknowledgedList] = useState([]);
  const [acknowledgingId, setAcknowledgingId] = useState(null);

  if (loading || !dashboardData) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading field operations telemetry for {city}...</div>
      </div>
    );
  }

  const { zones = [], active_alerts = [] } = dashboardData;

  // Filter tasks
  const inspectionNeededZones = zones.filter(
    z => z.risk_level === 'Critical' || z.risk_level === 'High' || z.water_accumulation === 'Severe' || z.water_accumulation === 'High'
  );

  const pendingAlerts = active_alerts.filter(
    a => !acknowledgedList.includes(a.id) && (a.severity === 'Critical' || a.severity === 'High')
  );

  const culvertBlockages = zones.filter(
    z => (z.drainage_blockage && z.drainage_blockage > 10) || z.drainage_utilization > 75
  );

  const handleAcknowledge = async (alertId) => {
    setAcknowledgingId(alertId);
    try {
      await apiService.updateAlertAction(alertId, 'acknowledge', currentUser?.name || 'Insp. Vikram Rao');
      setAcknowledgedList(prev => [...prev, alertId]);
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    } finally {
      setAcknowledgingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Officer Operational Shift Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
        borderRadius: '12px',
        padding: '18px 22px',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: '0 4px 14px rgba(13, 148, 136, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.2rem'
          }}>
            <ClipboardCheck size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                Zonal Field Command & Rapid Response Center
              </h2>
              <span style={{
                background: 'rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '999px',
                textTransform: 'uppercase'
              }}>
                On-Duty Active
              </span>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#ccfbf1', marginTop: '2px' }}>
              Officer: <strong>{currentUser?.name || 'Insp. Vikram Rao'}</strong> • Unit: <strong>Zonal Storm Response Unit 4 ({city})</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onNavigate('field-inspections')}
            style={{
              background: '#ffffff',
              color: '#0f766e',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <ClipboardCheck size={16} color="#0d9488" />
            <span>Log Field Inspection</span>
          </button>
          <button
            onClick={() => onNavigate('map')}
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <MapPin size={15} />
            <span>Zonal Map</span>
          </button>
        </div>
      </div>

      {/* 4 Task Telemetry Chips */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '14px'
      }}>
        <div className="gov-card" style={{ padding: '16px 18px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Pending Unacknowledged Alerts
            </span>
            <AlertTriangle size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px 0' }}>
            {pendingAlerts.length}
          </div>
          <div style={{ fontSize: '0.74rem', color: pendingAlerts.length > 0 ? '#b91c1c' : '#15803d', fontWeight: 600 }}>
            {pendingAlerts.length > 0 ? 'Requires immediate acknowledgement' : 'All alerts acknowledged'}
          </div>
        </div>

        <div className="gov-card" style={{ padding: '16px 18px', borderLeft: '4px solid #ea580c' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Priority Inspection Zones
            </span>
            <MapPin size={18} color="#ea580c" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px 0' }}>
            {inspectionNeededZones.length}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
            High & Critical waterlogging basins
          </div>
        </div>

        <div className="gov-card" style={{ padding: '16px 18px', borderLeft: '4px solid #0d9488' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Culverts Needing Clearance
            </span>
            <Waves size={18} color="#0d9488" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px 0' }}>
            {culvertBlockages.length}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
            Blockage &gt; 10% or flow &gt; 75%
          </div>
        </div>

        <div className="gov-card" style={{ padding: '16px 18px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Deployed Mobile Pumps
            </span>
            <ShieldCheck size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px 0' }}>
            6 Units
          </div>
          <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 600 }}>
            Active de-watering underway
          </div>
        </div>
      </div>

      {/* 3 Actionable Task Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '20px'
      }}>
        {/* TASK CARD 1: Unacknowledged Emergency Alerts */}
        <div className="gov-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="gov-card-header" style={{ borderBottom: '1px solid #fee2e2', background: '#fff5f5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="#dc2626" />
              <div>
                <h3 style={{ margin: 0, fontSize: '0.98rem', color: '#991b1b' }}>
                  Unacknowledged Alerts
                </h3>
                <div style={{ fontSize: '0.72rem', color: '#b91c1c' }}>
                  Require field officer sign-off & dispatch confirmation
                </div>
              </div>
            </div>
            <span style={{
              background: '#ef4444',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '999px'
            }}>
              {pendingAlerts.length} PENDING
            </span>
          </div>

          <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {pendingAlerts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: '#10b981' }}>
                <CheckCircle2 size={32} style={{ margin: '0 auto 8px auto', display: 'block' }} />
                <strong style={{ fontSize: '0.9rem' }}>All active alerts have been acknowledged!</strong>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                  Continue monitoring radar and drainage telemetry.
                </div>
              </div>
            ) : (
              pendingAlerts.map(a => (
                <div key={a.id} style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderLeft: `4px solid ${a.severity === 'Critical' ? '#dc2626' : '#ea580c'}`,
                  borderRadius: '8px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                      {a.location_name}
                    </span>
                    <span className={`badge-${a.severity.toLowerCase()}`} style={{ fontSize: '0.68rem' }}>
                      {a.severity}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
                    {a.reason}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', paddingTop: '6px', borderTop: '1px dashed #e2e8f0' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Flood Prob: <strong>{a.flood_probability}%</strong> ({a.expected_time})
                    </span>

                    <button
                      onClick={() => handleAcknowledge(a.id)}
                      disabled={acknowledgingId === a.id}
                      style={{
                        background: '#0d9488',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <CheckCircle2 size={13} />
                      <span>{acknowledgingId === a.id ? 'Acknowledging...' : 'Acknowledge'}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ padding: '10px 16px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', textAlign: 'right' }}>
            <button
              onClick={() => onNavigate('alerts')}
              style={{ background: 'none', border: 'none', color: '#0d9488', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              View All Emergency Alerts →
            </button>
          </div>
        </div>

        {/* TASK CARD 2: Zones Needing Field Inspection */}
        <div className="gov-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="gov-card-header" style={{ borderBottom: '1px solid #fed7aa', background: '#fffaf5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="#ea580c" />
              <div>
                <h3 style={{ margin: 0, fontSize: '0.98rem', color: '#9a3412' }}>
                  Zones Needing Field Inspection
                </h3>
                <div style={{ fontSize: '0.72rem', color: '#c2410c' }}>
                  Low-lying basins approaching water accumulation limit
                </div>
              </div>
            </div>
            <span style={{
              background: '#ea580c',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '999px'
            }}>
              {inspectionNeededZones.length} BASINS
            </span>
          </div>

          <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            {inspectionNeededZones.map(z => (
              <div key={z.location_id || z.name} style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{z.name}</strong>
                    <span className={`badge-${z.risk_level.toLowerCase()}`} style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                      {z.risk_level}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '3px' }}>
                    Elev: <strong>{z.elevation}m</strong> • Rainfall: <strong>{z.rainfall_rate} mm/hr</strong> • Drain: <strong>{z.drain_id}</strong>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedZone(z);
                    onNavigate('field-inspections');
                  }}
                  style={{
                    background: '#0d9488',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <ClipboardCheck size={13} />
                  <span>Inspect</span>
                </button>
              </div>
            ))}
          </div>

          <div style={{ padding: '10px 16px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', textAlign: 'right' }}>
            <button
              onClick={() => onNavigate('field-inspections')}
              style={{ background: 'none', border: 'none', color: '#0d9488', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Open Full Inspection Log →
            </button>
          </div>
        </div>

        {/* TASK CARD 3: Active Culvert Blockages */}
        <div className="gov-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="gov-card-header" style={{ borderBottom: '1px solid #ccfbf1', background: '#f0fdfa' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Waves size={18} color="#0d9488" />
              <div>
                <h3 style={{ margin: 0, fontSize: '0.98rem', color: '#0f766e' }}>
                  Active Culvert Blockages
                </h3>
                <div style={{ fontSize: '0.72rem', color: '#0d9488' }}>
                  Reported silt, debris, or trash accumulation
                </div>
              </div>
            </div>
            <span style={{
              background: '#0d9488',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '999px'
            }}>
              {culvertBlockages.length} DRAINS
            </span>
          </div>

          <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            {culvertBlockages.map(d => (
              <div key={d.drain_id || d.name} style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <strong style={{ fontSize: '0.86rem', color: '#0f172a' }}>{d.drain_id || 'DR-101'}</strong>
                    <span style={{ fontSize: '0.78rem', color: '#475569' }}>({d.name})</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '3px' }}>
                    Load: <strong>{d.drainage_utilization}%</strong> • Blockage: <strong style={{ color: d.drainage_blockage > 20 ? '#dc2626' : '#ea580c' }}>{d.drainage_blockage || 15}%</strong>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedZone(d);
                    onNavigate('drainage');
                  }}
                  style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Waves size={13} />
                  <span>Clear / Update</span>
                </button>
              </div>
            ))}
          </div>

          <div style={{ padding: '10px 16px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', textAlign: 'right' }}>
            <button
              onClick={() => onNavigate('drainage')}
              style={{ background: 'none', border: 'none', color: '#0d9488', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Manage Drainage Telemetry →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
