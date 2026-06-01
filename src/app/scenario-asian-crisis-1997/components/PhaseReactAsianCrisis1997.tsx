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
    id: 'afc-gdp', label: 'Short-Run GDP Effect',
    correctAnswerId: 'severe-recession', correctAnswerText: 'Severe recession (−5% to −15%)',
    options: [
      { id: 'strong-growth', text: 'Strong growth continues (+5%+)' },
      { id: 'weak-growth', text: 'Weak growth (1–3%)' },
      { id: 'stagnation', text: 'Near-zero growth (~0%)' },
      { id: 'mild-recession', text: 'Mild recession (−1% to −4%)' },
      { id: 'severe-recession', text: 'Severe recession (−5% to −15%)' },
    ],
    explanation: 'GDP fell 10.5% in Thailand, 13.1% in Indonesia, 5.7% in South Korea, and 7.4% in Malaysia in 1998. All components of AD collapsed simultaneously.',
    basePoints: 100,
  },
  {
    id: 'afc-currency', label: 'Exchange Rate Effect',
    correctAnswerId: 'severe-depreciation', correctAnswerText: 'Severe depreciation (−50% to −80%+)',
    options: [
      { id: 'appreciates', text: 'Currencies appreciate strongly' },
      { id: 'stable', text: 'Exchange rates remain stable' },
      { id: 'mild-depreciation', text: 'Mild depreciation (−5% to −15%)' },
      { id: 'moderate-depreciation', text: 'Moderate depreciation (−20% to −40%)' },
      { id: 'severe-depreciation', text: 'Severe depreciation (−50% to −80%+)' },
    ],
    explanation: 'The Thai baht fell ~55%, the Indonesian rupiah fell ~83% at its worst, and the South Korean won fell ~50%. When fixed exchange rate pegs collapsed, currencies fell far more dramatically.',
    basePoints: 100,
  },
  {
    id: 'afc-unemployment', label: 'Unemployment Effect',
    correctAnswerId: 'significant-rise', correctAnswerText: 'Significant rise (+5–10pp)',
    options: [
      { id: 'falls', text: 'Unemployment falls' },
      { id: 'unchanged', text: 'Unemployment unchanged' },
      { id: 'slight-rise', text: 'Slight rise (+1–3pp)' },
      { id: 'significant-rise', text: 'Significant rise (+5–10pp)' },
      { id: 'mass-unemployment', text: 'Mass unemployment (+15pp+)' },
    ],
    explanation: 'Unemployment rose significantly across all affected countries. Indonesia saw the most severe impact — millions lost jobs and an estimated 20–30 million people across Southeast Asia were pushed back into poverty.',
    basePoints: 80,
  },
  {
    id: 'afc-banking', label: 'Banking System Effect',
    correctAnswerId: 'systemic-crisis', correctAnswerText: 'Systemic crisis — widespread bank failures and credit freeze',
    options: [
      { id: 'stable', text: 'Banks remain stable' },
      { id: 'minor-stress', text: 'Minor stress — a few bank failures' },
      { id: 'moderate-failures', text: 'Moderate failures — some banks close' },
      { id: 'systemic-crisis', text: 'Systemic crisis — widespread bank failures and credit freeze' },
      { id: 'complete-collapse', text: 'Complete collapse — total loss of financial system' },
    ],
    explanation: 'The currency mismatch problem — companies borrowing in USD but earning in local currency — caused widespread insolvencies when currencies collapsed. Banks holding these bad loans then failed, causing a credit freeze.',
    basePoints: 100,
  },
  {
    id: 'afc-inflation', label: 'Inflation Effect',
    correctAnswerId: 'high-inflation', correctAnswerText: 'High inflation (20%+) for Indonesia; Moderate for others',
    options: [
      { id: 'deflation', text: 'Severe deflation (−10%+)' },
      { id: 'stable', text: 'Inflation stays low and stable' },
      { id: 'mild-inflation', text: 'Mild inflation (2–5%)' },
      { id: 'moderate-inflation', text: 'Moderate inflation (5–15%)' },
      { id: 'high-inflation', text: 'High inflation (20%+)' },
    ],
    explanation: 'Indonesia experienced inflation of ~80% in 1998 due to the extreme rupiah depreciation. Thailand and South Korea experienced more moderate inflation (5–15%). Currency depreciation raises import prices.',
    basePoints: 90,
  },
  {
    id: 'afc-policy', label: 'Most Appropriate Policy Response',
    correctAnswerId: 'imf-austerity', correctAnswerText: 'Accept IMF bailout with austerity conditions (controversial)',
    options: [
      { id: 'rate-cuts', text: 'Cut interest rates sharply to stimulate growth' },
      { id: 'fiscal-stimulus', text: 'Large fiscal stimulus — government spending' },
      { id: 'imf-austerity', text: 'Accept IMF bailout with austerity conditions' },
      { id: 'capital-controls', text: 'Impose capital controls to stop outflows' },
      { id: 'currency-board', text: 'Fix currency to USD with a currency board' },
    ],
    explanation: 'The IMF bailouts provided essential liquidity, but the austerity conditions were later criticised by economists including Joseph Stiglitz for deepening the recessions. There was no single "correct" policy response — this remains debated.',
    basePoints: 50,
  },
  {
    id: 'afc-recovery', label: 'Recovery Timeline',
    correctAnswerId: '1-2y', correctAnswerText: '1–2 years for South Korea; 3–5 years for Indonesia',
    options: [
      { id: '6m', text: '6 months (V-shaped recovery)' },
      { id: '1-2y', text: '1–2 years (short recession)' },
      { id: '3-5y', text: '3–5 years (prolonged recession)' },
      { id: '5-10y', text: '5–10 years (structural transformation required)' },
    ],
    explanation: 'South Korea grew 10.7% in 1999 after rapid structural reforms. Indonesia recovered much more slowly due to political instability and deeper structural damage.',
    basePoints: 80,
  },
];

