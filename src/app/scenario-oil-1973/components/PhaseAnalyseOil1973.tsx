'use client';
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Info, Newspaper, ArrowRight } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, ReferenceLine,
} from 'recharts';

interface PhaseAnalyseOil1973Props {
  onComplete: () => void;
}

const indicators = [
  {
    id: 'oil-ind-001', label: 'Oil Price (USD/barrel)', value: '$12.00', prev: '$3.00', trend: 'up',
    status: 'critical', description: 'OPEC embargo caused oil prices to quadruple from ~$3 to ~$12 per barrel between 1973–1974, making energy a strategic weapon.',
    sparkData: [3.0, 3.2, 3.5, 5.1, 8.4, 12.0],
  },
  {
    id: 'oil-ind-002', label: 'CPI Inflation (US)', value: '12.3%', prev: '3.4%', trend: 'up',
    status: 'critical', description: 'Rising energy and production costs drove CPI from ~3–4% pre-crisis to over 10–15% post-shock, triggering stagflation.',
    sparkData: [3.4, 3.8, 4.7, 6.2, 9.1, 12.3],
  },
  {
    id: 'oil-ind-003', label: 'GDP Growth (US)', value: '-0.5%', prev: '5.6%', trend: 'down',
    status: 'critical', description: 'Strong pre-crisis growth (~5–6%) collapsed into recession as higher energy costs squeezed output and consumer spending.',
    sparkData: [5.6, 5.1, 3.8, 1.9, 0.4, -0.5],
  },
  {
    id: 'oil-ind-004', label: 'Unemployment Rate (US)', value: '8.5%', prev: '4.6%', trend: 'up',
    status: 'warning', description: 'Firms cut output due to higher production costs, leading to significant job losses. Unemployment nearly doubled from pre-crisis lows.',
    sparkData: [4.6, 4.8, 5.2, 6.1, 7.2, 8.5],
  },
  {
    id: 'oil-ind-005', label: 'US Trade Balance ($bn)', value: '-$5.8bn', prev: '-$1.2bn', trend: 'down',
    status: 'warning', description: 'Oil-importing countries like the US saw worsening trade deficits as the import bill surged. Oil exporters accumulated huge surpluses.',
    sparkData: [-1.2, -1.5, -2.1, -3.0, -4.4, -5.8],
  },
  {
    id: 'oil-ind-006', label: 'Economic Sentiment', value: '22/100', prev: '68/100', trend: 'down',
    status: 'critical', description: 'Consumer and business confidence collapsed as petrol queues formed, energy rationing was introduced, and recession fears mounted.',
    sparkData: [68, 60, 50, 40, 30, 22],
  },
];

const oilPriceData = [
  { year: 'Jan 73', price: 3.0 }, { year: 'Apr 73', price: 3.2 },
  { year: 'Jul 73', price: 3.5 }, { year: 'Oct 73', price: 5.1 },
  { year: 'Jan 74', price: 8.4 }, { year: 'Apr 74', price: 11.2 },
  { year: 'Jul 74', price: 12.0 }, { year: 'Oct 74', price: 11.8 },
  { year: 'Jan 75', price: 11.5 },
];

const macroData = [
  { year: '1971', inflation: 3.3, gdp: 3.3, unemployment: 5.9 },
  { year: '1972', inflation: 3.4, gdp: 5.3, unemployment: 5.6 },
  { year: '1973', inflation: 6.2, gdp: 5.6, unemployment: 4.9 },
  { year: '1974', inflation: 11.0, gdp: -0.5, unemployment: 5.6 },
  { year: '1975', inflation: 9.1, gdp: -0.2, unemployment: 8.5 },
  { year: '1976', inflation: 5.8, gdp: 5.4, unemployment: 7.7 },
];

