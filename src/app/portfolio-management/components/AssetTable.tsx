'use client';
import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Search, SlidersHorizontal, TrendingUp, TrendingDown,
  Plus, Minus, Eye, ChevronUp, ChevronDown,
} from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  ticker: string;
  country: string;
  sector: string;
  type: 'Equity' | 'Bond' | 'Commodity' | 'Currency' | 'ETF';
  quantity: number;
  avgCost: number;
  currentPrice: number;
  value: number;
  totalReturn: number;
  returnPct: number;
  allocation: number;
  riskScore: number;
  pushFactor: 'positive' | 'negative' | 'neutral';
  pullFactor: 'positive' | 'negative' | 'neutral';
}

const assets: Asset[] = [
  { id: 'asset-001', name: 'US Treasury 10Y', ticker: 'TLT', country: 'USA', sector: 'Government Bonds', type: 'Bond', quantity: 120, avgCost: 89.40, currentPrice: 108.60, value: 13032, totalReturn: 2304, returnPct: 21.5, allocation: 10.4, riskScore: 2, pushFactor: 'positive', pullFactor: 'positive' },
  { id: 'asset-002', name: 'SPDR S&P 500 ETF', ticker: 'SPY', country: 'USA', sector: 'Broad Market', type: 'ETF', quantity: 45, avgCost: 154.20, currentPrice: 89.30, value: 4018, totalReturn: -2918, returnPct: -42.1, allocation: 3.2, riskScore: 8, pushFactor: 'negative', pullFactor: 'negative' },
  { id: 'asset-003', name: 'Gold Bullion ETF', ticker: 'GLD', country: 'Global', sector: 'Commodities', type: 'Commodity', quantity: 80, avgCost: 72.10, currentPrice: 88.50, value: 7080, totalReturn: 1312, returnPct: 22.7, allocation: 5.7, riskScore: 4, pushFactor: 'positive', pullFactor: 'neutral' },
  { id: 'asset-004', name: 'Johnson & Johnson', ticker: 'JNJ', country: 'USA', sector: 'Healthcare', type: 'Equity', quantity: 60, avgCost: 61.20, currentPrice: 58.40, value: 3504, totalReturn: -168, returnPct: -4.6, allocation: 2.8, riskScore: 3, pushFactor: 'neutral', pullFactor: 'positive' },
  { id: 'asset-005', name: 'UK Gilt 5Y', ticker: 'IGLT', country: 'GBR', sector: 'Government Bonds', type: 'Bond', quantity: 200, avgCost: 48.20, currentPrice: 52.80, value: 10560, totalReturn: 920, returnPct: 9.5, allocation: 8.5, riskScore: 2, pushFactor: 'positive', pullFactor: 'neutral' },
  { id: 'asset-006', name: 'iShares MSCI Japan', ticker: 'EWJ', country: 'JPN', sector: 'Broad Market', type: 'ETF', quantity: 150, avgCost: 12.80, currentPrice: 10.20, value: 1530, totalReturn: -390, returnPct: -20.3, allocation: 1.2, riskScore: 7, pushFactor: 'negative', pullFactor: 'negative' },
  { id: 'asset-007', name: 'Procter & Gamble', ticker: 'PG', country: 'USA', sector: 'Consumer Staples', type: 'Equity', quantity: 55, avgCost: 63.40, currentPrice: 61.20, value: 3366, totalReturn: -121, returnPct: -3.5, allocation: 2.7, riskScore: 3, pushFactor: 'neutral', pullFactor: 'positive' },
  { id: 'asset-008', name: 'iShares MSCI India', ticker: 'INDA', country: 'IND', sector: 'Broad Market', type: 'ETF', quantity: 200, avgCost: 28.40, currentPrice: 24.10, value: 4820, totalReturn: -860, returnPct: -15.1, allocation: 3.9, riskScore: 8, pushFactor: 'negative', pullFactor: 'positive' },
  { id: 'asset-009', name: 'German Bund ETF', ticker: 'DBXG', country: 'DEU', sector: 'Government Bonds', type: 'Bond', quantity: 180, avgCost: 54.20, currentPrice: 61.80, value: 11124, totalReturn: 1368, returnPct: 14.0, allocation: 8.9, riskScore: 2, pushFactor: 'positive', pullFactor: 'neutral' },
  { id: 'asset-010', name: 'Walmart Inc.', ticker: 'WMT', country: 'USA', sector: 'Consumer Staples', type: 'Equity', quantity: 70, avgCost: 54.80, currentPrice: 52.10, value: 3647, totalReturn: -189, returnPct: -4.9, allocation: 2.9, riskScore: 3, pushFactor: 'neutral', pullFactor: 'positive' },
  { id: 'asset-011', name: 'SPDR Gold Shares', ticker: 'SGOL', country: 'Global', sector: 'Commodities', type: 'Commodity', quantity: 50, avgCost: 84.20, currentPrice: 102.40, value: 5120, totalReturn: 910, returnPct: 21.6, allocation: 4.1, riskScore: 3, pushFactor: 'positive', pullFactor: 'neutral' },
  { id: 'asset-012', name: 'iShares China Large Cap', ticker: 'FXI', country: 'CHN', sector: 'Broad Market', type: 'ETF', quantity: 120, avgCost: 42.80, currentPrice: 28.60, value: 3432, totalReturn: -1704, returnPct: -33.2, allocation: 2.7, riskScore: 9, pushFactor: 'negative', pullFactor: 'negative' },
];

