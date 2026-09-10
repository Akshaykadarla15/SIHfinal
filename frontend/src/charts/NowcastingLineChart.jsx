import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea
} from 'recharts';

export const NowcastingLineChart = ({ timeline = [], height = 260 }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={timeline} margin={{ top: 15, right: 20, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="window"
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            domain={[0, 100]}
            unit="%"
          />
          <Tooltip
            formatter={(val) => [`${val}% Probability`, 'Flood Probability']}
            contentStyle={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.8rem'
            }}
          />
          {/* Shaded Risk Zones */}
          <ReferenceArea y1={0} y2={25} fill="#ecfdf5" fillOpacity={0.5} />
          <ReferenceArea y1={25} y2={50} fill="#fefce8" fillOpacity={0.5} />
          <ReferenceArea y1={50} y2={75} fill="#fff7ed" fillOpacity={0.5} />
          <ReferenceArea y1={75} y2={100} fill="#fef2f2" fillOpacity={0.5} />

          <Line
            type="monotone"
            dataKey="probability"
            name="Nowcasting Flood Probability"
            stroke="#0284c7"
            strokeWidth={3}
            dot={{ r: 5, fill: '#0284c7', stroke: '#fff', strokeWidth: 2 }}
            activeDot={{ r: 7, fill: '#dc2626', stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
