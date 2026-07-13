'use client';
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Info, Newspaper, ArrowRight,  } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, ReferenceLine,
} from 'recharts';

interface PhaseAnalyseProps {
  onComplete: () => void;
}

const indicators = [
  {
    id: 'ind-001', label: 'Fed Funds Rate', value: '2.0%', prev: '5.25%', trend: 'down',
    status: 'critical', description: 'Emergency cut from 5.25% as credit markets freeze',
    unit: '%', sparkData: [5.25, 5.25, 5.0, 4.5, 3.0, 2.0],
  },
  {
    id: 'ind-002', label: 'Unemployment Rate', value: '7.2%', prev: '5.0%', trend: 'up',
    status: 'warning', description: 'Rising sharply as financial sector layoffs cascade',
    unit: '%', sparkData: [5.0, 5.1, 5.5, 6.1, 6.7, 7.2],
  },
  {
    id: 'ind-003', label: 'CPI Inflation', value: '3.8%', prev: '5.6%', trend: 'down',
    status: 'normal', description: 'Falling as demand collapses and oil prices drop',
    unit: '%', sparkData: [5.6, 5.4, 4.9, 4.2, 4.0, 3.8],
  },
  {
    id: 'ind-004', label: 'GDP Growth (QoQ)', value: '-2.4%', prev: '+1.2%', trend: 'down',
    status: 'critical', description: 'Deep contraction as investment and consumption collapse',
    unit: '%', sparkData: [1.2, 0.6, -0.4, -1.2, -2.0, -2.4],
  },
  {
    id: 'ind-005', label: 'USD Index (DXY)', value: '86.4', prev: '72.1', trend: 'up',
    status: 'warning', description: 'Flight to safety driving dollar appreciation',
    unit: '', sparkData: [72.1, 74.5, 78.2, 82.1, 84.8, 86.4],
  },
  {
    id: 'ind-006', label: 'Economic Sentiment', value: '28/100', prev: '62/100', trend: 'down',
    status: 'critical', description: 'Consumer and business confidence in freefall',
    unit: '', sparkData: [62, 55, 44, 38, 32, 28],
  },
];

const s_pData = [
  { month: 'Jan 07', value: 1438 }, { month: 'Apr 07', value: 1482 },
  { month: 'Jul 07', value: 1455 }, { month: 'Oct 07', value: 1549 },
  { month: 'Jan 08', value: 1378 }, { month: 'Apr 08', value: 1385 },
  { month: 'Jul 08', value: 1260 }, { month: 'Oct 08', value: 968 },
  { month: 'Jan 09', value: 825 }, { month: 'Apr 09', value: 872 },
];

const creditSpreadData = [
  { month: 'Jan 07', ig: 0.8, hy: 2.5 }, { month: 'Apr 07', ig: 0.9, hy: 2.8 },
  { month: 'Jul 07', ig: 1.4, hy: 4.2 }, { month: 'Oct 07', ig: 1.8, hy: 5.1 },
  { month: 'Jan 08', ig: 2.2, hy: 6.8 }, { month: 'Apr 08', ig: 2.6, hy: 7.4 },
  { month: 'Jul 08', ig: 3.1, hy: 8.2 }, { month: 'Oct 08', ig: 6.4, hy: 18.5 },
  { month: 'Jan 09', ig: 7.2, hy: 21.3 }, { month: 'Apr 09', ig: 5.8, hy: 17.1 },
];

const newsItems = [
  { id: 'news-001', date: '15 Sep 2008', headline: 'Lehman Brothers files for Chapter 11 bankruptcy', tag: 'Breaking', tagColor: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { id: 'news-002', date: '14 Sep 2008', headline: 'Merrill Lynch sold to Bank of America for $50bn', tag: 'M&A', tagColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { id: 'news-003', date: '07 Sep 2008', headline: 'US government seizes Fannie Mae and Freddie Mac', tag: 'Policy', tagColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
  { id: 'news-004', date: '16 Sep 2008', headline: 'AIG receives $85bn emergency Fed bailout loan', tag: 'Bailout', tagColor: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
  { id: 'news-005', date: '03 Oct 2008', headline: 'US Congress passes $700bn TARP bank rescue package', tag: 'Fiscal', tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
];

const CustomSPTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-zinc-400 mb-1">{label}</p>
      <p className="text-sm font-mono font-semibold text-zinc-100">{String(payload[0]?.value ?? '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
    </div>
  );
};

const CustomSpreadTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-zinc-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={`tt-${p.dataKey}`} className="text-xs font-mono" style={{ color: p.color }}>{p.name}: {p.value}%</p>
      ))}
    </div>
  );
};

