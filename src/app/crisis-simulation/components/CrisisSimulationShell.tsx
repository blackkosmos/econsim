'use client';
import React, { useState, useCallback } from 'react';
import {
  generateCrisis,
  applyPolicy,
  ALL_CRISES,
  type CrisisScenario,
  type EconomicIndicators,
  type SimulationStep,
} from './crisisData';
import CrisisNarrative from './CrisisNarrative';
import IndicatorPanel from './IndicatorPanel';
import PolicyDecision from './PolicyDecision';
import OutcomeLog from './OutcomeLog';
import { RefreshCw, AlertTriangle, Zap, ChevronLeft } from 'lucide-react';


type Phase = 'intro' | 'active';

export default function CrisisSimulationShell() {
  const [scenario, setScenario] = useState<CrisisScenario | null>(null);
  const [phase, setPhase] = useState<Phase>('intro');
  const [indicators, setIndicators] = useState<EconomicIndicators | null>(null);
  const [previousIndicators, setPreviousIndicators] = useState<EconomicIndicators | null>(null);
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [stepCount, setStepCount] = useState(0);
  const [lastOutcomeId, setLastOutcomeId] = useState<string | null>(null);

  const startCrisis = useCallback((crisisId?: string) => {
    const crisis = generateCrisis(crisisId);
    setScenario(crisis);
    setIndicators({ ...crisis.indicators });
    setPreviousIndicators(null);
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

      const indicatorsBefore = { ...indicators };
      const { outcome, newIndicators } = applyPolicy(policyId, indicators, scenario.policies);

      const newStep: SimulationStep = {
        step: stepCount + 1,
        policyId,
        policyLabel: policy.label,
        outcome,
        indicatorsAfter: newIndicators,
        indicatorsBefore,
      };

      setPreviousIndicators(indicatorsBefore);
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
        <div className="max-w-2xl w-full text-center space-y-8 animate-fadeInUp">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs font-medium tracking-wide uppercase">
            <AlertTriangle size={12} />
            Crisis Simulation Lab
          </div>
          <div>
            <h1 className="text-4xl font-bold text-zinc-100 leading-tight mb-3">
              Step into the Hot Seat
            </h1>
            <p className="text-zinc-400 text-base leading-relaxed">
              You are a government official or central banker facing a financial crisis. Choose a crisis scenario below. Your policy decisions will directly affect all 8 economic indicators — watch them update in real time after every decision.
            </p>
          </div>

          {/* Crisis selector */}
          <div className="space-y-3 text-left">
            {ALL_CRISES.map((crisis) => (
              <button
                key={crisis.id}
                onClick={() => startCrisis(crisis.id)}
                className="w-full text-left bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800 rounded-xl p-5 transition-all duration-150 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        crisis.severity === 'critical' ? 'bg-red-500' :
                        crisis.severity === 'severe' ? 'bg-amber-500' : 'bg-yellow-400'
                      }`} />
                      <span className="text-sm font-bold text-zinc-100 group-hover:text-white">{crisis.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
                        crisis.severity === 'critical' ? 'bg-red-500/15 text-red-400 border border-red-500/25' :
                        crisis.severity === 'severe'? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' : 'bg-yellow-400/15 text-yellow-400 border border-yellow-400/25'
                      }`}>{crisis.severity}</span>
                    </div>
                    <p className="text-xs text-zinc-500 mb-2">{crisis.subtitle}</p>
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{crisis.narrative.slice(0, 140)}…</p>
                  </div>
                  <div className="flex-shrink-0 text-zinc-600 group-hover:text-zinc-400 transition-colors mt-1">
                    <ChevronLeft size={16} className="rotate-180" />
                  </div>
                </div>
                {/* Starting indicators preview */}
                <div className="mt-3 pt-3 border-t border-zinc-800 grid grid-cols-4 gap-2">
                  {[
                    { label: 'Inflation', value: `${crisis.indicators.inflation}%` },
                    { label: 'GDP Growth', value: `${crisis.indicators.gdpGrowth}%` },
                    { label: 'Confidence', value: `${crisis.indicators.marketConfidence}/100` },
                    { label: 'Banking', value: `${crisis.indicators.bankingStability}/100` },
                  ].map((ind) => (
                    <div key={ind.label} className="text-center">
                      <div className="text-xs font-mono font-semibold text-zinc-300">{ind.value}</div>
                      <div className="text-xs text-zinc-600">{ind.label}</div>
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => startCrisis()}
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 font-medium rounded-xl transition-all duration-200 text-sm"
          >
            <Zap size={14} />
            Random Crisis
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
          <button
            onClick={() => setPhase('intro')}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-emerald-400 transition-colors mr-1"
          >
            <ChevronLeft size={14} />
            <span>Crisis Select</span>
          </button>
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
          onClick={() => setPhase('intro')}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-zinc-100 rounded-lg text-sm font-medium transition-all duration-150"
        >
          <RefreshCw size={14} />
          Change Crisis
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
            previousIndicators={previousIndicators}
          />
          {steps.length > 0 && (
            <OutcomeLog steps={steps} />
          )}
        </div>
      </div>
    </div>
  );
}
