'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { BookOpen, Search, ChevronDown, ChevronUp, BarChart2, Zap, Star, Tag, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,  } from 'recharts';

interface Concept {
  id: string;
  title: string;
  category: string;
  level: 'A-Level' | 'IB' | 'Both';
  summary: string;
  detail: string;
  formula?: string;
  keyPoints: string[];
  tags: string[];
  chartData?: { x: string | number; y: number; y2?: number }[];
  chartLabel?: string;
  chartLabel2?: string;
}

const concepts: Concept[] = [
  {
    id: 'ad-as', title: 'AD-AS Model', category: 'Macroeconomic Framework', level: 'Both',
    summary: 'The Aggregate Demand–Aggregate Supply model shows how the price level and real output are determined in the economy.',
    detail: 'The AD curve shows the total demand for goods and services at different price levels. It slopes downward because: (1) wealth effect — higher prices reduce real wealth; (2) interest rate effect — higher prices raise interest rates, reducing investment; (3) exchange rate effect — higher prices reduce exports. The SRAS curve slopes upward because firms supply more at higher prices. The LRAS is vertical at the natural rate of output.',
    formula: 'AD = C + I + G + (X - M)',
    keyPoints: ['AD shifts right with fiscal/monetary stimulus', 'Negative supply shock shifts SRAS left', 'LRAS shifts right with productivity growth', 'Stagflation: SRAS shifts left → higher P, lower Y'],
    tags: ['AD', 'AS', 'Price Level', 'Output', 'Equilibrium'],
    chartData: [
      { x: 60, y: 100 }, { x: 70, y: 90 }, { x: 80, y: 80 }, { x: 90, y: 70 }, { x: 100, y: 60 },
    ],
    chartLabel: 'AD Curve (Price Level vs Real GDP)',
  },
  {
    id: 'phillips-curve', title: 'Phillips Curve', category: 'Inflation & Unemployment', level: 'Both',
    summary: 'The short-run trade-off between inflation and unemployment. Higher inflation is associated with lower unemployment.',
    detail: 'The original Phillips Curve (1958) showed an empirical inverse relationship between wage inflation and unemployment. Friedman and Phelps argued this only holds in the short run — in the long run, the curve is vertical at the natural rate of unemployment (NAIRU). The 1970s stagflation broke the short-run relationship, showing supply shocks can cause both inflation and unemployment to rise simultaneously.',
    keyPoints: ['Short-run: inverse relationship between inflation and unemployment', 'Long-run: vertical at NAIRU', 'Supply shocks shift the curve outward (stagflation)', 'Expectations-augmented Phillips Curve (Friedman-Phelps)'],
    tags: ['Inflation', 'Unemployment', 'NAIRU', 'Stagflation', 'Expectations'],
    chartData: [
      { x: 2, y: 10 }, { x: 4, y: 7 }, { x: 6, y: 5 }, { x: 8, y: 3.5 }, { x: 10, y: 2.5 }, { x: 12, y: 2 },
    ],
    chartLabel: 'Short-Run Phillips Curve (Inflation % vs Unemployment %)',
  },
  {
    id: 'monetary-policy', title: 'Monetary Policy', category: 'Policy', level: 'Both',
    summary: 'Central bank tools to control money supply and interest rates to achieve macroeconomic objectives.',
    detail: 'Monetary policy operates through the interest rate transmission mechanism: central bank rate → commercial bank rates → borrowing costs → consumption and investment → aggregate demand → output and inflation. Unconventional tools include Quantitative Easing (QE) — asset purchases to inject money — and forward guidance. The liquidity trap occurs when rates hit zero and further cuts lose effectiveness.',
    formula: 'Fisher Equation: i = r + π (nominal rate = real rate + inflation)',
    keyPoints: ['Expansionary: cut rates → boost AD → reduce unemployment', 'Contractionary: raise rates → reduce AD → lower inflation', 'QE: central bank buys assets to inject money', 'Liquidity trap: rates at zero bound, QE needed'],
    tags: ['Interest Rates', 'QE', 'Central Bank', 'Transmission Mechanism', 'Liquidity Trap'],
  },
  {
    id: 'fiscal-policy', title: 'Fiscal Policy', category: 'Policy', level: 'Both',
    summary: 'Government spending and taxation decisions to influence aggregate demand and economic activity.',
    detail: 'Fiscal policy works through the multiplier effect: an initial injection of government spending creates income, which is spent again, creating further income. The size of the multiplier depends on the marginal propensity to consume (MPC). Automatic stabilisers (unemployment benefits, progressive taxes) reduce the need for discretionary policy. Crowding out occurs when government borrowing raises interest rates, reducing private investment.',
    formula: 'Multiplier = 1 / (1 - MPC) = 1 / MPS',
    keyPoints: ['Expansionary: increase G or cut T → shift AD right', 'Contractionary: cut G or raise T → shift AD left', 'Multiplier amplifies initial spending change', 'Crowding out: government borrowing raises interest rates'],
    tags: ['Government Spending', 'Taxation', 'Multiplier', 'Crowding Out', 'Automatic Stabilisers'],
  },
  {
    id: 'exchange-rates', title: 'Exchange Rates', category: 'International Economics', level: 'Both',
    summary: 'The price of one currency in terms of another, determined by supply and demand in the foreign exchange market.',
    detail: 'Exchange rates are determined by: (1) interest rate differentials — higher rates attract hot money inflows; (2) inflation differentials — purchasing power parity (PPP); (3) current account balance — trade surpluses increase demand for currency; (4) speculation and confidence. Fixed exchange rates require central bank intervention; floating rates adjust automatically. The Marshall-Lerner condition states that a depreciation improves the current account if the sum of export and import price elasticities exceeds 1.',
    formula: 'PPP: e = P_domestic / P_foreign',
    keyPoints: ['Appreciation: currency worth more → exports more expensive', 'Depreciation: currency worth less → exports cheaper', 'Hot money flows respond to interest rate differentials', 'Marshall-Lerner condition for depreciation to improve CA'],
    tags: ['Currency', 'Depreciation', 'Appreciation', 'PPP', 'Hot Money', 'Marshall-Lerner'],
  },
  {
    id: 'financial-contagion', title: 'Financial Contagion', category: 'Financial Economics', level: 'IB',
    summary: 'The spread of financial crisis from one market or country to others through interconnected financial systems.',
    detail: 'Financial contagion occurs through: (1) trade linkages — falling demand reduces exports of trading partners; (2) financial linkages — shared creditors sell assets across markets; (3) investor herding — panic causes investors to withdraw from all "similar" markets regardless of fundamentals; (4) confidence effects — loss of trust spreads. The Asian Financial Crisis (1997) and 2008 GFC demonstrated extreme contagion effects.',
    keyPoints: ['Trade channel: falling demand reduces partner exports', 'Financial channel: shared creditors sell across markets', 'Herding: investors treat similar markets as one risk', 'Contagion can spread even without fundamental links'],
    tags: ['Contagion', 'Herding', 'Systemic Risk', 'Asian Crisis', 'Financial Crisis'],
  },
  {
    id: 'keynesian-monetarist', title: 'Keynesian vs Monetarist', category: 'Schools of Thought', level: 'Both',
    summary: 'Two competing macroeconomic frameworks with different views on the role of government and markets.',
    detail: 'Keynesians argue that markets can fail and get stuck in low-output equilibria. Government intervention through fiscal policy is necessary to stabilise the economy. The multiplier amplifies spending. Monetarists (Friedman) argue that markets are self-correcting in the long run. Monetary policy should follow rules (money supply growth = GDP growth). Government intervention causes more harm than good through crowding out and time lags.',
    keyPoints: ['Keynesian: markets fail, fiscal policy needed', 'Monetarist: markets self-correct, rules-based monetary policy', 'Keynesian: short-run focus; Monetarist: long-run focus', 'New Keynesian: price stickiness justifies intervention'],
    tags: ['Keynes', 'Friedman', 'Fiscal Policy', 'Monetary Policy', 'Market Failure'],
  },
  {
    id: 'debt-deflation', title: 'Debt Deflation', category: 'Financial Economics', level: 'IB',
    summary: "Irving Fisher's theory explaining how falling prices increase real debt burdens, creating a self-reinforcing deflationary spiral.",
    detail: "Fisher's debt deflation theory (1933) explains how a deflationary spiral develops: (1) falling prices increase the real value of debts; (2) debtors cut spending to service higher real debts; (3) reduced spending further depresses prices; (4) the cycle repeats. This mechanism was central to the Great Depression and explains why deflation is more dangerous than moderate inflation. It also explains why central banks target positive inflation (2%).",
    keyPoints: ['Falling prices → higher real debt burden', 'Higher real debt → spending cuts', 'Spending cuts → further price falls', 'Self-reinforcing spiral — requires policy intervention'],
    tags: ['Deflation', 'Debt', 'Fisher', 'Great Depression', 'Spiral'],
  },
];

