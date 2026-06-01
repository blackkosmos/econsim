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
import { PredictionEntry } from '@/lib/predictionStore';

interface QuestionDef {
  id: string;
  label: string;
  correctAnswerId: string;
  correctAnswerText: string;
  options: { id: string; text: string }[];
  explanation: string;
  basePoints: number;
}

const questionDefs: QuestionDef[] = [
  {
    id: 'dep-gdp', label: 'Short-Run GDP Effect',
    correctAnswerId: 'severe-recession', correctAnswerText: 'Severe recession (−5% or worse)',
    options: [
      { id: 'strong-growth', text: 'Strong growth continues (+4%+)' },
      { id: 'weak-growth', text: 'Weak growth (1–3%)' },
      { id: 'stagnation', text: 'Near-zero growth (~0%)' },
      { id: 'mild-recession', text: 'Mild recession (−1% to −3%)' },
      { id: 'severe-recession', text: 'Severe recession (−5% or worse)' },
    ],
    explanation: 'US GDP fell by ~30% between 1929 and 1933 — the largest peacetime contraction in American history. All components of AD collapsed simultaneously.',
    basePoints: 100,
  },
  {
    id: 'dep-unemployment', label: 'Unemployment Effect',
    correctAnswerId: 'mass-unemployment', correctAnswerText: 'Mass unemployment (+15pp+)',
    options: [
      { id: 'falls', text: 'Unemployment falls' },
      { id: 'unchanged', text: 'Unemployment unchanged' },
      { id: 'slight-rise', text: 'Slight rise (+2–4pp)' },
      { id: 'significant-rise', text: 'Significant rise (+5–10pp)' },
      { id: 'mass-unemployment', text: 'Mass unemployment (+15pp+)' },
    ],
    explanation: 'Unemployment surged from ~3% in 1929 to ~25% by 1933 — a rise of ~22 percentage points. This is the largest cyclical unemployment episode in US history.',
    basePoints: 100,
  },
  {
    id: 'dep-deflation', label: 'Price Level Effect',
    correctAnswerId: 'severe-deflation', correctAnswerText: 'Severe deflation (−10%+)',
    options: [
      { id: 'hyperinflation', text: 'Hyperinflation (50%+)' },
      { id: 'moderate-inflation', text: 'Moderate inflation (3–6%)' },
      { id: 'stable', text: 'Price level stays stable' },
      { id: 'mild-deflation', text: 'Mild deflation (−1% to −5%)' },
      { id: 'severe-deflation', text: 'Severe deflation (−10%+)' },
    ],
    explanation: "Prices fell by ~25% between 1929 and 1933. Irving Fisher's debt deflation spiral meant falling prices increased real debt burdens, forcing further spending cuts and deepening the deflation.",
    basePoints: 100,
  },
  {
    id: 'dep-banking', label: 'Banking System Effect',
    correctAnswerId: 'systemic-crisis', correctAnswerText: 'Systemic crisis — thousands of banks fail',
    options: [
      { id: 'stable', text: 'Banks remain stable' },
      { id: 'minor-stress', text: 'Minor stress — a few bank failures' },
      { id: 'moderate-failures', text: 'Moderate failures — hundreds of banks close' },
      { id: 'systemic-crisis', text: 'Systemic crisis — thousands of banks fail' },
      { id: 'complete-collapse', text: 'Complete collapse of the financial system' },
    ],
    explanation: "Over 4,000 banks failed between 1930 and 1933. Bank runs became self-fulfilling prophecies. FDR's bank holiday in March 1933 and the creation of the FDIC eventually stabilised the system.",
    basePoints: 100,
  },
  {
    id: 'dep-investment', label: 'Business Investment Effect',
    correctAnswerId: 'collapse', correctAnswerText: 'Near-total collapse (−70%+)',
    options: [
      { id: 'rises', text: 'Investment rises — firms expand capacity' },
      { id: 'unchanged', text: 'Investment unchanged' },
      { id: 'slight-fall', text: 'Slight fall (−10% to −20%)' },
      { id: 'large-fall', text: 'Large fall (−40% to −60%)' },
      { id: 'collapse', text: 'Near-total collapse (−70%+)' },
    ],
    explanation: 'Business investment fell by ~79% from 1929 to 1933. The Marginal Efficiency of Capital collapsed as firms expected no return on new investment. Even near-zero interest rates could not stimulate investment — a textbook liquidity trap.',
    basePoints: 100,
  },
  {
    id: 'dep-policy', label: 'Most Appropriate Policy Response',
    correctAnswerId: 'fiscal-stimulus', correctAnswerText: 'Large fiscal stimulus — government spending and public works',
    options: [
      { id: 'austerity', text: 'Austerity — cut government spending to balance the budget' },
      { id: 'rate-cuts', text: 'Cut interest rates to stimulate borrowing' },
      { id: 'fiscal-stimulus', text: 'Large fiscal stimulus — government spending and public works' },
      { id: 'tariffs', text: 'Raise tariffs to protect domestic industry' },
      { id: 'gold-standard', text: 'Maintain the gold standard to restore confidence' },
    ],
    explanation: "Roosevelt's New Deal — public works (WPA, CCC), banking reform, and social security — was the appropriate Keynesian response. Hoover's austerity approach worsened the depression.",
    basePoints: 100,
  },
  {
    id: 'dep-recovery', label: 'Recovery Timeline',
    correctAnswerId: '10y-plus', correctAnswerText: '10+ years (structural transformation required)',
    options: [
      { id: '1y', text: '1 year (V-shaped recovery)' },
      { id: '2-3y', text: '2–3 years (short recession)' },
      { id: '5-7y', text: '5–7 years (prolonged depression)' },
      { id: '10y-plus', text: '10+ years (structural transformation required)' },
    ],
    explanation: 'The US did not fully recover to pre-1929 output levels until WWII-era government spending in the early 1940s. The Depression caused permanent structural changes.',
    basePoints: 100,
  },
];

