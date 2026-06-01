'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Zap, Sliders, Play, RefreshCw, TrendingDown, AlertTriangle, BarChart2, Cpu,  } from 'lucide-react';

interface MacroSlider {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  value: number;
  description: string;
  color: string;
}

const defaultSliders: MacroSlider[] = [
  { id: 'inflation', label: 'Inflation Rate', min: -2, max: 25, step: 0.5, unit: '%', value: 3.5, description: 'Annual CPI change', color: 'text-red-400' },
  { id: 'interest', label: 'Interest Rates', min: 0, max: 20, step: 0.25, unit: '%', value: 5.25, description: 'Central bank base rate', color: 'text-amber-400' },
  { id: 'unemployment', label: 'Unemployment', min: 1, max: 30, step: 0.5, unit: '%', value: 4.2, description: 'Labour force unemployment rate', color: 'text-orange-400' },
  { id: 'exchange', label: 'Exchange Rate Index', min: 50, max: 150, step: 1, unit: '', value: 100, description: 'Trade-weighted currency index (100 = baseline)', color: 'text-sky-400' },
  { id: 'confidence', label: 'Consumer Confidence', min: 0, max: 100, step: 1, unit: '/100', value: 65, description: 'Consumer sentiment index', color: 'text-emerald-400' },
  { id: 'debt', label: 'Debt-to-GDP Ratio', min: 20, max: 250, step: 5, unit: '%', value: 95, description: 'Government debt as % of GDP', color: 'text-violet-400' },
];

const presets = [
  { id: 'stagflation', label: '1970s Stagflation', emoji: '🛢️', values: { inflation: 12, interest: 8, unemployment: 8, exchange: 85, confidence: 28, debt: 45 } },
  { id: 'gfc', label: '2008 Financial Crisis', emoji: '🏦', values: { inflation: 1.5, interest: 0.25, unemployment: 10, exchange: 110, confidence: 22, debt: 85 } },
  { id: 'covid', label: 'COVID Shock', emoji: '🦠', values: { inflation: 5.5, interest: 0.1, unemployment: 14, exchange: 95, confidence: 15, debt: 130 } },
  { id: 'boom', label: 'Economic Boom', emoji: '📈', values: { inflation: 2.1, interest: 3.5, unemployment: 3.2, exchange: 105, confidence: 88, debt: 60 } },
];

const generatedScenarios = [
  { id: 'gen-1', title: 'Sovereign Debt Spiral', severity: 'Critical', probability: 'High', description: 'High debt-to-GDP combined with rising interest rates creates unsustainable debt servicing costs, triggering a sovereign default cascade.', impacts: ['Currency collapse −45%', 'GDP contraction −8%', 'Unemployment +12pp'] },
  { id: 'gen-2', title: 'Stagflation Trap', severity: 'High', probability: 'Medium', description: 'Elevated inflation with rising unemployment creates a policy dilemma. Rate hikes deepen recession; rate cuts worsen inflation.', impacts: ['Inflation peak 15%', 'GDP stagnation', 'Real wages −18%'] },
];

const severityColors: Record<string, string> = {
  Critical: 'text-red-400 bg-red-500/10 border-red-500/20',
  High: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
};

