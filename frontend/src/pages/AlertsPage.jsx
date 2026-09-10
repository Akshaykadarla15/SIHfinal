import React, { useState, useEffect } from 'react';
import { useFlood } from '../context/FloodContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { AlertTriangle, CheckCircle, Flame, ShieldAlert, ArrowUpRight, Check, Send, AlertOctagon } from 'lucide-react';

export const AlertsPage = () => {
  const { city } = useFlood();
  const { currentUser } = useAuth();

  const [alerts, setAlerts] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'acknowledged', 'resolved'
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const res = await apiService.getAlerts(city);
      setAlerts(res.alerts || []);
    } catch (err) {
      console.error('Failed to load alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [city]);

  const handleAlertAction = async (alertId, action) => {
    try {
      await apiService.updateAlertAction(
        alertId,
        action,
        currentUser?.name || 'Authorized Officer'
      );
      setActionMessage(`Alert #${alertId} updated to: ${action.toUpperCase()}`);
      loadAlerts();
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err) {
      alert('Failed to update alert: ' + err.message);
    }
  };

  const filteredAlerts = alerts.filter(a => {
    if (filterStatus === 'all') return true;
    return a.status === filterStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header Bar */}
      <div className="gov-card" style={{ padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>
            Automated Early Warning & Alert Management ({city})
          </h2>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Threshold-triggered public safety warnings with full incident command escalation workflows
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'all', label: 'All Alerts' },
            { id: 'active', label: 'Active Only' },
            { id: 'acknowledged', label: 'Acknowledged' },
            { id: 'resolved', label: 'Resolved' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              style={{
                background: filterStatus === tab.id ? '#0284c7' : '#f1f5f9',
                color: filterStatus === tab.id ? '#fff' : '#475569',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionMessage && (
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
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Alerts Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => {
            const isCritical = alert.severity === 'Critical';
            const isHigh = alert.severity === 'High';
            const accentColor = isCritical ? '#ef4444' : (isHigh ? '#f97316' : '#eab308');

            return (
              <div
                key={alert.id}
                className="gov-card"
                style={{
                  borderLeft: `5px solid ${accentColor}`,
                  padding: '20px',
                  background: isCritical ? '#fffbfa' : '#ffffff'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: isCritical ? '#fef2f2' : '#fff7ed',
                      color: accentColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {isCritical ? <Flame size={20} /> : <AlertTriangle size={20} />}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>
                          {alert.title}
                        </h3>
                        <span className={`badge-${alert.severity.toLowerCase()}`}>
                          {alert.severity} Alert
                        </span>
                        <span style={{
                          background: '#f1f5f9',
                          color: '#475569',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          textTransform: 'uppercase'
                        }}>
                          Status: {alert.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        Location: <strong>{alert.location_name}</strong> • Time logged: {alert.created_at}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Flood Probability</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: accentColor }}>
                      {alert.flood_probability}%
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  fontSize: '0.82rem',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '14px'
                }}>
                  <div>
                    <strong style={{ color: '#475569', display: 'block', marginBottom: '2px' }}>Reason / Cause:</strong>
                    <span style={{ color: '#1e293b' }}>{alert.reason}</span>
                  </div>
                  <div>
                    <strong style={{ color: '#475569', display: 'block', marginBottom: '2px' }}>Expected Inundation Window:</strong>
                    <span style={{ color: '#dc2626', fontWeight: 700 }}>{alert.expected_time}</span>
                  </div>
                </div>

                {/* Recommendation & Action Controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ fontSize: '0.82rem', color: '#1e3a8a', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '8px 12px', flex: 1 }}>
                    <strong>Standard Operating Procedure:</strong> {alert.recommended_action}
                  </div>

                  {/* Incident Command Actions (Hidden from public; escalate restricted to admin) */}
                  {currentUser?.role !== 'public' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {alert.status === 'active' && (
                        <button
                          onClick={() => handleAlertAction(alert.id, 'acknowledge')}
                          className="btn-secondary"
                          style={{ fontSize: '0.78rem' }}
                        >
                          <Check size={14} color="#0284c7" />
                          <span>Acknowledge</span>
                        </button>
                      )}

                      {alert.status !== 'resolved' && (
                        <button
                          onClick={() => handleAlertAction(alert.id, 'resolve')}
                          className="btn-secondary"
                          style={{ fontSize: '0.78rem', color: '#065f46' }}
                        >
                          <CheckCircle size={14} color="#059669" />
                          <span>Mark as Resolved</span>
                        </button>
                      )}

                      {currentUser?.role === 'admin' && isHigh && alert.status !== 'resolved' && (
                        <button
                          onClick={() => handleAlertAction(alert.id, 'escalate')}
                          className="btn-danger"
                          style={{ fontSize: '0.78rem' }}
                        >
                          <AlertOctagon size={14} />
                          <span>Escalate to Critical</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="gov-card" style={{ padding: '50px', textAlign: 'center', color: '#64748b' }}>
            <CheckCircle size={36} color="#10b981" style={{ margin: '0 auto 10px auto' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>No matching alerts</div>
            <div style={{ fontSize: '0.85rem' }}>All municipal drainage zones operating within threshold limits.</div>
          </div>
        )}
      </div>
    </div>
  );
};
