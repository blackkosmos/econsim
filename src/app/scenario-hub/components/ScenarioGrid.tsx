'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp, TrendingDown, Zap, Globe, Clock, Star,
  CheckCircle2, Lock, Play, Filter, Search,
} from 'lucide-react';

type Difficulty = 'Foundation' | 'Developing' | 'Advanced' | 'Expert';
type Status = 'available' | 'completed' | 'in-progress' | 'locked';

interface Scenario {
  id: string;
  title: string;
  description: string;
  region: string;
  difficulty: Difficulty;
  status: Status;
  xp: number;
  time: number;
  type: string;
  tags: string[];
  score?: number;
  icon: 'up' | 'down' | 'zap' | 'globe';
}

const scenarios: Scenario[] = [
  {
    id: 'scen-001', title: 'UK Brexit Trade Shock', description: 'New tariff barriers disrupt UK-EU trade. Analyse the impact on sterling, inflation, and GDP growth.',
    region: 'United Kingdom', difficulty: 'Developing', status: 'completed', xp: 320, time: 25, type: 'Trade Shock',
    tags: ['Exchange Rate', 'Trade Policy', 'Inflation'], score: 88, icon: 'down',
  },
  {
    id: 'scen-002', title: 'Fed Rate Hike Cycle', description: 'The Federal Reserve raises rates 7 times in 18 months. Model capital flows from emerging markets to the US.',
    region: 'United States', difficulty: 'Advanced', status: 'completed', xp: 520, time: 35, type: 'Monetary Policy',
    tags: ['Interest Rates', 'Capital Flows', 'EM Risk'], score: 72, icon: 'up',
  },
  {
    id: 'scen-003', title: 'China Property Crisis', description: 'Evergrande defaults. Assess contagion to Chinese banks, commodity demand, and global supply chains.',
    region: 'China', difficulty: 'Expert', status: 'in-progress', xp: 780, time: 50, type: 'Banking Crisis',
    tags: ['Credit Risk', 'Commodities', 'Systemic Risk'], icon: 'down',
  },
  {
    id: 'scen-004', title: 'Oil Supply Shock 1973', description: 'OPEC oil embargo triggers stagflation. Manage a portfolio during simultaneous high inflation and rising unemployment.',
    region: 'Global', difficulty: 'Advanced', status: 'available', xp: 480, time: 30, type: 'Supply Shock',
    tags: ['Stagflation', 'Commodities', 'Fiscal Policy'], icon: 'zap',
  },
  {
    id: 'scen-005', title: 'ECB Negative Rates', description: 'The ECB cuts deposit rates below zero. Predict the effect on eurozone bank profitability and lending.',
    region: 'Eurozone', difficulty: 'Developing', status: 'available', xp: 290, time: 20, type: 'Monetary Policy',
    tags: ['Monetary Policy', 'Banking', 'EUR'], icon: 'down',
  },
  {
    id: 'scen-006', title: 'COVID-19 Economic Collapse', description: 'Global lockdowns shut down supply and demand simultaneously. Predict government fiscal responses and recovery paths.',
    region: 'Global', difficulty: 'Advanced', status: 'available', xp: 620, time: 40, type: 'External Shock',
    tags: ['Fiscal Policy', 'GDP', 'Unemployment'], icon: 'down',
  },
  {
    id: 'scen-007', title: 'Indian Tech Boom', description: 'FDI inflows surge into Indian technology and services. Analyse rupee appreciation, Dutch disease risk, and current account dynamics.',
    region: 'India', difficulty: 'Foundation', status: 'available', xp: 180, time: 15, type: 'Capital Inflows',
    tags: ['FDI', 'Exchange Rate', 'Growth'], icon: 'up',
  },
  {
    id: 'scen-008', title: 'Eurozone Sovereign Debt Crisis', description: 'Greece, Portugal, and Spain face bond market panic. Model the ECB\'s "whatever it takes" intervention.',
    region: 'Eurozone', difficulty: 'Expert', status: 'locked', xp: 900, time: 55, type: 'Debt Crisis',
    tags: ['Sovereign Debt', 'Bond Yields', 'Austerity'], icon: 'down',
  },
  {
    id: 'scen-009', title: 'Japan Deflation Trap', description: 'Two decades of deflation and near-zero growth. Evaluate Abenomics: fiscal stimulus, QE, and structural reform.',
    region: 'Japan', difficulty: 'Advanced', status: 'available', xp: 550, time: 35, type: 'Deflation',
    tags: ['Deflation', 'QE', 'Demographics'], icon: 'globe',
  },
  {
    id: 'scen-010', title: 'Emerging Market Currency Crisis', description: 'Rising USD and US rates trigger capital flight from Turkey and Argentina. Predict exchange rate collapses.',
    region: 'Emerging Markets', difficulty: 'Developing', status: 'available', xp: 350, time: 25, type: 'Currency Crisis',
    tags: ['Currency', 'Capital Flight', 'IMF'], icon: 'down',
  },
  {
    id: 'scen-011', title: 'UK Cost-of-Living Crisis 2022', description: 'Energy price spikes drive UK inflation to 11.1%. Analyse Bank of England rate decisions and real wage compression.',
    region: 'United Kingdom', difficulty: 'Foundation', status: 'available', xp: 210, time: 18, type: 'Inflation Shock',
    tags: ['Inflation', 'Real Wages', 'Energy'], icon: 'up',
  },
  {
    id: 'scen-012', title: 'Semiconductor Supply Chain Shock', description: 'TSMC faces a geopolitical disruption. Predict cascading effects on automotive, electronics, and defence sectors.',
    region: 'Asia-Pacific', difficulty: 'Expert', status: 'locked', xp: 840, time: 45, type: 'Supply Chain',
    tags: ['Supply Chain', 'Geopolitics', 'Tech Sector'], icon: 'zap',
  },
  {
    id: 'scen-013', title: '🇺🇸 Great Depression (1929–1939)', description: 'Wall Street crashes, banks collapse, and unemployment hits 25%. Analyse the worst economic downturn in US history and evaluate the New Deal response.',
    region: 'United States', difficulty: 'Expert', status: 'available', xp: 560, time: 35, type: 'Demand Shock',
    tags: ['AD Collapse', 'Deflation', 'Keynesian Policy'], icon: 'down',
  },
  {
    id: 'scen-014', title: '📉 Asian Financial Crisis (1997–1998)', description: 'Currency pegs collapse, banks fail, and capital flees. Analyse how the "Asian Tigers" fell into crisis and predict the short-run effects across Thailand, Indonesia, and South Korea.',
    region: 'Asia-Pacific', difficulty: 'Expert', status: 'available', xp: 580, time: 35, type: 'Currency Crisis',
    tags: ['Exchange Rate', 'Capital Flight', 'Contagion'], icon: 'down',
  },
];

