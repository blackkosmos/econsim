'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Trophy, Star, Flame, Target, Award, Zap, ChevronUp, ChevronDown,  } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  accuracy: number;
  streak: number;
  scenariosCompleted: number;
  badges: string[];
  change: 'up' | 'down' | 'same';
  changeAmount: number;
  isCurrentUser?: boolean;
}

const allTimeData: LeaderboardEntry[] = [
  { rank: 1, name: 'Priya Sharma', avatar: 'PS', level: 24, xp: 48200, accuracy: 91, streak: 47, scenariosCompleted: 38, badges: ['🏆', '🔥', '⚡'], change: 'same', changeAmount: 0 },
  { rank: 2, name: 'Marcus Chen', avatar: 'MC', level: 22, xp: 43800, accuracy: 88, streak: 31, scenariosCompleted: 35, badges: ['🥈', '📈', '🎯'], change: 'up', changeAmount: 1 },
  { rank: 3, name: 'Aisha Okonkwo', avatar: 'AO', level: 21, xp: 41200, accuracy: 86, streak: 28, scenariosCompleted: 33, badges: ['🥉', '💡', '🌍'], change: 'down', changeAmount: 1 },
  { rank: 4, name: 'James Whitfield', avatar: 'JW', level: 19, xp: 37600, accuracy: 84, streak: 22, scenariosCompleted: 30, badges: ['📊', '🎓'], change: 'up', changeAmount: 2 },
  { rank: 5, name: 'Sofia Reyes', avatar: 'SR', level: 18, xp: 34100, accuracy: 82, streak: 19, scenariosCompleted: 28, badges: ['💰', '🔬'], change: 'same', changeAmount: 0 },
  { rank: 6, name: 'Liam Nakamura', avatar: 'LN', level: 17, xp: 31500, accuracy: 79, streak: 15, scenariosCompleted: 25, badges: ['📉', '🌐'], change: 'up', changeAmount: 1 },
  { rank: 7, name: 'You', avatar: 'YO', level: 7, xp: 4820, accuracy: 78, streak: 14, scenariosCompleted: 6, badges: ['🎯'], change: 'up', changeAmount: 3, isCurrentUser: true },
];

const weeklyData: LeaderboardEntry[] = [
  { rank: 1, name: 'Liam Nakamura', avatar: 'LN', level: 17, xp: 2840, accuracy: 85, streak: 15, scenariosCompleted: 4, badges: ['🔥', '⚡'], change: 'up', changeAmount: 5 },
  { rank: 2, name: 'You', avatar: 'YO', level: 7, xp: 1960, accuracy: 78, streak: 14, scenariosCompleted: 3, badges: ['🎯'], change: 'up', changeAmount: 4, isCurrentUser: true },
  { rank: 3, name: 'Priya Sharma', avatar: 'PS', level: 24, xp: 1820, accuracy: 91, streak: 47, scenariosCompleted: 2, badges: ['🏆'], change: 'down', changeAmount: 2 },
  { rank: 4, name: 'Marcus Chen', avatar: 'MC', level: 22, xp: 1640, accuracy: 88, streak: 31, scenariosCompleted: 2, badges: ['📈'], change: 'same', changeAmount: 0 },
  { rank: 5, name: 'Sofia Reyes', avatar: 'SR', level: 18, xp: 1420, accuracy: 82, streak: 19, scenariosCompleted: 2, badges: ['💰'], change: 'up', changeAmount: 1 },
];

const achievements = [
  { id: 'ach-1', icon: '🏆', name: 'Crisis Master', desc: 'Complete 10 scenarios', earned: false, progress: 6, total: 10 },
  { id: 'ach-2', icon: '🔥', name: 'On Fire', desc: '14-day prediction streak', earned: true, progress: 14, total: 14 },
  { id: 'ach-3', icon: '🎯', name: 'Sharp Analyst', desc: 'Achieve 80%+ accuracy', earned: false, progress: 78, total: 80 },
  { id: 'ach-4', icon: '⚡', name: 'Speed Economist', desc: 'Complete scenario in <20 min', earned: false, progress: 0, total: 1 },
  { id: 'ach-5', icon: '🌍', name: 'Global Crisis Expert', desc: 'Complete all 5 historical crises', earned: false, progress: 3, total: 5 },
  { id: 'ach-6', icon: '📈', name: 'Bull Market', desc: 'Score 100% on any scenario', earned: false, progress: 0, total: 1 },
];

const rankColors: Record<number, string> = {
  1: 'text-amber-400',
  2: 'text-zinc-300',
  3: 'text-amber-600',
};

