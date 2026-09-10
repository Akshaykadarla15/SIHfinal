import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

export const RainfallTrendChart = ({ data = [], height = 260 }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#0284c7" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="time"
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
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
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              fontSize: '0.8rem'
            }}
          />
          <ReferenceLine y={50} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Heavy Threshold (50mm)', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} />
          <Area
            type="monotone"
            dataKey="rainfall"
            name="Observed Rain (mm/hr)"
            stroke="#0284c7"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#rainGradient)"
          />
          {data[0]?.forecast && (
            <Area
              type="monotone"
              dataKey="forecast"
              name="Forecast Rain (mm/hr)"
              stroke="#f97316"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#forecastGradient)"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
