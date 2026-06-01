'use client';
import React, { useState } from 'react';
import {
  CheckCircle2, TrendingUp, TrendingDown, AlertTriangle,
  Star, Trophy, ArrowRight, Info, BarChart2,
} from 'lucide-react';
import {
  RadialBarChart, RadialBar, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
} from 'recharts';
import Link from 'next/link';

const predictionResults = [
  {
    id: 'oil-res-001', question: 'Short-Run Inflation Effect', yourAnswer: 'Sharp rise (10%+)', correct: 'Sharp rise (10%+)', isCorrect: true, points: 100,
    explanation: 'Correct. US CPI rose from ~3.4% in 1972 to 11% in 1974. The oil price quadrupling drove cost-push inflation across all sectors — energy, transport, manufacturing and food.',
  },
  {
    id: 'oil-res-002', question: 'Short-Run GDP Growth Effect', yourAnswer: 'Mild recession (-0.5% to -1%)', correct: 'Mild recession (-0.5% to -1%)', isCorrect: true, points: 100,
    explanation: 'Correct. US GDP contracted in 1974–75. The SRAS curve shifted left — higher costs reduced output while raising prices, the textbook definition of a negative supply shock.',
  },
  {
    id: 'oil-res-003', question: 'Unemployment Effect', yourAnswer: 'Slight rise (+1–2pp)', correct: 'Significant rise (+3–5pp)', isCorrect: false, points: 30,
    explanation: 'Partially correct direction, but underestimated the magnitude. US unemployment rose from ~4.9% to 8.5% — a rise of ~3.6pp. Firms cut output significantly as energy costs made production unviable.',
  },
  {
    id: 'oil-res-004', question: 'Trade Balance Effect (Oil Importers)', yourAnswer: 'Trade deficit worsens', correct: 'Trade deficit worsens', isCorrect: true, points: 100,
    explanation: 'Correct. The US trade deficit widened sharply as the oil import bill quadrupled. The current account deteriorated for all major oil-importing nations.',
  },
  {
    id: 'oil-res-005', question: 'Most Appropriate Policy Response', yourAnswer: 'Supply-side reforms (energy diversification)', correct: 'Supply-side reforms (energy diversification)', isCorrect: true, points: 100,
    explanation: 'Correct. The long-run solution was reducing oil dependency through energy diversification, conservation, and North Sea/Alaskan oil development. Demand-management tools created a policy dilemma.',
  },
  {
    id: 'oil-res-006', question: 'Recovery Timeline', yourAnswer: '3–5 years (prolonged stagflation)', correct: '3–5 years (prolonged stagflation)', isCorrect: true, points: 100,
    explanation: 'Correct. Stagflation persisted through the mid-1970s. The second oil shock in 1979 extended the difficult period further. Full recovery required structural adjustment and Volcker\'s aggressive rate hikes in the early 1980s.',
  },
  {
    id: 'oil-res-007', question: 'Effect on Oil-Exporting Countries', yourAnswer: 'Large trade surpluses and revenue windfall', correct: 'Large trade surpluses and revenue windfall', isCorrect: true, points: 100,
    explanation: 'Correct. OPEC nations accumulated massive petrodollar surpluses. These were recycled through Western banks as loans to developing nations, contributing to the 1980s Latin American debt crisis.',
  },
];

const accuracyScore = 81;
const xpEarned = 588;
const accuracyData = [{ name: 'Accuracy', value: accuracyScore, fill: '#6ee7b7' }];