export default function PhaseAnalyse({ onComplete }: PhaseAnalyseProps) {
  const [expandedIndicator, setExpandedIndicator] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Context Banner */}
      <div className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
        <AlertTriangle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-400 mb-1">Scenario Context — September 2008</p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Lehman Brothers has filed for bankruptcy. Credit markets are seizing up globally. The Federal Reserve faces a crisis of confidence in the entire US banking system. 
            Study the macroeconomic indicators below to understand the scale of the shock before making your predictions.
          </p>
        </div>
      </div>

      {/* Macro Indicators Grid — 6 cards, 3-col, no orphan */}
      <div>
        <h2 className="text-base font-semibold text-zinc-200 mb-3 flex items-center gap-2">
          <Info size={15} className="text-emerald-400" />
          Key Macroeconomic Indicators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-3">
          {indicators.map((ind) => {
            const isExpanded = expandedIndicator === ind.id;
            const statusColors = {
              critical: 'border-red-500/30 bg-red-500/5',
              warning: 'border-amber-400/30 bg-amber-400/5',
              normal: 'border-zinc-700/50 bg-zinc-900',
            };
            const trendIcon = ind.trend === 'up'
              ? <TrendingUp size={14} className="text-red-400" />
              : ind.trend === 'down'
              ? <TrendingDown size={14} className="text-emerald-400" />
              : <Minus size={14} className="text-zinc-500" />;

            const sparkMin = Math.min(...ind.sparkData);
            const sparkMax = Math.max(...ind.sparkData);
            const sparkRange = sparkMax - sparkMin || 1;
            const sparkPoints = ind.sparkData.map((v, i) => ({
              x: (i / (ind.sparkData.length - 1)) * 100,
              y: 100 - ((v - sparkMin) / sparkRange) * 80 - 10,
            }));
            const sparkPath = sparkPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

            return (
              <div
                key={ind.id}
                className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 ${statusColors[ind.status as keyof typeof statusColors]} hover:border-zinc-600`}
                onClick={() => setExpandedIndicator(isExpanded ? null : ind.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{ind.label}</span>
                  <div className="flex items-center gap-1">
                    {ind.status === 'critical' && <AlertTriangle size={12} className="text-red-400" />}
                    {trendIcon}
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold font-mono tabular-nums text-zinc-100">{ind.value}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">prev: <span className="font-mono">{ind.prev}</span></div>
                  </div>
                  {/* Mini sparkline */}
                  <svg viewBox="0 0 100 50" className="w-20 h-10 opacity-60">
                    <path d={sparkPath} fill="none" stroke={ind.trend === 'down' ? '#f87171' : ind.trend === 'up' ? '#34d399' : '#6b7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-zinc-700/50">
                    <p className="text-xs text-zinc-400 leading-relaxed">{ind.description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-zinc-600 mt-2 flex items-center gap-1">
          <Info size={11} /> Click any indicator card to see context
        </p>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* S&P 500 Chart */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">S&P 500 Index</h3>
              <p className="text-xs text-zinc-500">Jan 2007 – Apr 2009</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 rounded-lg border border-red-500/20">
              <TrendingDown size={12} className="text-red-400" />
              <span className="text-xs font-mono text-red-400 font-semibold">-38.5%</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={s_pData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="spGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsl(240,4%,16%)" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomSPTooltip />} />
              <ReferenceLine x="Oct 08" stroke="#f87171" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: 'Crash', fill: '#f87171', fontSize: 10 }} />
              <Area type="monotone" dataKey="value" stroke="#f87171" strokeWidth={2} fill="url(#spGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Credit Spreads Chart */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">Credit Spreads (bps)</h3>
              <p className="text-xs text-zinc-500">Investment Grade vs High Yield</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-sky-400 inline-block rounded" /> IG</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-amber-400 inline-block rounded" /> HY</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={creditSpreadData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="hsl(240,4%,16%)" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomSpreadTooltip />} />
              <Line type="monotone" dataKey="ig" name="IG Spread" stroke="#38bdf8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="hy" name="HY Spread" stroke="#fbbf24" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* News Feed */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-zinc-800">
          <Newspaper size={15} className="text-zinc-400" />
          <h3 className="text-sm font-semibold text-zinc-200">Key Events Timeline</h3>
        </div>
        <div className="divide-y divide-zinc-800/60">
          {newsItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-5 py-3 hover:bg-zinc-800/30 transition-colors">
              <span className="text-xs font-mono text-zinc-600 w-24 flex-shrink-0">{item.date}</span>
              <span className={`px-2 py-0.5 text-xs rounded-full border flex-shrink-0 ${item.tagColor}`}>{item.tag}</span>
              <span className="text-sm text-zinc-300">{item.headline}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Proceed Button */}
      <div className="flex justify-end">
        <button
          onClick={onComplete}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-xl transition-all duration-150 active:scale-95"
        >
          I've Analysed the Situation
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}