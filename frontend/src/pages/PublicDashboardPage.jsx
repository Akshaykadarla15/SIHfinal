import React, { useState } from 'react';
import { useFlood } from '../context/FloodContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldAlert,
  Search,
  AlertTriangle,
  CheckCircle,
  MapPin,
  ExternalLink,
  PhoneCall,
  Camera,
  ShieldCheck,
  AlertOctagon,
  ArrowRight,
  HelpCircle,
  Languages
} from 'lucide-react';

export const PublicDashboardPage = ({ onNavigate }) => {
  const { dashboardData, city } = useFlood();
  const { language, setLanguage, t } = useLanguage();
  const zones = dashboardData?.zones || [];

  const [selectedZoneName, setSelectedZoneName] = useState(zones[0]?.name || 'Kukatpally');

  const currentZone = zones.find(z => z.name === selectedZoneName) || zones[0] || {
    name: 'Kukatpally',
    risk_level: 'High',
    flood_probability: 78.0,
    predicted_time: '30 to 60 minutes',
    rainfall_rate: 52.0,
    reason: 'Heavy rainfall and overloaded drainage system.'
  };

  const isCritical = currentZone.risk_level === 'Critical';
  const isHigh = currentZone.risk_level === 'High';
  const isModerate = currentZone.risk_level === 'Moderate';
  const isSafe = currentZone.risk_level === 'Safe';

  // Plain language status with i18n
  const getPlainLanguageStatus = () => {
    if (isCritical) {
      return {
        title: t('critical_title'),
        description: t('critical_desc'),
        badge: 'Critical Emergency [🛑]',
        bg: '#fff1f2',
        border: '#f43f5e',
        color: '#be123c',
        icon: AlertOctagon
      };
    }
    if (isHigh) {
      return {
        title: t('high_title'),
        description: t('high_desc'),
        badge: 'High Warning [⚠️]',
        bg: '#fff7ed',
        border: '#fb923c',
        color: '#c2410c',
        icon: AlertTriangle
      };
    }
    if (isModerate) {
      return {
        title: t('moderate_title'),
        description: t('moderate_desc'),
        badge: 'Moderate Advisory [▲]',
        bg: '#fefce8',
        border: '#facc15',
        color: '#a16207',
        icon: HelpCircle
      };
    }
    return {
      title: t('safe_title'),
      description: t('safe_desc'),
      badge: 'Safe [✓]',
      bg: '#f0fdf4',
      border: '#4ade80',
      color: '#15803d',
      icon: ShieldCheck
    };
  };

  const statusInfo = getPlainLanguageStatus();
  const StatusIcon = statusInfo.icon;

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Search Locality Header & Multilingual Switcher */}
      <div className="gov-card" style={{ padding: '18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: '0 0 4px 0' }}>
              {t('portal_title')}
            </h2>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {t('portal_subtitle')} ({city})
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Language Switcher Pill Group */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#f1f5f9',
              padding: '3px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              gap: '2px'
            }}>
              <Languages size={15} style={{ margin: '0 4px', color: '#475569' }} />
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
                    background: language === lang.code ? '#16a34a' : 'transparent',
                    color: language === lang.code ? '#ffffff' : '#334155',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} color="#16a34a" />
              <select
                value={selectedZoneName}
                onChange={(e) => setSelectedZoneName(e.target.value)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  background: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                {zones.map(z => (
                  <option key={z.name} value={z.name}>{z.name} ({z.risk_level})</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent "Report Waterlogging" CTA Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
        borderRadius: '12px',
        padding: '16px 22px',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '8px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Camera size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.98rem' }}>
              {t('report_cta_title')}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#dcfce7' }}>
              {t('report_cta_subtitle')}
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate && onNavigate('report-waterlogging')}
          style={{
            background: '#ffffff',
            color: '#15803d',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 18px',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <span>{t('report_cta_button')}</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Main Public Status Callout */}
      <div className="gov-card" style={{
        borderLeft: `6px solid ${statusInfo.border}`,
        padding: '24px 28px',
        background: statusInfo.bg
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            background: '#ffffff',
            color: statusInfo.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${statusInfo.border}`
          }}>
            <StatusIcon size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>
              {t('official_advisory')} • {city}
            </div>
            <h3 style={{ margin: 0, fontSize: '1.45rem', color: '#0f172a' }}>
              {statusInfo.title}
            </h3>
          </div>
        </div>

        {/* Detailed Metrics Panel */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '16px 20px',
          marginBottom: '20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: '0.92rem', color: '#334155', marginBottom: '12px', lineHeight: 1.6 }}>
            {statusInfo.description}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '12px' }}>
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>{t('locality')}</div>
              <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>{currentZone.name}</strong>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>{t('expected_inundation')}</div>
              <strong style={{ fontSize: '1rem', color: isCritical ? '#dc2626' : '#ea580c' }}>
                {currentZone.predicted_time}
              </strong>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>{t('flood_prob')}</div>
              <strong style={{ fontSize: '1.15rem', color: currentZone.flood_probability >= 75 ? '#dc2626' : '#0284c7' }}>
                {currentZone.flood_probability}%
              </strong>
            </div>

            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>{t('current_rainfall')}</div>
              <strong style={{ fontSize: '1rem', color: '#0f172a' }}>
                {currentZone.rainfall_rate} mm/hr
              </strong>
            </div>
          </div>

          <div style={{ fontSize: '0.84rem', color: '#475569', borderTop: '1px dashed #e2e8f0', paddingTop: '10px' }}>
            <strong>{t('municipal_guidance')}:</strong> {currentZone.recommended_action || 'Continue normal monitoring and avoid stagnant water pools.'}
          </div>
        </div>

        {/* Safety Checklist */}
        <div>
          <h4 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={18} color="#059669" />
            <span>{t('checklist_title')}</span>
          </h4>

          <ul style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            fontSize: '0.88rem',
            color: '#1e293b',
            listStyle: 'none',
            padding: 0
          }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#dc2626', fontWeight: 800 }}>⛔</span>
              <span>{t('check_1')}</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#dc2626', fontWeight: 800 }}>🚗</span>
              <span>{t('check_2')}</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#0284c7', fontWeight: 800 }}>⚡</span>
              <span>{t('check_3')}</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#059669', fontWeight: 800 }}>📱</span>
              <span>{t('check_4')}</span>
            </li>
          </ul>
        </div>

        {/* Emergency Helpline Box */}
        <div style={{
          marginTop: '20px',
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          fontSize: '0.82rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
            <PhoneCall size={16} color="#16a34a" />
            <span>{t('emergency_center')}: <strong>040-21111111 / 112</strong></span>
          </div>
          <span style={{ color: '#64748b' }}>{t('authority_line')}</span>
        </div>
      </div>
    </div>
  );
};