const sectorReactionData = [
  { sector: 'Oil & Gas', return: +85, color: '#34d399' },
  { sector: 'Gold', return: +72, color: '#34d399' },
  { sector: 'Commodities', return: +45, color: '#6ee7b7' },
  { sector: 'Utilities', return: -8, color: '#fbbf24' },
  { sector: 'Industrials', return: -22, color: '#fbbf24' },
  { sector: 'Consumer Disc.', return: -30, color: '#f87171' },
  { sector: 'Airlines', return: -42, color: '#f87171' },
  { sector: 'Autos', return: -38, color: '#f87171' },
];

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-zinc-400 mb-1">{label}</p>
      <p className={`text-sm font-mono font-semibold ${payload[0].value > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
        {payload[0].value > 0 ? '+' : ''}{payload[0].value}%
      </p>
    </div>
  );
};

export default function PhaseReactOil1973() {
  const [saved, setSaved] = useState(false);
  const correctCount = predictionResults.filter((r) => r.isCorrect).length;

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Results Header */}
      <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-amber-900/20 to-zinc-900 border border-amber-500/30 rounded-xl">
        <div className="p-3 bg-amber-500/15 rounded-xl">
          <Trophy size={28} className="text-amber-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-zinc-100 mb-1">Scenario Complete — Oil Supply Shock 1973</h2>
          <p className="text-sm text-zinc-400">You got {correctCount} of {predictionResults.length} predictions correct.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-3xl font-bold font-mono tabular-nums text-emerald-400">{accuracyScore}%</div>
            <div className="text-xs text-zinc-500">Prediction Accuracy</div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <Star size={16} className="text-amber-400" />
              <div className="text-3xl font-bold font-mono tabular-nums text-amber-400">+{xpEarned}</div>
            </div>
            <div className="text-xs text-zinc-500">XP Earned</div>
          </div>
        </div>
      </div>

      {/* Score + Sector Reactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-200 mb-4 flex items-center gap-2">
            <BarChart2 size={15} className="text-emerald-400" />
            Your Score Breakdown
          </h3>
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius={36} outerRadius={58} data={accuracyData} startAngle={90} endAngle={-270}>
                  <RadialBar dataKey="value" background={{ fill: '#27272a' }} cornerRadius={4} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2.5 flex-1">
              {[
                { label: 'Correct Predictions', value: `${correctCount}/${predictionResults.length}`, color: 'text-emerald-400' },
                { label: 'Total Points', value: `${predictionResults.reduce((a, r) => a + r.points, 0)}/700`, color: 'text-sky-400' },
                { label: 'XP Earned', value: `+${xpEarned}`, color: 'text-amber-400' },
                { label: 'Stagflation Understanding', value: 'Strong', color: 'text-violet-400' },
              ].map((item) => (
                <div key={`score-${item.label}`} className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">{item.label}</span>
                  <span className={`text-sm font-mono font-semibold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-200 mb-4">Actual Market Reactions by Sector (1973–74)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sectorReactionData} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 60 }}>
              <CartesianGrid stroke="hsl(240,4%,16%)" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="sector" tick={{ fill: '#a1a1aa', fontSize: 10 }} axisLine={false} tickLine={false} width={60} />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="return" radius={[0, 3, 3, 0]}>
                {sectorReactionData.map((entry) => (
                  <Cell key={`cell-${entry.sector}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Prediction Feedback */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-200">Prediction-by-Prediction Feedback</h3>
        </div>
        <div className="divide-y divide-zinc-800/60">
          {predictionResults.map((r) => (
            <div key={r.id} className={`px-5 py-4 ${r.isCorrect ? '' : 'bg-red-500/3'}`}>
              <div className="flex items-start gap-3">
                <div className={`p-1 rounded-full flex-shrink-0 mt-0.5 ${r.isCorrect ? 'bg-emerald-500/15' : 'bg-red-500/15'}`}>
                  {r.isCorrect
                    ? <CheckCircle2 size={14} className="text-emerald-400" />
                    : <AlertTriangle size={14} className="text-red-400" />
                  }
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">{r.question}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs">
                        <span className="text-zinc-500">Your answer: <span className={r.isCorrect ? 'text-emerald-400' : 'text-red-400'}>{r.yourAnswer}</span></span>
                        {!r.isCorrect && (
                          <span className="text-zinc-500">Correct: <span className="text-emerald-400">{r.correct}</span></span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Star size={12} className="text-amber-400" />
                      <span className={`text-sm font-mono font-semibold ${r.points > 0 ? 'text-amber-400' : 'text-zinc-600'}`}>+{r.points}</span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{r.explanation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key A-Level Concepts */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Info size={15} className="text-sky-400" />
          <h3 className="text-sm font-semibold text-zinc-200">Key A-Level Concepts Demonstrated</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { concept: 'Cost-Push Inflation', insight: 'Rising oil prices shifted SRAS leftward — raising prices without any increase in aggregate demand.', correct: true },
            { concept: 'Stagflation', insight: 'Simultaneous high inflation and rising unemployment broke the traditional Phillips Curve trade-off.', correct: true },
            { concept: 'Policy Dilemma', insight: 'Conventional demand-management tools could not solve stagflation — stimulating demand worsened inflation; fighting inflation deepened recession.', correct: false },
            { concept: 'Terms of Trade & Petrodollars', insight: 'Oil exporters accumulated surpluses recycled as loans to developing nations, planting seeds of the 1980s debt crisis.', correct: true },
          ].map((item) => (
            <div key={`concept-${item.concept}`} className={`p-3 rounded-lg border ${item.correct ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-amber-400/20 bg-amber-400/5'}`}>
              <div className="flex items-center gap-2 mb-1">
                {item.correct
                  ? <TrendingUp size={12} className="text-emerald-400" />
                  : <TrendingDown size={12} className="text-amber-400" />
                }
                <span className={`text-xs font-semibold ${item.correct ? 'text-emerald-400' : 'text-amber-400'}`}>{item.concept}</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">{item.insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link href="/scenario-hub" className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-xl border border-zinc-700/50 transition-colors">
          ← Back to Scenario Hub
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSaved(true)}
            disabled={saved}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl border transition-all duration-150 ${
              saved
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 cursor-default' :'bg-zinc-800 text-zinc-300 border-zinc-700/50 hover:bg-zinc-700'
            }`}
          >
            {saved ? <><CheckCircle2 size={14} /> Insights Saved</> : 'Save Insights'}
          </button>
          <Link
            href="/scenario-hub"
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-semibold rounded-xl transition-all duration-150 active:scale-95"
          >
            Next Scenario
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
