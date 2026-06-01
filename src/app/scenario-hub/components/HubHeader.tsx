'use client';
import React, { useState } from 'react';
import { Flame, Star, Target, Trophy, TrendingUp, BookOpen } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const stats = [
  { key: 'stat-xp', label: 'Total XP', value: '4,820', icon: Star, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { key: 'stat-streak', label: 'Day Streak', value: '14', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  { key: 'stat-accuracy', label: 'Avg. Accuracy', value: '78%', icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { key: 'stat-rank', label: 'Global Rank', value: '#42', icon: Trophy, color: 'text-violet-400', bg: 'bg-violet-400/10' },
  { key: 'stat-completed', label: 'Completed', value: '11 / 24', icon: BookOpen, color: 'text-sky-400', bg: 'bg-sky-400/10' },
  { key: 'stat-return', label: 'Portfolio Return', value: '+12.4%', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
];

export default function HubHeader() {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">Crises</h1>
          <p className="text-sm text-zinc-400 mt-0.5">Choose an economic scenario to simulate. Analyse, predict, and invest.</p>
        </div>
        <div className="flex items-center gap-2 bg-zinc-800/60 border border-zinc-700/50 rounded-lg px-3 py-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-xs text-zinc-400">Markets open</span>
          <span className="text-xs font-mono text-zinc-300">13 Apr 2026</span>
        </div>
      </div>
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {stats?.map((stat) => {
          const Icon = stat?.icon;
          return (
            <div key={stat?.key} className={`${stat?.bg} border border-zinc-700/50 rounded-xl p-3 flex flex-col gap-1.5`}>
              <div className="flex items-center gap-1.5">
                <Icon size={14} className={stat?.color} />
                <span className="text-xs text-zinc-500 font-medium">{stat?.label}</span>
              </div>
              <span className={`text-xl font-bold font-mono tabular-nums ${stat?.color}`}>{stat?.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}