'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import { Search, Filter, Clock, Star, TrendingDown, Globe, ChevronRight, Flame,  } from 'lucide-react';
import { getCompletedScenarios } from '@/lib/progressStore';

interface CrisisCard {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  type: string;
  region: string;
  difficulty: 'Intermediate' | 'Advanced' | 'Expert';
  xp: number;
  duration: string;
  description: string;
  tags: string[];
  href: string;
  color: string;
  emoji: string;
  isNew?: boolean;
  isAI?: boolean;
}

const crises: CrisisCard[] = [
  {
    id: 'crisis-gfc', title: '2008 Global Financial Crisis', subtitle: 'The Great Recession',
    year: '2008–2009', type: 'Banking Crisis', region: 'United States / Global',
    difficulty: 'Expert', xp: 850, duration: '~32 min',
    description: 'Lehman Brothers collapses. Credit markets freeze. The global financial system teeters on the edge. Can you predict the cascade?',
    tags: ['Banking', 'Credit Crisis', 'Systemic Risk', 'QE'],
    href: '/scenario-simulation', color: 'from-red-900/40 to-zinc-900', emoji: '🏦',
  },
  {
    id: 'crisis-afc', title: 'Asian Financial Crisis', subtitle: 'Currency Contagion',
    year: '1997–1998', type: 'Currency Crisis', region: 'Asia-Pacific',
    difficulty: 'Expert', xp: 580, duration: '~35 min',
    description: 'The Thai baht collapses. Contagion spreads across Asia. Fixed exchange rate pegs shatter. Predict the regional economic fallout.',
    tags: ['Currency', 'Contagion', 'IMF', 'Fixed Exchange Rate'],
    href: '/scenario-asian-crisis-1997', color: 'from-amber-900/40 to-zinc-900', emoji: '📉',
  },
  {
    id: 'crisis-dep', title: 'Great Depression', subtitle: 'The Decade of Despair',
    year: '1929–1939', type: 'Demand Shock', region: 'United States',
    difficulty: 'Expert', xp: 560, duration: '~35 min',
    description: 'Black Thursday. Banks fail by the thousands. Unemployment hits 25%. Navigate the worst economic collapse in modern history.',
    tags: ['Deflation', 'Bank Runs', 'Keynesian', 'New Deal'],
    href: '/scenario-depression-1929', color: 'from-sky-900/40 to-zinc-900', emoji: '🇺🇸',
  },
  {
    id: 'crisis-oil', title: 'Oil Supply Shock', subtitle: 'OPEC Embargo',
    year: '1973–1975', type: 'Supply Shock', region: 'Global',
    difficulty: 'Advanced', xp: 480, duration: '~30 min',
    description: 'OPEC cuts oil supply. Stagflation grips Western economies. The Phillips Curve breaks down. Predict the impossible trade-off.',
    tags: ['Stagflation', 'Supply Shock', 'OPEC', 'Phillips Curve'],
    href: '/scenario-oil-1973', color: 'from-orange-900/40 to-zinc-900', emoji: '🛢️',
  },
  {
    id: 'crisis-covid', title: 'COVID-19 Economic Collapse', subtitle: 'Pandemic Recession',
    year: '2020–2021', type: 'External Shock', region: 'Global',
    difficulty: 'Advanced', xp: 520, duration: '~28 min',
    description: 'Global lockdowns. Supply chains shatter. Unprecedented fiscal stimulus. Predict the fastest recession and recovery in history.',
    tags: ['Pandemic', 'Fiscal Stimulus', 'Supply Chain', 'V-Shape Recovery'],
    href: '/scenario-simulation', color: 'from-violet-900/40 to-zinc-900', emoji: '🦠', isNew: true,
  },
  {
    id: 'crisis-ai-1', title: 'AI-Generated: Debt Crisis', subtitle: 'Sovereign Default Cascade',
    year: '2024 Simulation', type: 'Debt Crisis', region: 'Emerging Markets',
    difficulty: 'Expert', xp: 720, duration: '~40 min',
    description: 'AI-generated scenario: Multiple emerging market sovereign defaults trigger a global credit crunch. Navigate the contagion.',
    tags: ['Sovereign Debt', 'Default', 'Contagion', 'IMF'],
    href: '/crisis-lab', color: 'from-emerald-900/40 to-zinc-900', emoji: '🤖', isAI: true,
  },
];

