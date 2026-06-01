'use client';
import React from 'react';
import type { SimulationStep } from './crisisData';
import { CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';

interface Props {
  steps: SimulationStep[];
}

const SEVERITY_META = {
  positive: { Icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/8 border-emerald-500/20', label: 'Positive' },
  neutral: { Icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/8 border-amber-500/20', label: 'Mixed' },
  negative: { Icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/8 border-red-500/20', label: 'Negative' },
};

export default function OutcomeLog({ steps }: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4 animate-fadeInUp">
      <div className="flex items-center gap-2">
        <Clock size={14} className="text-zinc-500" />
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest">Decision Log</h2>
        <span className="ml-auto text-xs text-zinc-600 font-mono">{steps.length} decision{steps.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin pr-1">
        {steps.map((step) => {
          const meta = SEVERITY_META[step.outcome.severity];
          const SevIcon = meta.Icon;

          return (
            <div
              key={step.step}
              className={`rounded-lg border p-4 space-y-2.5 animate-slideUp ${meta.bg}`}
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

              {/* Key indicator changes */}
              {Object.keys(step.outcome.indicatorDeltas).length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {Object.entries(step.outcome.indicatorDeltas).map(([key, delta]) => {
                    if (delta === undefined || delta === 0) return null;
                    const isPositive = (delta as number) > 0;
                    const label = key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (s) => s.toUpperCase())
                      .replace('Gdp', 'GDP');
                    return (
                      <span
                        key={key}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono ${
                          isPositive
                            ? 'bg-zinc-800 text-zinc-400' :'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        <span className={isPositive ? 'text-emerald-400' : 'text-red-400'}>
                          {isPositive ? '+' : ''}{(delta as number).toFixed(1)}
                        </span>
                        <span className="text-zinc-600">{label}</span>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
