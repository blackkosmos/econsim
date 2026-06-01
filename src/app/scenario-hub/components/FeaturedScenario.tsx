'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Clock, Star, Globe, TrendingDown, ChevronRight } from 'lucide-react';

export default function FeaturedScenario() {
  const router = useRouter();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/20 via-zinc-900 to-zinc-900 p-6 animate-pulseGlow">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-12 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="flex items-start gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-amber-400/15 text-amber-400 text-xs font-semibold rounded-full border border-amber-400/30 uppercase tracking-wide">
            Featured
          </span>
          <span className="px-2 py-0.5 bg-red-500/15 text-red-400 text-xs font-semibold rounded-full border border-red-500/30 uppercase tracking-wide">
            Expert
          </span>
          <span className="px-2 py-0.5 bg-zinc-700/60 text-zinc-300 text-xs font-semibold rounded-full border border-zinc-600/50">
            Banking Crisis
          </span>
        </div>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={20} className="text-red-400" />
            <h2 className="text-xl font-bold text-zinc-100">2008 Global Financial Crisis</h2>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-xl mb-4">
            Lehman Brothers has collapsed. Credit markets are freezing. The Fed faces a choice between emergency rate cuts and moral hazard. 
            Analyse the contagion risk, predict which sectors collapse first, and protect your portfolio from systemic failure.
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-zinc-400 mb-5">
            <div className="flex items-center gap-1.5">
              <Globe size={14} className="text-sky-400" />
              <span>United States · Global</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-zinc-500" />
              <span>~45 min</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star size={14} className="text-amber-400" />
              <span className="text-amber-400 font-semibold font-mono">+850 XP</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {['Monetary Policy', 'Systemic Risk', 'Capital Flows', 'Credit Markets', 'Contagion']?.map((tag) => (
              <span key={`ftag-${tag}`} className="px-2 py-0.5 bg-zinc-800/80 text-zinc-400 text-xs rounded-md border border-zinc-700/50">
                {tag}
              </span>
            ))}
          </div>

          <button
            onClick={() => router?.push('/scenario-simulation')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-semibold rounded-lg transition-all duration-150 active:scale-95"
          >
            <Zap size={16} />
            Start Simulation
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="hidden lg:flex flex-col gap-3 min-w-[160px]">
          {[
            { label: 'S&P 500 Impact', value: '-38.5%', color: 'text-red-400' },
            { label: 'Fed Funds Rate', value: '0.25%', color: 'text-sky-400' },
            { label: 'Unemployment', value: '10.0%', color: 'text-amber-400' },
            { label: 'GDP Growth', value: '-4.3%', color: 'text-red-400' },
          ]?.map((item) => (
            <div key={`fi-${item?.label}`} className="bg-zinc-800/50 rounded-lg px-3 py-2 border border-zinc-700/40">
              <p className="text-xs text-zinc-500 mb-0.5">{item?.label}</p>
              <p className={`text-base font-bold font-mono tabular-nums ${item?.color}`}>{item?.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}