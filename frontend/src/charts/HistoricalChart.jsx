import React from 'react';
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

export const HistoricalChart = ({ data = [], height = 300 }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 15, right: 20, left: -5, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="event"
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            angle={-20}
            textAnchor="end"
          />
          <YAxis
            yAxisId="left"
            stroke="#0284c7"
            fontSize={11}
            tickLine={false}
            unit=" mm"
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#dc2626"
            fontSize={11}
            tickLine={false}
            unit=" m"
          />
          <Tooltip
            contentStyle={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.8rem'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '0.78rem', paddingTop: '10px' }} />
          <Bar yAxisId="left" dataKey="rainfall" name="Recorded Rainfall (mm)" fill="#0284c7" radius={[4, 4, 0, 0]} />
          <Line yAxisId="right" type="monotone" dataKey="water_level" name="Peak Water Depth (meters)" stroke="#dc2626" strokeWidth={3} dot={{ r: 5, fill: '#dc2626' }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
