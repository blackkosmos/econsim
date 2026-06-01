'use client';
import React from 'react';
import { Shield, AlertTriangle, TrendingDown, Globe, Info, ChevronRight } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

const riskData = [{ name: 'Risk', value: 68, fill: '#fbbf24' }];

const riskFactors = [
  { id: 'rf-001', label: 'Concentration Risk', score: 7, desc: '42% in US assets — consider diversifying', severity: 'high' },
  { id: 'rf-002', label: 'Currency Exposure', score: 5, desc: '58% USD-denominated holdings', severity: 'medium' },
  { id: 'rf-003', label: 'Sector Correlation', score: 6, desc: 'Financials & ETFs move together in crisis', severity: 'medium' },
  { id: 'rf-004', label: 'Liquidity Risk', score: 3, desc: 'Most holdings are exchange-traded', severity: 'low' },
  { id: 'rf-005', label: 'Duration Risk', score: 4, desc: 'Bond portfolio has 5–10Y average duration', severity: 'low' },
];

const scenarioInsights = [
  { id: 'si-001', text: 'Your US Treasury allocation (+22%) is well-positioned for a flight-to-safety shock.', positive: true },
  { id: 'si-002', text: 'SPY and FXI positions are highly exposed to the crisis scenario — consider reducing.', positive: false },
  { id: 'si-003', text: 'Gold holdings provide good inflation and crisis hedge — maintain or increase.', positive: true },
  { id: 'si-004', text: 'EM equity exposure (INDA, EWJ) faces capital outflow risk as USD strengthens.', positive: false },
];

const severityColors: Record<string, string> = {
  high: 'text-red-400',
  medium: 'text-amber-400',
  low: 'text-emerald-400',
};

const severityBg: Record<string, string> = {
  high: 'bg-red-400/10 border-red-400/20',
  medium: 'bg-amber-400/10 border-amber-400/20',
  low: 'bg-emerald-400/10 border-emerald-400/20',
};

export default function RiskPanel() {
  return (
    <div className="space-y-4 sticky top-6">
      {/* Risk Score Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={15} className="text-amber-400" />
          <h3 className="text-sm font-semibold text-zinc-200">Portfolio Risk Score</h3>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-24 h-24 flex-shrink-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius={28} outerRadius={44} data={riskData} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" background={{ fill: '#27272a' }} cornerRadius={4} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold font-mono text-amber-400">68</span>
              <span className="text-xs text-zinc-600">/100</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-400 mb-1">Moderate-High Risk</p>
            <p className="text-xs text-zinc-500 leading-relaxed">Your portfolio carries elevated risk during the current crisis scenario.</p>
          </div>
        </div>

        <div className="space-y-2">
          {riskFactors.map((rf) => (
            <div key={rf.id} className={`p-2.5 rounded-lg border ${severityBg[rf.severity]}`}>
              <div className="flex items-center justify-between mb-0.5">
                <span className={`text-xs font-semibold ${severityColors[rf.severity]}`}>{rf.label}</span>
                <span className={`text-xs font-mono font-bold ${severityColors[rf.severity]}`}>{rf.score}/10</span>
              </div>
              <p className="text-xs text-zinc-600 leading-snug">{rf.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scenario Insights */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Info size={15} className="text-sky-400" />
          <h3 className="text-sm font-semibold text-zinc-200">Crisis Scenario Insights</h3>
        </div>
        <div className="space-y-2.5">
          {scenarioInsights.map((si) => (
            <div key={si.id} className={`flex items-start gap-2.5 p-2.5 rounded-lg border ${si.positive ? 'bg-emerald-500/5 border-emerald-500/15' : 'bg-red-500/5 border-red-500/15'}`}>
              {si.positive
                ? <TrendingDown size={13} className="text-emerald-400 flex-shrink-0 mt-0.5 rotate-180" />
                : <AlertTriangle size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
              }
              <p className={`text-xs leading-relaxed ${si.positive ? 'text-emerald-300/80' : 'text-red-300/80'}`}>{si.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Push/Pull Factor Legend */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Globe size={15} className="text-violet-400" />
          <h3 className="text-sm font-semibold text-zinc-200">Push/Pull Factors</h3>
        </div>
        <div className="space-y-2 text-xs text-zinc-500">
          <p className="leading-relaxed">
            <span className="font-semibold text-zinc-400">Push factors</span> drive capital out of a country (e.g. rising US rates push capital from EMs).
          </p>
          <p className="leading-relaxed">
            <span className="font-semibold text-zinc-400">Pull factors</span> attract capital into a country (e.g. strong UK growth pulls foreign investment).
          </p>
          <div className="flex items-center gap-4 pt-2 border-t border-zinc-800">
            <span className="flex items-center gap-1 text-emerald-400">↑ Favourable</span>
            <span className="flex items-center gap-1 text-red-400">↓ Unfavourable</span>
            <span className="flex items-center gap-1 text-zinc-500">→ Neutral</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/scenario-hub"
        className="flex items-center justify-between w-full px-4 py-3 bg-zinc-800/60 border border-zinc-700/50 rounded-xl text-sm text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-all duration-150 group"
      >
        <span>Try another scenario</span>
        <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}