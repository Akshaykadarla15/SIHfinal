import React, { useState } from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { Shield, Lock, Mail, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';

export const LoginPage = ({ onLoginSuccess }) => {
  const { login, loading } = useAuth();

  const [email, setEmail] = useState('admin@flood.ai');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setError(res.error || 'Invalid credentials. Please use one of the demo accounts.');
    }
  };

  const handleQuickFill = (account) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <div style={{
      maxWidth: '460px',
      margin: '60px auto',
      background: '#ffffff',
      border: '1px solid var(--border-color)',
      borderRadius: '14px',
      padding: '32px 36px',
      boxShadow: 'var(--shadow-lg)'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '12px',
          background: '#e0f2fe',
          color: '#0284c7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px auto'
        }}>
          <Shield size={26} />
        </div>
        <h2 style={{ fontSize: '1.45rem', color: '#0f172a', margin: '0 0 6px 0' }}>
          Authorized System Access
        </h2>
        <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
          Sign in or choose a demo role to access the Urban Flood Nowcasting System
        </div>
      </div>

      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fca5a5',
          color: '#dc2626',
          borderRadius: '8px',
          padding: '10px 14px',
          fontSize: '0.82rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px'
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
            Email Address
          </label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.88rem'
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '11px' }} />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.88rem'
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '11px', marginTop: '6px' }}
        >
          <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
          <ArrowRight size={16} />
        </button>
      </form>

      {/* Quick Demo Accounts Helper */}
      <div style={{ marginTop: '26px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '10px', textAlign: 'center' }}>
          One-Click Demo Accounts (SIH Evaluators)
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Object.entries(DEMO_ACCOUNTS).map(([key, acc]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleQuickFill(acc)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>{acc.name}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{acc.email} • {acc.badge}</div>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0284c7' }}>Select</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
