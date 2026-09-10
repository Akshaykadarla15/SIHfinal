import React, { useState, useEffect } from 'react';
import { useFlood } from '../context/FloodContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { DrainageBarChart } from '../charts/DrainageBarChart';
import { Waves, AlertTriangle, ShieldCheck, Wrench, CheckCircle, Edit3, X } from 'lucide-react';

export const DrainagePage = () => {
  const { city } = useFlood();
  const { currentUser } = useAuth();
  const [drainageData, setDrainageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingDrain, setEditingDrain] = useState(null);
  const [reportSuccess, setReportSuccess] = useState('');

  const loadDrainage = async () => {
    setLoading(true);
    try {
      const res = await apiService.getDrainage(city);
      setDrainageData(res);
    } catch (err) {
      console.error('Error loading drainage:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrainage();
  }, [city]);

  const handleUpdateDrain = async (e) => {
    e.preventDefault();
    if (!editingDrain) return;
    try {
      await apiService.updateDrainage({
        drain_id: editingDrain.drain_id,
        blockage_status: editingDrain.blockage_status,
        blockage_percentage: parseFloat(editingDrain.blockage_percentage),
        reported_by: `${currentUser?.name || 'Field Officer'} (${currentUser?.badge || 'Zonal Team'})`
      });
      setReportSuccess(`Status for ${editingDrain.drain_id} updated successfully!`);
      setEditingDrain(null);
      loadDrainage();
      setTimeout(() => setReportSuccess(''), 4000);
    } catch (err) {
      alert('Failed to update drainage: ' + err.message);
    }
  };

  if (loading || !drainageData) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading drainage telemetry for {city}...</div>;
  }

  const { summary, drains } = drainageData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Success Notification */}
      {reportSuccess && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#065f46',
          borderRadius: '8px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 600,
          fontSize: '0.85rem'
        }}>
          <CheckCircle size={18} />
          <span>{reportSuccess}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px'
      }}>
        <div className="gov-card">
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Monitored Drainage Culverts</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>{summary.total_drains} Outfalls</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Telemetry Instrumented</div>
        </div>

        <div className="gov-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Critical Surcharged Channels</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#dc2626', margin: '4px 0' }}>{summary.critical_drains} Drains</div>
          <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600 }}>Imminent backflow risk</div>
        </div>

        <div className="gov-card" style={{ borderLeft: '4px solid #eab308' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Warning Level Channels</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d97706', margin: '4px 0' }}>{summary.warning_drains} Drains</div>
          <div style={{ fontSize: '0.75rem', color: '#d97706' }}>Flow exceeding 65%</div>
        </div>

        <div className="gov-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Average Drainage Load</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0284c7', margin: '4px 0' }}>{summary.average_utilization}%</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Hydraulic capacity in use</div>
        </div>
      </div>

      {/* Capacity vs Load Bar Chart */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>
              Drainage Design Capacity vs Current Runoff Load (mm/hr)
            </h3>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Identifies zones where runoff flow is exceeding channel conveyance thresholds
            </div>
          </div>
        </div>

        <DrainageBarChart data={drains} height={280} />
      </div>

      {/* Main Drainage Inventory Table */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>
              Storm Water Drainage Infrastructure Registry ({city})
            </h3>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              {currentUser?.role === 'officer' ? 'Field Officer Mode: Click "Report Update" to submit drain clearance updates.' : 'Real-time telemetry and blockage inspection logs.'}
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                <th style={{ padding: '10px 14px' }}>Drain ID</th>
                <th style={{ padding: '10px 14px' }}>Location</th>
                <th style={{ padding: '10px 14px' }}>Max Capacity</th>
                <th style={{ padding: '10px 14px' }}>Current Load</th>
                <th style={{ padding: '10px 14px' }}>Utilization</th>
                <th style={{ padding: '10px 14px' }}>Blockage Status</th>
                <th style={{ padding: '10px 14px' }}>Overflow Risk</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
                <th style={{ padding: '10px 14px' }}>Last Inspected</th>
                <th style={{ padding: '10px 14px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {drains.map((d, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0284c7' }}>{d.drain_id}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0f172a' }}>{d.location_name}</td>
                  <td style={{ padding: '10px 14px' }}>{d.max_capacity} mm/hr</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: d.current_load > d.max_capacity * 0.8 ? '#dc2626' : '#1e293b' }}>
                    {d.current_load} mm/hr
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, width: '40px' }}>{d.utilization_percentage}%</span>
                      <div style={{ width: '60px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${Math.min(100, d.utilization_percentage)}%`,
                          height: '100%',
                          background: d.utilization_percentage > 85 ? '#ef4444' : (d.utilization_percentage > 65 ? '#f97316' : '#10b981')
                        }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{
                      fontWeight: 600,
                      color: d.blockage_status === 'Severe' ? '#dc2626' : (d.blockage_status === 'Suspected' ? '#ea580c' : '#059669')
                    }}>
                      {d.blockage_status} ({d.blockage_percentage}%)
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span className={`badge-${d.overflow_risk.toLowerCase()}`}>
                      {d.overflow_risk}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span className={d.status === 'Critical' ? 'badge-critical' : (d.status === 'Warning' ? 'badge-moderate' : 'badge-safe')}>
                      {d.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', color: '#64748b' }}>
                    {d.last_inspection}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <button
                      onClick={() => setEditingDrain({ ...d })}
                      className="btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                    >
                      <Edit3 size={13} />
                      <span>Update Status</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Field Officer Update Modal */}
      {editingDrain && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '480px',
            padding: '24px',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid #cbd5e1'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wrench size={20} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>
                  Field Status: {editingDrain.drain_id} ({editingDrain.location_name})
                </h3>
              </div>
              <button
                onClick={() => setEditingDrain(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateDrain} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Blockage Condition
                </label>
                <select
                  value={editingDrain.blockage_status}
                  onChange={(e) => setEditingDrain({ ...editingDrain, blockage_status: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="Clear">Clear (Normal Flow)</option>
                  <option value="Minor">Minor Silt / Leaves (&lt;15%)</option>
                  <option value="Suspected">Suspected Debris Choke (25–40%)</option>
                  <option value="Severe">Severe Trash / Silt Blockage (&gt;50%)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Estimated Blockage Percentage: {editingDrain.blockage_percentage}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editingDrain.blockage_percentage}
                  onChange={(e) => setEditingDrain({ ...editingDrain, blockage_percentage: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ fontSize: '0.78rem', color: '#64748b', background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                Submitting this update will recalculate overflow risk and alert central disaster command.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setEditingDrain(null)}
                  className="btn-secondary"
                  style={{ fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ fontSize: '0.85rem' }}
                >
                  Save & Log Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