const difficultyColors: Record<string, string> = {
  Intermediate: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Advanced: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Expert: 'text-red-400 bg-red-500/10 border-red-500/20',
};

const categories = ['All', 'Banking Crisis', 'Currency Crisis', 'Supply Shock', 'Demand Shock', 'Debt Crisis', 'External Shock'];

export default function CrisesPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDifficulty, setActiveDifficulty] = useState<string>('All');
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    setCompletedCount(getCompletedScenarios().length);
  }, []);

  const filtered = crises.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = activeCategory === 'All' || c.type === activeCategory;
    const matchDiff = activeDifficulty === 'All' || c.difficulty === activeDifficulty;
    return matchSearch && matchCategory && matchDiff;
  });

  return (
    <AppLayout>
      <div className="min-h-screen bg-zinc-950">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-8 py-8 space-y-8">

          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                <TrendingDown size={20} className="text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-zinc-100">Economic Crises</h1>
            </div>
            <p className="text-sm text-zinc-500">Explore and simulate the most significant economic crises in history. Each scenario tests your macroeconomic reasoning.</p>
          </div>

          {/* Search + Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search crises, concepts, or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Filter size={12} />
                <span>Type:</span>
              </div>
              {categories.map((cat) => (
                <button
                  key={`cat-${cat}`}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                    activeCategory === cat
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <div className="w-px h-4 bg-zinc-800 mx-1" />
              {['All', 'Intermediate', 'Advanced', 'Expert'].map((diff) => (
                <button
                  key={`diff-${diff}`}
                  onClick={() => setActiveDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                    activeDifficulty === diff
                      ? 'bg-zinc-700 text-zinc-200 border-zinc-600' :'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Crises', value: crises.length.toString(), icon: Globe, color: 'text-sky-400' },
              { label: 'Completed', value: completedCount.toString(), icon: Flame, color: 'text-emerald-400' },
              { label: 'XP Available', value: `${crises.reduce((a, c) => a + c.xp, 0).toLocaleString()}`, icon: Star, color: 'text-amber-400' },
              { label: 'Avg Duration', value: '~32 min', icon: Clock, color: 'text-violet-400' },
            ].map((stat) => (
              <div key={`stat-${stat.label}`} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
                <stat.icon size={18} className={stat.color} />
                <div>
                  <p className={`text-lg font-bold font-mono ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-zinc-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Crisis Cards Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">
              <TrendingDown size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No crises match your search. Try different filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((crisis) => (
                <Link
                  key={crisis.id}
                  href={crisis.href}
                  className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-zinc-950/50"
                >
                  {/* Cinematic header */}
                  <div className={`h-28 bg-gradient-to-br ${crisis.color} flex items-center justify-between px-5 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.03),transparent_60%)]" />
                    <div>
                      <span className="text-3xl">{crisis.emoji}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      {crisis.isAI && (
                        <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs text-emerald-400 font-medium">AI Generated</span>
                      )}
                      {crisis.isNew && (
                        <span className="px-2 py-0.5 bg-violet-500/20 border border-violet-500/30 rounded-full text-xs text-violet-400 font-medium">New</span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${difficultyColors[crisis.difficulty]}`}>
                        {crisis.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors leading-tight">{crisis.title}</h3>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">{crisis.year} · {crisis.region}</p>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{crisis.description}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {crisis.tags.slice(0, 3).map((tag) => (
                        <span key={`tag-${crisis.id}-${tag}`} className="px-2 py-0.5 bg-zinc-800 border border-zinc-700/50 rounded-full text-xs text-zinc-500">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-zinc-800">
                      <div className="flex items-center gap-3 text-xs text-zinc-500">
                        <span className="flex items-center gap-1"><Clock size={11} />{crisis.duration}</span>
                        <span className="flex items-center gap-1"><Star size={11} className="text-amber-400" /><span className="text-amber-400 font-mono">+{crisis.xp} XP</span></span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-emerald-400 group-hover:gap-2 transition-all">
                        <span>Start</span>
                        <ChevronRight size={12} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
