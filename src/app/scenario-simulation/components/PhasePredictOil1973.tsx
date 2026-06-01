'use client';
import React, { useState } from 'react';
import { Target, ArrowRight, ChevronDown, ChevronUp, Info } from 'lucide-react';

interface PredictionForm {
  inflationEffect: string;
  gdpEffect: string;
  unemploymentEffect: string;
  tradeBalanceEffect: string;
  policyResponse: string;
  stagflationRisk: number;
  recoveryTimeline: string;
  oilImporterEffect: string;
}

interface PredictionQuestion {
  id: string;
  label: string;
  type: 'direction' | 'slider' | 'select' | 'radio';
  field: keyof PredictionForm;
  description: string;
  options?: { value: string; label: string; hint?: string }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  concept: string;
  conceptExplanation: string;
}

const questions: PredictionQuestion[] = [
  {
    id: 'oil-q-infl',
    label: 'Short-Run Inflation Effect',
    type: 'direction',
    field: 'inflationEffect',
    description: 'OPEC cuts oil supply — a key input for production. What happens to the price level in the short run?',
    options: [
      { value: 'falls', label: 'Inflation falls', hint: 'Unlikely — supply is being restricted' },
      { value: 'stable', label: 'Inflation stays stable', hint: 'Unlikely — energy costs are rising sharply' },
      { value: 'moderate-rise', label: 'Moderate rise (3–6%)', hint: 'Possible but underestimates the shock' },
      { value: 'sharp-rise', label: 'Sharp rise (10%+)', hint: 'Likely — cost-push inflation from energy prices' },
      { value: 'hyperinflation', label: 'Hyperinflation (50%+)', hint: 'Too extreme for this scenario' },
    ],
    concept: 'Cost-Push Inflation',
    conceptExplanation: 'Cost-push inflation occurs when rising production costs (e.g., energy, raw materials) shift the Short-Run Aggregate Supply (SRAS) curve leftward. This raises the price level even without an increase in demand. In the AD/AS model: SRAS shifts left → Price Level rises, Real GDP falls.',
  },
  {
    id: 'oil-q-gdp',
    label: 'Short-Run GDP Growth Effect',
    type: 'direction',
    field: 'gdpEffect',
    description: 'Higher oil prices increase costs for firms across all sectors. What is the short-run effect on real GDP?',
    options: [
      { value: 'strong-growth', label: 'Strong growth continues (+4%+)', hint: 'Incorrect — supply shock reduces output' },
      { value: 'weak-growth', label: 'Weak growth (1–3%)', hint: 'Possible but optimistic' },
      { value: 'stagnation', label: 'Near-zero growth (~0%)', hint: 'Borderline — some economies stagnated' },
      { value: 'mild-recession', label: 'Mild recession (-0.5% to -1%)', hint: 'Likely for most OECD economies' },
      { value: 'deep-recession', label: 'Deep recession (<-2%)', hint: 'Possible for most oil-dependent economies' },
    ],
    concept: 'AD/AS Model — Negative Supply Shock',
    conceptExplanation: 'A negative supply shock shifts the SRAS curve leftward. This simultaneously raises the price level AND reduces real output — the defining feature of stagflation. Unlike a demand shock, there is no simple policy trade-off: stimulating demand worsens inflation; reducing inflation worsens unemployment.',
  },
  {
    id: 'oil-q-unemp',
    label: 'Unemployment Effect',
    type: 'direction',
    field: 'unemploymentEffect',
    description: 'As firms face higher production costs and output falls, what happens to employment?',
    options: [
      { value: 'falls', label: 'Unemployment falls', hint: 'Incorrect — output is contracting' },
      { value: 'unchanged', label: 'Unemployment unchanged', hint: 'Unlikely — firms will cut output and jobs' },
      { value: 'slight-rise', label: 'Slight rise (+1–2pp)', hint: 'Possible in less oil-dependent economies' },
      { value: 'significant-rise', label: 'Significant rise (+3–5pp)', hint: 'Likely — firms cut output due to higher costs' },
      { value: 'mass-unemployment', label: 'Mass unemployment (+8pp+)', hint: 'Too extreme for this scenario' },
    ],
    concept: 'Phillips Curve — Stagflation',
    conceptExplanation: 'The traditional Phillips Curve suggests a trade-off: lower unemployment comes with higher inflation. However, a supply shock breaks this relationship — both unemployment AND inflation rise simultaneously. This is stagflation, and it cannot be resolved by conventional demand-management policies alone.',
  },
  {
    id: 'oil-q-trade',
    label: 'Trade Balance Effect (Oil Importers)',
    type: 'direction',
    field: 'tradeBalanceEffect',
    description: 'Countries like the US and UK import large quantities of oil. What happens to their trade balance?',
    options: [
      { value: 'large-surplus', label: 'Trade surplus improves significantly', hint: 'Incorrect — import costs are rising' },
      { value: 'small-surplus', label: 'Small improvement in surplus', hint: 'Incorrect — oil import bill is surging' },
      { value: 'unchanged', label: 'Trade balance unchanged', hint: 'Unlikely — oil import costs have quadrupled' },
      { value: 'worsens', label: 'Trade deficit worsens', hint: 'Correct — higher oil import costs worsen the current account' },
      { value: 'severe-deficit', label: 'Severe trade deficit emerges', hint: 'Likely for highly oil-dependent economies' },
    ],
    concept: 'Current Account — Terms of Trade',
    conceptExplanation: 'The current account records trade in goods and services. When oil prices rise, oil-importing countries pay more for the same volume of imports — their terms of trade deteriorate. This worsens the current account deficit. Conversely, OPEC nations accumulate large surpluses (petrodollars), which they then recycled into Western financial markets.',
  },
  {
    id: 'oil-q-policy',
    label: 'Most Appropriate Policy Response',
    type: 'radio',
    field: 'policyResponse',
    description: 'Governments face a dilemma: stimulating the economy worsens inflation; fighting inflation worsens unemployment. Which response is most appropriate?',
    options: [
      { value: 'rate-cuts', label: 'Cut interest rates to stimulate growth', hint: 'Risks worsening inflation further' },
      { value: 'rate-hikes', label: 'Raise interest rates to fight inflation', hint: 'Risks deepening the recession' },
      { value: 'fiscal-stimulus', label: 'Large fiscal stimulus (government spending)', hint: 'Risks adding to inflationary pressure' },
      { value: 'supply-side', label: 'Supply-side reforms (energy diversification)', hint: 'Correct long-run response but slow to take effect' },
      { value: 'price-controls', label: 'Introduce price controls on energy', hint: 'Short-term relief but creates shortages' },
    ],
    concept: 'Policy Dilemma — Stagflation',
    conceptExplanation: 'Stagflation creates a policy dilemma because conventional tools work in opposite directions. Expansionary policy (rate cuts, fiscal stimulus) can boost output but worsens inflation. Contractionary policy (rate hikes, austerity) can reduce inflation but deepens recession. The long-run solution requires supply-side reforms to reduce oil dependency.',
  },
  {
    id: 'oil-q-stagflation',
    label: 'Stagflation Severity (1–10)',
    type: 'slider',
    field: 'stagflationRisk',
    description: 'How severe do you predict the stagflation episode will be? (1 = mild, 10 = extreme)',
    min: 1,
    max: 10,
    step: 1,
    unit: '/10',
    concept: 'Stagflation — Supply-Side Economics',
    conceptExplanation: 'Stagflation is defined as simultaneous high inflation and high unemployment — a combination that contradicts the traditional Phillips Curve. It was first observed at scale during the 1973 oil crisis and challenged Keynesian demand-management orthodoxy, paving the way for monetarism and supply-side economics in the 1980s.',
  },
  {
    id: 'oil-q-recovery',
    label: 'Recovery Timeline',
    type: 'radio',
    field: 'recoveryTimeline',
    description: 'How long before the affected economies return to pre-shock growth rates?',
    options: [
      { value: '6m', label: '6 months (V-shaped recovery)' },
      { value: '1-2y', label: '1–2 years (short recession)' },
      { value: '3-5y', label: '3–5 years (prolonged stagflation)' },
      { value: '5y+', label: '5+ years (structural adjustment needed)' },
    ],
    concept: 'Business Cycle / Hysteresis',
    conceptExplanation: 'Hysteresis refers to the long-lasting effects of a recession on the productive capacity of an economy. Prolonged unemployment can cause skill atrophy and discourage labour force participation, shifting the long-run AS curve leftward. Supply shocks that require structural adjustment (e.g., energy transition) tend to have longer recovery periods than demand-side recessions.',
  },
  {
    id: 'oil-q-oilexporter',
    label: 'Effect on Oil-Exporting Countries',
    type: 'direction',
    field: 'oilImporterEffect',
    description: 'While oil importers suffer, what is the short-run effect on OPEC member economies?',
    options: [
      { value: 'recession', label: 'Recession — they are also hurt', hint: 'Incorrect — they control the supply' },
      { value: 'unchanged', label: 'Broadly unchanged', hint: 'Incorrect — their revenues surge' },
      { value: 'moderate-gain', label: 'Moderate revenue gain', hint: 'Underestimates the scale of the windfall' },
      { value: 'large-surplus', label: 'Large trade surpluses and revenue windfall', hint: 'Correct — petrodollar recycling begins' },
      { value: 'hyperinflation', label: 'Hyperinflation from excess money', hint: 'Some experienced Dutch Disease, but not hyperinflation' },
    ],
    concept: 'Terms of Trade — Petrodollar Recycling',
    conceptExplanation: 'Oil exporters experienced a dramatic improvement in their terms of trade — the same volume of exports now earned four times the revenue. This created large current account surpluses (petrodollars), which OPEC nations deposited in Western banks. These banks then recycled the funds as loans to developing countries, contributing to the 1980s debt crisis.',
  },
];

