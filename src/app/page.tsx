'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';


// ─── Animated ticker data ────────────────────────────────────────────────────
const TICKER_ITEMS = [
  { label: 'GDP Growth', value: '+2.4%', up: true },
  { label: 'Inflation', value: '3.1%', up: false },
  { label: 'Unemployment', value: '4.2%', up: false },
  { label: 'Interest Rate', value: '5.25%', up: true },
  { label: 'Consumer Confidence', value: '98.7', up: true },
  { label: 'Trade Balance', value: '-$67B', up: false },
  { label: 'M2 Money Supply', value: '+6.8%', up: true },
  { label: 'Bond Yield 10Y', value: '4.31%', up: true },
  { label: 'Exchange Rate', value: '1.082', up: false },
  { label: 'Fiscal Deficit', value: '-3.9%', up: false },
];

// ─── Feature cards ────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: '⚡',
    title: 'Learn Through Simulation',
    desc: 'Engage with economic systems as they unfold — not as static diagrams frozen in a textbook.',
    span: 'col-span-1 row-span-1',
  },
  {
    icon: '🧠',
    title: 'Build Economic Intuition',
    desc: 'Develop the instinct to read economic signals, anticipate consequences, and reason under uncertainty.',
    span: 'col-span-1 row-span-2',
  },
  {
    icon: '🔗',
    title: 'Connect Theory to Reality',
    desc: 'See how Keynesian multipliers, monetary transmission, and fiscal policy play out in real conditions.',
    span: 'col-span-1 row-span-1',
  },
  {
    icon: '🌊',
    title: 'Understand Cause and Effect',
    desc: 'Trace how a single policy decision ripples through inflation, employment, growth, and confidence.',
    span: 'col-span-2 row-span-1',
  },
  {
    icon: '🎯',
    title: 'Develop Critical Thinking',
    desc: 'Evaluate competing economic arguments, weigh trade-offs, and form evidence-based positions.',
    span: 'col-span-1 row-span-1',
  },
  {
    icon: '📊',
    title: 'Prepare for Economics Exams',
    desc: 'A-Level, IB, AP, and university students build the analytical depth that top marks demand.',
    span: 'col-span-1 row-span-1',
  },
];