const sectorReactionData = [
  { sector: 'Gold', return: 69, color: '#34d399' },
  { sector: 'Utilities', return: 12, color: '#6ee7b7' },
  { sector: 'Govt Bonds', return: 8, color: '#6ee7b7' },
  { sector: 'Agriculture', return: -28, color: '#fbbf24' },
  { sector: 'Industrials', return: -45, color: '#f87171' },
  { sector: 'Banking', return: -72, color: '#f87171' },
  { sector: 'Construction', return: -78, color: '#f87171' },
  { sector: 'Equities (Dow)', return: -89, color: '#f87171' },
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

interface PhaseReactDepression1929Props {
  predictions: PredictionEntry[];
}

export default function PhaseReactDepression1929({ predictions }: PhaseReactDepression1929Props) {
  const [saved, setSaved] = useState(false);

  const results = questionDefs.map((qDef) => {
    const prediction = predictions.find((p) => p.questionId === qDef.id);
    const selectedAnswerId = prediction?.selectedAnswerId ?? '';

    let selectedOption = qDef.options.find((opt) => opt.id === selectedAnswerId);
    if (!selectedOption && selectedAnswerId) {
      selectedOption = { id: selectedAnswerId, text: selectedAnswerId };
    }
    if (!selectedOption) {
      console.error('Prediction mapping failed for question:', qDef.id, '| savedId:', selectedAnswerId);
      selectedOption = { id: '', text: 'No answer recorded' };
    }

    console.log('Question:', qDef.id, '| Saved:', selectedAnswerId, '| Displayed:', selectedOption.text);

    const isCorrect = selectedAnswerId === qDef.correctAnswerId;
    const points = isCorrect ? qDef.basePoints : Math.round(qDef.basePoints * 0.2);

    return {
      id: `dep-res-${qDef.id}`,
      question: qDef.label,
      yourAnswer: selectedOption.text,
      correct: qDef.correctAnswerText,
      isCorrect,
      points,
      explanation: qDef.explanation,
    };
  });

  const correctCount = results.filter((r) => r.isCorrect).length;
  const totalPoints = results.reduce((a, r) => a + r.points, 0);
  const accuracyScore = Math.round((correctCount / results.length) * 100);
  const xpEarned = Math.round(totalPoints * 0.88);
  const accuracyData = [{ name: 'Accuracy', value: accuracyScore, fill: '#6ee7b7' }];

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-sky-900/20 to-zinc-900 border border-sky-500/30 rounded-xl">
        <div className="p-3 bg-sky-500/15 rounded-xl">
          <Trophy size={28} className="text-sky-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-zinc-100 mb-1">Scenario Complete — Great Depression (1929–1939)</h2>
          <p className="text-sm text-zinc-400">You got {correctCount} of {results.length} predictions correct.</p>
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
                { label: 'Correct Predictions', value: `${correctCount}/${results.length}`, color: 'text-emerald-400' },
                { label: 'Total Points', value: `${totalPoints}/${questionDefs.reduce((a, q) => a + q.basePoints, 0)}`, color: 'text-sky-400' },
                { label: 'XP Earned', value: `+${xpEarned}`, color: 'text-amber-400' },
                { label: 'Keynesian Understanding', value: accuracyScore >= 70 ? 'Strong' : 'Developing', color: 'text-violet-400' },
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
          <h3 className="text-sm font-semibold text-zinc-200 mb-4">Actual Market Reactions by Sector (1929–1933)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sectorReactionData} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 68 }}>
              <CartesianGrid stroke="hsl(240,4%,16%)" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="sector" tick={{ fill: '#a1a1aa', fontSize: 10 }} axisLine={false} tickLine={false} width={68} />
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

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-200">Prediction-by-Prediction Feedback</h3>
        </div>
        <div className="divide-y divide-zinc-800/60">
          {results.map((r) => (
            <div key={r.id} className={`px-5 py-4 ${r.isCorrect ? '' : 'bg-red-500/[0.03]'}`}>
              <div className="flex items-start gap-3">
                <div className={`p-1 rounded-full flex-shrink-0 mt-0.5 ${r.isCorrect ? 'bg-emerald-500/15' : 'bg-red-500/15'}`}>
                  {r.isCorrect ? <CheckCircle2 size={14} className="text-emerald-400" /> : <AlertTriangle size={14} className="text-red-400" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">{r.question}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs">
                        <span className="text-zinc-500">Your answer: <span className={r.isCorrect ? 'text-emerald-400' : 'text-red-400'}>{r.yourAnswer}</span></span>
                        {!r.isCorrect && <span className="text-zinc-500">Correct: <span className="text-emerald-400">{r.correct}</span></span>}
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

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Info size={15} className="text-sky-400" />
          <h3 className="text-sm font-semibold text-zinc-200">Key A-Level Concepts Demonstrated</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { concept: 'AD Collapse & Multiplier Effect', insight: 'All components of AD fell simultaneously — the negative multiplier amplified the initial shock into a catastrophic depression.', correct: true },
            { concept: 'Debt Deflation Spiral', insight: 'Falling prices increased real debt burdens, forcing spending cuts that reduced AD further — a self-reinforcing deflationary spiral.', correct: true },
            { concept: 'Liquidity Trap', insight: 'Even near-zero interest rates could not stimulate investment — the MEC had collapsed. Monetary policy lost effectiveness, validating Keynesian fiscal intervention.', correct: false },
            { concept: 'Keynesian Fiscal Policy', insight: "Roosevelt's New Deal demonstrated that government spending can act as the spender of last resort, shifting AD rightward and breaking the deflationary spiral.", correct: true },
          ].map((item) => (
            <div key={`concept-${item.concept}`} className={`p-3 rounded-lg border ${item.correct ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-amber-400/20 bg-amber-400/5'}`}>
              <div className="flex items-center gap-2 mb-1">
                {item.correct ? <TrendingUp size={12} className="text-emerald-400" /> : <TrendingDown size={12} className="text-amber-400" />}
                <span className={`text-xs font-semibold ${item.correct ? 'text-emerald-400' : 'text-amber-400'}`}>{item.concept}</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">{item.insight}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link href="/scenario-hub" className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-xl border border-zinc-700/50 transition-colors">
          ← Back to Scenario Hub
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSaved(true)}
            disabled={saved}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl border transition-all duration-150 ${
              saved ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 cursor-default' : 'bg-zinc-800 text-zinc-300 border-zinc-700/50 hover:bg-zinc-700'
            }`}
          >
            {saved ? <><CheckCircle2 size={14} /> Insights Saved</> : 'Save Insights'}
          </button>
          <Link
            href="/scenario-hub"
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-semibold rounded-xl transition-all duration-150 active:scale-95"
          >
            Next Scenario <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
