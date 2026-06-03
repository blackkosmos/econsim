'use client';
import React, { useEffect, useRef, useState } from 'react';
import type { EconomicIndicators } from './crisisData';

interface Props {
  indicators: EconomicIndicators;
  baseline: EconomicIndicators;
  previousIndicators?: EconomicIndicators | null;
}

interface IndicatorConfig {
  key: keyof EconomicIndicators;
  label: string;
  unit: string;
  suffix: string;
  goodDirection: 'up' | 'down' | 'mid';
  decimals: number;
  description: string;
}

const CONFIGS: IndicatorConfig[] = [
  { key: 'inflation', label: 'Inflation', unit: '%', suffix: '%', goodDirection: 'down', decimals: 1, description: 'Annual consumer price inflation' },
  { key: 'unemployment', label: 'Unemployment', unit: '%', suffix: '%', goodDirection: 'down', decimals: 1, description: 'Share of labour force unemployed' },
  { key: 'gdpGrowth', label: 'GDP Growth', unit: '%', suffix: '%', goodDirection: 'up', decimals: 1, description: 'Annual real GDP growth rate' },
  { key: 'marketConfidence', label: 'Market Confidence', unit: '/100', suffix: '', goodDirection: 'up', decimals: 0, description: 'Composite investor confidence index (0–100)' },
  { key: 'debtToGdp', label: 'Debt-to-GDP', unit: '%', suffix: '%', goodDirection: 'down', decimals: 0, description: 'Government debt as % of GDP' },
  { key: 'bankingStability', label: 'Banking Stability', unit: '/100', suffix: '', goodDirection: 'up', decimals: 0, description: 'Banking sector health index (0–100)' },
  { key: 'policyRate', label: 'Policy Rate', unit: '%', suffix: '%', goodDirection: 'mid', decimals: 1, description: 'Central bank benchmark interest rate' },
  { key: 'currencyStrength', label: 'Currency Strength', unit: '/100', suffix: '', goodDirection: 'up', decimals: 0, description: 'Relative currency strength index (0–100)' },
];

function getDelta(current: number, previous: number): number {
  return parseFloat((current - previous).toFixed(2));
}

function formatVal(val: number, decimals: number): string {
  return val.toFixed(decimals);
}

interface IndicatorCardProps {
  cfg: IndicatorConfig;
  value: number;
  prevValue: number | null;
  baselineValue: number;
}

function IndicatorCard({ cfg, value, prevValue, baselineValue }: IndicatorCardProps) {
  const [flash, setFlash] = useState<'improved' | 'worsened' | null>(null);
  const [animating, setAnimating] = useState(false);
  const prevRef = useRef<number | null>(null);

  useEffect(() => {
    if (prevValue === null || prevRef.current === prevValue) return;
    prevRef.current = prevValue;

    const delta = getDelta(value, prevValue);
    if (Math.abs(delta) < 0.01) return;

    // Determine if this change is an improvement or deterioration
    let improved: boolean;
    if (cfg.goodDirection === 'up') {
      improved = delta > 0;
    } else if (cfg.goodDirection === 'down') {
      improved = delta < 0;
    } else {
      // 'mid' — for policy rate, no strong good/bad direction
      improved = false; // neutral, just animate
    }

    setFlash(cfg.goodDirection === 'mid' ? null : (improved ? 'improved' : 'worsened'));
    setAnimating(true);

    const timer = setTimeout(() => {
      setFlash(null);
      setAnimating(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [value, prevValue, cfg.goodDirection]);

  const stepDelta = prevValue !== null ? getDelta(value, prevValue) : 0;
  const baselineDelta = getDelta(value, baselineValue);
  const hasStepChange = prevValue !== null && Math.abs(stepDelta) >= 0.01;

  const flashBg = flash === 'improved' ?'bg-emerald-500/15 border-emerald-500/40'
    : flash === 'worsened' ?'bg-red-500/15 border-red-500/40' :'bg-zinc-800/60 border-zinc-700/50';

  const valueColor = flash === 'improved' ?'text-emerald-400'
    : flash === 'worsened' ?'text-red-400' :'text-zinc-100';

  const stepDeltaColor = (() => {
    if (!hasStepChange) return 'text-zinc-600';
    if (cfg.goodDirection === 'up') return stepDelta > 0 ? 'text-emerald-400' : 'text-red-400';
    if (cfg.goodDirection === 'down') return stepDelta < 0 ? 'text-emerald-400' : 'text-red-400';
    return 'text-zinc-400';
  })();

  const baselineDeltaColor = (() => {
    if (Math.abs(baselineDelta) < 0.01) return 'text-zinc-600';
    if (cfg.goodDirection === 'up') return baselineDelta > 0 ? 'text-emerald-500/70' : 'text-red-500/70';
    if (cfg.goodDirection === 'down') return baselineDelta < 0 ? 'text-emerald-500/70' : 'text-red-500/70';
    return 'text-zinc-500';
  })();

  return (
    <div
      className={`rounded-xl border p-3.5 transition-all duration-500 ${flashBg} ${animating ? 'scale-[1.02]' : 'scale-100'}`}
      title={cfg.description}
    >
      <p className="text-xs text-zinc-500 font-medium mb-1.5 leading-none">{cfg.label}</p>

      {/* Current value */}
      <div className="flex items-baseline gap-1 mb-1">
        <span className={`text-2xl font-bold font-mono tabular-nums leading-none transition-colors duration-500 ${valueColor}`}>
          {formatVal(value, cfg.decimals)}
        </span>
        <span className="text-xs text-zinc-600">{cfg.unit}</span>
      </div>

      {/* Step change — shown after a decision */}
      {hasStepChange && (
        <div className={`flex items-center gap-1 text-xs font-mono font-semibold ${stepDeltaColor} mb-0.5`}>
          <span>{stepDelta > 0 ? '▲' : '▼'}</span>
          <span>
            {stepDelta > 0 ? '+' : ''}{formatVal(stepDelta, cfg.decimals)}{cfg.suffix}
          </span>
          <span className="text-zinc-600 font-normal ml-0.5">this step</span>
        </div>
      )}

      {/* Baseline delta */}
      <div className={`text-xs font-mono ${baselineDeltaColor}`}>
        {Math.abs(baselineDelta) < 0.01
          ? <span className="text-zinc-700">— vs start</span>
          : <span>{baselineDelta > 0 ? '+' : ''}{formatVal(baselineDelta, cfg.decimals)}{cfg.suffix} vs start</span>
        }
      </div>
    </div>
  );
}

export default function IndicatorPanel({ indicators, baseline, previousIndicators }: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest">Economic Indicators</h2>
        <div className="flex items-center gap-3 text-xs font-mono text-zinc-600">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500/60 inline-block" />Improved</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500/60 inline-block" />Worsened</span>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CONFIGS.map((cfg) => (
          <IndicatorCard
            key={cfg.key}
            cfg={cfg}
            value={indicators[cfg.key]}
            prevValue={previousIndicators ? previousIndicators[cfg.key] : null}
            baselineValue={baseline[cfg.key]}
          />
        ))}
      </div>

      {/* Legend row */}
      {previousIndicators && (
        <div className="mt-3 pt-3 border-t border-zinc-800 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600 font-mono">
          <span>▲▼ = change from previous decision</span>
          <span>vs start = change from crisis starting value</span>
        </div>
      )}
    </div>
  );
}
