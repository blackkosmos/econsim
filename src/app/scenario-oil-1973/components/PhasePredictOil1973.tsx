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
    id: 'oil-inflation', label: 'Short-Run Inflation Effect', type: 'direction',
    description: 'OPEC cuts oil supply — a key input for production. What happens to the price level in the short run?',
    options: [
      { id: 'falls', text: 'Inflation falls', hint: 'Unlikely — supply is being restricted' },
      { id: 'stable', text: 'Inflation stays stable', hint: 'Unlikely — energy costs are rising sharply' },
      { id: 'moderate-rise', text: 'Moderate rise (3–6%)', hint: 'Possible but underestimates the shock' },
      { id: 'sharp-rise', text: 'Sharp rise (10%+)', hint: 'Likely — cost-push inflation from energy prices' },
      { id: 'hyperinflation', text: 'Hyperinflation (50%+)', hint: 'Too extreme for this scenario' },
    ],
    concept: 'Cost-Push Inflation',
    conceptExplanation: 'Cost-push inflation occurs when rising production costs (e.g., energy, raw materials) shift the Short-Run Aggregate Supply (SRAS) curve leftward. This raises the price level even without an increase in demand.',
  },
  {
    id: 'oil-gdp', label: 'Short-Run GDP Growth Effect', type: 'direction',
    description: 'Higher oil prices increase costs for firms across all sectors. What is the short-run effect on real GDP?',
    options: [
      { id: 'strong-growth', text: 'Strong growth continues (+4%+)', hint: 'Incorrect — supply shock reduces output' },
      { id: 'weak-growth', text: 'Weak growth (1–3%)', hint: 'Possible but optimistic' },
      { id: 'stagnation', text: 'Near-zero growth (~0%)', hint: 'Borderline — some economies stagnated' },
      { id: 'mild-recession', text: 'Mild recession (-0.5% to -1%)', hint: 'Likely for most OECD economies' },
      { id: 'deep-recession', text: 'Deep recession (<-2%)', hint: 'Possible for most oil-dependent economies' },
    ],
    concept: 'AD/AS Model — Negative Supply Shock',
    conceptExplanation: 'A negative supply shock shifts the SRAS curve leftward. This simultaneously raises the price level AND reduces real output — the defining feature of stagflation.',
  },
  {
    id: 'oil-unemployment', label: 'Unemployment Effect', type: 'direction',
    description: 'As firms face higher production costs and output falls, what happens to employment?',
    options: [
      { id: 'falls', text: 'Unemployment falls', hint: 'Incorrect — output is contracting' },
      { id: 'unchanged', text: 'Unemployment unchanged', hint: 'Unlikely — firms will cut output and jobs' },
      { id: 'slight-rise', text: 'Slight rise (+1–2pp)', hint: 'Possible in less oil-dependent economies' },
      { id: 'significant-rise', text: 'Significant rise (+3–5pp)', hint: 'Likely — firms cut output due to higher costs' },
      { id: 'mass-unemployment', text: 'Mass unemployment (+8pp+)', hint: 'Too extreme for this scenario' },
    ],
    concept: 'Phillips Curve — Stagflation',
    conceptExplanation: 'The traditional Phillips Curve suggests a trade-off: lower unemployment comes with higher inflation. However, a supply shock breaks this relationship — both unemployment AND inflation rise simultaneously. This is stagflation.',
  },
  {
    id: 'oil-trade', label: 'Trade Balance Effect (Oil Importers)', type: 'direction',
    description: 'Countries like the US and UK import large quantities of oil. What happens to their trade balance?',
    options: [
      { id: 'large-surplus', text: 'Trade surplus improves significantly', hint: 'Incorrect — import costs are rising' },
      { id: 'small-surplus', text: 'Small improvement in surplus', hint: 'Incorrect — oil import bill is surging' },
      { id: 'unchanged', text: 'Trade balance unchanged', hint: 'Unlikely — oil import costs have quadrupled' },
      { id: 'worsens', text: 'Trade deficit worsens', hint: 'Correct — higher oil import costs worsen the current account' },
      { id: 'severe-deficit', text: 'Severe trade deficit emerges', hint: 'Likely for highly oil-dependent economies' },
    ],
    concept: 'Current Account — Terms of Trade',
    conceptExplanation: 'The current account records trade in goods and services. When oil prices rise, oil-importing countries pay more for the same volume of imports — their terms of trade deteriorate.',
  },
  {
    id: 'oil-policy', label: 'Most Appropriate Policy Response', type: 'radio',
    description: 'Governments face a dilemma: stimulating the economy worsens inflation; fighting inflation worsens unemployment. Which response is most appropriate?',
    options: [
      { id: 'rate-cuts', text: 'Cut interest rates to stimulate growth', hint: 'Risks worsening inflation further' },
      { id: 'rate-hikes', text: 'Raise interest rates to fight inflation', hint: 'Risks deepening the recession' },
      { id: 'fiscal-stimulus', text: 'Large fiscal stimulus (government spending)', hint: 'Risks adding to inflationary pressure' },
      { id: 'supply-side', text: 'Supply-side reforms (energy diversification)', hint: 'Correct long-run response but slow to take effect' },
      { id: 'price-controls', text: 'Introduce price controls on energy', hint: 'Short-term relief but creates shortages' },
    ],
    concept: 'Policy Dilemma — Stagflation',
    conceptExplanation: 'Stagflation creates a policy dilemma because conventional tools work in opposite directions. The long-run solution requires supply-side reforms to reduce oil dependency.',
  },
  {
    id: 'oil-stagflation', label: 'Stagflation Severity (1–10)', type: 'slider',
    description: 'How severe do you predict the stagflation episode will be? (1 = mild, 10 = extreme)',
    min: 1, max: 10, step: 1, unit: '/10',
    concept: 'Stagflation — Supply-Side Economics',
    conceptExplanation: 'Stagflation is defined as simultaneous high inflation and high unemployment — a combination that contradicts the traditional Phillips Curve.',
  },
  {
    id: 'oil-recovery', label: 'Recovery Timeline', type: 'radio',
    description: 'How long before the affected economies return to pre-shock growth rates?',
    options: [
      { id: '6m', text: '6 months (V-shaped recovery)' },
      { id: '1-2y', text: '1–2 years (short recession)' },
      { id: '3-5y', text: '3–5 years (prolonged stagflation)' },
      { id: '5y-plus', text: '5+ years (structural adjustment needed)' },
    ],
    concept: 'Business Cycle / Hysteresis',
    conceptExplanation: 'Hysteresis refers to the long-lasting effects of a recession on the productive capacity of an economy. Supply shocks that require structural adjustment tend to have longer recovery periods.',
  },
  {
    id: 'oil-exporter', label: 'Effect on Oil-Exporting Countries', type: 'direction',
    description: 'While oil importers suffer, what is the short-run effect on OPEC member economies?',
    options: [
      { id: 'recession', text: 'Recession — they are also hurt', hint: 'Incorrect — they control the supply' },
      { id: 'unchanged', text: 'Broadly unchanged', hint: 'Incorrect — their revenues surge' },
      { id: 'moderate-gain', text: 'Moderate revenue gain', hint: 'Underestimates the scale of the windfall' },
      { id: 'large-surplus', text: 'Large trade surpluses and revenue windfall', hint: 'Correct — petrodollar recycling begins' },
      { id: 'hyperinflation', text: 'Hyperinflation from excess money', hint: 'Some experienced Dutch Disease, but not hyperinflation' },
    ],
    concept: 'Terms of Trade — Petrodollar Recycling',
    conceptExplanation: 'Oil exporters experienced a dramatic improvement in their terms of trade. This created large current account surpluses (petrodollars), which OPEC nations deposited in Western banks.',
  },
];

interface PhasePredictOil1973Props {
  onComplete: (predictions: PredictionEntry[]) => void;
}

export default function PhasePredictOil1973({ onComplete }: PhasePredictOil1973Props) {
  const [answers, setAnswers] = useState<Record<string, string | number>>({ 'oil-stagflation': 7 });
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
            Based on your analysis of the macro indicators, predict the short-run effects of the 1973 Oil Supply Shock.
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
                  <span>Mild stagflation</span>
                  <span>Moderate</span>
                  <span>Extreme stagflation</span>
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
