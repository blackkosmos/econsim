'use client';
import React, { useState } from 'react';
import type { PolicyOption } from './crisisData';
import { Landmark, TrendingUp, Scale, Wrench, ChevronRight } from 'lucide-react';

interface Props {
  policies: PolicyOption[];
  onChoose: (policyId: string) => void;
  stepCount: number;
}

const CATEGORY_META: Record<PolicyOption['category'], { label: string; color: string; Icon: React.ElementType }> = {
  monetary: { label: 'Monetary', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', Icon: Landmark },
  fiscal: { label: 'Fiscal', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', Icon: TrendingUp },
  regulatory: { label: 'Regulatory', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', Icon: Scale },
  structural: { label: 'Structural', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', Icon: Wrench },
};

export default function PolicyDecision({ policies, onChoose, stepCount }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleSelect = (id: string) => {
    if (confirmed) return;
    setSelected(id);
  };

  const handleConfirm = () => {
    if (!selected || confirmed) return;
    setConfirmed(true);
    onChoose(selected);
    // Reset for next step
    setTimeout(() => {
      setSelected(null);
      setConfirmed(false);
    }, 600);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4 animate-fadeInUp">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest">
          {stepCount === 0 ? 'Choose Your First Response' : `Step ${stepCount + 1} — Next Decision`}
        </h2>
        <span className="text-xs text-zinc-600 font-mono">{policies.length} options</span>
      </div>

      <div className="space-y-2.5">
        {policies.map((policy) => {
          const meta = CATEGORY_META[policy.category];
          const CatIcon = meta.Icon;
          const isSelected = selected === policy.id;

          return (
            <button
              key={policy.id}
              onClick={() => handleSelect(policy.id)}
              disabled={confirmed}
              className={`w-full text-left rounded-lg border p-3.5 transition-all duration-150 group ${
                isSelected
                  ? 'bg-red-500/10 border-red-500/30 shadow-sm shadow-red-500/10'
                  : 'bg-zinc-800/50 border-zinc-700/60 hover:border-zinc-600 hover:bg-zinc-800'
              } ${confirmed ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected ? 'border-red-400 bg-red-400' : 'border-zinc-600 group-hover:border-zinc-400'
                }`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-zinc-200">{policy.label}</span>
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium border ${meta.color}`}>
                      <CatIcon size={9} />
                      {meta.label}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">{policy.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleConfirm}
        disabled={!selected || confirmed}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
          selected && !confirmed
            ? 'bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/20'
            : 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700'
        }`}
      >
        {confirmed ? 'Implementing...' : (
          <>
            <ChevronRight size={15} />
            Implement Policy
          </>
        )}
      </button>
    </div>
  );
}
