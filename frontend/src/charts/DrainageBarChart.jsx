import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const DrainageBarChart = ({ data = [], height = 280 }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 15, left: -10, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="location_name"
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            angle={-25}
            textAnchor="end"
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            unit=" mm"
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
          <Bar dataKey="max_capacity" name="Design Capacity (mm/hr)" fill="#0284c7" radius={[4, 4, 0, 0]} />
          <Bar dataKey="current_load" name="Current Runoff Load (mm/hr)" fill="#f97316" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