const categories = ['All', 'Macroeconomic Framework', 'Inflation & Unemployment', 'Policy', 'International Economics', 'Financial Economics', 'Schools of Thought'];
const levels = ['All', 'A-Level', 'IB', 'Both'];

const levelColors: Record<string, string> = {
  'A-Level': 'text-sky-400 bg-sky-500/10 border-sky-500/20',
  'IB': 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  'Both': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="text-sm font-mono font-semibold text-emerald-400">{payload[0].value}</p>
    </div>
  );
};

export default function TheoryBankPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLevel, setActiveLevel] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>('ad-as');
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);

  const filtered = concepts.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.summary.toLowerCase().includes(search.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = activeCategory === 'All' || c.category === activeCategory;
    const matchLevel = activeLevel === 'All' || c.level === activeLevel || c.level === 'Both';
    return matchSearch && matchCat && matchLevel;
  });

  const flashcardConcept = filtered[flashcardIndex % Math.max(filtered.length, 1)];

  return (
    <AppLayout>
      <div className="min-h-screen bg-zinc-950">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-8 py-8 space-y-8">

          {/* Header */}
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-sky-500/10 rounded-lg border border-sky-500/20">
                  <BookOpen size={20} className="text-sky-400" />
                </div>
                <h1 className="text-2xl font-bold text-zinc-100">Theory Bank</h1>
              </div>
              <p className="text-sm text-zinc-500">Interactive A-Level & IB macroeconomics concepts with graphs, formulas, and flashcards.</p>
            </div>
            <button
              onClick={() => { setFlashcardMode(!flashcardMode); setFlashcardFlipped(false); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                flashcardMode
                  ? 'bg-violet-500/15 text-violet-400 border-violet-500/30'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <Star size={14} />
              {flashcardMode ? 'Exit Flashcards' : 'Flashcard Mode'}
            </button>
          </div>

          {/* Flashcard Mode */}
          {flashcardMode && flashcardConcept && (
            <div className="space-y-4">
              <div
                onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                className="cursor-pointer bg-zinc-900 border border-violet-500/30 rounded-2xl p-8 min-h-48 flex flex-col items-center justify-center text-center hover:border-violet-500/50 transition-all"
              >
                {!flashcardFlipped ? (
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs border mb-3 ${levelColors[flashcardConcept.level]}`}>{flashcardConcept.level}</span>
                    <h3 className="text-xl font-bold text-zinc-100 mb-2">{flashcardConcept.title}</h3>
                    <p className="text-xs text-zinc-500">Click to reveal definition</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-zinc-300 leading-relaxed">{flashcardConcept.summary}</p>
                    {flashcardConcept.formula && (
                      <div className="px-4 py-2 bg-zinc-800 rounded-lg border border-zinc-700 inline-block">
                        <code className="text-sm text-emerald-400 font-mono">{flashcardConcept.formula}</code>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => { setFlashcardIndex((i) => Math.max(0, i - 1)); setFlashcardFlipped(false); }}
                  disabled={flashcardIndex === 0}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm rounded-xl hover:bg-zinc-800 disabled:opacity-30 transition-all"
                >
                  ← Previous
                </button>
                <span className="text-xs text-zinc-500">{flashcardIndex + 1} / {filtered.length}</span>
                <button
                  onClick={() => { setFlashcardIndex((i) => Math.min(filtered.length - 1, i + 1)); setFlashcardFlipped(false); }}
                  disabled={flashcardIndex >= filtered.length - 1}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm rounded-xl hover:bg-zinc-800 disabled:opacity-30 transition-all"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Search + Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search concepts, formulas, or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-sky-500/50 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={`cat-${cat}`}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                    activeCategory === cat
                      ? 'bg-sky-500/15 text-sky-400 border-sky-500/30' :'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <div className="w-px h-4 bg-zinc-800 mx-1" />
              {levels.map((lvl) => (
                <button
                  key={`lvl-${lvl}`}
                  onClick={() => setActiveLevel(lvl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                    activeLevel === lvl
                      ? 'bg-zinc-700 text-zinc-200 border-zinc-600' :'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1"><BookOpen size={11} />{filtered.length} concepts</span>
            <span className="flex items-center gap-1"><BarChart2 size={11} />{concepts.filter((c) => c.chartData).length} with interactive graphs</span>
            <span className="flex items-center gap-1"><Zap size={11} />{concepts.filter((c) => c.formula).length} with formulas</span>
          </div>

          {/* Concepts List */}
          <div className="space-y-3">
            {filtered.map((concept) => {
              const isExpanded = expandedId === concept.id;
              return (
                <div
                  key={concept.id}
                  className={`bg-zinc-900 border rounded-2xl overflow-hidden transition-all duration-200 ${isExpanded ? 'border-sky-500/30' : 'border-zinc-800 hover:border-zinc-700'}`}
                >
                  {/* Header */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : concept.id)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className={`text-sm font-bold ${isExpanded ? 'text-sky-400' : 'text-zinc-200'}`}>{concept.title}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs border ${levelColors[concept.level]}`}>{concept.level}</span>
                          <span className="text-xs text-zinc-600">{concept.category}</span>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed">{concept.summary}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {concept.tags.slice(0, 4).map((tag) => (
                            <span key={`tag-${concept.id}-${tag}`} className="flex items-center gap-1 px-2 py-0.5 bg-zinc-800 border border-zinc-700/50 rounded-full text-xs text-zinc-500">
                              <Tag size={8} />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      {concept.formula && <code className="hidden sm:block text-xs text-emerald-400/60 font-mono bg-zinc-800 px-2 py-0.5 rounded">formula</code>}
                      {concept.chartData && <BarChart2 size={14} className="text-zinc-600" />}
                      {isExpanded ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-600" />}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-5 pb-5 space-y-5 border-t border-zinc-800">
                      <div className="pt-4">
                        <p className="text-sm text-zinc-400 leading-relaxed">{concept.detail}</p>
                      </div>

                      {concept.formula && (
                        <div className="p-4 bg-zinc-800/60 border border-zinc-700/50 rounded-xl">
                          <p className="text-xs text-zinc-500 mb-2 flex items-center gap-1.5"><Zap size={11} className="text-emerald-400" /> Key Formula</p>
                          <code className="text-sm text-emerald-400 font-mono">{concept.formula}</code>
                        </div>
                      )}

                      {concept.chartData && (
                        <div className="p-4 bg-zinc-800/30 border border-zinc-700/30 rounded-xl">
                          <p className="text-xs text-zinc-500 mb-3 flex items-center gap-1.5"><BarChart2 size={11} className="text-sky-400" /> {concept.chartLabel}</p>
                          <ResponsiveContainer width="100%" height={160}>
                            <LineChart data={concept.chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                              <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
                              <XAxis dataKey="x" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
                              <Tooltip content={<CustomTooltip />} />
                              <Line type="monotone" dataKey="y" stroke="#34d399" strokeWidth={2} dot={false} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}

                      <div>
                        <p className="text-xs text-zinc-500 mb-2 flex items-center gap-1.5"><Star size={11} className="text-amber-400" /> Key Points</p>
                        <div className="space-y-2">
                          {concept.keyPoints.map((point, i) => (
                            <div key={`kp-${concept.id}-${i}`} className="flex items-start gap-2">
                              <ChevronRight size={12} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-zinc-400 leading-relaxed">{point}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
