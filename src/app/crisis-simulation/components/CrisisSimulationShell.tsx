'use client';
import React, { useState, useCallback } from 'react';
import {
  generateCrisis,
  applyPolicy,
  type CrisisScenario,
  type EconomicIndicators,
  type SimulationStep,
} from './crisisData';
import CrisisNarrative from './CrisisNarrative';
import IndicatorPanel from './IndicatorPanel';
import PolicyDecision from './PolicyDecision';
import OutcomeLog from './OutcomeLog';
import { RefreshCw, AlertTriangle, Zap, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

type Phase = 'intro' | 'active';

export default function CrisisSimulationShell() {
  const [scenario, setScenario] = useState<CrisisScenario | null>(null);
  const [phase, setPhase] = useState<Phase>('intro');
  const [indicators, setIndicators] = useState<EconomicIndicators | null>(null);
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [stepCount, setStepCount] = useState(0);
  const [lastOutcomeId, setLastOutcomeId] = useState<string | null>(null);

  const startNewCrisis = useCallback(() => {
    const crisis = generateCrisis();
    setScenario(crisis);
    setIndicators({ ...crisis.indicators });
    setSteps([]);
    setStepCount(0);
    setLastOutcomeId(null);
    setPhase('active');
  }, []);

  const handlePolicyChoice = useCallback(
    (policyId: string) => {
      if (!scenario || !indicators) return;
      const policy = scenario.policies.find((p) => p.id === policyId);
      if (!policy) return;

      const { outcome, newIndicators } = applyPolicy(policyId, indicators, scenario.policies);
      const newStep: SimulationStep = {
        step: stepCount + 1,
        policyId,
        policyLabel: policy.label,
        outcome,
        indicatorsAfter: newIndicators,
      };

      setSteps((prev) => [newStep, ...prev]);
      setIndicators(newIndicators);
      setStepCount((c) => c + 1);
      setLastOutcomeId(`step-${stepCount + 1}`);
    },
    [scenario, indicators, stepCount]
  );

  if (phase === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-16">
        <div className="max-w-xl w-full text-center space-y-8 animate-fadeInUp">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs font-medium tracking-wide uppercase">
            <AlertTriangle size={12} />
            Crisis Simulation Lab
          </div>
          <div>
            <h1 className="text-4xl font-bold text-zinc-100 leading-tight mb-3">
              Step into the Hot Seat
            </h1>
            <p className="text-zinc-400 text-base leading-relaxed">
              You are a government official or central banker facing a financial crisis. Each simulation generates a unique, randomised scenario with different starting conditions. Your decisions will shape the outcome — for better or worse.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-left">
            {[
              { icon: '🎲', title: 'Randomised Crises', desc: 'New scenario every time — no two crises are alike.' },
              { icon: '📊', title: 'Live Indicators', desc: 'Watch inflation, GDP, and confidence shift with every decision.' },
              { icon: '🏛️', title: 'Real Policy Tools', desc: 'Rate hikes, bailouts, austerity — choose your response.' },
            ].map((f) => (
              <div key={f.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-1.5">
                <span className="text-2xl">{f.icon}</span>
                <p className="text-zinc-200 text-sm font-semibold">{f.title}</p>
                <p className="text-zinc-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          <button
            onClick={startNewCrisis}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-red-500 hover:bg-red-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-red-500/20 text-sm"
          >
            <Zap size={16} />
            Generate Crisis Scenario
          </button>
        </div>
      </div>
    );
  }

  if (!scenario || !indicators) return null;

  return (
    <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 py-6 space-y-5">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/scenario-hub"
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-emerald-400 transition-colors mr-1"
          >
            <ChevronLeft size={14} />
            <span>Scenario Hub</span>
          </Link>
          <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${
            scenario.severity === 'critical' ? 'bg-red-500' :
            scenario.severity === 'severe' ? 'bg-amber-500' : 'bg-yellow-400'
          }`} />
          <div>
            <h1 className="text-lg font-bold text-zinc-100 leading-none">{scenario.title}</h1>
            <p className="text-xs text-zinc-500 mt-0.5">{scenario.subtitle}</p>
          </div>
          <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
            scenario.severity === 'critical' ?'bg-red-500/15 text-red-400 border border-red-500/25'
              : scenario.severity === 'severe' ?'bg-amber-500/15 text-amber-400 border border-amber-500/25' :'bg-yellow-400/15 text-yellow-400 border border-yellow-400/25'
          }`}>
            {scenario.severity}
          </span>
          {stepCount > 0 && (
            <span className="ml-1 px-2.5 py-0.5 rounded-full text-xs font-mono bg-zinc-800 text-zinc-400 border border-zinc-700">
              Step {stepCount}
            </span>
          )}
        </div>
        <button
          onClick={startNewCrisis}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-zinc-100 rounded-lg text-sm font-medium transition-all duration-150"
        >
          <RefreshCw size={14} />
          New Crisis
        </button>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left column: narrative + policy */}
        <div className="xl:col-span-1 space-y-5">
          <CrisisNarrative narrative={scenario.narrative} stepCount={stepCount} />
          <PolicyDecision
            policies={scenario.policies}
            onChoose={handlePolicyChoice}
            stepCount={stepCount}
          />
        </div>

        {/* Right columns: indicators + log */}
        <div className="xl:col-span-2 space-y-5">
          <IndicatorPanel
            indicators={indicators}
            baseline={scenario.indicators}
          />
          {steps.length > 0 && (
            <OutcomeLog steps={steps} />
          )}
        </div>
      </div>
    </div>
  );
}
