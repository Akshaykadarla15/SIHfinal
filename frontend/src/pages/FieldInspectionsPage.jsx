import React, { useState } from 'react';
import { useFlood } from '../context/FloodContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  Waves,
  MapPin,
  Calendar,
  Save,
  Clock,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';

export const FieldInspectionsPage = () => {
  const { dashboardData, selectedZone, city } = useFlood();
  const { currentUser } = useAuth();
  const zones = dashboardData?.zones || [];

  const [selectedZoneName, setSelectedZoneName] = useState(selectedZone?.name || zones[0]?.name || 'Begumpet');
  const activeZone = zones.find(z => z.name === selectedZoneName) || zones[0] || {};

  const [formData, setFormData] = useState({
    blockage_status: activeZone.drainage_blockage > 20 ? 'Severe' : (activeZone.drainage_blockage > 10 ? 'Suspected' : 'Clear'),
    blockage_percentage: activeZone.drainage_blockage || 15,
    water_depth_cm: 25,
    debris_type: 'Plastic & Trash Debris',
    pump_deployed: activeZone.risk_level === 'Critical' ? 'Yes' : 'No',
    inspection_notes: `Inspected culvert ${activeZone.drain_id || 'DR-HYD-102'} during rapid patrol. Inflow rate sustained.`
  });

  const [successMessage, setSuccessMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Past mock logs
  const [inspectionLogs, setInspectionLogs] = useState([
    {
      id: 1,
      zone: 'Begumpet',
      drain_id: 'DR-HYD-112',
      officer: 'Insp. Vikram Rao',
      time: 'Today, 09:15 AM',
      blockage: '35% (Severe)',
      status: 'Pump Deployed',
      notes: 'Culvert under Prakash Nagar choked with plastic bags. 20 HP mobile pump active.'
    },
    {
      id: 2,
      zone: 'Kukatpally',
      drain_id: 'DR-HYD-102',
      officer: 'Insp. Vikram Rao',
      time: 'Today, 08:30 AM',
      blockage: '25% (Suspected)',
      status: 'Clearing Crew Dispatched',
      notes: 'Silt buildup around intake grate. Municipal sanitation crew manually desilting.'
    },
    {
      id: 3,
      zone: 'Tolichowki',
      drain_id: 'DR-HYD-140',
      officer: 'Sub-Insp. K. Praveen',
      time: 'Today, 07:45 AM',
      blockage: '40% (Severe)',
      status: 'Barricaded',
      notes: 'Low-lying culvert overflowed onto service road. Traffic police diverted light vehicles.'
    }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiService.updateDrainage({
        drain_id: activeZone.drain_id || 'DR-HYD-101',
        blockage_status: formData.blockage_status,
        blockage_percentage: Number(formData.blockage_percentage),
        reported_by: currentUser?.name || 'Insp. Vikram Rao'
      });

      const newLog = {
        id: Date.now(),
        zone: selectedZoneName,
        drain_id: activeZone.drain_id || 'DR-HYD-101',
        officer: currentUser?.name || 'Insp. Vikram Rao',
        time: 'Just now',
        blockage: `${formData.blockage_percentage}% (${formData.blockage_status})`,
        status: formData.pump_deployed === 'Yes' ? 'Pump Deployed' : 'Inspected',
        notes: formData.inspection_notes
      };

      setInspectionLogs(prev => [newLog, ...prev]);
      setSuccessMessage(`Inspection successfully logged for ${selectedZoneName} (${activeZone.drain_id || 'DR-HYD-101'})!`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error('Failed to submit inspection:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Banner */}
      <div className="gov-card" style={{ padding: '16px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: '#ccfbf1',
              color: '#0d9488',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ClipboardCheck size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>
                Zonal Field Inspection Log & Drainage Telemetry Update
              </h2>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Officer field reports instantly calibrate AI nowcasting drainage utilization coefficients
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} color="#0d9488" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Target Zone:</span>
            <select
              value={selectedZoneName}
              onChange={(e) => setSelectedZoneName(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#0f172a',
                background: '#fff'
              }}
            >
              {zones.map(z => (
                <option key={z.name} value={z.name}>{z.name} ({z.drain_id})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {successMessage && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '8px',
          padding: '12px 18px',
          color: '#065f46',
          fontSize: '0.86rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} color="#059669" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Grid: Inspection Form (Left) & Recent Logs (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 1.3fr',
        gap: '22px'
      }}>
        {/* Form Card */}
        <div className="gov-card">
          <div className="gov-card-header">
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>
              Log Physical Culvert Inspection
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{activeZone.drain_id || 'DR-HYD-102'}</span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Blockage Severity
                </label>
                <select
                  value={formData.blockage_status}
                  onChange={(e) => setFormData({ ...formData, blockage_status: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="Clear">Clear (0 - 5%)</option>
                  <option value="Minor">Minor (5 - 15%)</option>
                  <option value="Suspected">Suspected (15 - 30%)</option>
                  <option value="Severe">Severe (&gt; 30%)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Estimated Blockage: {formData.blockage_percentage}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.blockage_percentage}
                  onChange={(e) => setFormData({ ...formData, blockage_percentage: Number(e.target.value) })}
                  style={{ width: '100%', accentColor: '#0d9488', marginTop: '6px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Standing Water Depth (cm)
                </label>
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={formData.water_depth_cm}
                  onChange={(e) => setFormData({ ...formData, water_depth_cm: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Mobile Dewatering Pump Deployed?
                </label>
                <select
                  value={formData.pump_deployed}
                  onChange={(e) => setFormData({ ...formData, pump_deployed: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="No">No (Flow Adequate)</option>
                  <option value="Yes">Yes (Active Pump Operating)</option>
                  <option value="Requested">Requested from Base Depot</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Primary Obstruction Material
              </label>
              <select
                value={formData.debris_type}
                onChange={(e) => setFormData({ ...formData, debris_type: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem'
                }}
              >
                <option value="Plastic & Trash Debris">Plastic & Trash Debris</option>
                <option value="Construction Rubble & Gravel">Construction Rubble & Gravel</option>
                <option value="Heavy Silt & Clay Sediment">Heavy Silt & Clay Sediment</option>
                <option value="Uprooted Tree Branches">Uprooted Tree Branches</option>
                <option value="None / Natural Flow">None / Natural Flow</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Field Observation Notes & Directives
              </label>
              <textarea
                rows="3"
                value={formData.inspection_notes}
                onChange={(e) => setFormData({ ...formData, inspection_notes: e.target.value })}
                placeholder="Details of physical culvert state, traffic disruption, or pump placement..."
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                background: '#0d9488',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 18px',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 4px rgba(13, 148, 136, 0.2)'
              }}
            >
              <Save size={16} />
              <span>{submitting ? 'Submitting to Municipal GIS...' : 'Save Inspection Record'}</span>
            </button>
          </form>
        </div>

        {/* Recent Inspection Logs Table */}
        <div className="gov-card">
          <div className="gov-card-header">
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>
              Recent Zonal Inspection Log ({inspectionLogs.length})
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Auto-synced with Dispatch</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '520px', overflowY: 'auto' }}>
            {inspectionLogs.map(log => (
              <div key={log.id} style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{log.zone}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>({log.drain_id})</span>
                  </div>
                  <span style={{
                    fontSize: '0.7rem',
                    background: log.status.includes('Pump') ? '#ccfbf1' : '#f1f5f9',
                    color: log.status.includes('Pump') ? '#0f766e' : '#475569',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontWeight: 700
                  }}>
                    {log.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#334155' }}>
                  {log.notes}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '4px', borderTop: '1px solid #edf2f7', paddingTop: '4px' }}>
                  <span>Officer: <strong>{log.officer}</strong></span>
                  <span>Blockage: <strong>{log.blockage}</strong></span>
                  <span><Clock size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
