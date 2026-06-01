'use client';
import React, { useState } from 'react';
import { Target, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { PredictionEntry } from '@/lib/predictionStore';

interface PredictionQuestion {
  id: string;
  label: string;
  type: 'direction' | 'slider' | 'select' | 'radio';
  description: string;
  options?: { id: string; text: string; hint?: string; isCorrect?: boolean }[];
  min?: number; max?: number; step?: number; unit?: string;
  concept: string;
}

const questions: PredictionQuestion[] = [
  {
    id: 'gfc-gdp-dir', label: 'Short-run GDP Direction', type: 'direction',
    description: 'Will GDP grow, contract, or stagnate over the next 4 quarters?',
    options: [
      { id: 'strong-growth', text: 'Strong Growth (+2%+)', hint: 'Unlikely given credit freeze' },
      { id: 'weak-growth', text: 'Weak Growth (0–2%)', hint: 'Possible with stimulus' },
      { id: 'stagnation', text: 'Stagnation (~0%)', hint: 'Borderline recession' },
      { id: 'mild-contraction', text: 'Mild Contraction (-1% to 0%)', hint: 'Likely scenario' },
      { id: 'deep-contraction', text: 'Deep Contraction (<-2%)', hint: 'Severe recession', isCorrect: true },
    ],
    concept: 'AD/AS Model — Aggregate Demand Shock',
  },
  {
    id: 'gfc-unemployment', label: 'Unemployment Change (12 months)', type: 'slider',
    description: 'How many percentage points will unemployment rise from current 7.2%?',
    min: 0, max: 8, step: 0.5, unit: 'pp rise',
    concept: 'Phillips Curve — Cyclical Unemployment',
  },
  {
    id: 'gfc-inflation-dir', label: 'Inflation Direction (6 months)', type: 'direction',
    description: 'With falling demand and a credit freeze, what happens to CPI?',
    options: [
      { id: 'hyperinflation', text: 'Hyperinflation (10%+)', hint: 'Very unlikely' },
      { id: 'high-inflation', text: 'High Inflation (5–10%)', hint: 'Unlikely — demand is falling' },
      { id: 'moderate', text: 'Moderate (2–5%)', hint: 'Possible if supply-side issues persist' },
      { id: 'low', text: 'Low Inflation (0–2%)', hint: 'Likely as demand collapses' },
      { id: 'deflation', text: 'Deflation (<0%)', hint: 'Possible — demand destruction', isCorrect: true },
    ],
    concept: 'Quantity Theory of Money / Demand-Pull Inflation',
  },
  {
    id: 'gfc-dollar', label: 'USD Exchange Rate', type: 'direction',
    description: 'How will global capital flows affect the USD during the crisis?',
    options: [
      { id: 'strong-appreciation', text: 'Strong Appreciation (+10%+)', hint: 'Flight to safety', isCorrect: true },
      { id: 'mild-appreciation', text: 'Mild Appreciation (+2–10%)', hint: 'Moderate safe-haven demand' },
      { id: 'stable', text: 'Broadly Stable (±2%)', hint: 'Offsetting forces' },
      { id: 'depreciation', text: 'Depreciation', hint: 'Rate cuts reduce USD appeal' },
    ],
    concept: 'Hot Money Flows / Safe-Haven Currencies',
  },
  {
    id: 'gfc-bond-yields', label: 'US Treasury Bond Yields', type: 'select',
    description: 'Will investors buy or sell US government bonds during the panic?',
    options: [
      { id: 'sharp-fall', text: 'Sharp fall (flight to safety buying)', isCorrect: true },
      { id: 'mild-fall', text: 'Mild fall (moderate safe-haven demand)' },
      { id: 'stable', text: 'Stable (no net movement)' },
      { id: 'rise', text: 'Rise (investors sell bonds for cash)' },
    ],
    concept: 'Bond Pricing — Inverse Yield Relationship',
  },
  {
    id: 'gfc-banking-risk', label: 'Systemic Banking Risk (1–10)', type: 'slider',
    description: 'How severe is the risk of further major bank failures beyond Lehman?',
    min: 1, max: 10, step: 1, unit: '/10',
    concept: 'Systemic Risk / Contagion',
  },
  {
    id: 'gfc-recovery', label: 'Economic Recovery Timeline', type: 'radio',
    description: 'How long before GDP returns to pre-crisis trend growth?',
    options: [
      { id: '6m', text: '6 months (V-shaped recovery)' },
      { id: '1-2y', text: '1–2 years (normal recession)' },
      { id: '3-5y', text: '3–5 years (prolonged downturn)', isCorrect: true },
      { id: '5y-plus', text: '5+ years (structural damage)' },
    ],
    concept: 'Business Cycle / Hysteresis',
  },
  {
    id: 'gfc-policy', label: 'Most Effective Policy Response', type: 'radio',
    description: 'Which policy intervention will have the greatest positive impact?',
    options: [
      { id: 'rate-cuts', text: 'Aggressive Fed rate cuts to 0%' },
      { id: 'qe', text: 'Quantitative Easing (asset purchases)', isCorrect: true },
      { id: 'fiscal', text: 'Large fiscal stimulus package' },
      { id: 'bailout', text: 'Direct bank recapitalisation (TARP)' },
    ],
    concept: 'Monetary vs Fiscal Policy Transmission',
  },
];

interface PhaseProps {
  onComplete: (predictions: PredictionEntry[]) => void;
}

export default function PhasePredict({ onComplete }: PhaseProps) {
  const [answers, setAnswers] = useState<Record<string, string | number>>({
    'gfc-unemployment': 2,
    'gfc-banking-risk': 7,
  });
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const setVal = (questionId: string, value: string | number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setErrors((prev) => { const next = { ...prev }; delete next[questionId]; return next; });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredIds = questions
      .filter((q) => q.type !== 'slider')
      .map((q) => q.id);
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

    setTimeout(() => {
      setSubmitting(false);
      onComplete(predictions);
    }, 1400);
  };

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="flex items-start gap-3 p-4 bg-sky-500/5 border border-sky-500/20 rounded-xl">
        <Target size={18} className="text-sky-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-sky-400 mb-1">Make Your Economic Predictions</p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Based on your analysis of the macro indicators, predict the short-run effects of the 2008 crisis.
            Each question is linked to an A-Level economics concept — hover the concept tag to review the theory.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-start justify-between mb-1">
              <label className="text-sm font-semibold text-zinc-200">{q.label}</label>
              <button
                type="button"
                onClick={() => setExpandedConcept(expandedConcept === q.id ? null : q.id)}
                className="flex items-center gap-1 px-2 py-0.5 bg-zinc-800 rounded-md text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <Info size={10} />
                {q.concept}
                {expandedConcept === q.id ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
              </button>
            </div>
            <p className="text-xs text-zinc-500 mb-3">{q.description}</p>

            {expandedConcept === q.id && (
              <div className="mb-3 p-3 bg-sky-500/5 border border-sky-500/20 rounded-lg">
                <p className="text-xs text-sky-300 leading-relaxed">
                  <span className="font-semibold">Concept: {q.concept}.</span> Apply this framework to justify your prediction.
                </p>
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

            {q.type === 'select' && q.options && (
              <select
                value={(answers[q.id] as string) ?? ''}
                onChange={(e) => setVal(q.id, e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700/50 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-emerald-500/50 transition-colors"
              >
                <option value="">Select your prediction...</option>
                {q.options.map((opt) => (
                  <option key={`${q.id}-sel-${opt.id}`} value={opt.id}>{opt.text}</option>
                ))}
              </select>
            )}

            {q.type === 'slider' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">{q.min}{q.unit}</span>
                  <span className="text-lg font-bold font-mono tabular-nums text-emerald-400">
                    {answers[q.id] ?? q.min}{q.unit}
                  </span>
                  <span className="text-xs text-zinc-500">{q.max}{q.unit}</span>
                </div>
                <input
                  type="range"
                  min={q.min}
                  max={q.max}
                  step={q.step}
                  value={(answers[q.id] as number) ?? q.min}
                  onChange={(e) => setVal(q.id, Number(e.target.value))}
                  className="w-full h-2 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-emerald-400"
                />
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