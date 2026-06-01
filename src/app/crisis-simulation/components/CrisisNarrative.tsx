'use client';
import React from 'react';
import { FileText, ChevronRight } from 'lucide-react';

interface Props {
  narrative: string;
  stepCount: number;
}

export default function CrisisNarrative({ narrative, stepCount }: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3 animate-fadeInUp">
      <div className="flex items-center gap-2">
        <FileText size={14} className="text-red-400" />
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
          {stepCount === 0 ? 'Crisis Briefing' : 'Original Briefing'}
        </span>
      </div>
      <p className="text-zinc-300 text-sm leading-relaxed">{narrative}</p>
      {stepCount === 0 && (
        <div className="flex items-center gap-1.5 text-xs text-red-400/80 pt-1">
          <ChevronRight size={12} />
          <span>Select a policy response below to begin managing the crisis.</span>
        </div>
      )}
    </div>
  );
}
