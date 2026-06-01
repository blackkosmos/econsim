'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, TrendingDown, Clock, Star } from 'lucide-react';
import PhaseAnalyseDepression1929 from './PhaseAnalyseDepression1929';
import PhasePredictDepression1929 from './PhasePredictDepression1929';
import PhaseReactDepression1929 from './PhaseReactDepression1929';
import { PredictionEntry } from '@/lib/predictionStore';

export type Phase = 'analyse' | 'predict' | 'react';

const phases: { key: Phase; label: string; desc: string }[] = [
  { key: 'analyse', label: '1. Analyse', desc: 'Study macro indicators' },
  { key: 'predict', label: '2. Predict', desc: 'Forecast the effects' },
  { key: 'react', label: '3. Results', desc: 'Review your score' },
];

export default function SimulationShellDepression1929() {
  const [phase, setPhase] = useState<Phase>('analyse');
  const [savedPredictions, setSavedPredictions] = useState<PredictionEntry[]>([]);
  const phaseIndex = phases.findIndex((p) => p.key === phase);

  const handlePredictComplete = (predictions: PredictionEntry[]) => {
    setSavedPredictions(predictions);
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
              <span className="text-zinc-300">🇺🇸 Great Depression (1929–1939)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-500/10 rounded-lg border border-sky-500/20">
                <TrendingDown size={20} className="text-sky-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-zinc-100">🇺🇸 Great Depression in the United States (1929–1939)</h1>
                <p className="text-sm text-zinc-500">Demand Shock · Expert Difficulty · United States</p>
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
              <span className="font-mono font-semibold">+560 XP</span>
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
        {phase === 'analyse' && <PhaseAnalyseDepression1929 onComplete={() => setPhase('predict')} />}
        {phase === 'predict' && <PhasePredictDepression1929 onComplete={handlePredictComplete} />}
        {phase === 'react' && <PhaseReactDepression1929 predictions={savedPredictions} />}
      </div>
    </div>
  );
}
