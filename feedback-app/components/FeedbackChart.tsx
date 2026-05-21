'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

interface Props {
  data: { date: string; count: number }[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#13152a] border border-[#2e3060] rounded-xl px-3 py-2 shadow-xl">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className="text-white text-sm font-semibold">
        {payload[0].value} {payload[0].value === 1 ? 'submission' : 'submissions'}
      </p>
    </div>
  );
}

export function FeedbackChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gradViolet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e2040" vertical={false} />
        <XAxis dataKey="date" stroke="#1e2040" tick={{ fill: '#5c6080', fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis stroke="#1e2040" tick={{ fill: '#5c6080', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3d3f72', strokeWidth: 1 }} />
        <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2.5}
          fill="url(#gradViolet)"
          dot={{ fill: '#8b5cf6', strokeWidth: 0, r: 3 }}
          activeDot={{ fill: '#a78bfa', strokeWidth: 0, r: 5 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
