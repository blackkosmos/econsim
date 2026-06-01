'use client';
import React from 'react';
import type { EconomicIndicators } from './crisisData';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Props {
  indicators: EconomicIndicators;
  baseline: EconomicIndicators;
}

interface IndicatorConfig {
  key: keyof EconomicIndicators;
  label: string;
  unit: string;
  goodDirection: 'up' | 'down' | 'mid';
  warningThreshold: number;
  criticalThreshold: number;
  thresholdDirection: 'above' | 'below';
  description: string;
}

const CONFIGS: IndicatorConfig[] = [
  { key: 'inflation', label: 'Inflation', unit: '%', goodDirection: 'mid', warningThreshold: 6, criticalThreshold: 12, thresholdDirection: 'above', description: 'Annual consumer price inflation' },
  { key: 'unemployment', label: 'Unemployment', unit: '%', goodDirection: 'down', warningThreshold: 8, criticalThreshold: 14, thresholdDirection: 'above', description: 'Share of labour force unemployed' },
  { key: 'gdpGrowth', label: 'GDP Growth', unit: '%', goodDirection: 'up', warningThreshold: 0, criticalThreshold: -3, thresholdDirection: 'below', description: 'Annual real GDP growth rate' },
  { key: 'marketConfidence', label: 'Market Confidence', unit: '/100', goodDirection: 'up', warningThreshold: 40, criticalThreshold: 20, thresholdDirection: 'below', description: 'Composite investor confidence index' },
  { key: 'debtToGdp', label: 'Debt / GDP', unit: '%', goodDirection: 'down', warningThreshold: 90, criticalThreshold: 120, thresholdDirection: 'above', description: 'Government debt as % of GDP' },
  { key: 'bankingStability', label: 'Banking Stability', unit: '/100', goodDirection: 'up', warningThreshold: 40, criticalThreshold: 20, thresholdDirection: 'below', description: 'Composite banking sector health index' },
  { key: 'interestRate', label: 'Policy Rate', unit: '%', goodDirection: 'mid', warningThreshold: 10, criticalThreshold: 16, thresholdDirection: 'above', description: 'Central bank benchmark interest rate' },
  { key: 'currencyStrength', label: 'Currency Strength', unit: '/100', goodDirection: 'up', warningThreshold: 35, criticalThreshold: 18, thresholdDirection: 'below', description: 'Relative currency strength index' },
];

function getStatus(value: number, config: IndicatorConfig): 'good' | 'warning' | 'critical' {
  if (config.thresholdDirection === 'above') {
    if (value >= config.criticalThreshold) return 'critical';
    if (value >= config.warningThreshold) return 'warning';
    return 'good';
  } else {
    if (value <= config.criticalThreshold) return 'critical';
    if (value <= config.warningThreshold) return 'warning';
    return 'good';
  }
}

function getDelta(current: number, baseline: number): number {
  return parseFloat((current - baseline).toFixed(1));
}

export default function IndicatorPanel({ indicators, baseline }: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 animate-fadeInUp">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest">Economic Indicators</h2>
        <span className="text-xs text-zinc-600 font-mono">Live</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CONFIGS.map((cfg) => {
          const value = indicators[cfg.key];
          const base = baseline[cfg.key];
          const delta = getDelta(value, base);
          const status = getStatus(value, cfg);

          const statusColors = {
            good: 'text-emerald-400',
            warning: 'text-amber-400',
            critical: 'text-red-400',
          };
          const statusBg = {
            good: 'bg-emerald-500/8 border-emerald-500/15',
            warning: 'bg-amber-500/8 border-amber-500/15',
            critical: 'bg-red-500/10 border-red-500/20',
          };

          const DeltaIcon = delta > 0.05 ? TrendingUp : delta < -0.05 ? TrendingDown : Minus;
          const deltaColor = (() => {
            if (Math.abs(delta) < 0.05) return 'text-zinc-500';
            if (cfg.goodDirection === 'up') return delta > 0 ? 'text-emerald-400' : 'text-red-400';
            if (cfg.goodDirection === 'down') return delta < 0 ? 'text-emerald-400' : 'text-red-400';
            return 'text-zinc-400';
          })();

          return (
            <div
              key={cfg.key}
              className={`rounded-lg border p-3 space-y-1.5 transition-all duration-300 ${statusBg[status]}`}
              title={cfg.description}
            >
              <p className="text-xs text-zinc-500 font-medium leading-none">{cfg.label}</p>
              <div className="flex items-end gap-1.5">
                <span className={`text-xl font-bold font-mono tabular-nums leading-none ${statusColors[status]}`}>
                  {value.toFixed(1)}
                </span>
                <span className="text-xs text-zinc-600 mb-0.5">{cfg.unit}</span>
              </div>
              <div className={`flex items-center gap-1 text-xs font-mono ${deltaColor}`}>
                <DeltaIcon size={10} />
                <span>{delta > 0 ? '+' : ''}{delta.toFixed(1)}</span>
                <span className="text-zinc-700 text-xs">vs start</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
