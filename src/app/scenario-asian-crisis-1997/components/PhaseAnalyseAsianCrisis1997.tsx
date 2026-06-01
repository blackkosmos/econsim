'use client';
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Info, ArrowRight } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ReferenceLine,  } from 'recharts';

interface PhaseAnalyseAsianCrisis1997Props {
  onComplete: () => void;
}

const indicators = [
  {
    id: 'afc-ind-001', label: 'GDP Growth (Thailand)', value: '-10.5%', prev: '+5.9%', trend: 'down',
    status: 'critical', description: 'Thailand\'s GDP contracted by approximately 10.5% in 1998 — a catastrophic reversal from years of strong growth. The collapse was driven by currency depreciation, banking failures, and a sharp fall in investment and consumption.',
    sparkData: [5.9, 5.5, -1.4, -10.5, 4.2, 4.8],
  },
  {
    id: 'afc-ind-002', label: 'GDP Growth (Indonesia)', value: '-13.1%', prev: '+4.7%', trend: 'down',
    status: 'critical', description: 'Indonesia suffered the worst GDP contraction of any affected country — approximately 13.1% in 1998. The rupiah collapsed by over 80%, causing widespread bank failures, corporate bankruptcies, and severe social unrest that led to President Suharto\'s resignation.',
    sparkData: [4.7, 4.5, 4.7, -13.1, 0.8, 4.9],
  },
  {
    id: 'afc-ind-003', label: 'GDP Growth (South Korea)', value: '-5.7%', prev: '+6.8%', trend: 'down',
    status: 'critical', description: 'South Korea\'s GDP fell by approximately 5.7% in 1998. The won depreciated sharply, and several major conglomerates (chaebols) faced insolvency. South Korea accepted a large IMF bailout package and implemented significant structural reforms.',
    sparkData: [6.8, 7.1, 5.0, -5.7, 10.7, 8.8],
  },
  {
    id: 'afc-ind-004', label: 'Thai Baht Depreciation', value: '-55%', prev: 'Pegged', trend: 'down',
    status: 'critical', description: 'The Thai baht lost approximately 55% of its value against the US dollar after the government abandoned the fixed exchange rate peg in July 1997. This triggered panic across the region as investors feared similar collapses in neighbouring economies.',
    sparkData: [100, 100, 100, 45, 42, 44],
  },
  {
    id: 'afc-ind-005', label: 'Indonesian Rupiah', value: '-83%', prev: 'Stable', trend: 'down',
    status: 'critical', description: 'The Indonesian rupiah suffered the most dramatic collapse — losing over 83% of its value at its worst point. Companies that had borrowed in US dollars faced impossible debt repayment burdens as their local currency earnings became nearly worthless in dollar terms.',
    sparkData: [100, 100, 98, 17, 22, 28],
  },
  {
    id: 'afc-ind-006', label: 'Unemployment (Indonesia)', value: '+20pp', prev: '~4%', trend: 'up',
    status: 'critical', description: 'Unemployment surged dramatically across the region. In Indonesia, millions lost jobs as firms and banks collapsed. The crisis pushed an estimated 20–30 million people back into poverty across Southeast Asia, reversing years of development gains.',
    sparkData: [4, 4.2, 4.7, 22, 20, 15],
  },
];

const gdpData = [
  { year: '1993', thailand: 8.3, indonesia: 6.5, southKorea: 6.3, malaysia: 9.9 },
  { year: '1994', thailand: 8.9, indonesia: 7.5, southKorea: 8.3, malaysia: 9.2 },
  { year: '1995', thailand: 9.2, indonesia: 8.2, southKorea: 8.9, malaysia: 9.8 },
  { year: '1996', thailand: 5.9, indonesia: 7.8, southKorea: 6.8, malaysia: 10.0 },
  { year: '1997', thailand: -1.4, indonesia: 4.7, southKorea: 5.0, malaysia: 7.3 },
  { year: '1998', thailand: -10.5, indonesia: -13.1, southKorea: -5.7, malaysia: -7.4 },
  { year: '1999', thailand: 4.2, indonesia: 0.8, southKorea: 10.7, malaysia: 6.1 },
  { year: '2000', thailand: 4.8, indonesia: 4.9, southKorea: 8.8, malaysia: 8.9 },
];

