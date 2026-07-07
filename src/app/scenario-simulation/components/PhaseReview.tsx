'use client';
import React, { useState } from 'react';
import {
  CheckCircle2, TrendingUp, TrendingDown, AlertTriangle,
  Star, Trophy, ArrowRight, Info, BarChart2, Briefcase, Minus,
} from 'lucide-react';
import {
  RadialBarChart, RadialBar, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
} from 'recharts';
import Link from 'next/link';
import { PredictionEntry } from '@/lib/predictionStore';
import type { ReactResult } from './PhaseReact';

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
    id: 'gfc-gdp-dir', label: 'GDP Direction',
    correctAnswerId: 'deep-contraction', correctAnswerText: 'Deep Contraction (<-2%)',
    options: [
      { id: 'strong-growth', text: 'Strong Growth (+2%+)' },
      { id: 'weak-growth', text: 'Weak Growth (0–2%)' },
      { id: 'stagnation', text: 'Stagnation (~0%)' },
      { id: 'mild-contraction', text: 'Mild Contraction (-1% to 0%)' },
      { id: 'deep-contraction', text: 'Deep Contraction (<-2%)' },
    ],
    explanation: 'GDP fell -4.3% in 2009 — the deepest contraction since the Great Depression.',
    basePoints: 100,
  },
  {
    id: 'gfc-unemployment', label: 'Unemployment Change',
    correctAnswerId: '2.8', correctAnswerText: '+2.8pp',
    options: [],
    explanation: 'Unemployment rose from 7.2% to 10.0% (+2.8pp) by Oct 2009.',
    basePoints: 85,
  },
  {
    id: 'gfc-inflation-dir', label: 'Inflation Direction',
    correctAnswerId: 'deflation', correctAnswerText: 'Deflation (<0%)',
    options: [
      { id: 'hyperinflation', text: 'Hyperinflation (10%+)' },
      { id: 'high-inflation', text: 'High Inflation (5–10%)' },
      { id: 'moderate', text: 'Moderate (2–5%)' },
      { id: 'low', text: 'Low Inflation (0–2%)' },
      { id: 'deflation', text: 'Deflation (<0%)' },
    ],
    explanation: 'CPI briefly turned negative in mid-2009 as demand destruction overwhelmed cost pressures.',
    basePoints: 100,
  },
  {
    id: 'gfc-dollar', label: 'USD Exchange Rate',
    correctAnswerId: 'strong-appreciation', correctAnswerText: 'Strong Appreciation (+10%+)',
    options: [
      { id: 'strong-appreciation', text: 'Strong Appreciation (+10%+)' },
      { id: 'mild-appreciation', text: 'Mild Appreciation (+2–10%)' },
      { id: 'stable', text: 'Broadly Stable (±2%)' },
      { id: 'depreciation', text: 'Depreciation' },
    ],
    explanation: 'The DXY rose ~15% as global capital fled to USD safe-haven assets.',
    basePoints: 100,
  },
  {
    id: 'gfc-bond-yields', label: 'Treasury Bond Yields',
    correctAnswerId: 'sharp-fall', correctAnswerText: 'Sharp fall (flight to safety buying)',
    options: [
      { id: 'sharp-fall', text: 'Sharp fall (flight to safety buying)' },
      { id: 'mild-fall', text: 'Mild fall (moderate safe-haven demand)' },
      { id: 'stable', text: 'Stable (no net movement)' },
      { id: 'rise', text: 'Rise (investors sell bonds for cash)' },
    ],
    explanation: '10-year yields fell from 4.5% to 2.2% as investors piled into US government bonds.',
    basePoints: 100,
  },
  {
    id: 'gfc-banking-risk', label: 'Systemic Banking Risk',
    correctAnswerId: '9', correctAnswerText: '9/10',
    options: [],
    explanation: 'Risk was 9/10. 9 major institutions required government intervention.',
    basePoints: 80,
  },
  {
    id: 'gfc-recovery', label: 'Recovery Timeline',
    correctAnswerId: '3-5y', correctAnswerText: '3–5 years (prolonged downturn)',
    options: [
      { id: '6m', text: '6 months (V-shaped recovery)' },
      { id: '1-2y', text: '1–2 years (normal recession)' },
      { id: '3-5y', text: '3–5 years (prolonged downturn)' },
      { id: '5y-plus', text: '5+ years (structural damage)' },
    ],
    explanation: 'The US economy only returned to pre-crisis GDP trend around 2013–2014.',
    basePoints: 100,
  },
  {
    id: 'gfc-policy', label: 'Most Effective Policy',
    correctAnswerId: 'qe', correctAnswerText: 'Quantitative Easing (asset purchases)',
    options: [
      { id: 'rate-cuts', text: 'Aggressive Fed rate cuts to 0%' },
      { id: 'qe', text: 'Quantitative Easing (asset purchases)' },
      { id: 'fiscal', text: 'Large fiscal stimulus package' },
      { id: 'bailout', text: 'Direct bank recapitalisation (TARP)' },
    ],
    explanation: 'TARP helped stabilise banks but QE was more significant in restoring credit flows and asset prices over 2009–2015.',
    basePoints: 100,
  },
];

