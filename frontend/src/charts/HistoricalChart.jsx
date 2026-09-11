import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { Waves, Droplets, Activity } from 'lucide-react';

export const HistoricalChart = ({ data = [], height = 300 }) => {
  const [activeMetric, setActiveMetric] = useState('both'); // 'both', 'flood', 'drainage'

  return (
    <div style={{ width: '100%' }}>
      {/* Metric Selector Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '8px',
        marginBottom: '12px',
        paddingRight: '10px'
      }}>
        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Chart View:</span>
        <button
          type="button"
          onClick={() => setActiveMetric('both')}
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            border: '1px solid',
            borderColor: activeMetric === 'both' ? '#0284c7' : '#cbd5e1',
            background: activeMetric === 'both' ? '#e0f2fe' : '#ffffff',
            color: activeMetric === 'both' ? '#0369a1' : '#475569',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Activity size={12} />
          Multi-Variable
        </button>

        <button
          type="button"
          onClick={() => setActiveMetric('drainage')}
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            border: '1px solid',
            borderColor: activeMetric === 'drainage' ? '#d97706' : '#cbd5e1',
            background: activeMetric === 'drainage' ? '#fef3c7' : '#ffffff',
            color: activeMetric === 'drainage' ? '#b45309' : '#475569',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Droplets size={12} />
          Drainage Capacity vs Load
        </button>

        <button
          type="button"
          onClick={() => setActiveMetric('flood')}
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            border: '1px solid',
            borderColor: activeMetric === 'flood' ? '#0284c7' : '#cbd5e1',
            background: activeMetric === 'flood' ? '#e0f2fe' : '#ffffff',
            color: activeMetric === 'flood' ? '#0369a1' : '#475569',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Waves size={12} />
          Precipitation vs Depth
        </button>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 15, right: 25, left: -5, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="event"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              angle={-20}
              textAnchor="end"
            />
            
            {/* Primary Left Axis: Rate/Volume (mm or mm/hr) */}
            <YAxis
              yAxisId="left"
              stroke="#0284c7"
              fontSize={11}
              tickLine={false}
              unit=" mm"
            />

            {/* Secondary Right Axis: Water Level (m) or Surcharge (%) */}
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#dc2626"
              fontSize={11}
              tickLine={false}
              unit={activeMetric === 'drainage' ? ' %' : ' m'}
            />

            <Tooltip
              contentStyle={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.8rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '0.78rem', paddingTop: '10px' }} />

            {/* Mode: Rainfall vs Water Level */}
            {(activeMetric === 'both' || activeMetric === 'flood') && (
              <Bar
                yAxisId="left"
                dataKey="rainfall"
                name="Rainfall (mm)"
                fill="#0284c7"
                radius={[4, 4, 0, 0]}
              />
            )}

            {/* Mode: Drainage Capacity vs Drainage Load */}
            {(activeMetric === 'both' || activeMetric === 'drainage') && (
              <Bar
                yAxisId="left"
                dataKey="drainage_capacity"
                name="Drainage Capacity (mm/hr)"
                fill="#94a3b8"
                radius={[4, 4, 0, 0]}
              />
            )}

            {(activeMetric === 'both' || activeMetric === 'drainage') && (
              <Bar
                yAxisId="left"
                dataKey="drainage_load"
                name="Peak Drainage Load (mm/hr)"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
              />
            )}

            {(activeMetric === 'both' || activeMetric === 'flood') && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="water_level"
                name="Inundation Depth (m)"
                stroke="#dc2626"
                strokeWidth={3}
                dot={{ r: 4, fill: '#dc2626' }}
              />
            )}

            {activeMetric === 'drainage' && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="utilization"
                name="Hydraulic Surcharge (% of design cap)"
                stroke="#7c3aed"
                strokeWidth={3}
                dot={{ r: 4, fill: '#7c3aed' }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
