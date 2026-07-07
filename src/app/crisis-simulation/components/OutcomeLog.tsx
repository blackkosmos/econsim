'use client';
import React from 'react';
import type { SimulationStep, EconomicIndicators } from './crisisData';
import { CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';

interface Props {
  steps: SimulationStep[];
}

const SEVERITY_META = {
  positive: { Icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/8 border-emerald-500/20', label: 'Positive' },
  neutral: { Icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/8 border-amber-500/20', label: 'Mixed' },
  negative: { Icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/8 border-red-500/20', label: 'Negative' },
};

const INDICATOR_LABELS: Record<keyof EconomicIndicators, { label: string; unit: string; goodDirection: 'up' | 'down' | 'mid' }> = {
  inflation: { label: 'Inflation', unit: '%', goodDirection: 'down' },
  unemployment: { label: 'Unemployment', unit: '%', goodDirection: 'down' },
  gdpGrowth: { label: 'GDP Growth', unit: '%', goodDirection: 'up' },
  marketConfidence: { label: 'Market Confidence', unit: '', goodDirection: 'up' },
  debtToGdp: { label: 'Debt/GDP', unit: '%', goodDirection: 'down' },
  bankingStability: { label: 'Banking Stability', unit: '', goodDirection: 'up' },
  policyRate: { label: 'Policy Rate', unit: '%', goodDirection: 'mid' },
  currencyStrength: { label: 'Currency Strength', unit: '', goodDirection: 'up' },
};

function formatDeltaVal(val: number, key: keyof EconomicIndicators): string {
  const decimals = ['inflation', 'unemployment', 'gdpGrowth', 'policyRate'].includes(key) ? 1 : 0;
  return val.toFixed(decimals);
}

function formatAbsVal(val: number, key: keyof EconomicIndicators): string {
  const decimals = ['inflation', 'unemployment', 'gdpGrowth', 'policyRate'].includes(key) ? 1 : 0;
  return val.toFixed(decimals);
}

export default function OutcomeLog({ steps }: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4 animate-fadeInUp">
      <div className="flex items-center gap-2">
        <Clock size={14} className="text-zinc-500" />
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest">Decision Log</h2>
        <span className="ml-auto text-xs text-zinc-600 font-mono">{steps.length} decision{steps.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin pr-1">
        {steps.map((step) => {
          const meta = SEVERITY_META[step.outcome.severity];
          const SevIcon = meta.Icon;

          // Build before→after display for changed indicators
          const changedIndicators = Object.entries(step.outcome.indicatorDeltas)
            .filter(([, delta]) => delta !== undefined && Math.abs(delta as number) >= 0.01)
            .map(([key, delta]) => {
              const k = key as keyof EconomicIndicators;
              const cfg = INDICATOR_LABELS[k];
              const before = step.indicatorsBefore[k];
              const after = step.indicatorsAfter[k];
              const d = delta as number;
              const isGood = cfg.goodDirection === 'up' ? d > 0 : cfg.goodDirection === 'down' ? d < 0 : null;
              return { key: k, label: cfg.label, unit: cfg.unit, before, after, delta: d, isGood };
            });

          return (
            <div
              key={step.step}
              className={`rounded-lg border p-4 space-y-3 animate-slideUp ${meta.bg}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded">
                  Step {step.step}
                </span>
                <span className="text-sm font-semibold text-zinc-200">{step.policyLabel}</span>
                <div className={`ml-auto flex items-center gap-1 text-xs font-medium ${meta.color}`}>
                  <SevIcon size={12} />
                  {meta.label}
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">{step.outcome.explanation}</p>

              {/* Before → After indicator changes */}
              {changedIndicators.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-0.5">
                  {changedIndicators.map(({ key, label, unit, before, after, delta, isGood }) => {
                    const deltaColor = isGood === null
                      ? 'text-zinc-400'
                      : isGood
                      ? 'text-emerald-400' :'text-red-400';

                    return (
                      <div key={key} className="bg-zinc-900/60 rounded-lg px-2.5 py-2 border border-zinc-800">
                        <div className="text-xs text-zinc-600 mb-1 leading-none">{label}</div>
                        <div className="flex items-center gap-1 font-mono text-xs">
                          <span className="text-zinc-500">{formatAbsVal(before, key)}{unit}</span>
                          <span className="text-zinc-700">→</span>
                          <span className="text-zinc-200 font-semibold">{formatAbsVal(after, key)}{unit}</span>
                        </div>
                        <div className={`text-xs font-mono font-semibold mt-0.5 ${deltaColor}`}>
                          {delta > 0 ? '+' : ''}{formatDeltaVal(delta, key)}{unit}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Unchanged indicators note */}
              {Object.keys(step.outcome.indicatorDeltas).length < 8 && (
                <p className="text-xs text-zinc-700 italic">
                  {8 - Object.keys(step.outcome.indicatorDeltas).filter(k => {
                    const d = step.outcome.indicatorDeltas[k as keyof EconomicIndicators];
                    return d !== undefined && Math.abs(d) >= 0.01;
                  }).length} indicator{8 - Object.keys(step.outcome.indicatorDeltas).filter(k => {
                    const d = step.outcome.indicatorDeltas[k as keyof EconomicIndicators];
                    return d !== undefined && Math.abs(d) >= 0.01;
                  }).length !== 1 ? 's' : ''} unchanged — not directly affected by this policy.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
