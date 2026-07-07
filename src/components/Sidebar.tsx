'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { LayoutGrid, ShieldAlert, BookOpen, ChevronLeft, ChevronRight, Star, Flame, Target,  } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const navItems = [
  { key: 'nav-crises', href: '/crises', icon: LayoutGrid, label: 'Crises', badge: null },
  { key: 'nav-crisis', href: '/crisis-lab', icon: ShieldAlert, label: 'Crises Lab', badge: 'New' },
  { key: 'nav-theory', href: '/theory-bank', icon: BookOpen, label: 'Theory Bank', badge: null },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`
        flex flex-col bg-zinc-900 border-r border-zinc-800 h-screen
        transition-all duration-300 ease-in-out flex-shrink-0
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center h-16 px-3 border-b border-zinc-800 ${collapsed ? 'justify-center' : 'gap-2'}`}>
        <Link href="/" className={`flex items-center gap-2 cursor-pointer ${collapsed ? '' : ''}`}>
          <AppLogo size={32} />
          {!collapsed && (
            <span className="font-semibold text-base text-zinc-100 tracking-tight">
              MacroHub
            </span>
          )}
        </Link>
      </div>
      {/* Student Stats Strip */}
      {!collapsed && (
        <div className="mx-3 mt-3 p-3 bg-zinc-800/60 rounded-lg border border-zinc-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400 font-medium">Your Progress</span>
            <span className="text-xs font-mono text-emerald-400 font-semibold">Lv. 1</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 text-amber-400">
              <Flame size={12} />
              <span className="font-mono font-semibold">0</span>
              <span className="text-zinc-500">streak</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400">
              <Star size={12} />
              <span className="font-mono font-semibold">0</span>
              <span className="text-zinc-500">XP</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-zinc-500 mb-1">
              <span>XP to Lv.2</span>
              <span className="font-mono">0 / 1,000</span>
            </div>
            <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full" style={{ width: '0%' }} />
            </div>
          </div>
        </div>
      )}
      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto scrollbar-thin">
        {!collapsed && (
          <p className="text-xs font-medium text-zinc-600 uppercase tracking-widest px-2 mb-2">Navigation</p>
        )}
        {navItems?.map((item) => {
          const isActive = pathname === item?.href || (item?.href !== '/' && pathname?.startsWith(item?.href));
          const Icon = item?.icon;
          return (
            <Link
              key={item?.key}
              href={item?.href}
              title={collapsed ? item?.label : undefined}
              className={`
                flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-150 group relative
                ${isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 border border-transparent'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <Icon size={18} className={`flex-shrink-0 ${isActive ? 'text-emerald-400' : ''}`} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item?.label}</span>
                  {item?.badge && (
                    <span className="bg-emerald-500/20 text-emerald-400 text-xs font-mono px-1.5 py-0.5 rounded-full">
                      {item?.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && item?.badge && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>
      {/* Accuracy badge */}
      {!collapsed && (
        <div className="mx-3 mb-3 p-2.5 bg-zinc-800/40 rounded-lg border border-zinc-700/40">
          <div className="flex items-center gap-2">
            <Target size={14} className="text-emerald-400" />
            <div className="flex-1">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Prediction Accuracy</span>
                <span className="font-mono text-emerald-400 font-semibold">78%</span>
              </div>
              <div className="mt-1 h-1 bg-zinc-700 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Collapse toggle */}
      <div className="p-2 border-t border-zinc-800">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all duration-150"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : (
            <span className="flex items-center gap-2 text-xs">
              <ChevronLeft size={16} />
              <span>Collapse</span>
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}