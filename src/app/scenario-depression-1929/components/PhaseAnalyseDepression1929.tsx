'use client';
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Info, ArrowRight } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, ReferenceLine,
} from 'recharts';

interface PhaseAnalyseDepression1929Props {
  onComplete: () => void;
}

const indicators = [
  {
    id: 'dep-ind-001', label: 'US GDP Growth', value: '-13.0%', prev: '+6.7%', trend: 'down',
    status: 'critical', description: 'US GDP fell by roughly 30% between 1929 and 1933 — the largest peacetime contraction in American history. Production collapsed as investment, consumption, and trade all fell simultaneously.',
    sparkData: [6.7, 2.8, -8.5, -6.4, -13.0, -1.3],
  },
  {
    id: 'dep-ind-002', label: 'Unemployment Rate (US)', value: '24.9%', prev: '3.2%', trend: 'up',
    status: 'critical', description: 'Unemployment surged from ~3% in 1929 to nearly 25% by 1933 — around one in four workers was unemployed. Millions lost jobs as businesses cut production and investment collapsed.',
    sparkData: [3.2, 8.7, 15.9, 23.6, 24.9, 21.7],
  },
  {
    id: 'dep-ind-003', label: 'Price Level (Deflation)', value: '-25%', prev: '+0.6%', trend: 'down',
    status: 'critical', description: 'The US experienced severe deflation — prices fell by around 25% between 1929 and 1933. Falling demand caused businesses to cut prices and wages, increasing the real burden of debt.',
    sparkData: [0.6, -2.3, -9.0, -10.3, -5.1, 0.8],
  },
  {
    id: 'dep-ind-004', label: 'Bank Failures', value: '4,000+', prev: '~500/yr', trend: 'up',
    status: 'critical', description: 'Thousands of banks collapsed between 1930 and 1933. Many Americans lost their savings because bank deposits were not insured. Bank runs became widespread as confidence evaporated.',
    sparkData: [500, 1350, 2293, 1456, 4000, 2000],
  },
  {
    id: 'dep-ind-005', label: 'Business Investment', value: '-79%', prev: 'Baseline', trend: 'down',
    status: 'critical', description: 'Business investment collapsed by nearly 80% from 1929 to 1933. Firms stopped expanding due to extreme uncertainty, weak demand, and the inability to access credit from failing banks.',
    sparkData: [100, 83, 58, 35, 21, 28],
  },
  {
    id: 'dep-ind-006', label: 'US Trade Volume', value: '-66%', prev: 'Baseline', trend: 'down',
    status: 'warning', description: 'US exports and imports fell sharply. The Smoot–Hawley Tariff Act (1930) raised tariffs on over 20,000 imported goods, triggering retaliatory tariffs and causing global trade to collapse by two-thirds.',
    sparkData: [100, 88, 69, 52, 39, 34],
  },
];

const gdpData = [
  { year: '1929', gdp: 105.0 },
  { year: '1930', gdp: 97.4 },
  { year: '1931', gdp: 88.5 },
  { year: '1932', gdp: 78.3 },
  { year: '1933', gdp: 74.0 },
  { year: '1934', gdp: 80.8 },
  { year: '1935', gdp: 87.4 },
  { year: '1936', gdp: 97.0 },
  { year: '1937', gdp: 102.5 },
  { year: '1938', gdp: 98.7 },
  { year: '1939', gdp: 105.0 },
];

const macroData = [
  { year: '1929', unemployment: 3.2, inflation: 0.6, investment: 100 },
  { year: '1930', unemployment: 8.7, inflation: -2.3, investment: 83 },
  { year: '1931', unemployment: 15.9, inflation: -9.0, investment: 58 },
  { year: '1932', unemployment: 23.6, inflation: -10.3, investment: 35 },
  { year: '1933', unemployment: 24.9, inflation: -5.1, investment: 21 },
  { year: '1934', unemployment: 21.7, inflation: 3.5, investment: 28 },
  { year: '1935', unemployment: 20.1, inflation: 2.2, investment: 38 },
  { year: '1936', unemployment: 16.9, inflation: 1.5, investment: 52 },
  { year: '1937', unemployment: 14.3, inflation: 3.6, investment: 65 },
  { year: '1938', unemployment: 19.0, inflation: -2.1, investment: 55 },
  { year: '1939', unemployment: 17.2, inflation: -1.4, investment: 62 },
];

