'use client';
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Globe, Shield, Activity } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const kpis = [
  {
    id: 'kpi-value', label: 'Portfolio Value', value: '$124,830', change: '+$13,842', pct: '+12.4%',
    trend: 'up', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20',
  },
  {
    id: 'kpi-return', label: 'Total Return', value: '+12.4%', change: '+2.1% this week', pct: '',
    trend: 'up', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20',
  },
  {
    id: 'kpi-exposure', label: 'International Exposure', value: '68%', change: '12 countries', pct: '',
    trend: 'neutral', icon: Globe, color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'border-sky-400/20',
  },
  {
    id: 'kpi-risk', label: 'Portfolio Volatility', value: '18.4%', change: '↑ from 14.2%', pct: '',
    trend: 'down', icon: Activity, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20',
  },
  {
    id: 'kpi-div', label: 'Diversification Score', value: '6.8/10', change: 'Moderate risk', pct: '',
    trend: 'neutral', icon: Shield, color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/20',
  },
];

export default function PortfolioHeader() {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">Portfolio Management</h1>
          <p className="text-sm text-zinc-400 mt-0.5">Manage your international investment portfolio. Allocate capital based on scenario insights.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
            <Activity size={14} className="text-amber-400" />
            <span className="text-xs text-amber-400 font-medium">Crisis scenario active</span>
          </div>
          <div className="flex items-center gap-2 bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-3 py-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-zinc-400 font-mono">Updated 2 min ago</span>
          </div>
        </div>
      </div>
      {/* 5 KPI cards — grid-cols-5, fills row perfectly */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {kpis?.map((kpi) => {
          const Icon = kpi?.icon;
          return (
            <div key={kpi?.id} className={`${kpi?.bg} border ${kpi?.border} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} className={kpi?.color} />
                <span className="text-xs text-zinc-500 font-medium">{kpi?.label}</span>
              </div>
              <div className={`text-xl font-bold font-mono tabular-nums ${kpi?.color}`}>{kpi?.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {kpi?.trend === 'up' && <TrendingUp size={11} className="text-emerald-400" />}
                {kpi?.trend === 'down' && <TrendingDown size={11} className="text-red-400" />}
                <span className="text-xs text-zinc-600">{kpi?.change}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}