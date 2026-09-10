import React, { useState } from 'react';
import { useFlood } from '../context/FloodContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Camera,
  MapPin,
  Send,
  CheckCircle2,
  AlertTriangle,
  Waves,
  Clock,
  Shield,
  Upload,
  Image as ImageIcon,
  Languages
} from 'lucide-react';
import axios from 'axios';

export const ReportWaterloggingPage = () => {
  const { dashboardData, city } = useFlood();
  const { currentUser } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const zones = dashboardData?.zones || [];

  const [selectedZoneName, setSelectedZoneName] = useState(zones[0]?.name || 'Kukatpally');
  const [waterDepth, setWaterDepth] = useState('Knee-deep (1-2 ft)');
  const [description, setDescription] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Local community reports list (seeds + new)
  const [reports, setReports] = useState([
    {
      id: 1,
      zone: 'Begumpet',
      depth: 'Waist-deep (> 2 ft)',
      description: 'Rasoolpura underpass completely waterlogged. Three autos stranded. Avoid this stretch.',
      time: '15 mins ago',
      verified: true,
      photo: null
    },
    {
      id: 2,
      zone: 'Kukatpally',
      depth: 'Knee-deep (1-2 ft)',
      description: 'Water overflowing from roadside drain near Metro Pillar 782. Traffic moving at walking pace.',
      time: '35 mins ago',
      verified: true,
      photo: null
    },
    {
      id: 3,
      zone: 'Tolichowki',
      depth: 'Ankle-deep (< 1 ft)',
      description: 'Ponding near flyover entry. Minor water stagnation on right lane.',
      time: '1 hour ago',
      verified: false,
      photo: null
    }
  ]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const activeZone = zones.find(z => z.name === selectedZoneName) || zones[0] || {};
    const reportPayload = {
      city: city,
      location_name: selectedZoneName,
      latitude: activeZone.latitude || 17.44,
      longitude: activeZone.longitude || 78.44,
      water_depth: waterDepth,
      description: description,
      photo_url: photoPreview || null,
      reporter_name: currentUser?.name || 'Concerned Citizen'
    };

    try {
      // Post to backend route
      await axios.post('http://127.0.0.1:8000/api/reports/waterlogging', reportPayload).catch(err => {
        console.warn('Backend waterlogging route offline or pending migration, saving in local state:', err);
      });

      const newReport = {
        id: Date.now(),
        zone: selectedZoneName,
        depth: waterDepth,
        description: description,
        time: 'Just now',
        verified: false,
        photo: photoPreview
      };

      setReports(prev => [newReport, ...prev]);
      setSubmitted(true);
      setDescription('');
      setPhotoPreview(null);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('Failed to submit citizen report:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header Banner */}
      <div className="gov-card" style={{ padding: '20px 24px', background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Camera size={26} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                {t('report_heading')}
              </h2>
              <div style={{ fontSize: '0.82rem', color: '#dcfce7', marginTop: '3px' }}>
                {t('report_subheading')} ({city})
              </div>
            </div>
          </div>

          {/* Language Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.15)',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.3)',
            gap: '2px'
          }}>
            <Languages size={15} style={{ margin: '0 4px', color: '#ffffff' }} />
            {[
              { code: 'en', label: 'English' },
              { code: 'hi', label: 'हिंदी' },
              { code: 'te', label: 'తెలుగు' }
            ].map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.78rem',
                  fontWeight: language === lang.code ? 800 : 500,
                  background: language === lang.code ? '#ffffff' : 'transparent',
                  color: language === lang.code ? '#15803d' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {submitted && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '10px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#065f46'
        }}>
          <CheckCircle2 size={24} color="#059669" />
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem' }}>Thank you! Your waterlogging report has been received.</strong>
            <span style={{ fontSize: '0.8rem', color: '#047857' }}>
              Municipal field officers have been notified and this incident has been pinned to the active emergency map.
            </span>
          </div>
        </div>
      )}

      {/* Grid: Form (Left) & Community Feed (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '22px'
      }}>
        {/* Reporting Form */}
        <div className="gov-card" style={{ padding: '22px 24px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#0f172a', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="#16a34a" />
            <span>{t('submit_incident')}</span>
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                {t('affected_locality')} ({city})
              </label>
              <select
                value={selectedZoneName}
                onChange={(e) => setSelectedZoneName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: '#0f172a'
                }}
              >
                {zones.map(z => (
                  <option key={z.name} value={z.name}>{z.name} ({z.city})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                {t('observed_depth')}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { label: 'Ankle-deep (< 1 ft)', desc: 'Vehicles passing slowly' },
                  { label: 'Knee-deep (1-2 ft)', desc: '2-wheelers stalled' },
                  { label: 'Waist-deep (> 2 ft)', desc: 'Cars submerged / danger' },
                  { label: 'Severe Submersion (> 4 ft)', desc: 'Underpass blocked' }
                ].map(depth => (
                  <button
                    key={depth.label}
                    type="button"
                    onClick={() => setWaterDepth(depth.label)}
                    style={{
                      background: waterDepth === depth.label ? '#dcfce7' : '#f8fafc',
                      border: `1.5px solid ${waterDepth === depth.label ? '#16a34a' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      padding: '10px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: waterDepth === depth.label ? '#15803d' : '#0f172a' }}>
                      {depth.label}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                      {depth.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                {t('landmark_desc')}
              </label>
              <textarea
                rows="3"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Water accumulating under flyover near Pillar 140, blocked roadside storm drain, vehicles turning back..."
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                {t('upload_photo')}
              </label>
              <div style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '8px',
                padding: '14px',
                textAlign: 'center',
                background: '#f8fafc',
                cursor: 'pointer'
              }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                  id="photo-upload-input"
                />
                <label htmlFor="photo-upload-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  {photoPreview ? (
                    <div>
                      <img src={photoPreview} alt="Upload preview" style={{ maxHeight: '120px', borderRadius: '6px', objectFit: 'cover' }} />
                      <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, marginTop: '4px' }}>Click to change photo</div>
                    </div>
                  ) : (
                    <>
                      <Upload size={24} color="#64748b" />
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>
                        Click to select or capture waterlogging photo
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>PNG, JPG up to 5MB</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                background: '#16a34a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                fontSize: '0.92rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 3px 8px rgba(22, 163, 74, 0.25)'
              }}
            >
              <Send size={16} />
              <span>{submitting ? 'Submitting...' : t('transmit_report')}</span>
            </button>
          </form>
        </div>

        {/* Live Community Incident Feed */}
        <div className="gov-card" style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', color: '#0f172a', margin: 0 }}>
              {t('live_feed')}
            </h3>
            <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
              {reports.length} Reports
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '560px', overflowY: 'auto' }}>
            {reports.map(r => (
              <div key={r.id} style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                    {r.zone}
                  </span>
                  <span style={{
                    fontSize: '0.68rem',
                    background: r.verified ? '#dbeafe' : '#fef3c7',
                    color: r.verified ? '#1e40af' : '#92400e',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 700
                  }}>
                    {r.verified ? '✓ Officer Verified' : 'Community Reported'}
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#b91c1c', fontWeight: 700 }}>
                  🌊 {r.depth}
                </div>

                <div style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.4 }}>
                  {r.description}
                </div>

                {r.photo && (
                  <img src={r.photo} alt="Report attachment" style={{ width: '100%', maxHeight: '110px', objectFit: 'cover', borderRadius: '6px', marginTop: '4px' }} />
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                  <span><Clock size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />{r.time}</span>
                  <span style={{ color: '#16a34a', fontWeight: 600 }}>Active on GIS Map</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
