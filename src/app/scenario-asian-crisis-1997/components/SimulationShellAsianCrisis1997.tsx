'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, TrendingDown, Clock, Star } from 'lucide-react';
import PhaseAnalyseAsianCrisis1997 from './PhaseAnalyseAsianCrisis1997';
import PhasePredictAsianCrisis1997 from './PhasePredictAsianCrisis1997';
import PhaseReactAsianCrisis1997 from './PhaseReactAsianCrisis1997';
import { PredictionEntry } from '@/lib/predictionStore';
import { markScenarioCompleted } from '@/lib/progressStore';

export type Phase = 'analyse' | 'predict' | 'react';

const phases: { key: Phase; label: string; desc: string }[] = [
  { key: 'analyse', label: '1. Analyse', desc: 'Study macro indicators' },
  { key: 'predict', label: '2. Predict', desc: 'Forecast the effects' },
  { key: 'react', label: '3. Results', desc: 'Review your score' },
];

export default function SimulationShellAsianCrisis1997() {
  const [phase, setPhase] = useState<Phase>('analyse');
  const [savedPredictions, setSavedPredictions] = useState<PredictionEntry[]>([]);
  const phaseIndex = phases.findIndex((p) => p.key === phase);

  const handlePredictComplete = (predictions: PredictionEntry[]) => {
    setSavedPredictions(predictions);
    markScenarioCompleted('crisis-afc');
    setPhase('react');
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 py-6 space-y-6">
        {/* Scenario Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-sm text-zinc-500">
              <Link href="/scenario-hub" className="hover:text-emerald-400 transition-colors cursor-pointer">Scenario Hub</Link>
              <ChevronRight size={14} />
              <span className="text-zinc-300">📉 Asian Financial Crisis (1997–1998)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <TrendingDown size={20} className="text-amber-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-zinc-100">📉 Asian Financial Crisis (1997–1998)</h1>
                <p className="text-sm text-zinc-500">Currency Crisis · Expert Difficulty · Asia-Pacific</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm text-zinc-400">
              <Clock size={14} />
              <span className="font-mono tabular-nums">~35 min</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-amber-400">
              <Star size={14} />
              <span className="font-mono font-semibold">+580 XP</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 rounded-lg border border-zinc-700/50">
              <TrendingDown size={14} className="text-red-400" />
              <span className="text-sm text-zinc-300">Expert</span>
            </div>
          </div>
        </div>

        {/* Phase Stepper */}
        <div className="flex items-center gap-0 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
          {phases.map((p, idx) => {
            const isActive = p.key === phase;
            const isDone = idx < phaseIndex;
            return (
              <React.Fragment key={`phase-frag-${p.key}`}>
                <button
                  key={`phase-btn-${p.key}`}
                  onClick={() => isDone && setPhase(p.key)}
                  className={`
                    flex-1 flex flex-col items-center py-3 px-4 rounded-lg transition-all duration-200
                    ${isActive ? 'phase-active' : ''}
                    ${isDone ? 'cursor-pointer opacity-70 hover:opacity-90' : isActive ? 'cursor-default' : 'cursor-not-allowed opacity-40'}
                  `}
                >
                  <span className={`text-sm font-semibold ${isActive ? 'text-emerald-400' : isDone ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {p.label}
                  </span>
                  <span className={`text-xs mt-0.5 ${isActive ? 'text-emerald-400/70' : 'text-zinc-600'}`}>
                    {p.desc}
                  </span>
                </button>
                {idx < phases.length - 1 && (
                  <ChevronRight key={`phase-sep-${p.key}`} size={16} className="text-zinc-700 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Phase Content */}
        {phase === 'analyse' && <PhaseAnalyseAsianCrisis1997 onComplete={() => setPhase('predict')} />}
        {phase === 'predict' && <PhasePredictAsianCrisis1997 onComplete={handlePredictComplete} />}
        {phase === 'react' && <PhaseReactAsianCrisis1997 predictions={savedPredictions} />}
      </div>
    </div>
  );
}