const difficultyConfig: Record<Difficulty, { color: string; bg: string; border: string }> = {
  Foundation: { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' },
  Developing: { color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/30' },
  Advanced: { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30' },
  Expert: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
};

const typeFilters = ['All', 'Monetary Policy', 'Trade Shock', 'Banking Crisis', 'Supply Shock', 'Currency Crisis', 'External Shock', 'Debt Crisis', 'Demand Shock'];
const difficultyFilters: Array<'All' | Difficulty> = ['All', 'Foundation', 'Developing', 'Advanced', 'Expert'];

export default function ScenarioGrid() {
  const router = useRouter();
  const [activeType, setActiveType] = useState('All');
  const [activeDiff, setActiveDiff] = useState<'All' | Difficulty>('All');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = scenarios.filter((s) => {
    const matchType = activeType === 'All' || s.type === activeType;
    const matchDiff = activeDiff === 'All' || s.difficulty === activeDiff;
    const matchSearch = search === '' || s.title.toLowerCase().includes(search.toLowerCase()) || s.region.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchType && matchDiff && matchSearch && matchStatus;
  });

  const getIcon = (icon: Scenario['icon']) => {
    switch (icon) {
      case 'up': return <TrendingUp size={18} className="text-emerald-400" />;
      case 'down': return <TrendingDown size={18} className="text-red-400" />;
      case 'zap': return <Zap size={18} className="text-amber-400" />;
      case 'globe': return <Globe size={18} className="text-sky-400" />;
    }
  };

  const getStatusBadge = (status: Status) => {
    switch (status) {
      case 'completed': return (
        <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-400/10 text-emerald-400 text-xs rounded-full border border-emerald-400/20">
          <CheckCircle2 size={10} /> Done
        </span>
      );
      case 'in-progress': return (
        <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-400/10 text-amber-400 text-xs rounded-full border border-amber-400/20">
          <Play size={10} /> Active
        </span>
      );
      case 'locked': return (
        <span className="flex items-center gap-1 px-2 py-0.5 bg-zinc-700/60 text-zinc-500 text-xs rounded-full border border-zinc-600/30">
          <Lock size={10} /> Locked
        </span>
      );
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search scenarios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-zinc-800/60 border border-zinc-700/50 rounded-lg text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Filter size={12} />
            <span>{filtered.length} scenarios</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-zinc-800/60 border border-zinc-700/50 rounded-lg text-xs text-zinc-400 focus:outline-none focus:border-emerald-500/50 transition-colors"
          >
            {['All', 'available', 'completed', 'in-progress', 'locked'].map((s) => (
              <option key={`sf-${s}`} value={s}>{s === 'All' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          {difficultyFilters.map((d) => (
            <button
              key={`df-${d}`}
              onClick={() => setActiveDiff(d)}
              className={`px-3 py-1 text-xs font-medium rounded-full border transition-all duration-150 ${
                activeDiff === d
                  ? d === 'All' ?'bg-zinc-700 text-zinc-100 border-zinc-600'
                    : `${difficultyConfig[d as Difficulty].bg} ${difficultyConfig[d as Difficulty].color} ${difficultyConfig[d as Difficulty].border}`
                  : 'bg-transparent text-zinc-500 border-zinc-700/50 hover:border-zinc-600 hover:text-zinc-300'
              }`}
            >
              {d}
            </button>
          ))}
          <div className="w-px bg-zinc-700/50 mx-1" />
          {typeFilters.map((t) => (
            <button
              key={`tf-${t}`}
              onClick={() => setActiveType(t)}
              className={`px-3 py-1 text-xs font-medium rounded-full border transition-all duration-150 ${
                activeType === t
                  ? 'bg-zinc-700 text-zinc-100 border-zinc-600' :'bg-transparent text-zinc-500 border-zinc-700/50 hover:border-zinc-600 hover:text-zinc-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Globe size={40} className="text-zinc-700 mb-3" />
          <h3 className="text-base font-semibold text-zinc-400 mb-1">No scenarios match your filters</h3>
          <p className="text-sm text-zinc-600">Try adjusting the difficulty or type filter to find scenarios.</p>
          <button onClick={() => { setActiveType('All'); setActiveDiff('All'); setSearch(''); }} className="mt-4 px-4 py-2 bg-zinc-800 text-zinc-300 text-sm rounded-lg border border-zinc-700 hover:bg-zinc-700 transition-colors">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((s) => {
            const diff = difficultyConfig[s.difficulty];
            const isLocked = s.status === 'locked';
            return (
              <div
                key={s.id}
                className={`
                  relative bg-zinc-900 border border-zinc-800 rounded-xl p-4 card-hover
                  ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                  ${s.status === 'in-progress' ? 'border-amber-400/30 bg-amber-900/5' : ''}
                `}
                onClick={() => !isLocked && (s.id === 'scen-004' ? router.push('/scenario-oil-1973') : s.id === 'scen-013' ? router.push('/scenario-depression-1929') : s.id === 'scen-014' ? router.push('/scenario-asian-crisis-1997') : router.push('/scenario-simulation'))}
              >
                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-zinc-950/40 z-10">
                    <div className="flex flex-col items-center gap-1">
                      <Lock size={20} className="text-zinc-500" />
                      <span className="text-xs text-zinc-500">Complete more scenarios to unlock</span>
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-zinc-800 rounded-lg">
                      {getIcon(s.icon)}
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${diff.bg} ${diff.color} ${diff.border}`}>
                      {s.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {getStatusBadge(s.status)}
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-zinc-100 mb-1 leading-snug">{s.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed mb-3 line-clamp-2">{s.description}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {s.tags.slice(0, 3).map((tag) => (
                    <span key={`${s.id}-tag-${tag}`} className="px-1.5 py-0.5 bg-zinc-800/80 text-zinc-500 text-xs rounded border border-zinc-700/40">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <div className="flex items-center gap-1">
                      <Globe size={11} />
                      <span>{s.region}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={11} />
                      <span>{s.time} min</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {s.status === 'completed' && s.score !== undefined && (
                      <span className="text-xs font-mono text-zinc-400 mr-1">{s.score}%</span>
                    )}
                    <Star size={12} className="text-amber-400" />
                    <span className="text-xs font-mono font-semibold text-amber-400">+{s.xp}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}