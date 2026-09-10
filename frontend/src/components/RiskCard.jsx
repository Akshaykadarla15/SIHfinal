import React from 'react';

export const getRiskSymbol = (level) => {
  if (!level) return '';
  const l = level.toLowerCase();
  if (l.includes('critical')) return '🛑';
  if (l.includes('high')) return '⚠️';
  if (l.includes('moderate')) return '▲';
  if (l.includes('safe')) return '✓';
  return '';
};

export const RiskCard = ({ title, value, subtitle, icon: Icon, badge, variant = 'default' }) => {
  // Variant border & accent colors
  const variantStyles = {
    default: { borderLeft: '4px solid #0284c7', bg: '#ffffff' },
    safe: { borderLeft: '4px solid #10b981', bg: '#ffffff' },
    moderate: { borderLeft: '4px solid #eab308', bg: '#ffffff' },
    high: { borderLeft: '4px solid #f97316', bg: '#ffffff' },
    critical: { borderLeft: '4px solid #ef4444', bg: '#ffffff' }
  };

  const style = variantStyles[variant] || variantStyles.default;
  const symbol = getRiskSymbol(badge || variant);

  return (
    <div
      className="gov-card"
      style={{
        borderLeft: style.borderLeft,
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
          {title}
        </span>
        {Icon && (
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0284c7'
          }}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0' }}>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>
          {value}
        </div>
        {badge && (
          <span className={`badge-${badge.toLowerCase()}`}>
            <span aria-hidden="true">{symbol}</span>
            <span>{badge}</span>
          </span>
        )}
      </div>

      {subtitle && (
        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
};