const newsItems = [
  { id: 'dep-news-001', date: 'Oct 24, 1929', headline: '"Black Thursday" — stock market panic begins on Wall Street', tag: 'Crash', tagColor: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { id: 'dep-news-002', date: 'Oct 29, 1929', headline: '"Black Tuesday" — the worst single-day stock market crash in US history', tag: 'Crash', tagColor: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { id: 'dep-news-003', date: '1930–1933', headline: 'Thousands of US banks fail — millions lose savings with no deposit insurance', tag: 'Banking', tagColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { id: 'dep-news-004', date: 'Jun 1930', headline: 'Smoot–Hawley Tariff Act signed — global trade collapses as countries retaliate', tag: 'Trade', tagColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { id: 'dep-news-005', date: '1932', headline: 'Unemployment reaches ~25% — Hoover Bonus Army marchers dispersed in Washington', tag: 'Unemployment', tagColor: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { id: 'dep-news-006', date: 'Mar 1933', headline: 'FDR inaugurated — declares bank holiday and begins the New Deal', tag: 'New Deal', tagColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
  { id: 'dep-news-007', date: '1935–1938', headline: 'New Deal programs expand — WPA, CCC, Social Security Act passed', tag: 'Policy', tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { id: 'dep-news-008', date: 'Late 1930s', headline: 'Recovery strengthens gradually — WWII spending eventually ends the Depression', tag: 'Recovery', tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
];

const CustomGDPTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-zinc-400 mb-1">{label}</p>
      <p className="text-sm font-mono font-semibold text-sky-400">GDP Index: {payload[0]?.value?.toFixed(1)}</p>
    </div>
  );
};

const CustomMacroTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-zinc-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={`tt-${p.dataKey}`} className="text-xs font-mono" style={{ color: p.color }}>{p.name}: {p.value}{p.dataKey === 'investment' ? '' : '%'}</p>
      ))}
    </div>
  );
};

export default function PhaseAnalyseDepression1929({ onComplete }: PhaseAnalyseDepression1929Props) {
  const [expandedIndicator, setExpandedIndicator] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Historical Context Banner */}
      <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
        <AlertTriangle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-400 mb-1">Historical Context — The Great Depression (1929–1939)</p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The American Great Depression began after the <span className="text-zinc-200 font-medium">Wall Street Crash of 1929</span>, when stock prices collapsed following years of speculation during the "Roaring Twenties." Americans had bought stocks using borrowed money, banks operated with weak regulation, and industrial overproduction had become a problem. When confidence collapsed, investors sold stocks rapidly, banks failed, businesses cut production, and unemployment surged. The crisis became the <span className="text-amber-400 font-medium">worst economic downturn in American history</span>, fundamentally changing the role of government in the economy.
          </p>
        </div>
      </div>

      {/* Before vs After */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-emerald-500/20 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            Before the Crash (1920s — "Roaring Twenties")
          </h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="flex items-center gap-2"><span className="text-emerald-400 font-mono text-xs">GDP</span> Strong growth — industrial expansion and consumer boom</li>
            <li className="flex items-center gap-2"><span className="text-emerald-400 font-mono text-xs">UNEMP</span> ~3% — near full employment</li>
            <li className="flex items-center gap-2"><span className="text-emerald-400 font-mono text-xs">STOCKS</span> Rapid speculation — buying on margin widespread</li>
            <li className="flex items-center gap-2"><span className="text-emerald-400 font-mono text-xs">BANKS</span> Weakly regulated — excessive lending</li>
          </ul>
        </div>
        <div className="bg-zinc-900 border border-red-500/20 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
            After the Crash (1930–1933 — Trough)
          </h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="flex items-center gap-2"><span className="text-red-400 font-mono text-xs">GDP</span> −30% — catastrophic contraction in output</li>
            <li className="flex items-center gap-2"><span className="text-red-400 font-mono text-xs">UNEMP</span> ~25% — one in four workers unemployed</li>
            <li className="flex items-center gap-2"><span className="text-red-400 font-mono text-xs">PRICES</span> −25% deflation — debt burdens increased in real terms</li>
            <li className="flex items-center gap-2"><span className="text-red-400 font-mono text-xs">BANKS</span> 4,000+ failures — savings wiped out, credit frozen</li>
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
              <h3 className="text-sm font-semibold text-zinc-200">US GDP Index (1929 = 100)</h3>
              <p className="text-xs text-zinc-500">1929 – 1939</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 rounded-lg border border-red-500/20">
              <TrendingDown size={12} className="text-red-400" />
              <span className="text-xs font-mono text-red-400 font-semibold">−30% peak-to-trough</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={gdpData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="gdpGrad1929" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="hsl(240,4%,16%)" strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} domain={[60, 115]} />
              <Tooltip content={<CustomGDPTooltip />} />
              <ReferenceLine x="1929" stroke="#f87171" strokeDasharray="4 4" strokeOpacity={0.6} label={{ value: 'Crash', fill: '#f87171', fontSize: 10 }} />
              <ReferenceLine x="1933" stroke="#34d399" strokeDasharray="4 4" strokeOpacity={0.6} label={{ value: 'New Deal', fill: '#34d399', fontSize: 10 }} />
              <Area type="monotone" dataKey="gdp" stroke="#38bdf8" strokeWidth={2} fill="url(#gdpGrad1929)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">Macro Indicators 1929–1939</h3>
              <p className="text-xs text-zinc-500">Unemployment & Inflation (%)</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-amber-400 inline-block rounded" /> Unemp</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-sky-400 inline-block rounded" /> Inflation</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={macroData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="hsl(240,4%,16%)" strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomMacroTooltip />} />
              <ReferenceLine x="1929" stroke="#f87171" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: 'Crash', fill: '#f87171', fontSize: 10 }} />
              <ReferenceLine x="1933" stroke="#34d399" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: 'New Deal', fill: '#34d399', fontSize: 10 }} />
              <Line type="monotone" dataKey="unemployment" name="Unemployment" stroke="#fbbf24" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="inflation" name="Inflation" stroke="#38bdf8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Economic Mechanism */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-zinc-200 mb-4 flex items-center gap-2">
          <AlertTriangle size={15} className="text-amber-400" />
          Economic Mechanism — What Caused the Collapse?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { title: 'Stock Market Crash', desc: 'Wealth disappeared overnight. Consumer confidence collapsed as millions lost savings in the crash. Buying on margin amplified losses.', color: 'border-red-500/20 bg-red-500/5', textColor: 'text-red-400' },
            { title: 'Bank Failures & Credit Freeze', desc: 'Banks stopped lending. Panic-driven bank runs caused thousands of banks to collapse. People withdrew savings, destroying the credit system.', color: 'border-amber-400/20 bg-amber-400/5', textColor: 'text-amber-400' },
            { title: 'Demand Collapse', desc: 'Consumption ↓ → Investment ↓ → Production ↓. Businesses laid off workers, causing even lower spending — a self-reinforcing downward spiral.', color: 'border-red-500/20 bg-red-500/5', textColor: 'text-red-400' },
            { title: 'Deflation Trap', desc: 'Falling prices increased real debt burdens. Consumers delayed spending expecting lower prices later, deepening the demand collapse.', color: 'border-amber-400/20 bg-amber-400/5', textColor: 'text-amber-400' },
            { title: 'Gold Standard Constraints', desc: 'The Federal Reserve had limited flexibility. Monetary policy remained too tight during the early years, preventing recovery.', color: 'border-zinc-700/50 bg-zinc-800/50', textColor: 'text-zinc-400' },
            { title: 'Smoot–Hawley Tariffs', desc: 'The 1930 tariff act triggered global retaliation. International trade collapsed by two-thirds, eliminating export demand.', color: 'border-zinc-700/50 bg-zinc-800/50', textColor: 'text-zinc-400' },
          ].map((item) => (
            <div key={`mech-${item.title}`} className={`p-3 rounded-lg border ${item.color}`}>
              <p className={`text-xs font-semibold mb-1 ${item.textColor}`}>{item.title}</p>
              <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Events Timeline */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-zinc-200 mb-4">Key Events Timeline</h3>
        <div className="space-y-3">
          {newsItems.map((item, idx) => (
            <div key={item.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-zinc-600 mt-1.5" />
                {idx < newsItems.length - 1 && <div className="w-px flex-1 bg-zinc-800 mt-1 min-h-[20px]" />}
              </div>
              <div className="flex-1 pb-3">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="text-xs font-mono text-zinc-500">{item.date}</span>
                  <span className={`px-1.5 py-0.5 text-xs rounded border ${item.tagColor}`}>{item.tag}</span>
                </div>
                <p className="text-sm text-zinc-300">{item.headline}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Policy Responses */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-zinc-200 mb-4 flex items-center gap-2">
          <Info size={15} className="text-sky-400" />
          Policy Responses
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-zinc-700/50 bg-zinc-800/40">
            <p className="text-xs font-semibold text-amber-400 mb-2">Early Response — President Hoover (1929–1933)</p>
            <p className="text-xs text-zinc-400 leading-relaxed mb-2">Herbert Hoover initially believed the economy would recover naturally. Policies were limited — some public works spending but no direct intervention. Many economists later argued this response was too weak and too slow.</p>
            <ul className="space-y-1 text-xs text-zinc-500">
              <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-zinc-600 flex-shrink-0" /> Limited public works spending</li>
              <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-zinc-600 flex-shrink-0" /> No direct relief to unemployed</li>
              <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-zinc-600 flex-shrink-0" /> Smoot–Hawley Tariff worsened trade</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
            <p className="text-xs font-semibold text-emerald-400 mb-2">New Deal — President Roosevelt (1933–1939)</p>
            <p className="text-xs text-zinc-400 leading-relaxed mb-2">FDR introduced sweeping reforms: public jobs programs, banking reforms, financial regulation, and the Social Security system. The New Deal changed the role of government in the economy permanently.</p>
            <ul className="space-y-1 text-xs text-zinc-500">
              <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" /> Civilian Conservation Corps (CCC)</li>
              <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" /> Works Progress Administration (WPA)</li>
              <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" /> Banking reforms &amp; FDIC deposit insurance</li>
              <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" /> Social Security Act (1935)</li>
              <li className="flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0" /> Moved away from strict gold standard</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <button
          onClick={onComplete}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-semibold rounded-xl transition-all duration-150 active:scale-95"
        >
          Continue to Predictions <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
