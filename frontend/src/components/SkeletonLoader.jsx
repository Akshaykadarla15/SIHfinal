import React from 'react';

export const SkeletonBox = ({ width = '100%', height = '20px', borderRadius = '6px', style = {} }) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-shimmer 1.5s infinite linear',
        ...style
      }}
    />
  );
};

export const SkeletonCard = ({ height = '120px' }) => {
  return (
    <div
      className="gov-card"
      style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        height
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SkeletonBox width="45%" height="16px" />
        <SkeletonBox width="28px" height="28px" borderRadius="50%" />
      </div>
      <SkeletonBox width="60%" height="28px" />
      <SkeletonBox width="80%" height="12px" />
    </div>
  );
};

export const SkeletonTable = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="gov-card" style={{ padding: '16px' }}>
      <SkeletonBox width="30%" height="22px" style={{ marginBottom: '16px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {Array.from({ length: cols }).map((_, c) => (
              <SkeletonBox key={c} width={`${100 / cols}%`} height="18px" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