export default function CrisisLabPage() {
  const [sliders, setSliders] = useState<MacroSlider[]>(defaultSliders);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const setSliderValue = (id: string, value: number) => {
    setSliders((prev) => prev.map((s) => s.id === id ? { ...s, value } : s));
    setActivePreset(null);
    setGenerated(false);
  };

  const applyPreset = (preset: typeof presets[0]) => {
    setSliders((prev) => prev.map((s) => ({
      ...s,
      value: preset.values[s.id as keyof typeof preset.values] ?? s.value,
    })));
    setActivePreset(preset.id);
    setGenerated(false);
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2200);
  };

  const handleReset = () => {
    setSliders(defaultSliders);
    setActivePreset(null);
    setGenerated(false);
  };

  const riskScore = Math.round(
    (sliders.find((s) => s.id === 'inflation')!.value / 25) * 20 +
    (sliders.find((s) => s.id === 'unemployment')!.value / 30) * 25 +
    (sliders.find((s) => s.id === 'debt')!.value / 250) * 25 +
    ((100 - sliders.find((s) => s.id === 'confidence')!.value) / 100) * 30
  );

  return (
    <AppLayout>
      <div className="min-h-screen bg-zinc-950">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-8 py-8 space-y-8">

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <Cpu size={20} className="text-emerald-400" />
                </div>
                <h1 className="text-2xl font-bold text-zinc-100">Crisis Lab</h1>
              </div>
              <p className="text-sm text-zinc-500">Configure macroeconomic conditions and generate custom crisis scenarios for simulation.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm rounded-xl hover:bg-zinc-800 hover:text-zinc-200 transition-all"
              >
                <RefreshCw size={14} />
                Reset
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-zinc-950 text-sm font-semibold rounded-xl transition-all active:scale-95"
              >
                {generating ? (
                  <><RefreshCw size={14} className="animate-spin" /> Generating...</>
                ) : (
                  <><Zap size={14} /> Generate Crisis</>
                )}
              </button>
            </div>
          </div>

          {/* Presets */}
          <div>
            <p className="text-xs text-zinc-500 mb-3 flex items-center gap-1.5"><Sliders size={12} /> Quick Presets</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all duration-150 ${
                    activePreset === preset.id
                      ? 'border-emerald-500/40 bg-emerald-500/5 text-zinc-100' :'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <span className="text-xl">{preset.emoji}</span>
                  <span className="text-xs font-medium leading-tight">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sliders Panel */}
            <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                  <Sliders size={15} className="text-emerald-400" />
                  Macroeconomic Conditions
                </h2>
                <span className="text-xs text-zinc-500">Adjust to configure your scenario</span>
              </div>

              <div className="space-y-5">
                {sliders.map((slider) => (
                  <div key={slider.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-sm font-medium text-zinc-300">{slider.label}</span>
                        <span className="text-xs text-zinc-600 ml-2">{slider.description}</span>
                      </div>
                      <span className={`text-base font-bold font-mono tabular-nums ${slider.color}`}>
                        {slider.value}{slider.unit}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min={slider.min}
                        max={slider.max}
                        step={slider.step}
                        value={slider.value}
                        onChange={(e) => setSliderValue(slider.id, Number(e.target.value))}
                        className="w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-emerald-400"
                      />
                      <div className="flex justify-between text-xs text-zinc-700 mt-1">
                        <span>{slider.min}{slider.unit}</span>
                        <span>{slider.max}{slider.unit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Panel */}
            <div className="space-y-4">
              {/* Risk Score */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-zinc-200 mb-4 flex items-center gap-2">
                  <AlertTriangle size={14} className="text-amber-400" />
                  Crisis Risk Score
                </h3>
                <div className="flex items-center justify-center mb-4">
                  <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${
                    riskScore > 70 ? 'border-red-500/50 bg-red-500/10' :
                    riskScore > 40 ? 'border-amber-500/50 bg-amber-500/10': 'border-emerald-500/50 bg-emerald-500/10'
                  }`}>
                    <div className="text-center">
                      <div className={`text-2xl font-black font-mono ${
                        riskScore > 70 ? 'text-red-400' : riskScore > 40 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>{riskScore}</div>
                      <div className="text-xs text-zinc-500">/100</div>
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      riskScore > 70 ? 'bg-gradient-to-r from-red-600 to-red-400' :
                      riskScore > 40 ? 'bg-gradient-to-r from-amber-600 to-amber-400': 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                    }`}
                    style={{ width: `${riskScore}%` }}
                  />
                </div>
                <p className="text-xs text-center text-zinc-500">
                  {riskScore > 70 ? '🔴 Critical risk — crisis likely' : riskScore > 40 ? '🟡 Elevated risk — instability possible' : '🟢 Low risk — stable conditions'}
                </p>
              </div>

              {/* Macro Indicators Summary */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2">
                  <BarChart2 size={14} className="text-sky-400" />
                  Indicator Summary
                </h3>
                <div className="space-y-2">
                  {sliders.map((s) => (
                    <div key={`sum-${s.id}`} className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500">{s.label}</span>
                      <span className={`text-xs font-mono font-semibold ${s.color}`}>{s.value}{s.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Generated Scenarios */}
          {generated && (
            <div className="space-y-4 animate-fadeInUp">
              <div className="flex items-center gap-2">
                <Cpu size={15} className="text-emerald-400" />
                <h2 className="text-sm font-semibold text-zinc-200">Generated Crisis Scenarios</h2>
                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-400">AI Generated</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedScenarios.map((scenario) => (
                  <div key={scenario.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-sm font-bold text-zinc-100">{scenario.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${severityColors[scenario.severity]}`}>
                        {scenario.severity}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-3">{scenario.description}</p>
                    <div className="space-y-1.5 mb-4">
                      {scenario.impacts.map((impact, i) => (
                        <div key={`impact-${scenario.id}-${i}`} className="flex items-center gap-2 text-xs">
                          <TrendingDown size={10} className="text-red-400 flex-shrink-0" />
                          <span className="text-zinc-400">{impact}</span>
                        </div>
                      ))}
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl hover:bg-emerald-500/20 transition-colors">
                      <Play size={12} />
                      Simulate This Crisis
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!generated && !generating && (
            <div className="text-center py-12 bg-zinc-900/50 border border-zinc-800 border-dashed rounded-2xl">
              <Cpu size={32} className="mx-auto mb-3 text-zinc-700" />
              <p className="text-sm text-zinc-500 mb-1">Configure macroeconomic conditions above</p>
              <p className="text-xs text-zinc-600">Then click "Generate Crisis" to create a custom simulation scenario</p>
            </div>
          )}

          {generating && (
            <div className="text-center py-12 bg-zinc-900/50 border border-emerald-500/20 rounded-2xl animate-pulse">
              <Cpu size={32} className="mx-auto mb-3 text-emerald-400" />
              <p className="text-sm text-emerald-400 font-medium mb-1">Analysing macroeconomic conditions...</p>
              <p className="text-xs text-zinc-500">Generating crisis scenarios based on your parameters</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
