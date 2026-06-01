'use client';
import React, { useState } from 'react';
import { Trophy, TrendingUp, Star, Medal } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  xp: number;
  accuracy: number;
  completed: number;
  change: 'up' | 'down' | 'same';
  isYou?: boolean;
}

const globalEntries: LeaderboardEntry[] = [
  { id: 'lb-001', rank: 1, name: 'Priya Nair', xp: 9420, accuracy: 91, completed: 20, change: 'same' },
  { id: 'lb-002', rank: 2, name: 'Marcus Osei', xp: 8750, accuracy: 88, completed: 18, change: 'up' },
  { id: 'lb-003', rank: 3, name: 'Yuki Tanaka', xp: 8210, accuracy: 85, completed: 17, change: 'down' },
  { id: 'lb-004', rank: 4, name: 'Aisha Rahman', xp: 7890, accuracy: 84, completed: 16, change: 'up' },
  { id: 'lb-005', rank: 5, name: 'Tom Hargreaves', xp: 7340, accuracy: 82, completed: 15, change: 'same' },
  { id: 'lb-006', rank: 6, name: 'Sofia Mendes', xp: 6980, accuracy: 80, completed: 14, change: 'up' },
  { id: 'lb-007', rank: 7, name: 'Chen Wei', xp: 6540, accuracy: 79, completed: 13, change: 'down' },
  { id: 'lb-008', rank: 8, name: 'Olivia Patel', xp: 5920, accuracy: 77, completed: 12, change: 'same' },
  { id: 'lb-009', rank: 42, name: 'You', xp: 4820, accuracy: 78, completed: 11, change: 'up', isYou: true },
];

const weeklyEntries: LeaderboardEntry[] = [
  { id: 'wk-001', rank: 1, name: 'Marcus Osei', xp: 1240, accuracy: 92, completed: 3, change: 'up' },
  { id: 'wk-002', rank: 2, name: 'You', xp: 980, accuracy: 85, completed: 2, change: 'up', isYou: true },
  { id: 'wk-003', rank: 3, name: 'Priya Nair', xp: 870, accuracy: 88, completed: 2, change: 'down' },
  { id: 'wk-004', rank: 4, name: 'Aisha Rahman', xp: 760, accuracy: 80, completed: 2, change: 'same' },
  { id: 'wk-005', rank: 5, name: 'Tom Hargreaves', xp: 620, accuracy: 75, completed: 1, change: 'same' },
  { id: 'wk-006', rank: 6, name: 'Yuki Tanaka', xp: 540, accuracy: 78, completed: 1, change: 'down' },
  { id: 'wk-007', rank: 7, name: 'Sofia Mendes', xp: 480, accuracy: 72, completed: 1, change: 'up' },
];

export default function LeaderboardPanel() {
  const [tab, setTab] = useState<'global' | 'weekly'>('global');
  const entries = tab === 'global' ? globalEntries : weeklyEntries;

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Medal size={14} className="text-amber-400" />;
    if (rank === 2) return <Medal size={14} className="text-zinc-400" />;
    if (rank === 3) return <Medal size={14} className="text-amber-600" />;
    return null;
  };

  const getChangeIcon = (change: LeaderboardEntry['change']) => {
    if (change === 'up') return <span className="text-emerald-400 text-xs">↑</span>;
    if (change === 'down') return <span className="text-red-400 text-xs">↓</span>;
    return <span className="text-zinc-600 text-xs">—</span>;
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden sticky top-6">
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={16} className="text-amber-400" />
          <h3 className="text-sm font-semibold text-zinc-100">Leaderboard</h3>
        </div>
        <div className="flex bg-zinc-800 rounded-lg p-0.5">
          {(['global', 'weekly'] as const).map((t) => (
            <button
              key={`lb-tab-${t}`}
              onClick={() => setTab(t)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
                tab === t ? 'bg-zinc-700 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {t === 'global' ? 'All-Time' : 'This Week'}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-zinc-800/60">
        {entries.map((entry, idx) => (
          <div
            key={entry.id}
            className={`flex items-center gap-3 px-4 py-3 transition-colors ${
              entry.isYou ? 'bg-emerald-500/5 border-l-2 border-emerald-500' : 'hover:bg-zinc-800/40'
            }`}
          >
            {/* Rank */}
            <div className="w-6 flex items-center justify-center">
              {getRankIcon(entry.rank) || (
                <span className={`text-xs font-mono font-semibold ${entry.isYou ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {entry.rank}
                </span>
              )}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold truncate ${entry.isYou ? 'text-emerald-400' : 'text-zinc-300'}`}>
                {entry.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-zinc-600 font-mono">{entry.accuracy}% acc</span>
                <span className="text-xs text-zinc-700">·</span>
                <span className="text-xs text-zinc-600">{entry.completed} done</span>
              </div>
            </div>

            {/* XP + change */}
            <div className="flex flex-col items-end gap-0.5">
              <div className="flex items-center gap-1">
                <Star size={10} className="text-amber-400" />
                <span className="text-xs font-mono font-semibold text-zinc-300 tabular-nums">
                  {entry.xp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </span>
              </div>
              {getChangeIcon(entry.change)}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-2 p-2.5 bg-zinc-800/50 rounded-lg">
          <TrendingUp size={14} className="text-emerald-400" />
          <div className="flex-1">
            <p className="text-xs text-zinc-400">Your rank moved up <span className="text-emerald-400 font-semibold">+6 places</span> this week</p>
          </div>
        </div>
      </div>
    </div>
  );
}