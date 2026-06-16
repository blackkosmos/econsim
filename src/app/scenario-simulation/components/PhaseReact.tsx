'use client';
import React, { useState } from 'react';
import {
  Briefcase, ShieldCheck, TrendingUp, TrendingDown, Minus,
  ArrowRight, CheckCircle2, AlertTriangle, Info,
} from 'lucide-react';

export type Stance = 'reduce' | 'hold' | 'increase';

export interface ReactPosition {
  name: string;
  category: string;
  stance: Stance;
  recommended: Stance;
  verdict: 'good' | 'neutral' | 'poor';
  actualReturn: number;
}

export interface ReactResult {
  positioningScore: number;
  goodCount: number;
  poorCount: number;
  total: number;
  activeReturn: number;
  positions: ReactPosition[];
}

interface PhaseReactProps {
  onComplete: (result: ReactResult) => void;
}

interface AssetDef {
  id: string;
  name: string;
  category: string;
  recommended: Stance;
  actualReturn: number;
  rationale: string;
}

const assets: AssetDef[] = [
  {
    id: 'financials', name: 'Bank & Financial Stocks', category: 'Equities',
    recommended: 'reduce', actualReturn: -55,
    rationale: 'Banks are at the epicentre of the crisis. Financials fell ~55% — the most exposed sector.',
  },
  {
    id: 'cyclicals', name: 'Cyclical Equities (Consumer / Industrials)', category: 'Equities',
    recommended: 'reduce', actualReturn: -38,
    rationale: 'Discretionary and industrial demand collapses as investment and consumption fall.',
  },
  {
    id: 'hy-bonds', name: 'High-Yield Corporate Bonds', category: 'Credit',
    recommended: 'reduce', actualReturn: -30,
    rationale: 'Credit spreads blew out as default risk spiked — high-yield debt was hit hard.',
  },
  {
    id: 'treasuries', name: 'US Treasuries', category: 'Government Bonds',
    recommended: 'increase', actualReturn: 22,
    rationale: 'Flight to safety drove Treasury prices up and yields down (+22% total return).',
  },
  {
    id: 'gold', name: 'Gold', category: 'Commodities',
    recommended: 'increase', actualReturn: 18,
    rationale: 'A classic safe-haven asset — gold rose ~18% as confidence collapsed.',
  },
  {
    id: 'cash', name: 'Cash / USD', category: 'Cash',
    recommended: 'increase', actualReturn: 6,
    rationale: 'The dollar strengthened ~15% as global capital fled to USD liquidity.',
  },
];

const stanceMeta: Record<Stance, { label: string; icon: React.ReactNode; active: string }> = {
  reduce: {
    label: 'Reduce',
    icon: <TrendingDown size={13} />,
    active: 'bg-red-500/15 border-red-500/40 text-red-400',
  },
  hold: {
    label: 'Hold',
    icon: <Minus size={13} />,
    active: 'bg-zinc-600/30 border-zinc-500/50 text-zinc-200',
  },
  increase: {
    label: 'Increase',
    icon: <TrendingUp size={13} />,
    active: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
  },
};

const stanceOrder: Stance[] = ['reduce', 'hold', 'increase'];