type SortField = 'name' | 'value' | 'returnPct' | 'allocation' | 'riskScore';
type SortDir = 'asc' | 'desc';

const typeColors: Record<Asset['type'], string> = {
  Equity: 'bg-sky-400/10 text-sky-400 border-sky-400/20',
  Bond: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  Commodity: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
  Currency: 'bg-violet-400/10 text-violet-400 border-violet-400/20',
  ETF: 'bg-zinc-600/30 text-zinc-300 border-zinc-600/40',
};

const factorColors: Record<string, string> = {
  positive: 'text-emerald-400',
  negative: 'text-red-400',
  neutral: 'text-zinc-500',
};

const factorLabels: Record<string, string> = {
  positive: '↑',
  negative: '↓',
  neutral: '→',
};

export default function AssetTable() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortField, setSortField] = useState<SortField>('value');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [tradeModal, setTradeModal] = useState<{ asset: Asset; action: 'buy' | 'sell' } | null>(null);
  const [tradeQty, setTradeQty] = useState(10);
  const [tradingId, setTradingId] = useState<string | null>(null);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const filtered = assets
    .filter((a) => {
      const matchSearch = search === '' || a.name.toLowerCase().includes(search.toLowerCase()) || a.ticker.toLowerCase().includes(search.toLowerCase()) || a.country.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === 'All' || a.type === typeFilter;
      return matchSearch && matchType;
    })
    .sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1;
      if (sortField === 'name') return mul * a.name.localeCompare(b.name);
      return mul * (a[sortField] - b[sortField]);
    });

  const toggleRow = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((a) => a.id)));
  };

  const handleTrade = () => {
    if (!tradeModal) return;
    setTradingId(tradeModal.asset.id);
    // Backend: POST /api/portfolio/trade with { assetId, action, quantity }
    setTimeout(() => {
      setTradingId(null);
      setTradeModal(null);
      toast.success(`${tradeModal.action === 'buy' ? 'Bought' : 'Sold'} ${tradeQty} shares of ${tradeModal.asset.ticker}`);
    }, 1200);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronDown size={12} className="text-zinc-700" />;
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-emerald-400" /> : <ChevronDown size={12} className="text-emerald-400" />;
  };

  const RiskBar = ({ score }: { score: number }) => {
    const color = score <= 3 ? 'bg-emerald-400' : score <= 6 ? 'bg-amber-400' : 'bg-red-400';
    return (
      <div className="flex items-center gap-1.5">
        <div className="flex gap-0.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`risk-bar-${i}`}
              className={`w-1 h-3 rounded-sm ${i < score ? color : 'bg-zinc-700'}`}
            />
          ))}
        </div>
        <span className={`text-xs font-mono ${score <= 3 ? 'text-emerald-400' : score <= 6 ? 'text-amber-400' : 'text-red-400'}`}>{score}</span>
      </div>
    );
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Table Header Controls */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-zinc-800 flex-wrap">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-zinc-200">Portfolio Holdings</h3>
          <span className="text-xs text-zinc-500 font-mono">{filtered.length} assets</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-7 pr-3 py-1.5 bg-zinc-800/60 border border-zinc-700/50 rounded-lg text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 w-44 transition-colors"
            />
          </div>
          <div className="flex items-center gap-1">
            {(['All', 'Equity', 'Bond', 'ETF', 'Commodity'] as const).map((t) => (
              <button
                key={`tf-asset-${t}`}
                onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1 text-xs rounded-md transition-all duration-150 ${
                  typeFilter === t
                    ? 'bg-zinc-700 text-zinc-100' :'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-800 border border-zinc-700/50 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 transition-colors">
            <SlidersHorizontal size={12} />
            Columns
          </button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selected.size > 0 && (
        <div className="flex items-center justify-between px-5 py-2.5 bg-emerald-500/5 border-b border-emerald-500/20 animate-slideUp">
          <span className="text-xs text-emerald-400 font-medium">{selected.size} asset{selected.size > 1 ? 's' : ''} selected</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { toast.success(`Sold ${selected.size} selected assets`); setSelected(new Set()); }}
              className="px-3 py-1 bg-red-500/15 text-red-400 text-xs rounded-lg border border-red-500/25 hover:bg-red-500/25 transition-colors"
            >
              Sell Selected
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="px-3 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-lg border border-zinc-700/50 hover:bg-zinc-700 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-4 py-3 text-left w-8">
                <input
                  type="checkbox"
                  checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                  className="accent-emerald-400"
                />
              </th>
              <th className="px-3 py-3 text-left">
                <button onClick={() => toggleSort('name')} className="flex items-center gap-1 text-xs font-medium text-zinc-500 uppercase tracking-wide hover:text-zinc-300 transition-colors">
                  Asset <SortIcon field="name" />
                </button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Type</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">Country</th>
              <th className="px-3 py-3 text-right">
                <button onClick={() => toggleSort('value')} className="flex items-center gap-1 text-xs font-medium text-zinc-500 uppercase tracking-wide hover:text-zinc-300 transition-colors ml-auto">
                  Value <SortIcon field="value" />
                </button>
              </th>
              <th className="px-3 py-3 text-right">
                <button onClick={() => toggleSort('returnPct')} className="flex items-center gap-1 text-xs font-medium text-zinc-500 uppercase tracking-wide hover:text-zinc-300 transition-colors ml-auto">
                  Return <SortIcon field="returnPct" />
                </button>
              </th>
              <th className="px-3 py-3 text-right">
                <button onClick={() => toggleSort('allocation')} className="flex items-center gap-1 text-xs font-medium text-zinc-500 uppercase tracking-wide hover:text-zinc-300 transition-colors ml-auto">
                  Alloc. <SortIcon field="allocation" />
                </button>
              </th>
              <th className="px-3 py-3 text-left">
                <button onClick={() => toggleSort('riskScore')} className="flex items-center gap-1 text-xs font-medium text-zinc-500 uppercase tracking-wide hover:text-zinc-300 transition-colors">
                  Risk <SortIcon field="riskScore" />
                </button>
              </th>
              <th className="px-3 py-3 text-center text-xs font-medium text-zinc-500 uppercase tracking-wide">Push</th>
              <th className="px-3 py-3 text-center text-xs font-medium text-zinc-500 uppercase tracking-wide">Pull</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/40">
            {filtered.map((asset) => (
              <tr
                key={asset.id}
                className={`group transition-colors hover:bg-zinc-800/40 ${selected.has(asset.id) ? 'bg-emerald-500/5' : ''}`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(asset.id)}
                    onChange={() => toggleRow(asset.id)}
                    className="accent-emerald-400"
                  />
                </td>
                <td className="px-3 py-3">
                  <div>
                    <p className="text-sm font-semibold text-zinc-200 leading-snug">{asset.name}</p>
                    <p className="text-xs font-mono text-zinc-500">{asset.ticker} · {asset.sector}</p>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className={`px-2 py-0.5 text-xs rounded-full border ${typeColors[asset.type]}`}>
                    {asset.type}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className="text-xs text-zinc-400 font-mono">{asset.country}</span>
                </td>
                <td className="px-3 py-3 text-right">
                  <div>
                    <p className="text-sm font-mono font-semibold text-zinc-200 tabular-nums">${String(asset.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                    <p className="text-xs font-mono text-zinc-600 tabular-nums">{asset.quantity} × ${asset.currentPrice.toFixed(2)}</p>
                  </div>
                </td>
                <td className="px-3 py-3 text-right">
                  <div className={`flex items-center justify-end gap-1 ${asset.returnPct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {asset.returnPct >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    <span className="text-sm font-mono font-semibold tabular-nums">
                      {asset.returnPct >= 0 ? '+' : ''}{asset.returnPct.toFixed(1)}%
                    </span>
                  </div>
                  <p className={`text-xs font-mono tabular-nums text-right ${asset.totalReturn >= 0 ? 'text-emerald-400/70' : 'text-red-400/70'}`}>
                    {asset.totalReturn >= 0 ? '+' : ''}${String(Math.abs(asset.totalReturn)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full"
                        style={{ width: `${Math.min(asset.allocation * 4, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-zinc-400 tabular-nums w-8 text-right">{asset.allocation}%</span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <RiskBar score={asset.riskScore} />
                </td>
                <td className="px-3 py-3 text-center">
                  <span className={`text-base font-bold ${factorColors[asset.pushFactor]}`} title={`Push factor: ${asset.pushFactor}`}>
                    {factorLabels[asset.pushFactor]}
                  </span>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className={`text-base font-bold ${factorColors[asset.pullFactor]}`} title={`Pull factor: ${asset.pullFactor}`}>
                    {factorLabels[asset.pullFactor]}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setTradeModal({ asset, action: 'buy' }); setTradeQty(10); }}
                      title="Buy more of this asset"
                      className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-md transition-colors"
                    >
                      <Plus size={13} />
                    </button>
                    <button
                      onClick={() => { setTradeModal({ asset, action: 'sell' }); setTradeQty(10); }}
                      title="Sell this asset"
                      className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-md transition-colors"
                    >
                      <Minus size={13} />
                    </button>
                    <button
                      title="View asset detail"
                      className="p-1.5 bg-zinc-700/50 hover:bg-zinc-700 text-zinc-400 rounded-md transition-colors"
                    >
                      <Eye size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search size={36} className="text-zinc-700 mb-3" />
            <h3 className="text-sm font-semibold text-zinc-400 mb-1">No assets match your search</h3>
            <p className="text-xs text-zinc-600">Try a different ticker, name, or remove the type filter.</p>
          </div>
        )}
      </div>

      {/* Pagination footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800">
        <span className="text-xs text-zinc-500 font-mono">Showing {filtered.length} of {assets.length} holdings</span>
        <div className="flex items-center gap-1">
          {['1'].map((pg) => (
            <button key={`pg-${pg}`} className="w-7 h-7 flex items-center justify-center text-xs rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              {pg}
            </button>
          ))}
        </div>
      </div>

      {/* Trade Modal */}
      {tradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm" onClick={() => setTradeModal(null)}>
          <div
            className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-zinc-100">
                  {tradeModal.action === 'buy' ? 'Buy' : 'Sell'} {tradeModal.asset.ticker}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">{tradeModal.asset.name}</p>
              </div>
              <div className={`px-3 py-1.5 rounded-lg text-sm font-mono font-semibold ${tradeModal.action === 'buy' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                ${tradeModal.asset.currentPrice.toFixed(2)}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-zinc-800/60 rounded-lg p-3">
                  <p className="text-zinc-500 mb-0.5">Current Holdings</p>
                  <p className="font-mono font-semibold text-zinc-200">{tradeModal.asset.quantity} shares</p>
                </div>
                <div className="bg-zinc-800/60 rounded-lg p-3">
                  <p className="text-zinc-500 mb-0.5">Current Value</p>
                  <p className="font-mono font-semibold text-zinc-200">${String(tradeModal.asset.value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">
                  Quantity to {tradeModal.action === 'buy' ? 'Buy' : 'Sell'}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setTradeQty(Math.max(1, tradeQty - 5))}
                    className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={tradeModal.action === 'sell' ? tradeModal.asset.quantity : 999}
                    value={tradeQty}
                    onChange={(e) => setTradeQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 text-center py-2 bg-zinc-800 border border-zinc-700/50 rounded-lg text-sm font-mono font-semibold text-zinc-100 focus:outline-none focus:border-emerald-500/50"
                  />
                  <button
                    onClick={() => setTradeQty(tradeQty + 5)}
                    className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="bg-zinc-800/60 rounded-lg p-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-zinc-500">Order value</span>
                  <span className="font-mono font-semibold text-zinc-200">${(tradeQty * tradeModal.asset.currentPrice).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">New position size</span>
                  <span className="font-mono font-semibold text-zinc-200">
                    {tradeModal.action === 'buy'
                      ? tradeModal.asset.quantity + tradeQty
                      : Math.max(0, tradeModal.asset.quantity - tradeQty)} shares
                  </span>
                </div>
              </div>

              {tradeModal.action === 'sell' && tradeQty > tradeModal.asset.quantity && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  ⚠ You only hold {tradeModal.asset.quantity} shares — reduce quantity to proceed.
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setTradeModal(null)}
                className="flex-1 py-2.5 bg-zinc-800 text-zinc-300 text-sm font-medium rounded-xl border border-zinc-700/50 hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTrade}
                disabled={!!tradingId || (tradeModal.action === 'sell' && tradeQty > tradeModal.asset.quantity)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  tradeModal.action === 'buy' ?'bg-emerald-500 hover:bg-emerald-400 text-zinc-950' :'bg-red-500 hover:bg-red-400 text-white'
                }`}
              >
                {tradingId === tradeModal.asset.id ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3-3-3h4z" />
                  </svg>
                ) : (
                  <>
                    {tradeModal.action === 'buy' ? <Plus size={14} /> : <Minus size={14} />}
                    Confirm {tradeModal.action === 'buy' ? 'Purchase' : 'Sale'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}