const sectorReactionData = [
  { sector: 'Financials', return: -55, color: '#f87171' },
  { sector: 'Energy', return: -42, color: '#f87171' },
  { sector: 'Consumer Disc.', return: -38, color: '#f87171' },
  { sector: 'Industrials', return: -35, color: '#fbbf24' },
  { sector: 'Materials', return: -30, color: '#fbbf24' },
  { sector: 'Tech', return: -28, color: '#fbbf24' },
  { sector: 'Healthcare', return: -18, color: '#6ee7b7' },
  { sector: 'Utilities', return: -12, color: '#6ee7b7' },
  { sector: 'US Treasuries', return: +22, color: '#34d399' },
  { sector: 'Gold', return: +18, color: '#34d399' },
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

interface PhaseReviewProps {
  predictions: PredictionEntry[];
  reactResult?: ReactResult | null;
}

const stanceLabel: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  reduce: { label: 'Reduced', color: 'text-red-400', icon: <TrendingDown size={12} /> },
  hold: { label: 'Held', color: 'text-zinc-300', icon: <Minus size={12} /> },
  increase: { label: 'Increased', color: 'text-emerald-400', icon: <TrendingUp size={12} /> },
};

export default function PhaseReview({ predictions, reactResult }: PhaseReviewProps) {
  const [saved, setSaved] = useState(false);

  const results = questionDefs.map((qDef) => {
    const prediction = predictions.find((p) => p.questionId === qDef.id);
    const selectedAnswerId = prediction?.selectedAnswerId ?? '';

    let selectedOption: { id: string; text: string } | undefined;
    if (qDef.options.length > 0) {
      selectedOption = qDef.options.find((opt) => opt.id === selectedAnswerId);
    }

    if (!selectedOption && selectedAnswerId) {
      selectedOption = { id: selectedAnswerId, text: selectedAnswerId };
    }

    if (!selectedOption) {
      selectedOption = { id: '', text: 'No answer recorded' };
    }

    const isCorrect = selectedAnswerId === qDef.correctAnswerId;
    const points = isCorrect ? qDef.basePoints : Math.round(qDef.basePoints * 0.2);

    return {
      id: `res-${qDef.id}`,
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
  const xpEarned = Math.round(totalPoints * 0.8);
  const accuracyData = [{ name: 'Accuracy', value: accuracyScore, fill: '#6ee7b7' }];

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Results Header */}
      <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-emerald-900/20 to-zinc-900 border border-emerald-500/30 rounded-xl">
        <div className="p-3 bg-emerald-500/15 rounded-xl">
          <Trophy size={28} className="text-emerald-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-zinc-100 mb-1">Scenario Complete!</h2>
          <p className="text-sm text-zinc-400">
            You got {correctCount} of {results.length} predictions correct
            {reactResult ? ` and posted a ${reactResult.activeReturn > 0 ? '+' : ''}${reactResult.activeReturn}% active portfolio return.` : '.'}
          </p>
        </div>
        <div className="flex items-center gap-5">
          <div className="text-right">
            <div className="text-3xl font-bold font-mono tabular-nums text-emerald-400">{accuracyScore}%</div>
            <div className="text-xs text-zinc-500">Economic Reasoning</div>
          </div>
          {reactResult && (
            <div className="text-right">
              <div className={`text-3xl font-bold font-mono tabular-nums ${reactResult.activeReturn >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {reactResult.activeReturn > 0 ? '+' : ''}{reactResult.activeReturn}%
              </div>
              <div className="text-xs text-zinc-500">Financial Performance</div>
            </div>
          )}
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <Star size={16} className="text-amber-400" />
              <div className="text-3xl font-bold font-mono tabular-nums text-amber-400">+{xpEarned}</div>
            </div>
            <div className="text-xs text-zinc-500">XP Earned</div>
          </div>
        </div>
      </div>

      {/* Two-column: accuracy radial + sector reactions */}
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
                { label: 'Confidence Calibration', value: accuracyScore >= 70 ? 'Good' : 'Developing', color: 'text-violet-400' },
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
          <h3 className="text-sm font-semibold text-zinc-200 mb-4">Actual Market Reactions by Sector</h3>
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

      {/* Portfolio Performance (from React phase) */}
      {reactResult && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <Briefcase size={15} className="text-emerald-400" />
              Portfolio Performance — How You Repositioned
            </h3>
            <div className="flex items-center gap-5">
              <div className="text-right">
                <div className="text-sm font-mono font-semibold text-emerald-400">{reactResult.positioningScore}%</div>
                <div className="text-[10px] text-zinc-600 uppercase tracking-wide">Defensive</div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-mono font-semibold ${reactResult.activeReturn >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {reactResult.activeReturn > 0 ? '+' : ''}{reactResult.activeReturn}%
                </div>
                <div className="text-[10px] text-zinc-600 uppercase tracking-wide">Active Return</div>
              </div>
            </div>
          </div>
          <div className="divide-y divide-zinc-800/60">
            {reactResult.positions.map((pos) => {
              const meta = stanceLabel[pos.stance];
              return (
                <div key={`pos-${pos.name}`} className={`px-5 py-3 flex items-center justify-between gap-4 ${pos.verdict === 'poor' ? 'bg-red-500/3' : ''}`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-1 rounded-full flex-shrink-0 ${pos.verdict === 'good' ? 'bg-emerald-500/15' : pos.verdict === 'poor' ? 'bg-red-500/15' : 'bg-amber-400/15'}`}>
                      {pos.verdict === 'good'
                        ? <CheckCircle2 size={13} className="text-emerald-400" />
                        : pos.verdict === 'poor'
                        ? <AlertTriangle size={13} className="text-red-400" />
                        : <Info size={13} className="text-amber-400" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-zinc-200 truncate">{pos.name}</p>
                      <p className="text-xs text-zinc-600">{pos.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 flex-shrink-0">
                    <span className={`flex items-center gap-1 text-xs font-medium ${meta.color}`}>
                      {meta.icon}
                      {meta.label}
                    </span>
                    <span className={`text-sm font-mono font-semibold w-14 text-right ${pos.actualReturn >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {pos.actualReturn > 0 ? '+' : ''}{pos.actualReturn}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-5 py-3 bg-zinc-900/60 border-t border-zinc-800 text-xs text-zinc-500 leading-relaxed">
            Active return measures how well your tilts (increase / reduce) aligned with each asset&apos;s actual crisis-period
            move. Cutting falling assets and rotating into safe havens — Treasuries, gold, and cash — generates positive
            active return. This is the financial side of your performance; prediction accuracy below is the reasoning side.
          </div>
        </div>
      )}

      {/* Prediction Results */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-200">Prediction-by-Prediction Feedback</h3>
        </div>
        <div className="divide-y divide-zinc-800/60">
          {results.map((r) => (
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
                      <span className={`text-sm font-mono font-semibold ${r.points > 0 ? 'text-amber-400' : 'text-zinc-600'}`}>
                        +{r.points}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{r.explanation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Learning Points */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Info size={15} className="text-sky-400" />
          <h3 className="text-sm font-semibold text-zinc-200">Key A-Level Concepts Demonstrated</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { concept: 'AD/AS Model', insight: 'A negative demand shock shifts AD left, causing both falling output and falling price levels.', correct: true },
            { concept: 'Phillips Curve', insight: 'The short-run trade-off between unemployment and inflation breaks down during supply shocks.', correct: true },
            { concept: 'Liquidity Trap', insight: 'When rates hit zero, conventional monetary policy loses effectiveness — QE becomes necessary.', correct: false },
            { concept: 'Safe-Haven Assets', insight: 'In crises, capital flows to USD, gold, and government bonds regardless of fundamentals.', correct: true },
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
            {saved ? <><CheckCircle2 size={14} /> Applied to Portfolio</> : 'Apply Insights to Portfolio'}
          </button>
          <Link
            href="/portfolio-management"
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-semibold rounded-xl transition-all duration-150 active:scale-95"
          >
            Manage Portfolio
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