const currencyData = [
  { month: 'Jan 97', baht: 100, rupiah: 100, won: 100 },
  { month: 'Apr 97', baht: 100, rupiah: 100, won: 100 },
  { month: 'Jul 97', baht: 72, rupiah: 95, won: 98 },
  { month: 'Oct 97', baht: 55, rupiah: 60, won: 75 },
  { month: 'Jan 98', baht: 47, rupiah: 17, won: 55 },
  { month: 'Apr 98', baht: 44, rupiah: 22, won: 62 },
  { month: 'Jul 98', baht: 45, rupiah: 25, won: 68 },
  { month: 'Jan 99', baht: 48, rupiah: 28, won: 78 },
];

const newsItems = [
  { id: 'afc-news-001', date: 'Early 1997', headline: 'Concerns grow about Thailand\'s debt levels and overheated property market', tag: 'Warning', tagColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { id: 'afc-news-002', date: 'Jul 2, 1997', headline: 'Thailand abandons fixed exchange rate — baht immediately loses ~20% of value', tag: 'Currency', tagColor: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { id: 'afc-news-003', date: 'Jul–Oct 1997', headline: 'Currency crisis spreads to Philippines, Malaysia, Indonesia, and South Korea', tag: 'Contagion', tagColor: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { id: 'afc-news-004', date: 'Late 1997', headline: 'Stock markets and banking systems across Asia weaken sharply — capital flight accelerates', tag: 'Markets', tagColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { id: 'afc-news-005', date: 'Nov–Dec 1997', headline: 'IMF provides emergency bailout packages to Thailand ($17.2B), Indonesia ($43B), South Korea ($58.4B)', tag: 'IMF', tagColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
  { id: 'afc-news-006', date: '1998', headline: 'Indonesia experiences severe economic and political instability — riots break out across the country', tag: 'Crisis', tagColor: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { id: 'afc-news-007', date: 'May 1998', headline: 'Indonesian President Suharto resigns after 32 years in power amid economic collapse', tag: 'Political', tagColor: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
  { id: 'afc-news-008', date: '1998–1999', headline: 'Recovery gradually begins — South Korea recovers fastest; Indonesia slowest', tag: 'Recovery', tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
];

const mechanisms = [
  {
    id: 'mech-001', title: 'Fixed Exchange Rate Pressure',
    body: 'Countries maintained currencies pegged to the US dollar. When investors lost confidence, central banks spent foreign reserves defending the peg. Eventually reserves ran out and currencies collapsed anyway — often more dramatically than if they had floated earlier.',
    color: 'border-red-500/20 bg-red-500/5', labelColor: 'text-red-400',
  },
  {
    id: 'mech-002', title: 'Foreign Currency Debt Trap',
    body: 'Companies and banks had borrowed heavily in US dollars. When local currencies depreciated by 50–80%, the cost of repaying dollar-denominated debt in local currency terms doubled or tripled. This caused widespread corporate and bank insolvencies.',
    color: 'border-amber-500/20 bg-amber-500/5', labelColor: 'text-amber-400',
  },
  {
    id: 'mech-003', title: 'Capital Flight',
    body: 'Foreign investors rapidly withdrew money from Asian markets when confidence fell. This worsened currency depreciation, reduced the money supply, and deepened banking instability. The speed of capital outflows was amplified by financial globalisation.',
    color: 'border-orange-500/20 bg-orange-500/5', labelColor: 'text-orange-400',
  },
  {
    id: 'mech-004', title: 'Financial Contagion',
    body: 'The crisis spread because investors feared neighbouring countries had similar weaknesses — excessive borrowing, fixed exchange rates, and asset bubbles. Even countries with relatively sound fundamentals (like Malaysia) were affected by the regional panic.',
    color: 'border-violet-500/20 bg-violet-500/5', labelColor: 'text-violet-400',
  },
];

const CustomGDPTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-zinc-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={`tt-${p.dataKey}`} className="text-xs font-mono" style={{ color: p.color }}>{p.name}: {p.value}%</p>
      ))}
    </div>
  );
};

const CustomCurrencyTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-zinc-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={`tt-${p.dataKey}`} className="text-xs font-mono" style={{ color: p.color }}>{p.name}: {p.value} (Jan 97 = 100)</p>
      ))}
    </div>
  );
};

