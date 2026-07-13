'use client';
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,  } from 'recharts';

const performanceData = [
  { date: 'Oct 08', value: 110988, benchmark: 110000 },
  { date: 'Nov 08', value: 98200, benchmark: 97000 },
  { date: 'Dec 08', value: 95400, benchmark: 93000 },
  { date: 'Jan 09', value: 88100, benchmark: 86000 },
  { date: 'Feb 09', value: 84600, benchmark: 81000 },
  { date: 'Mar 09', value: 91200, benchmark: 85000 },
  { date: 'Apr 09', value: 99800, benchmark: 90000 },
  { date: 'May 09', value: 107400, benchmark: 95000 },
  { date: 'Jun 09', value: 112100, benchmark: 99000 },
  { date: 'Jul 09', value: 118600, benchmark: 104000 },
  { date: 'Aug 09', value: 121300, benchmark: 107000 },
  { date: 'Sep 09', value: 124830, benchmark: 110000 },
];

const sectorAllocation = [
  { name: 'US Treasuries', value: 22, color: '#6ee7b7' },
  { name: 'Technology', value: 18, color: '#38bdf8' },
  { name: 'Healthcare', value: 15, color: '#a78bfa' },
  { name: 'Gold & Commodities', value: 14, color: '#fbbf24' },
  { name: 'Financials', value: 10, color: '#f87171' },
  { name: 'Energy', value: 9, color: '#fb923c' },
  { name: 'EM Bonds', value: 7, color: '#34d399' },
  { name: 'Consumer Staples', value: 5, color: '#94a3b8' },
];

const countryAllocation = [
  { name: 'United States', value: 42, color: '#6ee7b7' },
  { name: 'United Kingdom', value: 12, color: '#38bdf8' },
  { name: 'Germany', value: 10, color: '#a78bfa' },
  { name: 'Japan', value: 9, color: '#fbbf24' },
  { name: 'China', value: 8, color: '#f87171' },
  { name: 'India', value: 7, color: '#fb923c' },
  { name: 'Other', value: 12, color: '#52525b' },
];

const CustomPerfTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-zinc-400 mb-1">{label}</p>
      <p className="text-sm font-mono text-emerald-400 font-semibold">${String(payload[0]?.value ?? '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
      <p className="text-xs font-mono text-zinc-500">Benchmark: ${String(payload[1]?.value ?? '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
    </div>
  );
};

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.06) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontFamily="IBM Plex Mono" fontWeight="600">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function PortfolioCharts() {
  const [allocationView, setAllocationView] = useState<'sector' | 'country'>('sector');
  const allocationData = allocationView === 'sector' ? sectorAllocation : countryAllocation;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Performance Chart — spans 2 cols */}
      <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-200">Portfolio Performance</h3>
            <p className="text-xs text-zinc-500">vs. Benchmark (S&P 500 equivalent)</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-400 inline-block rounded" /> Your Portfolio</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-zinc-600 inline-block rounded" /> Benchmark</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={performanceData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6ee7b7" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6ee7b7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="benchGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#52525b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#52525b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="hsl(240,4%,16%)" strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomPerfTooltip />} />
            <Area type="monotone" dataKey="benchmark" stroke="#52525b" strokeWidth={1.5} fill="url(#benchGrad)" dot={false} />
            <Area type="monotone" dataKey="value" stroke="#6ee7b7" strokeWidth={2} fill="url(#perfGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Allocation Pie */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-zinc-200">Allocation</h3>
          <div className="flex bg-zinc-800 rounded-md p-0.5">
            {(['sector', 'country'] as const).map((v) => (
              <button
                key={`alloc-tab-${v}`}
                onClick={() => setAllocationView(v)}
                className={`px-2 py-1 text-xs rounded transition-all duration-150 ${
                  allocationView === v ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {v === 'sector' ? 'Sector' : 'Country'}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={allocationData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              dataKey="value"
              labelLine={false}
              label={CustomPieLabel}
            >
              {allocationData.map((entry) => (
                <Cell key={`pie-${entry.name}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => [`${v}%`, 'Allocation']} contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-1.5 mt-2">
          {allocationData.slice(0, 5).map((item) => (
            <div key={`leg-${item.name}`} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-zinc-400 truncate max-w-[110px]">{item.name}</span>
              </div>
              <span className="text-xs font-mono text-zinc-400">{item.value}%</span>
            </div>
          ))}
          {allocationData.length > 5 && (
            <p className="text-xs text-zinc-600">+{allocationData.length - 5} more</p>
          )}
        </div>
      </div>
    </div>
  );
}