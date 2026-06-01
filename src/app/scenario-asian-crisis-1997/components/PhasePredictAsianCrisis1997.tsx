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
    id: 'afc-gdp', label: 'Short-Run GDP Effect', type: 'direction',
    description: 'Currencies collapse, banks fail, and foreign capital rapidly exits the region. What is the short-run effect on real GDP in affected Asian economies?',
    options: [
      { id: 'strong-growth', text: 'Strong growth continues (+5%+)', hint: 'Incorrect — the financial system is collapsing' },
      { id: 'weak-growth', text: 'Weak growth (1–3%)', hint: 'Underestimates the severity of simultaneous shocks' },
      { id: 'stagnation', text: 'Near-zero growth (~0%)', hint: 'Too optimistic — investment and consumption are collapsing' },
      { id: 'mild-recession', text: 'Mild recession (−1% to −4%)', hint: 'Possible but underestimates the depth for worst-hit countries' },
      { id: 'severe-recession', text: 'Severe recession (−5% to −15%)', hint: 'Correct — GDP fell 5–13% across affected countries in 1998' },
    ],
    concept: 'Aggregate Demand (AD) Collapse',
    conceptExplanation: 'Aggregate Demand (AD = C + I + G + NX) collapsed simultaneously. Investment fell as banks stopped lending and firms faced insolvency. Consumption fell as unemployment rose and confidence collapsed. Net exports were disrupted by currency volatility. This is a textbook leftward shift of the AD curve — lower real output and rising unemployment.',
  },
  {
    id: 'afc-currency', label: 'Exchange Rate Effect', type: 'direction',
    description: 'Investors lose confidence and rapidly withdraw capital from Asian markets. Countries can no longer defend their fixed exchange rate pegs. What happens to exchange rates?',
    options: [
      { id: 'appreciates', text: 'Currencies appreciate strongly', hint: 'Incorrect — capital is flowing out, not in' },
      { id: 'stable', text: 'Exchange rates remain stable', hint: 'Incorrect — fixed pegs cannot be maintained without reserves' },
      { id: 'mild-depreciation', text: 'Mild depreciation (−5% to −15%)', hint: 'Underestimates the scale of the collapse' },
      { id: 'moderate-depreciation', text: 'Moderate depreciation (−20% to −40%)', hint: 'Possible but underestimates the worst cases' },
      { id: 'severe-depreciation', text: 'Severe depreciation (−50% to −80%+)', hint: 'Correct — baht fell ~55%, rupiah fell ~83% at worst' },
    ],
    concept: 'Fixed Exchange Rate Collapse & Speculative Attack',
    conceptExplanation: 'A speculative attack occurs when investors collectively bet against a fixed exchange rate they believe is unsustainable. Central banks must spend foreign reserves to defend the peg. When reserves run out, the currency collapses — often more dramatically than if it had floated earlier.',
  },
  {
    id: 'afc-unemployment', label: 'Unemployment Effect', type: 'direction',
    description: 'GDP contracts sharply, firms face insolvency, and banks stop lending. What happens to unemployment across the affected economies?',
    options: [
      { id: 'falls', text: 'Unemployment falls', hint: 'Incorrect — output is contracting sharply' },
      { id: 'unchanged', text: 'Unemployment unchanged', hint: 'Incorrect — mass layoffs are occurring' },
      { id: 'slight-rise', text: 'Slight rise (+1–3pp)', hint: 'Underestimates the scale of job losses' },
      { id: 'significant-rise', text: 'Significant rise (+5–10pp)', hint: 'Correct for some countries — Indonesia saw even larger rises' },
      { id: 'mass-unemployment', text: 'Mass unemployment (+15pp+)', hint: 'Correct for Indonesia — millions lost jobs and poverty surged' },
    ],
    concept: 'Cyclical Unemployment & Poverty',
    conceptExplanation: 'Cyclical (demand-deficient) unemployment occurs when aggregate demand falls below the level needed to employ all workers. As AD collapses, firms reduce output and lay off workers. In the Asian crisis, the effects were particularly severe because many workers had no social safety net.',
  },
  {
    id: 'afc-banking', label: 'Banking System Effect', type: 'direction',
    description: 'Companies that borrowed in US dollars cannot repay their loans as local currencies collapse. Banks hold large amounts of bad loans. What happens to the banking system?',
    options: [
      { id: 'stable', text: 'Banks remain stable', hint: 'Incorrect — banks hold large amounts of foreign currency debt' },
      { id: 'minor-stress', text: 'Minor stress — a few bank failures', hint: 'Underestimates the systemic nature of the crisis' },
      { id: 'moderate-failures', text: 'Moderate failures — some banks close', hint: 'Possible but underestimates the scale' },
      { id: 'systemic-crisis', text: 'Systemic crisis — widespread bank failures and credit freeze', hint: 'Correct — banking systems across the region collapsed' },
      { id: 'complete-collapse', text: 'Complete collapse — total loss of financial system', hint: 'Close — IMF bailouts prevented total collapse in most countries' },
    ],
    concept: 'Balance Sheet Recession & Currency Mismatch',
    conceptExplanation: 'A currency mismatch occurs when firms borrow in foreign currency (USD) but earn revenue in local currency. When the local currency depreciates, the real value of foreign debt rises dramatically — causing widespread insolvencies, which then cause bank failures.',
  },
  {
    id: 'afc-inflation', label: 'Inflation Effect', type: 'direction',
    description: 'Currencies depreciate by 50–80%. Most goods in Asia are imported or priced in US dollars. What happens to domestic inflation?',
    options: [
      { id: 'deflation', text: 'Severe deflation (−10%+)', hint: 'Incorrect — currency depreciation raises import prices' },
      { id: 'stable', text: 'Inflation stays low and stable', hint: 'Incorrect — import prices are rising sharply' },
      { id: 'mild-inflation', text: 'Mild inflation (2–5%)', hint: 'Underestimates the pass-through from currency depreciation' },
      { id: 'moderate-inflation', text: 'Moderate inflation (5–15%)', hint: 'Correct for Thailand and South Korea' },
      { id: 'high-inflation', text: 'High inflation (20%+)', hint: 'Correct for Indonesia — inflation reached ~80% in 1998' },
    ],
    concept: 'Import Price Inflation & Exchange Rate Pass-Through',
    conceptExplanation: 'Exchange rate pass-through describes how currency depreciation feeds into domestic inflation. When a currency depreciates, the price of imported goods rises in local currency terms. For countries that import significant amounts of food, fuel, and manufactured goods, this causes cost-push inflation.',
  },
  {
    id: 'afc-policy', label: 'Most Appropriate Policy Response', type: 'radio',
    description: 'Currencies are collapsing, banks are failing, and capital is fleeing. The IMF is offering emergency loans with conditions attached. Which policy response is most appropriate?',
    options: [
      { id: 'rate-cuts', text: 'Cut interest rates sharply to stimulate growth', hint: 'Would worsen capital flight and currency collapse' },
      { id: 'fiscal-stimulus', text: 'Large fiscal stimulus — government spending', hint: 'Difficult when government revenues are collapsing and debt is rising' },
      { id: 'imf-austerity', text: 'Accept IMF bailout with austerity conditions', hint: 'Controversial — IMF conditions were later criticised for worsening recessions' },
      { id: 'capital-controls', text: 'Impose capital controls to stop outflows', hint: "Malaysia's approach — controversial but may have helped" },
      { id: 'currency-board', text: 'Fix currency to USD with a currency board', hint: 'Argentina tried this later — it eventually failed too' },
    ],
    concept: 'IMF Conditionality & Policy Trilemma',
    conceptExplanation: 'The "impossible trinity" (policy trilemma) states that a country cannot simultaneously have: (1) a fixed exchange rate, (2) free capital movement, and (3) independent monetary policy. The Asian crisis countries had all three — and the combination proved unsustainable.',
  },
  {
    id: 'afc-recovery', label: 'Recovery Timeline', type: 'radio',
    description: 'Given the scale of the collapse — currency crashes, banking failures, mass unemployment — how long before affected economies return to pre-crisis growth rates?',
    options: [
      { id: '6m', text: '6 months (V-shaped recovery)' },
      { id: '1-2y', text: '1–2 years (short recession)' },
      { id: '3-5y', text: '3–5 years (prolonged recession)' },
      { id: '5-10y', text: '5–10 years (structural transformation required)' },
    ],
    concept: 'Economic Recovery & Hysteresis',
    conceptExplanation: 'Hysteresis refers to the long-lasting effects of a recession on the productive capacity of an economy. South Korea recovered relatively quickly (GDP grew 10.7% in 1999) due to rapid structural reforms. Indonesia recovered much more slowly due to political instability and deeper structural damage.',
  },
  {
    id: 'afc-contagion', label: 'Financial Contagion Severity (1–10)', type: 'slider',
    description: 'How severe do you think financial contagion was in spreading the crisis from Thailand to other Asian economies? (1 = minimal spread, 10 = extreme contagion)',
    min: 1, max: 10, step: 1, unit: '/10',
    concept: 'Financial Contagion & Herding Behaviour',
    conceptExplanation: 'Financial contagion occurs when a crisis in one country spreads to others — even countries with different economic fundamentals. It happens through trade linkages, financial linkages, and investor herding.',
  },
];

interface PhasePredictAsianCrisis1997Props {
  onComplete: (predictions: PredictionEntry[]) => void;
}

export default function PhasePredictAsianCrisis1997({ onComplete }: PhasePredictAsianCrisis1997Props) {
  const [answers, setAnswers] = useState<Record<string, string | number>>({ 'afc-contagion': 7 });
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

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
            Based on your analysis of the macro indicators, predict the short-run effects of the Asian Financial Crisis (1997–1998).
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
                  <span>Minimal contagion</span>
                  <span>Moderate</span>
                  <span>Extreme contagion</span>
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
