import React from 'react';
import {
  CloudRain,
  Sliders,
  ShieldCheck,
  Activity,
  ArrowRight,
  Waves,
  Mountain,
  Cpu,
  MapPin,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useFlood } from '../context/FloodContext';

export const LandingPage = ({ onNavigate }) => {
  const { city } = useFlood();

  return (
    <div style={{ background: '#ffffff', minHeight: 'calc(100vh - 65px)' }}>
      {/* Hero Section */}
      <section style={{
        padding: '60px 24px 50px 24px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: '#e0f2fe',
          color: '#0369a1',
          padding: '6px 14px',
          borderRadius: '999px',
          fontSize: '0.82rem',
          fontWeight: 700,
          marginBottom: '20px',
          border: '1px solid #bae6fd'
        }}>
          <ShieldCheck size={16} />
          <span>Smart India Hackathon 2024 • Disaster Management Prototype</span>
        </div>

        <h1 style={{
          fontSize: '3rem',
          fontWeight: 800,
          color: '#0f172a',
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          marginBottom: '16px'
        }}>
          Urban Flood Nowcasting System
        </h1>

        <p style={{
          fontSize: '1.25rem',
          color: '#475569',
          maxWidth: '740px',
          margin: '0 auto 32px auto',
          fontWeight: 400
        }}>
          AI-powered early warning for smarter, safer, and flood-resilient cities.
          Predict urban waterlogging <strong>minutes to hours before it happens</strong>.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '45px' }}>
          <button
            onClick={() => onNavigate('dashboard')}
            className="btn-primary"
            style={{ padding: '12px 28px', fontSize: '1rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)' }}
          >
            <span>View Live Dashboard</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => onNavigate('simulation')}
            className="btn-secondary"
            style={{ padding: '12px 24px', fontSize: '1rem', borderRadius: '8px' }}
          >
            <Sliders size={18} color="#ea580c" />
            <span>Try Scenario Simulator</span>
          </button>
        </div>

        {/* Visual Architecture Formula Box */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px 30px',
          maxWidth: '920px',
          margin: '0 auto',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
            Integrated Multi-Source Hydrological AI Pipeline
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid #cbd5e1', padding: '10px 16px', borderRadius: '10px' }}>
              <CloudRain size={20} color="#0284c7" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>Rainfall Rates</span>
            </div>

            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#94a3b8' }}>+</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid #cbd5e1', padding: '10px 16px', borderRadius: '10px' }}>
              <Waves size={20} color="#0284c7" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>Drainage Capacity</span>
            </div>

            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#94a3b8' }}>+</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid #cbd5e1', padding: '10px 16px', borderRadius: '10px' }}>
              <Mountain size={20} color="#0284c7" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>Terrain Elevation</span>
            </div>

            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#94a3b8' }}>+</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid #cbd5e1', padding: '10px 16px', borderRadius: '10px' }}>
              <Cpu size={20} color="#7c3aed" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>Hydrological AI</span>
            </div>

            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0284c7' }}>→</span>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              padding: '10px 18px',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)'
            }}>
              <CheckCircle size={20} color="#059669" />
              <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#065f46' }}>Early Flood Prediction & Alert</span>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '16px', marginBottom: 0 }}>
            "The system analyzes rainfall, drainage capacity, terrain elevation, and historical flood patterns to predict urban flooding before it happens."
          </p>
        </div>
      </section>

      {/* 3 Core Roles Section */}
      <section style={{
        background: '#f8fafc',
        borderTop: '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0',
        padding: '50px 24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
              Multi-Role Municipal Public Safety Operations
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Tailored workflows for administration command, zonal field crews, and citizens.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Admin */}
            <div className="gov-card">
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px'
              }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Disaster Authority Lead</h3>
              <p style={{ fontSize: '0.86rem', color: '#64748b', marginBottom: '14px' }}>
                Municipal commissioners and disaster leads can monitor live rainfall, evaluate drainage capacity, inspect city risk maps, and broadcast alerts.
              </p>
              <ul style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.8, paddingLeft: '18px' }}>
                <li>City-wide flood probability overview</li>
                <li>Simulate heavy rainfall scenarios</li>
                <li>Escalate & broadcast emergency warnings</li>
              </ul>
            </div>

            {/* Field Officer */}
            <div className="gov-card">
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px'
              }}>
                <Waves size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Zonal Field Officer</h3>
              <p style={{ fontSize: '0.86rem', color: '#64748b', marginBottom: '14px' }}>
                Ground response teams track high-risk roads, check storm culverts, acknowledge alerts, and report clearing of clogged drains.
              </p>
              <ul style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.8, paddingLeft: '18px' }}>
                <li>Inspect localized drain blockage levels</li>
                <li>Report maintenance & trash clearance</li>
                <li>Deploy de-watering pumps to critical zones</li>
              </ul>
            </div>

            {/* Public Citizen */}
            <div className="gov-card">
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px'
              }}>
                <MapPin size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Public Citizen Portal</h3>
              <p style={{ fontSize: '0.86rem', color: '#64748b', marginBottom: '14px' }}>
                Citizens search their local residential sector, view expected waterlogging windows, and review actionable road safety advisories.
              </p>
              <ul style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.8, paddingLeft: '18px' }}>
                <li>Search area flood risk in minutes</li>
                <li>Avoid submerged underpasses & routes</li>
                <li>Receive verified municipal safety bulletins</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SIH Hackathon Demo Guide */}
      <section style={{ padding: '45px 24px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '12px',
          padding: '24px 28px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <AlertTriangle size={20} color="#ea580c" />
            <h3 style={{ margin: 0, fontSize: '1.15rem' }}>SIH 10-Step Presentation Flow</h3>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.7 }}>
            1. View City-wide Risk Map → 2. Observe Rainfall increasing → 3. Click high-risk area (Kukatpally / Begumpet) to inspect 82% flood probability & 30-45 min expected window → 4. Open Explainable AI to show factor attribution → 5. Open Scenario Simulator, set Rainfall = 100 mm/hr, Blockage = 35% → 6. Click "RUN SIMULATION" to watch instant recalculation into Critical Risk → 7. Review generated emergency alerts and municipal action recommendations!
          </div>
          <div style={{ marginTop: '16px' }}>
            <button
              onClick={() => onNavigate('dashboard')}
              className="btn-primary"
              style={{ fontSize: '0.88rem' }}
            >
              Enter System Dashboard →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