export default function LeaderboardPage() {
  const [tab, setTab] = useState<'weekly' | 'alltime'>('alltime');
  const data = tab === 'alltime' ? allTimeData : weeklyData;

  return (
    <AppLayout>
      <div className="min-h-screen bg-zinc-950">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-8 py-8 space-y-8">

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <Trophy size={20} className="text-amber-400" />
                </div>
                <h1 className="text-2xl font-bold text-zinc-100">Leaderboard</h1>
              </div>
              <p className="text-sm text-zinc-500">Compete with economists worldwide. Climb the ranks through accurate predictions.</p>
            </div>
            <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
              <button
                onClick={() => setTab('alltime')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${tab === 'alltime' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                All Time
              </button>
              <button
                onClick={() => setTab('weekly')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${tab === 'weekly' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                This Week
              </button>
            </div>
          </div>

          {/* Top 3 Podium */}
          <div className="grid grid-cols-3 gap-4">
            {[data[1], data[0], data[2]].filter(Boolean).map((entry, idx) => {
              const podiumPos = [2, 1, 3][idx];
              const heights = ['h-28', 'h-36', 'h-24'];
              const glows = ['shadow-zinc-400/10', 'shadow-amber-400/20', 'shadow-amber-600/10'];
              const borders = ['border-zinc-600/30', 'border-amber-500/40', 'border-amber-600/30'];
              return (
                <div key={`podium-${entry.rank}`} className={`flex flex-col items-center gap-3 p-5 bg-zinc-900 border ${borders[idx]} rounded-2xl shadow-lg ${glows[idx]} ${entry.isCurrentUser ? 'ring-1 ring-emerald-500/30' : ''}`}>
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold ${entry.isCurrentUser ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-200 border border-zinc-700'}`}>
                      {entry.avatar}
                    </div>
                    {podiumPos <= 3 && (
                      <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${podiumPos === 1 ? 'bg-amber-500 text-zinc-950' : podiumPos === 2 ? 'bg-zinc-400 text-zinc-950' : 'bg-amber-700 text-zinc-100'}`}>
                        {podiumPos}
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-zinc-200">{entry.name}</p>
                    <p className="text-xs text-zinc-500">Lv. {entry.level}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-amber-400" />
                    <span className="text-sm font-mono font-bold text-amber-400">{entry.xp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                  </div>
                  <div className={`${heights[idx]} w-full bg-zinc-800/50 rounded-lg flex items-end justify-center pb-2`}>
                    <span className={`text-2xl font-black ${rankColors[podiumPos] ?? 'text-zinc-400'}`}>#{podiumPos}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rankings Table */}
            <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-200">Full Rankings</h2>
                <span className="text-xs text-zinc-500">{tab === 'alltime' ? 'All time XP' : 'XP this week'}</span>
              </div>
              <div className="divide-y divide-zinc-800/60">
                {data.map((entry) => (
                  <div
                    key={`rank-${entry.rank}-${entry.name}`}
                    className={`flex items-center gap-4 px-5 py-3.5 transition-colors ${entry.isCurrentUser ? 'bg-emerald-500/5 border-l-2 border-emerald-500/40' : 'hover:bg-zinc-800/40'}`}
                  >
                    {/* Rank */}
                    <div className="w-8 text-center flex-shrink-0">
                      {entry.rank <= 3 ? (
                        <span className={`text-lg ${rankColors[entry.rank]}`}>
                          {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                        </span>
                      ) : (
                        <span className="text-sm font-mono text-zinc-500">#{entry.rank}</span>
                      )}
                    </div>

                    {/* Change indicator */}
                    <div className="w-6 flex-shrink-0">
                      {entry.change === 'up' && <ChevronUp size={14} className="text-emerald-400" />}
                      {entry.change === 'down' && <ChevronDown size={14} className="text-red-400" />}
                      {entry.change === 'same' && <span className="text-zinc-600 text-xs">—</span>}
                    </div>

                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${entry.isCurrentUser ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-300 border border-zinc-700'}`}>
                      {entry.avatar}
                    </div>

                    {/* Name + badges */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold truncate ${entry.isCurrentUser ? 'text-emerald-400' : 'text-zinc-200'}`}>
                          {entry.name}
                        </span>
                        <span className="text-xs text-zinc-600">Lv.{entry.level}</span>
                        <div className="flex gap-0.5">
                          {entry.badges.slice(0, 2).map((b, i) => (
                            <span key={`badge-${entry.rank}-${i}`} className="text-xs">{b}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-zinc-500">
                        <span className="flex items-center gap-1"><Flame size={10} className="text-orange-400" />{entry.streak}d</span>
                        <span className="flex items-center gap-1"><Target size={10} className="text-emerald-400" />{entry.accuracy}%</span>
                        <span>{entry.scenariosCompleted} scenarios</span>
                      </div>
                    </div>

                    {/* XP */}
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 justify-end">
                        <Star size={11} className="text-amber-400" />
                        <span className="text-sm font-mono font-bold text-amber-400">{entry.xp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                      </div>
                      <span className="text-xs text-zinc-600">XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements Panel */}
            <div className="space-y-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Award size={15} className="text-violet-400" />
                  <h2 className="text-sm font-semibold text-zinc-200">Your Achievements</h2>
                </div>
                <div className="space-y-3">
                  {achievements.map((ach) => (
                    <div key={ach.id} className={`p-3 rounded-xl border transition-all ${ach.earned ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-800/30'}`}>
                      <div className="flex items-start gap-3">
                        <span className={`text-xl ${ach.earned ? '' : 'grayscale opacity-50'}`}>{ach.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-xs font-semibold ${ach.earned ? 'text-zinc-200' : 'text-zinc-400'}`}>{ach.name}</p>
                            {ach.earned && <span className="text-xs text-emerald-400">✓</span>}
                          </div>
                          <p className="text-xs text-zinc-600 mt-0.5">{ach.desc}</p>
                          {!ach.earned && (
                            <div className="mt-1.5">
                              <div className="h-1 bg-zinc-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all"
                                  style={{ width: `${Math.min(100, (ach.progress / ach.total) * 100)}%` }}
                                />
                              </div>
                              <p className="text-xs text-zinc-600 mt-0.5">{ach.progress}/{ach.total}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Level Progress */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={15} className="text-emerald-400" />
                  <h2 className="text-sm font-semibold text-zinc-200">Level Progress</h2>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                    <span className="text-lg font-black text-emerald-400">7</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-zinc-200">Macro Analyst</p>
                    <p className="text-xs text-zinc-500">4,820 / 6,000 XP to Level 8</p>
                  </div>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-300 rounded-full" style={{ width: '80%' }} />
                </div>
                <p className="text-xs text-zinc-600 mt-1.5">1,180 XP remaining</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