interface PhasePredictOil1973Props {
  onComplete: () => void;
}

export default function PhasePredictOil1973({ onComplete }: PhasePredictOil1973Props) {
  const [answers, setAnswers] = useState<Partial<PredictionForm>>({ stagflationRisk: 7 });
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setValue = (field: keyof PredictionForm, value: string | number) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields: (keyof PredictionForm)[] = [
      'inflationEffect', 'gdpEffect', 'unemploymentEffect', 'tradeBalanceEffect',
      'policyResponse', 'recoveryTimeline', 'oilImporterEffect',
    ];
    const newErrors: Record<string, string> = {};
    requiredFields.forEach((f) => {
      if (!answers[f]) newErrors[f] = 'Please select an option';
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onComplete();
    }, 1200);
  };

  const stagflationRisk = (answers.stagflationRisk as number) ?? 7;

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Instruction Banner */}
      <div className="flex items-start gap-3 p-4 bg-sky-500/5 border border-sky-500/20 rounded-xl">
        <Target size={18} className="text-sky-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-sky-400 mb-1">Make Your Economic Predictions</p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Based on your analysis of the macro indicators, predict the short-run effects of the 1973 Oil Supply Shock.
            Each question is linked to an A-Level economics concept — <span className="text-zinc-300">hover the concept tag</span> to review the theory.
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
                title={q.conceptExplanation}
                className="flex items-center gap-1 px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 rounded-md text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex-shrink-0 group relative"
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

            {errors[q.field] && (
              <p className="text-xs text-red-400 mb-2">{errors[q.field]}</p>
            )}

            {(q.type === 'direction' || q.type === 'radio') && q.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt) => {
                  const isSelected = answers[q.field] === opt.value;
                  return (
                    <label
                      key={`${q.id}-opt-${opt.value}`}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? 'border-emerald-500/40 bg-emerald-500/5 text-zinc-100' :'border-zinc-700/50 hover:border-zinc-600 text-zinc-400 hover:text-zinc-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.field}
                        value={opt.value}
                        checked={isSelected}
                        onChange={() => setValue(q.field, opt.value)}
                        className="mt-0.5 accent-emerald-400 flex-shrink-0"
                      />
                      <div>
                        <span className="text-sm font-medium">{opt.label}</span>
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
                    {stagflationRisk}{q.unit}
                  </span>
                  <span className="text-xs text-zinc-500">{q.max}{q.unit}</span>
                </div>
                <input
                  type="range"
                  min={q.min}
                  max={q.max}
                  step={q.step}
                  value={stagflationRisk}
                  onChange={(e) => setValue(q.field, Number(e.target.value))}
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

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-zinc-950 text-sm font-semibold rounded-xl transition-all duration-150 active:scale-95"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                Analysing predictions...
              </>
            ) : (
              <>
                Submit Predictions
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
