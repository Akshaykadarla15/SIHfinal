import React from 'react';
import { Compass, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage = ({ activeTab, onNavigate, defaultTab = 'dashboard' }) => {
  return (
    <div style={{
      minHeight: '400px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div className="gov-card" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '36px 28px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: '#e0f2fe',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 18px'
        }}>
          <Compass size={32} color="#0284c7" />
        </div>

        <h2 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '8px' }}>
          404 — Module Not Found
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '20px', lineHeight: 1.5 }}>
          The requested module <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: '#0284c7', fontWeight: 700 }}>{activeTab}</code> does not exist or you do not have authorization to view this section under your current role.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => onNavigate(defaultTab)}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Home size={15} />
            <span>Return to Role Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