const sectorReactionData = [
  { sector: 'USD Assets', return: 45, color: '#34d399' },
  { sector: 'Oil & Commodities', return: 8, color: '#6ee7b7' },
  { sector: 'Export Firms', return: -15, color: '#fbbf24' },
  { sector: 'Property', return: -42, color: '#f87171' },
  { sector: 'Banking', return: -58, color: '#f87171' },
  { sector: 'Asian Equities', return: -65, color: '#f87171' },
  { sector: 'Rupiah Assets', return: -83, color: '#f87171' },
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

interface PhaseReactAsianCrisis1997Props {
  predictions: PredictionEntry[];
}

export default function PhaseReactAsianCrisis1997({ predictions }: PhaseReactAsianCrisis1997Props) {
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
      id: `afc-res-${qDef.id}`,
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
  const xpEarned = Math.round(totalPoints * 0.9);
  const accuracyData = [{ name: 'Accuracy', value: accuracyScore, fill: '#6ee7b7' }];

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-amber-900/20 to-zinc-900 border border-amber-500/30 rounded-xl">
        <div className="p-3 bg-amber-500/15 rounded-xl">
          <Trophy size={28} className="text-amber-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-zinc-100 mb-1">Scenario Complete — Asian Financial Crisis (1997–1998)</h2>
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
                { label: 'Contagion Understanding', value: accuracyScore >= 70 ? 'Strong' : 'Developing', color: 'text-violet-400' },
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
          <h3 className="text-sm font-semibold text-zinc-200 mb-4">Actual Market Reactions by Asset Class (1997–1998)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sectorReactionData} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 80 }}>
              <CartesianGrid stroke="hsl(240,4%,16%)" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="sector" tick={{ fill: '#a1a1aa', fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
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
            { concept: 'Speculative Attack & Fixed Exchange Rates', insight: 'Fixed exchange rate pegs create vulnerability to speculative attacks. When investors collectively bet against a peg, central banks exhaust reserves and currencies collapse dramatically.', correct: true },
            { concept: 'Currency Mismatch & Balance Sheet Recession', insight: 'Borrowing in foreign currency while earning in local currency creates a dangerous mismatch. Currency depreciation multiplies the real cost of debt, causing widespread insolvencies.', correct: true },
            { concept: 'Financial Contagion & Herding', insight: 'Investor panic spread the crisis from Thailand to the entire region — even countries with stronger fundamentals were affected because investors treated all Asian emerging markets as a single risk category.', correct: true },
            { concept: 'IMF Conditionality Debate', insight: "The IMF's austerity conditions remain controversial. Critics argue they deepened recessions; supporters argue they were necessary to restore confidence and prevent total collapse.", correct: false },
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