const newsItems = [
  { id: 'oil-news-001', date: 'Oct 1973', headline: 'Yom Kippur War begins — Egypt and Syria attack Israel', tag: 'War', tagColor: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { id: 'oil-news-002', date: 'Oct 1973', headline: 'OPEC announces oil embargo against US and Western Europe', tag: 'Embargo', tagColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { id: 'oil-news-003', date: 'Nov 1973', headline: 'US introduces emergency speed limits and daylight saving to cut energy use', tag: 'Policy', tagColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
  { id: 'oil-news-004', date: '1973–74', headline: 'Oil prices rise from ~$3 to ~$12 per barrel — a 300% increase', tag: 'Prices', tagColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { id: 'oil-news-005', date: '1974–75', headline: 'Global recession hits US, UK, Germany and Japan simultaneously', tag: 'Recession', tagColor: 'bg-red-500/20 text-red-400 border-red-500/30' },
];

const CustomOilTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-zinc-400 mb-1">{label}</p>
      <p className="text-sm font-mono font-semibold text-amber-400">${payload[0]?.value?.toFixed(2)}/bbl</p>
    </div>
  );
};

const CustomMacroTooltip = ({ active, payload, label }: any) => {
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

export default function PhaseAnalyseOil1973({ onComplete }: PhaseAnalyseOil1973Props) {
  const [expandedIndicator, setExpandedIndicator] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Historical Context Banner */}
      <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
        <AlertTriangle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-400 mb-1">Historical Context — Oil Supply Shock (1973)</p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The 1973 oil crisis was triggered during the <span className="text-zinc-200 font-medium">Yom Kippur War</span>, when Arab oil-producing nations
            coordinated through <span className="text-zinc-200 font-medium">OPEC</span> to reduce oil exports to countries supporting Israel — especially the US and Western Europe.
            Before 1973, oil was cheap and stable, Western economies relied heavily on imported oil, and growth was strong with relatively low inflation.
            After the shock, oil prices quadrupled and energy became a strategic weapon, triggering the first major episode of <span className="text-amber-400 font-medium">stagflation</span> — simultaneous high inflation and rising unemployment.
          </p>
        </div>
      </div>

      {/* Before vs After */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-emerald-500/20 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            Before the Shock (Pre-1973)
          </h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="flex items-center gap-2"><span className="text-emerald-400 font-mono text-xs">CPI</span> ~3–4% — low and stable inflation</li>
            <li className="flex items-center gap-2"><span className="text-emerald-400 font-mono text-xs">GDP</span> ~5–6% — strong growth</li>
            <li className="flex items-center gap-2"><span className="text-emerald-400 font-mono text-xs">OIL</span> ~$3/bbl — cheap, abundant energy</li>
            <li className="flex items-center gap-2"><span className="text-emerald-400 font-mono text-xs">UNEMP</span> Low — near full employment</li>
          </ul>
        </div>
        <div className="bg-zinc-900 border border-red-500/20 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
            After the Shock (1974–1975)
          </h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="flex items-center gap-2"><span className="text-red-400 font-mono text-xs">CPI</span> 10–15%+ — severe cost-push inflation</li>
            <li className="flex items-center gap-2"><span className="text-red-400 font-mono text-xs">GDP</span> Negative — recession in many countries</li>
            <li className="flex items-center gap-2"><span className="text-red-400 font-mono text-xs">OIL</span> ~$12/bbl — 300% price increase</li>
            <li className="flex items-center gap-2"><span className="text-red-400 font-mono text-xs">UNEMP</span> Rising significantly — firms cut output</li>
          </ul>
        </div>
      </div>

      {/* Macro Indicators Grid */}
      <div>
        <h2 className="text-base font-semibold text-zinc-200 mb-3 flex items-center gap-2">
          <Info size={15} className="text-emerald-400" />
          Key Macroeconomic Indicators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
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
                  <svg viewBox="0 0 100 50" className="w-20 h-10 opacity-60">
                    <path d={sparkPath} fill="none" stroke={ind.trend === 'up' ? '#f87171' : '#34d399'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
        <p className="text-xs text-zinc-600 mt-2 flex items-center gap-1"><Info size={11} /> Click any indicator card to see context</p>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">Oil Price (USD/barrel)</h3>
              <p className="text-xs text-zinc-500">Jan 1973 – Jan 1975</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <TrendingUp size={12} className="text-amber-400" />
              <span className="text-xs font-mono text-amber-400 font-semibold">+300%</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={oilPriceData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="oilGrad1973" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsl(240,4%,16%)" strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<CustomOilTooltip />} />
              <ReferenceLine x="Oct 73" stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.6} label={{ value: 'Embargo', fill: '#f59e0b', fontSize: 10 }} />
              <Area type="monotone" dataKey="price" stroke="#f59e0b" strokeWidth={2} fill="url(#oilGrad1973)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">Macro Indicators 1971–1976</h3>
              <p className="text-xs text-zinc-500">Inflation, GDP Growth & Unemployment (%)</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-red-400 inline-block rounded" /> CPI</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-emerald-400 inline-block rounded" /> GDP</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-amber-400 inline-block rounded" /> Unemp</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={macroData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="hsl(240,4%,16%)" strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomMacroTooltip />} />
              <ReferenceLine x="1973" stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: 'Shock', fill: '#f59e0b', fontSize: 10 }} />
              <Line type="monotone" dataKey="inflation" name="CPI Inflation" stroke="#f87171" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="gdp" name="GDP Growth" stroke="#34d399" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="unemployment" name="Unemployment" stroke="#fbbf24" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Events Timeline */}
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
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-semibold rounded-xl transition-all duration-150 active:scale-95"
        >
          Proceed to Predictions
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