export default function PhaseAnalyseAsianCrisis1997({ onComplete }: PhaseAnalyseAsianCrisis1997Props) {
  const [expandedIndicator, setExpandedIndicator] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Historical Context Banner */}
      <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
        <AlertTriangle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-400 mb-1">Historical Context — Asian Financial Crisis (1997–1998)</p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The Asian financial crisis was a major economic and financial collapse affecting East and Southeast Asia between 1997 and 1998. It began in <span className="text-zinc-200 font-medium">Thailand in July 1997</span> when the government stopped defending the baht's fixed exchange rate, and quickly spread to Indonesia, South Korea, Malaysia, and the Philippines. The crisis caused <span className="text-amber-400 font-medium">currency collapses, banking failures, stock market crashes, rising unemployment, and severe recessions</span> — becoming one of the most important global financial crises of the late 20th century.
          </p>
        </div>
      </div>

      {/* Asian Tigers Context */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2">
          <Info size={14} className="text-sky-400" />
          The "Asian Tigers" — Why Did the Crisis Happen?
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed mb-4">
          During the late 1980s and early 1990s, many Asian economies were called the <span className="text-zinc-200 font-medium">"Asian Tigers"</span> because of their rapid industrial growth and export success. Countries such as Thailand, South Korea, Malaysia, and Indonesia experienced fast GDP growth, rising foreign investment, expanding banking sectors, and booming property markets. Many governments and businesses believed rapid growth would continue indefinitely.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: 'Excessive Borrowing', desc: 'Banks and companies borrowed heavily, especially in US dollars, creating large foreign currency debt obligations.', color: 'border-red-500/20 bg-red-500/5', tag: 'text-red-400' },
            { label: 'Fixed Exchange Rates', desc: 'Many countries kept currencies closely tied to the US dollar, creating a false sense of stability and encouraging more foreign borrowing.', color: 'border-amber-500/20 bg-amber-500/5', tag: 'text-amber-400' },
            { label: 'Asset Bubbles', desc: 'Property and stock markets became heavily overvalued as cheap credit and optimism drove prices far above fundamental values.', color: 'border-orange-500/20 bg-orange-500/5', tag: 'text-orange-400' },
            { label: 'Weak Financial Regulation', desc: 'Banks often made risky loans with limited oversight. Lending standards were poor and risk management was inadequate.', color: 'border-violet-500/20 bg-violet-500/5', tag: 'text-violet-400' },
            { label: 'Short-Term Foreign Borrowing', desc: 'Much of the foreign debt was short-term — meaning it had to be repaid quickly, making countries vulnerable to sudden capital outflows.', color: 'border-sky-500/20 bg-sky-500/5', tag: 'text-sky-400' },
            { label: 'Loss of Investor Confidence', desc: 'When investors feared countries could not maintain exchange rates or repay debt, capital rapidly left the region — triggering the very collapse they feared.', color: 'border-zinc-600/30 bg-zinc-800/50', tag: 'text-zinc-400' },
          ].map((item) => (
            <div key={`cause-${item.label}`} className={`p-3 rounded-lg border ${item.color}`}>
              <p className={`text-xs font-semibold mb-1 ${item.tag}`}>{item.label}</p>
              <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Before vs After */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-emerald-500/20 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            Before the Crisis (Early 1990s — "Asian Tigers")
          </h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="flex items-center gap-2"><span className="text-emerald-400 font-mono text-xs">GDP</span> 7–10% annual growth — rapid industrialisation and exports</li>
            <li className="flex items-center gap-2"><span className="text-emerald-400 font-mono text-xs">FDI</span> Large foreign investment inflows — strong investor confidence</li>
            <li className="flex items-center gap-2"><span className="text-emerald-400 font-mono text-xs">FX</span> Fixed exchange rates — currencies pegged to US dollar</li>
            <li className="flex items-center gap-2"><span className="text-emerald-400 font-mono text-xs">PROP</span> Booming property and stock markets — asset price inflation</li>
          </ul>
        </div>
        <div className="bg-zinc-900 border border-red-500/20 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
            After the Crisis (1997–1998 — Collapse)
          </h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="flex items-center gap-2"><span className="text-red-400 font-mono text-xs">GDP</span> −5% to −13% — severe recessions across the region</li>
            <li className="flex items-center gap-2"><span className="text-red-400 font-mono text-xs">FX</span> Currencies lost 40–83% of value — baht, rupiah, won collapsed</li>
            <li className="flex items-center gap-2"><span className="text-red-400 font-mono text-xs">BANKS</span> Banking failures — bad loans, credit freeze, insolvencies</li>
            <li className="flex items-center gap-2"><span className="text-red-400 font-mono text-xs">UNEMP</span> Unemployment surged — millions lost jobs across the region</li>
          </ul>
        </div>
      </div>

      {/* Macro Indicators Grid */}
      <div>
        <h2 className="text-base font-semibold text-zinc-200 mb-3 flex items-center gap-2">
          <Info size={15} className="text-emerald-400" />
          Key Macroeconomic Indicators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {indicators.map((ind) => {
            const isExpanded = expandedIndicator === ind.id;
            const statusColors = {
              critical: 'border-red-500/30 bg-red-500/5',
              warning: 'border-amber-400/30 bg-amber-400/5',
              normal: 'border-zinc-700/50 bg-zinc-900',
            };
            const trendIcon = ind.trend === 'up'
              ? <TrendingUp size={14} className="text-red-400" />
              : ind.trend === 'down'
              ? <TrendingDown size={14} className="text-emerald-400" />
              : <Minus size={14} className="text-zinc-500" />;
            const sparkMin = Math.min(...ind.sparkData);
            const sparkMax = Math.max(...ind.sparkData);
            const sparkRange = sparkMax - sparkMin || 1;
            const sparkPoints = ind.sparkData.map((v, i) => ({
              x: (i / (ind.sparkData.length - 1)) * 100,
              y: 100 - ((v - sparkMin) / sparkRange) * 80 - 10,
            }));
            const sparkPath = sparkPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
            return (
              <div
                key={ind.id}
                className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 ${statusColors[ind.status as keyof typeof statusColors]} hover:border-zinc-600`}
                onClick={() => setExpandedIndicator(isExpanded ? null : ind.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{ind.label}</span>
                  <div className="flex items-center gap-1">
                    {ind.status === 'critical' && <AlertTriangle size={12} className="text-red-400" />}
                    {trendIcon}
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold font-mono tabular-nums text-zinc-100">{ind.value}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">prev: <span className="font-mono">{ind.prev}</span></div>
                  </div>
                  <svg viewBox="0 0 100 50" className="w-20 h-10 opacity-60">
                    <path d={sparkPath} fill="none" stroke={ind.trend === 'up' ? '#f87171' : '#34d399'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-zinc-700/50">
                    <p className="text-xs text-zinc-400 leading-relaxed">{ind.description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-zinc-600 mt-2 flex items-center gap-1"><Info size={11} /> Click any indicator card to see context</p>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">GDP Growth by Country (%)</h3>
              <p className="text-xs text-zinc-500">1993 – 2000</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 rounded-lg border border-red-500/20">
              <TrendingDown size={12} className="text-red-400" />
              <span className="text-xs font-mono text-red-400 font-semibold">Crisis: 1997–98</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mb-3">
            {[{ key: 'thailand', color: '#f59e0b', label: 'Thailand' }, { key: 'indonesia', color: '#f87171', label: 'Indonesia' }, { key: 'southKorea', color: '#38bdf8', label: 'S. Korea' }, { key: 'malaysia', color: '#a78bfa', label: 'Malaysia' }].map((c) => (
              <div key={c.key} className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-xs text-zinc-500">{c.label}</span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={gdpData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="hsl(240,4%,16%)" strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} domain={[-16, 12]} />
              <Tooltip content={<CustomGDPTooltip />} />
              <ReferenceLine y={0} stroke="#52525b" strokeDasharray="4 4" />
              <ReferenceLine x="1997" stroke="#f87171" strokeDasharray="4 4" strokeOpacity={0.6} label={{ value: 'Crisis', fill: '#f87171', fontSize: 10 }} />
              <Line type="monotone" dataKey="thailand" stroke="#f59e0b" strokeWidth={2} dot={false} name="Thailand" />
              <Line type="monotone" dataKey="indonesia" stroke="#f87171" strokeWidth={2} dot={false} name="Indonesia" />
              <Line type="monotone" dataKey="southKorea" stroke="#38bdf8" strokeWidth={2} dot={false} name="S. Korea" />
              <Line type="monotone" dataKey="malaysia" stroke="#a78bfa" strokeWidth={2} dot={false} name="Malaysia" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">Currency Collapse (Jan 1997 = 100)</h3>
              <p className="text-xs text-zinc-500">Baht, Rupiah, Won vs USD</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mb-3">
            {[{ key: 'baht', color: '#f59e0b', label: 'Thai Baht' }, { key: 'rupiah', color: '#f87171', label: 'Indonesian Rupiah' }, { key: 'won', color: '#38bdf8', label: 'Korean Won' }].map((c) => (
              <div key={c.key} className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-xs text-zinc-500">{c.label}</span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={currencyData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="hsl(240,4%,16%)" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 110]} />
              <Tooltip content={<CustomCurrencyTooltip />} />
              <ReferenceLine x="Jul 97" stroke="#f87171" strokeDasharray="4 4" strokeOpacity={0.6} label={{ value: 'Baht floats', fill: '#f87171', fontSize: 9 }} />
              <Line type="monotone" dataKey="baht" stroke="#f59e0b" strokeWidth={2} dot={false} name="Thai Baht" />
              <Line type="monotone" dataKey="rupiah" stroke="#f87171" strokeWidth={2} dot={false} name="Rupiah" />
              <Line type="monotone" dataKey="won" stroke="#38bdf8" strokeWidth={2} dot={false} name="Korean Won" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Events Timeline */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-200">Key Events Timeline</h3>
        </div>
        <div className="divide-y divide-zinc-800/60">
          {newsItems.map((item) => (
            <div key={item.id} className="flex items-start gap-4 px-5 py-3">
              <span className="text-xs font-mono text-zinc-500 flex-shrink-0 w-24 pt-0.5">{item.date}</span>
              <div className="flex-1">
                <p className="text-sm text-zinc-300">{item.headline}</p>
              </div>
              <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full border ${item.tagColor}`}>{item.tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Economic Mechanisms */}
      <div>
        <h2 className="text-base font-semibold text-zinc-200 mb-3">Economic Mechanism — How the Crisis Spread</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mechanisms.map((m) => (
            <div key={m.id} className={`p-4 rounded-xl border ${m.color}`}>
              <p className={`text-sm font-semibold mb-2 ${m.labelColor}`}>{m.title}</p>
              <p className="text-sm text-zinc-400 leading-relaxed">{m.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Policy Responses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-red-500/20 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-3">IMF Bailout Conditions</h3>
          <p className="text-xs text-zinc-400 mb-3">The IMF provided emergency packages to Thailand ($17.2B), Indonesia ($43B), and South Korea ($58.4B). Conditions included:</p>
          <ul className="space-y-1.5 text-xs text-zinc-400">
            <li className="flex items-start gap-2"><ArrowRight size={10} className="text-red-400 flex-shrink-0 mt-0.5" />Government spending cuts (austerity)</li>
            <li className="flex items-start gap-2"><ArrowRight size={10} className="text-red-400 flex-shrink-0 mt-0.5" />Higher interest rates to defend currencies</li>
            <li className="flex items-start gap-2"><ArrowRight size={10} className="text-red-400 flex-shrink-0 mt-0.5" />Banking sector reforms and closures</li>
            <li className="flex items-start gap-2"><ArrowRight size={10} className="text-red-400 flex-shrink-0 mt-0.5" />Structural economic reforms</li>
          </ul>
        </div>
        <div className="bg-zinc-900 border border-emerald-500/20 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-3">Long-Term Lessons</h3>
          <p className="text-xs text-zinc-400 mb-3">After the crisis, many Asian countries fundamentally changed how they managed their economies:</p>
          <ul className="space-y-1.5 text-xs text-zinc-400">
            <li className="flex items-start gap-2"><ArrowRight size={10} className="text-emerald-400 flex-shrink-0 mt-0.5" />Built much larger foreign currency reserves</li>
            <li className="flex items-start gap-2"><ArrowRight size={10} className="text-emerald-400 flex-shrink-0 mt-0.5" />Moved toward more flexible exchange rates</li>
            <li className="flex items-start gap-2"><ArrowRight size={10} className="text-emerald-400 flex-shrink-0 mt-0.5" />Strengthened banking supervision and regulation</li>
            <li className="flex items-start gap-2"><ArrowRight size={10} className="text-emerald-400 flex-shrink-0 mt-0.5" />Reduced reliance on short-term foreign borrowing</li>
          </ul>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <button
          onClick={onComplete}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-semibold rounded-xl transition-all duration-150 active:scale-95"
        >
          Continue to Predictions <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
