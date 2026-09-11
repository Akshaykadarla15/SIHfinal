import React, { useState, useEffect } from 'react';
import { useFlood } from '../context/FloodContext';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { FileText, Download, Printer, Shield, CheckCircle, AlertTriangle } from 'lucide-react';

export const ReportsPage = () => {
  const { city } = useFlood();
  const { currentUser } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('daily');

  useEffect(() => {
    const loadReport = async () => {
      setLoading(true);
      try {
        const res = await apiService.getReportSummary(city);
        setReport(res);
      } catch (err) {
        console.error('Failed to load report:', err);
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, [city, reportType]);

  const handleDownloadCsv = () => {
    window.open(`${import.meta.env.VITE_API_URL}/reports/download-csv?city=${encodeURIComponent(city)}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !report) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Generating official municipal report for {city}...</div>;
  }

  const { executive_summary, high_risk_zones, all_zones, recommendations } = report;
  const isPublic = currentUser?.role === 'public';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Action Header */}
      <div className="gov-card" style={{ padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>
            {isPublic ? 'Citizen Safety Flood Bulletin' : 'Official Municipal Disaster Management Bulletins'}
          </h2>
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            {isPublic
              ? 'Official advisory summary and emergency guidelines issued for citizens in ' + city
              : 'Automated daily and operational situation reports ready for administration dissemination'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handlePrint}
            className="btn-secondary"
            style={{ fontSize: '0.82rem' }}
          >
            <Printer size={15} />
            <span>Print Bulletin</span>
          </button>

          {!isPublic && (
            <button
              onClick={handleDownloadCsv}
              className="btn-primary"
              style={{ fontSize: '0.82rem' }}
            >
              <Download size={15} />
              <span>Download CSV Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="gov-card" style={{ padding: '32px 36px', background: '#ffffff', boxShadow: 'var(--shadow-md)' }}>
        {/* Document Header */}
        <div style={{
          textAlign: 'center',
          borderBottom: '2px solid #0f172a',
          paddingBottom: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            GOVERNMENT OF TELANGANA • DISASTER MANAGEMENT AUTHORITY
          </div>
          <h1 style={{ fontSize: '1.45rem', color: '#0f172a', margin: '6px 0' }}>
            {report.report_title}
          </h1>
          <div style={{ fontSize: '0.82rem', color: '#475569' }}>
            Bulletin Generated: <strong>{report.generated_at}</strong> • Target City: <strong>{report.city}</strong>
          </div>
        </div>

        {/* Executive Summary Metrics Box */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          padding: '16px 20px',
          marginBottom: '24px'
        }}>
          <h3 style={{ fontSize: '0.95rem', color: '#0f172a', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            1. Executive Assessment Summary
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>City Risk Index</div>
              <strong style={{ fontSize: '1.2rem', color: executive_summary.overall_status === 'CRITICAL' ? '#dc2626' : '#ea580c' }}>
                {executive_summary.overall_status}
              </strong>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Peak Recorded Rain</div>
              <strong style={{ fontSize: '1.1rem', color: '#0284c7' }}>{executive_summary.max_rainfall_recorded}</strong>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Forecast Peak Rate</div>
              <strong style={{ fontSize: '1.1rem', color: '#ea580c' }}>{executive_summary.forecast_peak}</strong>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Critical Basins Count</div>
              <strong style={{ fontSize: '1.1rem', color: '#dc2626' }}>{executive_summary.critical_areas_count} Zones</strong>
            </div>
          </div>
        </div>

        {/* High-Risk Zones Breakdown */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '0.95rem', color: '#0f172a', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            2. High-Priority Inundation Zones
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '8px 12px' }}>Locality</th>
                <th style={{ padding: '8px 12px' }}>Rainfall Rate</th>
                <th style={{ padding: '8px 12px' }}>Drain Load</th>
                <th style={{ padding: '8px 12px' }}>Flood Probability</th>
                <th style={{ padding: '8px 12px' }}>Expected Flood Window</th>
                <th style={{ padding: '8px 12px' }}>Action Standard</th>
              </tr>
            </thead>
            <tbody>
              {high_risk_zones.map((z, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 700 }}>{z.name}</td>
                  <td style={{ padding: '8px 12px' }}>{z.rainfall_rate} mm/hr</td>
                  <td style={{ padding: '8px 12px' }}>{z.drainage_utilization}%</td>
                  <td style={{ padding: '8px 12px', fontWeight: 700, color: '#dc2626' }}>{z.flood_probability}%</td>
                  <td style={{ padding: '8px 12px', color: '#b91c1c' }}>{z.predicted_time}</td>
                  <td style={{ padding: '8px 12px', color: '#1e3a8a' }}>{z.recommended_action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Operational Directives */}
        <div>
          <h3 style={{ fontSize: '0.95rem', color: '#0f172a', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            3. Operational Field Directives
          </h3>
          <ol style={{ paddingLeft: '20px', fontSize: '0.85rem', color: '#334155', lineHeight: 1.8 }}>
            {recommendations.map((rec, idx) => (
              <li key={idx}><strong>Directive #{idx + 1}:</strong> {rec}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};
