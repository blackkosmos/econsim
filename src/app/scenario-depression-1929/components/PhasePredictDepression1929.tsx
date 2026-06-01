'use client';
import React, { useState } from 'react';
import { Target, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { PredictionEntry } from '@/lib/predictionStore';

interface PredictionQuestion {
  id: string;
  label: string;
  type: 'direction' | 'slider' | 'radio';
  description: string;
  options?: { id: string; text: string; hint?: string }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  concept: string;
  conceptExplanation: string;
}

const questions: PredictionQuestion[] = [
  {
    id: 'dep-gdp', label: 'Short-Run GDP Effect', type: 'direction',
    description: 'The stock market crashes, banks fail, and consumer confidence collapses. What is the short-run effect on real GDP?',
    options: [
      { id: 'strong-growth', text: 'Strong growth continues (+4%+)', hint: 'Incorrect — multiple shocks are reinforcing each other' },
      { id: 'weak-growth', text: 'Weak growth (1–3%)', hint: 'Underestimates the severity of simultaneous shocks' },
      { id: 'stagnation', text: 'Near-zero growth (~0%)', hint: 'Too optimistic — demand is collapsing across all sectors' },
      { id: 'mild-recession', text: 'Mild recession (−1% to −3%)', hint: 'Possible but underestimates the depth' },
      { id: 'severe-recession', text: 'Severe recession (−5% or worse)', hint: 'Correct — GDP fell ~30% over 4 years' },
    ],
    concept: 'Aggregate Demand (AD) Collapse',
    conceptExplanation: 'Aggregate Demand (AD = C + I + G + NX) collapsed simultaneously across all components. Consumption fell as wealth evaporated and unemployment rose. Investment fell as firms faced uncertainty and credit dried up.',
  },
  {
    id: 'dep-unemployment', label: 'Unemployment Effect', type: 'direction',
    description: 'As GDP collapses and firms cut production, what happens to unemployment in the short run?',
    options: [
      { id: 'falls', text: 'Unemployment falls', hint: 'Incorrect — output is contracting sharply' },
      { id: 'unchanged', text: 'Unemployment unchanged', hint: 'Incorrect — mass layoffs are occurring' },
      { id: 'slight-rise', text: 'Slight rise (+2–4pp)', hint: 'Underestimates the scale of job losses' },
      { id: 'significant-rise', text: 'Significant rise (+5–10pp)', hint: 'Possible but still underestimates the peak' },
      { id: 'mass-unemployment', text: 'Mass unemployment (+15pp+)', hint: 'Correct — unemployment reached ~25% from ~3%' },
    ],
    concept: 'Cyclical Unemployment',
    conceptExplanation: 'Cyclical (demand-deficient) unemployment occurs when aggregate demand falls below the level needed to employ all workers. The Great Depression saw the largest cyclical unemployment in US history — a 22 percentage point rise from trough to peak.',
  },
  {
    id: 'dep-deflation', label: 'Price Level Effect', type: 'direction',
    description: 'Demand collapses across the economy. What happens to the general price level?',
    options: [
      { id: 'hyperinflation', text: 'Hyperinflation (50%+)', hint: 'Incorrect — demand is collapsing, not surging' },
      { id: 'moderate-inflation', text: 'Moderate inflation (3–6%)', hint: 'Incorrect — supply is not being restricted' },
      { id: 'stable', text: 'Price level stays stable', hint: 'Unlikely — demand collapse puts downward pressure on prices' },
      { id: 'mild-deflation', text: 'Mild deflation (−1% to −5%)', hint: 'Possible but underestimates the severity' },
      { id: 'severe-deflation', text: 'Severe deflation (−10%+)', hint: 'Correct — prices fell ~25% between 1929 and 1933' },
    ],
    concept: 'Demand-Pull Deflation & Debt Deflation',
    conceptExplanation: "When AD collapses, firms compete for fewer customers by cutting prices — this is demand-pull deflation. Irving Fisher's debt deflation theory explains why this is dangerous: falling prices increase the real value of debts, forcing borrowers to cut spending further.",
  },
  {
    id: 'dep-banking', label: 'Banking System Effect', type: 'direction',
    description: 'Stock prices collapse and loans go bad. What happens to the banking system?',
    options: [
      { id: 'stable', text: 'Banks remain stable', hint: 'Incorrect — banks held large amounts of bad loans' },
      { id: 'minor-stress', text: 'Minor stress — a few bank failures', hint: 'Underestimates the systemic nature of the crisis' },
      { id: 'moderate-failures', text: 'Moderate failures — hundreds of banks close', hint: 'Possible but underestimates the scale' },
      { id: 'systemic-crisis', text: 'Systemic crisis — thousands of banks fail', hint: 'Correct — over 4,000 banks failed 1930–1933' },
      { id: 'complete-collapse', text: 'Complete collapse of the financial system', hint: "Close — FDR's bank holiday in 1933 prevented total collapse" },
    ],
    concept: 'Financial Accelerator & Bank Runs',
    conceptExplanation: 'A bank run occurs when depositors, fearing a bank will fail, rush to withdraw savings simultaneously — causing the very failure they feared. The "financial accelerator" describes how financial sector stress amplifies economic downturns.',
  },
  {
    id: 'dep-investment', label: 'Business Investment Effect', type: 'direction',
    description: 'Banks stop lending, demand collapses, and uncertainty is extreme. What happens to business investment?',
    options: [
      { id: 'rises', text: 'Investment rises — firms expand capacity', hint: 'Incorrect — demand is collapsing' },
      { id: 'unchanged', text: 'Investment unchanged', hint: 'Incorrect — firms have no incentive to expand' },
      { id: 'slight-fall', text: 'Slight fall (−10% to −20%)', hint: 'Underestimates the collapse in confidence' },
      { id: 'large-fall', text: 'Large fall (−40% to −60%)', hint: 'Possible but still underestimates the actual collapse' },
      { id: 'collapse', text: 'Near-total collapse (−70%+)', hint: 'Correct — investment fell ~79% from 1929 to 1933' },
    ],
    concept: 'Marginal Efficiency of Capital (MEC)',
    conceptExplanation: "The Marginal Efficiency of Capital (MEC) is the expected rate of return on investment. When confidence collapses, the MEC falls sharply — firms expect low returns on new investment. Keynes argued that in a severe depression, even very low interest rates may not stimulate investment — the 'liquidity trap'.",
  },
  {
    id: 'dep-policy', label: 'Most Appropriate Policy Response', type: 'radio',
    description: 'The economy is in freefall. Unemployment is rising, banks are failing, and deflation is setting in. Which policy response is most appropriate?',
    options: [
      { id: 'austerity', text: "Austerity — cut government spending to balance the budget", hint: "Hoover's approach — worsened the depression" },
      { id: 'rate-cuts', text: 'Cut interest rates to stimulate borrowing', hint: 'Useful but limited — liquidity trap reduces effectiveness' },
      { id: 'fiscal-stimulus', text: 'Large fiscal stimulus — government spending and public works', hint: "Correct — Keynesian approach; Roosevelt's New Deal" },
      { id: 'tariffs', text: 'Raise tariffs to protect domestic industry', hint: 'Smoot–Hawley approach — worsened the depression' },
      { id: 'gold-standard', text: 'Maintain the gold standard to restore confidence', hint: 'Constrained monetary policy — abandoning it helped recovery' },
    ],
    concept: 'Keynesian Fiscal Policy',
    conceptExplanation: "Keynes argued that in a severe recession, private sector demand collapses and the economy gets stuck in a low-output equilibrium. Government must step in as the 'spender of last resort' — increasing G in the AD equation.",
  },
  {
    id: 'dep-recovery', label: 'Recovery Timeline', type: 'radio',
    description: 'Given the scale of the collapse — banking failures, deflation, mass unemployment — how long before the US economy returns to pre-crash output levels?',
    options: [
      { id: '1y', text: '1 year (V-shaped recovery)' },
      { id: '2-3y', text: '2–3 years (short recession)' },
      { id: '5-7y', text: '5–7 years (prolonged depression)' },
      { id: '10y-plus', text: '10+ years (structural transformation required)' },
    ],
    concept: 'Hysteresis & Long-Run Scarring',
    conceptExplanation: 'Hysteresis refers to the long-lasting effects of a recession on the productive capacity of an economy. The Great Depression caused permanent structural changes: the New Deal, financial regulation, and social safety nets. Full recovery to pre-1929 output levels required WWII-era government spending.',
  },
  {
    id: 'dep-keynesian', label: 'Keynesian Multiplier Strength (1–10)', type: 'slider',
    description: 'How effective do you think government fiscal stimulus (New Deal) would be in this scenario? (1 = very weak, 10 = very powerful)',
    min: 1, max: 10, step: 1, unit: '/10',
    concept: 'Fiscal Multiplier',
    conceptExplanation: 'The fiscal multiplier measures how much GDP increases for each unit of government spending. In a deep recession with high unemployment and a liquidity trap, the multiplier is typically larger (>1) because idle resources are put to work.',
  },
];

interface PhasePredictDepression1929Props {
  onComplete: (predictions: PredictionEntry[]) => void;
}

export default function PhasePredictDepression1929({ onComplete }: PhasePredictDepression1929Props) {
  const [answers, setAnswers] = useState<Record<string, string | number>>({ 'dep-keynesian': 6 });
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setVal = (questionId: string, value: string | number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setErrors((prev) => { const next = { ...prev }; delete next[questionId]; return next; });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredIds = questions.filter((q) => q.type !== 'slider').map((q) => q.id);
    const newErrors: Record<string, string> = {};
    requiredIds.forEach((id) => { if (!answers[id]) newErrors[id] = 'Please select an option'; });
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setSubmitting(true);
    const predictions: PredictionEntry[] = questions.map((q) => {
      const val = answers[q.id];
      const selectedAnswerId = val !== undefined ? String(val) : '';
      console.log('Question:', q.id, '| Saved:', selectedAnswerId);
      return { questionId: q.id, selectedAnswerId, timestamp: Date.now() };
    });

    setTimeout(() => { setSubmitting(false); onComplete(predictions); }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="flex items-start gap-3 p-4 bg-sky-500/5 border border-sky-500/20 rounded-xl">
        <Target size={18} className="text-sky-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-sky-400 mb-1">Make Your Economic Predictions</p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Based on your analysis of the macro indicators, predict the short-run effects of the Great Depression (1929–1939).
            Each question is linked to an A-Level economics concept — <span className="text-zinc-300">click the concept tag</span> to review the theory.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-start justify-between mb-1 gap-3">
              <label className="text-sm font-semibold text-zinc-200">{q.label}</label>
              <button
                type="button"
                onClick={() => setExpandedConcept(expandedConcept === q.id ? null : q.id)}
                className="flex items-center gap-1 px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 rounded-md text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex-shrink-0"
              >
                <Info size={10} />
                <span className="hidden sm:inline">{q.concept}</span>
                <span className="sm:hidden">Theory</span>
                {expandedConcept === q.id ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
              </button>
            </div>
            <p className="text-xs text-zinc-500 mb-3">{q.description}</p>

            {expandedConcept === q.id && (
              <div className="mb-3 p-3 bg-sky-500/5 border border-sky-500/20 rounded-lg">
                <p className="text-xs font-semibold text-sky-400 mb-1">{q.concept}</p>
                <p className="text-xs text-sky-300/80 leading-relaxed">{q.conceptExplanation}</p>
              </div>
            )}

            {errors[q.id] && <p className="text-xs text-red-400 mb-2">{errors[q.id]}</p>}

            {(q.type === 'direction' || q.type === 'radio') && q.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt) => {
                  const isSelected = answers[q.id] === opt.id;
                  return (
                    <label
                      key={`${q.id}-opt-${opt.id}`}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? 'border-emerald-500/40 bg-emerald-500/5 text-zinc-100' :'border-zinc-700/50 hover:border-zinc-600 text-zinc-400 hover:text-zinc-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt.id}
                        checked={isSelected}
                        onChange={() => setVal(q.id, opt.id)}
                        className="mt-0.5 accent-emerald-400 flex-shrink-0"
                      />
                      <div>
                        <span className="text-sm font-medium">{opt.text}</span>
                        {opt.hint && <p className="text-xs text-zinc-600 mt-0.5">{opt.hint}</p>}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            {q.type === 'slider' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">{q.min}{q.unit}</span>
                  <span className="text-lg font-bold font-mono tabular-nums text-emerald-400">
                    {(answers[q.id] as number) ?? q.min}{q.unit}
                  </span>
                  <span className="text-xs text-zinc-500">{q.max}{q.unit}</span>
                </div>
                <input
                  type="range" min={q.min} max={q.max} step={q.step}
                  value={(answers[q.id] as number) ?? q.min}
                  onChange={(e) => setVal(q.id, Number(e.target.value))}
                  className="w-full h-2 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-xs text-zinc-600">
                  <span>Weak multiplier</span>
                  <span>Moderate</span>
                  <span>Strong multiplier</span>
                </div>
              </div>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-semibold rounded-xl transition-all duration-150 active:scale-[0.99]"
        >
          {submitting ? 'Submitting...' : 'Submit Predictions →'}
        </button>
      </form>
    </div>
  );
}