export default function PhaseReact({ onComplete }: PhaseReactProps) {
  const [stances, setStances] = useState<Record<string, Stance>>(
    () => Object.fromEntries(assets.map((a) => [a.id, 'hold' as Stance]))
  );
  const [locked, setLocked] = useState(false);

  const setStance = (assetId: string, stance: Stance) => {
    if (locked) return;
    setStances((prev) => ({ ...prev, [assetId]: stance }));
  };

  const evaluate = (asset: AssetDef): 'good' | 'neutral' | 'poor' => {
    const chosen = stances[asset.id];
    if (chosen === asset.recommended) return 'good';
    if (chosen === 'hold') return 'neutral';
    return 'poor';
  };

  const goodCount = assets.filter((a) => evaluate(a) === 'good').length;
  const poorCount = assets.filter((a) => evaluate(a) === 'poor').length;
  const positioningScore = Math.round((goodCount / assets.length) * 100);

  const tilt = (stance: Stance): number => (stance === 'increase' ? 1 : stance === 'reduce' ? -1 : 0);
  const activeReturn = Math.round(
    assets.reduce((sum, a) => sum + tilt(stances[a.id]) * a.actualReturn, 0) / assets.length
  );

  const handleContinue = () => {
    const result: ReactResult = {
      positioningScore,
      goodCount,
      poorCount,
      total: assets.length,
      activeReturn,
      positions: assets.map((a) => ({
        name: a.name,
        category: a.category,
        stance: stances[a.id],
        recommended: a.recommended,
        verdict: evaluate(a),
        actualReturn: a.actualReturn,
      })),
    };
    onComplete(result);
  };

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Intro banner */}
      <div className="flex items-start gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
        <Briefcase size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-emerald-400 mb-1">React — Reposition Your Portfolio</p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The crisis is unfolding. Based on your analysis and predictions, decide how to reposition each asset class
            before the full impact hits. Reduce your exposure to vulnerable assets and rotate into safe havens, then
            lock in your positioning.
          </p>
        </div>
      </div>

      {/* Asset positioning */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <ShieldCheck size={15} className="text-emerald-400" />
            Defensive Positioning
          </h3>
          <span className="text-xs text-zinc-500 font-mono">{assets.length} asset classes</span>
        </div>
        <div className="divide-y divide-zinc-800/60">
          {assets.map((asset) => {
            const verdict = evaluate(asset);
            return (
              <div key={asset.id} className="px-5 py-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-200">{asset.name}</p>
                    <p className="text-xs text-zinc-600">{asset.category}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {stanceOrder.map((stance) => {
                      const isSelected = stances[asset.id] === stance;
                      const meta = stanceMeta[stance];
                      return (
                        <button
                          key={`${asset.id}-${stance}`}
                          onClick={() => setStance(asset.id, stance)}
                          disabled={locked}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-150 ${
                            isSelected
                              ? meta.active
                              : 'border-zinc-700/60 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                          } ${locked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {meta.icon}
                          {meta.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {locked && (
                  <div
                    className={`mt-3 flex items-start gap-2 rounded-lg border p-3 text-xs leading-relaxed ${
                      verdict === 'good'
                        ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300'
                        : verdict === 'poor'
                        ? 'border-red-500/30 bg-red-500/5 text-red-300'
                        : 'border-amber-400/30 bg-amber-400/5 text-amber-200'
                    }`}
                  >
                    {verdict === 'good' ? (
                      <CheckCircle2 size={13} className="flex-shrink-0 mt-0.5" />
                    ) : verdict === 'poor' ? (
                      <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
                    ) : (
                      <Info size={13} className="flex-shrink-0 mt-0.5" />
                    )}
                    <span>
                      <span className="font-semibold">
                        {verdict === 'good'
                          ? 'Well positioned. '
                          : verdict === 'poor'
                          ? 'Exposed. '
                          : 'Neutral — a more decisive move was available. '}
                      </span>
                      {asset.rationale}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Locked summary */}
      {locked && (
        <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-emerald-900/20 to-zinc-900 border border-emerald-500/30 rounded-xl">
          <div className="p-3 bg-emerald-500/15 rounded-xl">
            <ShieldCheck size={26} className="text-emerald-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-zinc-100 mb-1">Positioning Locked In</h3>
            <p className="text-sm text-zinc-400">
              {goodCount} of {assets.length} asset classes were well positioned for the crisis
              {poorCount > 0 ? `, with ${poorCount} left exposed.` : '.'}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className={`text-3xl font-bold font-mono tabular-nums ${activeReturn >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {activeReturn > 0 ? '+' : ''}{activeReturn}%
              </div>
              <div className="text-xs text-zinc-500">Active Return</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold font-mono tabular-nums text-emerald-400">{positioningScore}%</div>
              <div className="text-xs text-zinc-500">Defensive Score</div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end">
        {!locked ? (
          <button
            onClick={() => setLocked(true)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-xl transition-all duration-150 active:scale-95"
          >
            <ShieldCheck size={16} />
            Lock In Positioning
          </button>
        ) : (
          <button
            onClick={handleContinue}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-xl transition-all duration-150 active:scale-95"
          >
            Continue to Review
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