// ─── Floating chart sparkline ─────────────────────────────────────────────────
function Sparkline({ points, color }: { points: number[]; color: string }) {
  const w = 120, h = 40;
  const min = Math.min(...points), max = Math.max(...points);
  const range = max - min || 1;
  const pts = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={pts} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Floating indicator card ──────────────────────────────────────────────────
function FloatingCard({
  label, value, change, points, color, style,
}: {
  label: string; value: string; change: string; points: number[]; color: string; style?: React.CSSProperties;
}) {
  return (
    <div
      className="absolute backdrop-blur-md border rounded-xl px-4 py-3 shadow-2xl"
      style={{
        background: 'rgba(10,20,40,0.75)',
        borderColor: `${color}33`,
        boxShadow: `0 0 24px ${color}22`,
        ...style,
      }}
    >
      <div className="text-xs font-mono text-zinc-400 mb-1">{label}</div>
      <div className="flex items-end gap-3">
        <span className="text-xl font-bold font-mono" style={{ color }}>{value}</span>
        <span className="text-xs font-mono mb-0.5" style={{ color }}>{change}</span>
      </div>
      <Sparkline points={points} color={color} />
    </div>
  );
}

// ─── World map SVG (simplified dot-grid globe) ────────────────────────────────
function WorldMap() {
  const dots: { cx: number; cy: number; r: number; opacity: number }[] = [];
  // Rough continent outlines as dot clusters
  const regions = [
    // North America
    ...Array.from({ length: 60 }, (_, i) => ({ cx: 160 + (i % 10) * 12, cy: 120 + Math.floor(i / 10) * 14, r: 1.5, opacity: 0.5 + (i * 0.007) % 0.4 })),
    // South America
    ...Array.from({ length: 35 }, (_, i) => ({ cx: 220 + (i % 7) * 10, cy: 240 + Math.floor(i / 7) * 14, r: 1.5, opacity: 0.4 + (i * 0.011) % 0.4 })),
    // Europe
    ...Array.from({ length: 40 }, (_, i) => ({ cx: 440 + (i % 8) * 10, cy: 100 + Math.floor(i / 8) * 12, r: 1.5, opacity: 0.5 + (i * 0.009) % 0.4 })),
    // Africa
    ...Array.from({ length: 55 }, (_, i) => ({ cx: 450 + (i % 11) * 10, cy: 180 + Math.floor(i / 11) * 14, r: 1.5, opacity: 0.4 + (i * 0.008) % 0.4 })),
    // Asia
    ...Array.from({ length: 90 }, (_, i) => ({ cx: 560 + (i % 15) * 12, cy: 100 + Math.floor(i / 15) * 14, r: 1.5, opacity: 0.5 + (i * 0.006) % 0.4 })),
    // Oceania
    ...Array.from({ length: 20 }, (_, i) => ({ cx: 700 + (i % 5) * 12, cy: 290 + Math.floor(i / 5) * 14, r: 1.5, opacity: 0.4 + (i * 0.013) % 0.4 })),
  ];
  dots.push(...regions);

  // Connection lines between major financial hubs
  const connections = [
    { x1: 200, y1: 145, x2: 460, y2: 115 }, // NY → London
    { x1: 460, y1: 115, x2: 620, y2: 130 }, // London → Tokyo
    { x1: 620, y1: 130, x2: 200, y2: 145 }, // Tokyo → NY
    { x1: 460, y1: 115, x2: 580, y2: 200 }, // London → Dubai
    { x1: 200, y1: 145, x2: 240, y2: 270 }, // NY → São Paulo
    { x1: 620, y1: 130, x2: 720, y2: 300 }, // Tokyo → Sydney
  ];

  const hubs = [
    { cx: 200, cy: 145, label: 'NEW YORK' },
    { cx: 460, cy: 115, label: 'LONDON' },
    { cx: 620, cy: 130, label: 'TOKYO' },
    { cx: 580, cy: 200, label: 'DUBAI' },
    { cx: 240, cy: 270, label: 'SÃO PAULO' },
    { cx: 720, cy: 300, label: 'SYDNEY' },
  ];

  return (
    <svg viewBox="0 0 900 400" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width="900" height="400" fill="url(#mapGlow)" />
      {/* Dot grid */}
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="#38bdf8" opacity={d.opacity} />
      ))}
      {/* Connection lines */}
      {connections.map((c, i) => (
        <line key={i} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
          stroke="#0ea5e9" strokeWidth="0.8" strokeOpacity="0.35" strokeDasharray="4 6" />
      ))}
      {/* Hub nodes */}
      {hubs.map((h, i) => (
        <g key={i} filter="url(#glow)">
          <circle cx={h.cx} cy={h.cy} r="5" fill="#0ea5e9" opacity="0.9" />
          <circle cx={h.cx} cy={h.cy} r="10" fill="none" stroke="#0ea5e9" strokeWidth="1" opacity="0.4" />
          <text x={h.cx} y={h.cy - 16} textAnchor="middle" fill="#7dd3fc" fontSize="7" fontFamily="JetBrains Mono, monospace" letterSpacing="1">{h.label}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold font-mono text-cyan-400 mb-1">{value}</div>
      <div className="text-sm text-zinc-400 font-medium">{label}</div>
    </div>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // DEBUG: Show which route is loaded and redirect condition status
    const visited = localStorage.getItem('econsim_visited');
    console.log('[EconSim Debug] Route loaded: /');
    console.log('[EconSim Debug] econsim_visited =', visited);
    console.log('[EconSim Debug] Auto-redirect suppressed — landing page always shown. Redirect only fires on explicit CTA click.');

    setMounted(true);
  }, []);

  const handleEnter = () => {
    localStorage.setItem('econsim_visited', 'true');
    console.log('[EconSim Debug] CTA clicked — setting econsim_visited and navigating to /crises');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#020b18] text-white overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Google Font import ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes float-med {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes scan-line {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px #0ea5e944, 0 0 40px #0ea5e922; }
          50% { box-shadow: 0 0 40px #0ea5e966, 0 0 80px #0ea5e933; }
        }
        .animate-ticker { animation: ticker-scroll 40s linear infinite; }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-med { animation: float-med 4.5s ease-in-out infinite; }
        .animate-fade-up { animation: fade-up 0.8s cubic-bezier(0.16,1,0.3,1) forwards; }
        .animate-fade-up-delay-1 { animation: fade-up 0.8s 0.15s cubic-bezier(0.16,1,0.3,1) both; }
        .animate-fade-up-delay-2 { animation: fade-up 0.8s 0.3s cubic-bezier(0.16,1,0.3,1) both; }
        .animate-fade-up-delay-3 { animation: fade-up 0.8s 0.45s cubic-bezier(0.16,1,0.3,1) both; }
        .animate-glow-pulse { animation: glow-pulse 3s ease-in-out infinite; }
        .glass-panel {
          background: rgba(10, 25, 50, 0.6);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(14, 165, 233, 0.15);
        }
        .glass-panel-light {
          background: rgba(14, 30, 60, 0.5);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(14, 165, 233, 0.1);
        }
        .neon-border {
          border: 1px solid rgba(14, 165, 233, 0.4);
          box-shadow: 0 0 20px rgba(14, 165, 233, 0.15), inset 0 0 20px rgba(14, 165, 233, 0.03);
        }
        .btn-primary {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          box-shadow: 0 0 24px rgba(14, 165, 233, 0.4);
          transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
        }
        .btn-primary:hover {
          box-shadow: 0 0 40px rgba(14, 165, 233, 0.6);
          transform: translateY(-2px);
        }
        .btn-ghost {
          background: rgba(14, 165, 233, 0.08);
          border: 1px solid rgba(14, 165, 233, 0.3);
          transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
        }
        .btn-ghost:hover {
          background: rgba(14, 165, 233, 0.15);
          border-color: rgba(14, 165, 233, 0.6);
          transform: translateY(-2px);
        }
        .feature-card {
          background: rgba(10, 25, 50, 0.5);
          border: 1px solid rgba(14, 165, 233, 0.1);
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .feature-card:hover {
          background: rgba(14, 165, 233, 0.08);
          border-color: rgba(14, 165, 233, 0.35);
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(14, 165, 233, 0.12);
        }
        .scan-overlay::after {
          content: '';
          position: absolute;
          left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(14,165,233,0.4), transparent);
          animation: scan-line 4s linear infinite;
          pointer-events: none;
        }
      `}</style>

      {/* ── Top Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-14"
        style={{ background: 'rgba(2,11,24,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(14,165,233,0.1)' }}>
        <div className="flex items-center gap-2">
          <img src="/assets/images/image-1782738716776.png" alt="EconSim Logo" className="h-8 w-auto" />
        </div>
        <div className="flex items-center gap-3">
          <Link href="/crises" onClick={handleEnter}
            className="text-xs font-medium text-zinc-400 hover:text-cyan-400 transition-colors px-3 py-1.5">
            Skip to Crises
          </Link>
          <Link href="/crises" onClick={handleEnter}
            className="btn-primary text-xs font-semibold text-white px-4 py-2 rounded-lg">
            Start Learning →
          </Link>
        </div>
      </nav>

      {/* ── Ticker ── */}
      <div className="fixed top-14 left-0 right-0 z-40 overflow-hidden h-8 flex items-center"
        style={{ background: 'rgba(2,11,24,0.95)', borderBottom: '1px solid rgba(14,165,233,0.08)' }}>
        <div ref={tickerRef} className="animate-ticker flex gap-0 whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-6 text-xs font-mono">
              <span className="text-zinc-500">{item.label}</span>
              <span className={item.up ? 'text-emerald-400' : 'text-red-400'}>{item.value}</span>
              <span className={item.up ? 'text-emerald-500' : 'text-red-500'}>{item.up ? '▲' : '▼'}</span>
              <span className="text-zinc-700 mx-2">|</span>
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          SECTION 1 — HERO
      ════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-20 px-6 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Deep gradient */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(14,165,233,0.08) 0%, transparent 70%)' }} />
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(rgba(14,165,233,1) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        {/* World map */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          <div className="w-full max-w-5xl">
            <WorldMap />
          </div>
        </div>

        {/* Floating indicator cards */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          <div className="animate-float-slow" style={{ position: 'absolute', top: '22%', left: '6%' }}>
            <FloatingCard label="GDP GROWTH" value="+2.4%" change="↑ 0.3%" points={[1.8,2.0,1.9,2.2,2.1,2.4,2.3,2.4]} color="#34d399" />
          </div>
          <div className="animate-float-med" style={{ position: 'absolute', top: '18%', right: '7%' }}>
            <FloatingCard label="INFLATION RATE" value="3.1%" change="↓ 0.2%" points={[4.2,3.9,3.7,3.5,3.3,3.2,3.1,3.1]} color="#f87171" />
          </div>
          <div className="animate-float-slow" style={{ position: 'absolute', bottom: '28%', left: '5%' }}>
            <FloatingCard label="INTEREST RATE" value="5.25%" change="→ hold" points={[4.5,4.75,5.0,5.25,5.25,5.25,5.25,5.25]} color="#0ea5e9" />
          </div>
          <div className="animate-float-med" style={{ position: 'absolute', bottom: '25%', right: '6%' }}>
            <FloatingCard label="UNEMPLOYMENT" value="4.2%" change="↓ 0.1%" points={[5.1,4.9,4.7,4.5,4.4,4.3,4.2,4.2]} color="#a78bfa" />
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-xs font-mono font-medium text-cyan-400"
            style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            A-Level · IB · AP · University Economics
          </div>

          <h1 className="animate-fade-up-delay-1 text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Master Macroeconomics<br />
            <span style={{ background: 'linear-gradient(135deg, #0ea5e9, #38bdf8, #7dd3fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Through Real and Simulated
            </span>
            <br />Economic Crises
          </h1>

          <p className="animate-fade-up-delay-2 text-base md:text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Preparing for A-Level, IB, AP, or university economics exams? Stop memorizing definitions and start understanding how economies actually work through interactive exploration, economic reasoning, and real-world decision making.
          </p>

          <div className="animate-fade-up-delay-3 flex flex-wrap items-center justify-center gap-3">
            <Link href="/crises" onClick={handleEnter}
              className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white">
              Explore Crises
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="relative z-10 mt-20 w-full max-w-3xl mx-auto">
          <div className="glass-panel rounded-2xl px-8 py-6 grid grid-cols-3 gap-6 divide-x divide-zinc-800">
            <AnimatedStat value="6+" label="Economic Crises" />
            <AnimatedStat value="40+" label="Macroeconomic Variables" />
            <AnimatedStat value="100%" label="Exam-Relevant Content" />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 2 — THE PROBLEM
      ════════════════════════════════════════════════════════════ */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 50%, rgba(239,68,68,0.04) 0%, transparent 70%)' }} />

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left: text */}
            <div className="flex-1 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-red-400 mb-6"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                THE PROBLEM
              </div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Economics Was Never Meant to Be Memorized
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-5">
                Many students spend hours memorizing definitions, diagrams, and models without developing an intuitive understanding of how economies behave.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Traditional learning often focuses on remembering information for exams rather than understanding economic cause-and-effect relationships.
              </p>
            </div>

            {/* Right: visual */}
            <div className="flex-1 max-w-lg w-full">
              <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.4), transparent)' }} />
                <div className="text-xs font-mono text-zinc-500 mb-4">TRADITIONAL LEARNING APPROACH</div>
                {/* Simulated dense notes */}
                <div className="space-y-2">
                  {['AD = C + I + G + (X-M)', 'Multiplier = 1 / (1 - MPC)', 'Phillips Curve: π = πe − β(u − un)', 'Fisher Equation: i = r + πe', 'Quantity Theory: MV = PY'].map((formula, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.08)' }}>
                      <span className="w-5 h-5 rounded flex items-center justify-center text-xs font-mono text-red-400 flex-shrink-0"
                        style={{ background: 'rgba(239,68,68,0.1)' }}>{i + 1}</span>
                      <span className="text-xs font-mono text-zinc-300">{formula}</span>
                      <span className="ml-auto text-xs text-zinc-600">memorize</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 p-3 rounded-lg flex items-center gap-3" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}>
                  <span className="text-2xl">😰</span>
                  <div>
                    <div className="text-xs font-semibold text-red-400">Exam in 3 days</div>
                    <div className="text-xs text-zinc-500">47 definitions remaining</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 3 — A BETTER WAY
      ════════════════════════════════════════════════════════════ */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 20% 50%, rgba(14,165,233,0.05) 0%, transparent 70%)' }} />

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            {/* Right: text */}
            <div className="flex-1 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-cyan-400 mb-6"
                style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)' }}>
                A BETTER WAY
              </div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Learn Economics Through Experience
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-5">
                Understanding macroeconomics becomes easier when students actively engage with economic systems instead of passively reading about them.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Build intuition by exploring how different economic variables interact and influence one another.
              </p>
            </div>

            {/* Left: interactive dashboard visual */}
            <div className="flex-1 max-w-lg w-full">
              <div className="glass-panel rounded-2xl p-5 relative overflow-hidden scan-overlay">
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.4), transparent)' }} />
                <div className="text-xs font-mono text-zinc-500 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  INTERACTIVE ECONOMIC DASHBOARD
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {[
                    { label: 'GDP Growth', val: '+2.4%', color: '#34d399', pts: [1.8,2.0,2.1,2.3,2.4] },
                    { label: 'Inflation', val: '3.1%', color: '#f87171', pts: [4.2,3.8,3.5,3.2,3.1] },
                    { label: 'Interest Rate', val: '5.25%', color: '#0ea5e9', pts: [4.5,4.75,5.0,5.25,5.25] },
                    { label: 'Unemployment', val: '4.2%', color: '#a78bfa', pts: [5.1,4.8,4.5,4.3,4.2] },
                  ].map((item, i) => (
                    <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(14,165,233,0.04)', border: '1px solid rgba(14,165,233,0.1)' }}>
                      <div className="text-xs text-zinc-500 mb-1">{item.label}</div>
                      <div className="text-base font-bold font-mono mb-1" style={{ color: item.color }}>{item.val}</div>
                      <Sparkline points={item.pts} color={item.color} />
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-xl flex items-center gap-3" style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.12)' }}>
                  <span className="text-2xl">🎯</span>
                  <div>
                    <div className="text-xs font-semibold text-cyan-400">Prediction Accuracy</div>
                    <div className="text-xs text-zinc-400">You predicted the recession 2 quarters early</div>
                  </div>
                  <span className="ml-auto text-sm font-bold font-mono text-emerald-400">+850 XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 4 — SEE THE BIG PICTURE
      ════════════════════════════════════════════════════════════ */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(14,165,233,0.04) 0%, transparent 70%)' }} />

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-cyan-400 mb-6"
            style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)' }}>
            THE BIG PICTURE
          </div>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            See How Economies Actually Work
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto mb-16 leading-relaxed">
            Explore the relationships between inflation, unemployment, economic growth, interest rates, financial markets, confidence, and government policy. Develop a deeper understanding of how economies evolve and respond to changing conditions.
          </p>

          {/* Interconnected variables diagram */}
          <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.4), transparent)' }} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: '📈', label: 'GDP Growth', color: '#34d399', desc: 'Output & production' },
                { icon: '💹', label: 'Inflation', color: '#f87171', desc: 'Price level changes' },
                { icon: '👥', label: 'Unemployment', color: '#a78bfa', desc: 'Labour market' },
                { icon: '🏦', label: 'Interest Rates', color: '#0ea5e9', desc: 'Monetary policy' },
                { icon: '💱', label: 'Exchange Rates', color: '#fbbf24', desc: 'Currency markets' },
                { icon: '📊', label: 'Fiscal Policy', color: '#fb923c', desc: 'Government spending' },
                { icon: '🌐', label: 'Trade Balance', color: '#38bdf8', desc: 'Global flows' },
                { icon: '🧭', label: 'Confidence', color: '#4ade80', desc: 'Expectations' },
              ].map((item, i) => (
                <div key={i} className="feature-card rounded-xl p-4 text-left">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-sm font-semibold mb-1" style={{ color: item.color }}>{item.label}</div>
                  <div className="text-xs text-zinc-500">{item.desc}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-xl text-center" style={{ background: 'rgba(14,165,233,0.04)', border: '1px solid rgba(14,165,233,0.08)' }}>
              <p className="text-sm text-zinc-400">Every variable influences every other. <span className="text-cyan-400 font-medium">That&apos;s the system you&apos;ll learn to read.</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 5 — BEYOND TEXTBOOKS
      ════════════════════════════════════════════════════════════ */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 30% 50%, rgba(139,92,246,0.04) 0%, transparent 70%)' }} />

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-violet-400 mb-6"
                style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
                BEYOND TEXTBOOKS
              </div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Move Beyond Passive Learning
              </h2>
              <div className="space-y-4">
                <p className="text-zinc-400 leading-relaxed">
                  Economics is not a collection of isolated definitions.
                </p>
                <p className="text-zinc-300 leading-relaxed font-medium">
                  It is a dynamic system of incentives, decisions, markets, policies, and human behavior.
                </p>
                <p className="text-zinc-400 leading-relaxed">
                  Develop economic intuition by observing relationships, identifying patterns, and understanding consequences.
                </p>
              </div>
            </div>

            {/* Comparison visual */}
            <div className="flex-1 max-w-lg w-full space-y-4">
              <div className="p-4 rounded-xl flex items-center gap-4" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)' }}>
                <span className="text-2xl flex-shrink-0">📖</span>
                <div>
                  <div className="text-sm font-semibold text-red-400 mb-0.5">Passive Reading</div>
                  <div className="text-xs text-zinc-500">&quot;The multiplier effect increases aggregate demand by a factor of 1/(1-MPC).&quot;</div>
                </div>
              </div>
              <div className="p-4 rounded-xl flex items-center gap-4" style={{ background: 'rgba(14,165,233,0.04)', border: '1px solid rgba(14,165,233,0.1)' }}>
                <span className="text-2xl flex-shrink-0">⚡</span>
                <div>
                  <div className="text-sm font-semibold text-cyan-400 mb-0.5">Active Understanding</div>
                  <div className="text-xs text-zinc-400">You watch government spending ripple through employment, consumption, and output — in real time.</div>
                </div>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(52,211,153,0.04)', border: '1px solid rgba(52,211,153,0.1)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-emerald-400 text-sm font-semibold">The result?</span>
                </div>
                <div className="text-xs text-zinc-400">You don&apos;t just know the formula. You understand <em className="text-zinc-300">why</em> it works — and when it breaks down.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 6 — WHY STUDENTS USE IT
      ════════════════════════════════════════════════════════════ */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(14,165,233,0.05) 0%, transparent 70%)' }} />

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-cyan-400 mb-6"
              style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)' }}>
              WHY STUDENTS USE IT
            </div>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Built for How Economists<br />Actually Think
            </h2>
          </div>

          {/* Bento grid — varied sizes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto">
            {/* Large card */}
            <div className="feature-card rounded-2xl p-7 md:col-span-2 md:row-span-1">
              <div className="text-3xl mb-4">{FEATURES[0].icon}</div>
              <h3 className="text-lg font-bold mb-2">{FEATURES[0].title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{FEATURES[0].desc}</p>
              <div className="mt-5 flex gap-2 flex-wrap">
                {['Oil Shock 1973', 'Great Depression', '2008 GFC', 'Asian Crisis'].map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full font-mono text-cyan-400"
                    style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.15)' }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Tall card */}
            <div className="feature-card rounded-2xl p-7 md:row-span-2">
              <div className="text-3xl mb-4">{FEATURES[1].icon}</div>
              <h3 className="text-lg font-bold mb-2">{FEATURES[1].title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">{FEATURES[1].desc}</p>
              {/* Mini intuition meter */}
              <div className="space-y-3">
                {[
                  { label: 'Pattern Recognition', pct: 82 },
                  { label: 'Causal Reasoning', pct: 76 },
                  { label: 'Policy Analysis', pct: 91 },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-zinc-400">{item.label}</span>
                      <span className="font-mono text-cyan-400">{item.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: 'rgba(14,165,233,0.1)' }}>
                      <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Regular cards */}
            {FEATURES.slice(2).map((f, i) => (
              <div key={i} className="feature-card rounded-2xl p-6">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="text-base font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 px-6 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(14,165,233,0.07) 0%, transparent 70%)' }} />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(rgba(14,165,233,1) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        {/* World map background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
          <div className="w-full max-w-4xl">
            <WorldMap />
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-cyan-400 mb-8"
            style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            START YOUR JOURNEY
          </div>

          <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Stop Memorizing Economics.<br />
            <span style={{ background: 'linear-gradient(135deg, #0ea5e9, #38bdf8, #7dd3fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Start Understanding It.
            </span>
          </h2>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Build intuition, explore economic systems, and develop a deeper understanding of macroeconomics through interactive learning.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link href="/crises" onClick={handleEnter}
              className="btn-primary animate-glow-pulse inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white">
              Explore Crises
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <Link href="/scenario-hub" onClick={handleEnter}
              className="btn-ghost inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-cyan-300">
              Start Learning
            </Link>
          </div>

          {/* Bottom indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-xs text-zinc-600 font-mono">
            {['A-Level Economics', 'IB Economics', 'AP Macroeconomics', 'University Level'].map(tag => (
              <span key={tag} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-cyan-800" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Minimal footer ── */}
      <footer className="border-t py-8 px-6 text-center" style={{ borderColor: 'rgba(14,165,233,0.1)' }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}>
            <span className="text-white font-bold text-xs font-mono">E</span>
          </div>
          <span className="text-sm font-semibold text-zinc-400">EconSim</span>
        </div>
        <p className="text-xs text-zinc-600">Learn macroeconomics through simulation, not memorization.</p>
      </footer>
    </div>
  );
}
