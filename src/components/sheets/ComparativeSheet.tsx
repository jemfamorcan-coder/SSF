import React, { useState } from 'react';
import { OfficeSSFData } from '../../types/ssf';
import { computeComparativeVariances, formatNumber, formatPHP, formatDelta } from '../../utils/formatters';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ComparativeSheetProps {
  offices: OfficeSSFData[];
  asOfDate?: string;
}

export const ComparativeSheet: React.FC<ComparativeSheetProps> = ({ 
  offices, 
  asOfDate = '29 October 2026, 06:00 AM' 
}) => {
  const [metricMode, setMetricMode] = useState<'ffpQty' | 'totalSSF'>('ffpQty');
  const [filterType, setFilterType] = useState<'ALL' | 'Replenished' | 'Dispatched' | 'Stable'>('ALL');

  const variances = computeComparativeVariances(offices);

  const totalDeltaFFP = variances.reduce((acc, v) => acc + v.deltaFFPQty, 0);
  const totalDeltaSSF = variances.reduce((acc, v) => acc + v.deltaTotalSSF, 0);
  const replenishedCount = variances.filter(v => v.activityType === 'Replenished').length;
  const dispatchedCount = variances.filter(v => v.activityType === 'Dispatched').length;

  const filteredVariances = variances.filter(v => {
    if (filterType === 'ALL') return true;
    return v.activityType === filterType;
  });

  // Sort by delta absolute magnitude
  const sortedVariances = [...filteredVariances].sort((a, b) => {
    const valA = metricMode === 'ffpQty' ? a.deltaFFPQty : a.deltaTotalSSF;
    const valB = metricMode === 'ffpQty' ? b.deltaFFPQty : b.deltaTotalSSF;
    return valB - valA;
  });

  const maxAbsDelta = Math.max(
    1,
    ...variances.map(v => Math.abs(metricMode === 'ffpQty' ? v.deltaFFPQty : v.deltaTotalSSF))
  );

  return (
    <div className="space-y-6">
      {/* Comparative Incident Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-800 uppercase tracking-wider mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Disaster Operations Incident Comparison</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              18 October 2026 (06:00 PM) → Live Operational Status ({asOfDate})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Net inventory change tracking rapid disaster distribution to affected LGUs and production intake from NRLMB
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
              <button
                onClick={() => setMetricMode('ffpQty')}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  metricMode === 'ffpQty' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Food Packs (FFP) Qty
              </button>
              <button
                onClick={() => setMetricMode('totalSSF')}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  metricMode === 'totalSSF' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Stockpile Valuation (₱)
              </button>
            </div>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-lg">
            <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Net FFP Stockpile Movement</span>
            </div>
            <div className="text-xl font-bold text-emerald-950 mt-1">
              {formatDelta(totalDeltaFFP)} packs
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5">
              {replenishedCount} Offices augmented stock
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg">
            <div className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              <span>Net SSF Valuation Variance</span>
            </div>
            <div className="text-xl font-bold text-blue-950 mt-1">
              {formatDelta(totalDeltaSSF, true)}
            </div>
            <div className="text-[11px] text-blue-700 mt-0.5">
              Reflects new packaging & procurement
            </div>
          </div>

          <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-lg">
            <div className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
              <span>Disaster Relief Dispatches</span>
            </div>
            <div className="text-xl font-bold text-rose-950 mt-1">
              {dispatchedCount} Field Offices Active
            </div>
            <div className="text-[11px] text-rose-700 mt-0.5">
              FO V leading relief distribution (-10,185 packs)
            </div>
          </div>
        </div>
      </div>

      {/* Diverging Waterfall / Delta Bar Visualization */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Regional Delta Spectrum ({metricMode === 'ffpQty' ? 'Family Food Packs' : 'Total SSF Value'})
            </h3>
            <p className="text-xs text-slate-500">
              Green indicates inventory buildup / intake; Red indicates relief dispatches to affected LGUs
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
            {(['ALL', 'Replenished', 'Dispatched', 'Stable'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  filterType === f ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Diverging Bar Rows */}
        <div className="space-y-2 mt-2">
          {sortedVariances.map(v => {
            const delta = metricMode === 'ffpQty' ? v.deltaFFPQty : v.deltaTotalSSF;
            const isPositive = delta > 0;
            const isZero = delta === 0;
            const barWidthPercent = Math.min(100, (Math.abs(delta) / maxAbsDelta) * 100);

            return (
              <div 
                key={v.office} 
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors text-xs"
              >
                <div className="w-36 font-medium text-slate-900 truncate" title={v.office}>
                  {v.shortName}
                </div>

                {/* Left/Right Diverging Canvas */}
                <div className="flex-1 flex items-center h-6 bg-slate-100/70 rounded relative overflow-hidden">
                  {/* Center Line */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-300 z-10" />

                  {/* Left (Dispatched / Negative) */}
                  <div className="w-1/2 h-full flex justify-end items-center pr-0.5">
                    {!isPositive && !isZero && (
                      <div
                        className="h-4 bg-rose-500 rounded-l transition-all flex items-center justify-start pl-1 text-[10px] text-white font-mono"
                        style={{ width: `${barWidthPercent}%` }}
                      >
                        {barWidthPercent > 20 && (metricMode === 'ffpQty' ? formatNumber(delta) : formatPHP(delta, true))}
                      </div>
                    )}
                  </div>

                  {/* Right (Replenished / Positive) */}
                  <div className="w-1/2 h-full flex justify-start items-center pl-0.5">
                    {isPositive && (
                      <div
                        className="h-4 bg-emerald-600 rounded-r transition-all flex items-center justify-end pr-1 text-[10px] text-white font-mono"
                        style={{ width: `${barWidthPercent}%` }}
                      >
                        {barWidthPercent > 20 && (metricMode === 'ffpQty' ? `+${formatNumber(delta)}` : formatDelta(delta, true))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Delta Label */}
                <div className="w-28 text-right font-mono font-semibold">
                  <span className={isPositive ? 'text-emerald-600' : isZero ? 'text-slate-400' : 'text-rose-600'}>
                    {metricMode === 'ffpQty' ? formatDelta(delta) : formatDelta(delta, true)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Comparative Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900">
            Side-by-Side Incident Audit Trail
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit comparing baseline inventory vs current stockpile status
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 text-[11px] font-semibold">
                <th className="py-2.5 px-3">Office</th>
                <th className="py-2.5 px-3 text-right">Base FFP (18 Oct)</th>
                <th className="py-2.5 px-3 text-right">Current FFP (20 Oct)</th>
                <th className="py-2.5 px-3 text-right font-bold">FFP Net Delta</th>
                <th className="py-2.5 px-3 text-right">Base SSF Value</th>
                <th className="py-2.5 px-3 text-right">Current SSF Value</th>
                <th className="py-2.5 px-3 text-right font-bold">Value Net Delta</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {variances.map(v => (
                <tr key={v.office} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2 px-3 font-medium text-slate-900">{v.shortName}</td>
                  <td className="py-2 px-3 text-right font-mono text-slate-600">
                    {formatNumber(v.baseFFPQty)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-slate-900 font-semibold">
                    {formatNumber(v.currentFFPQty)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold">
                    <span className={v.deltaFFPQty > 0 ? 'text-emerald-600' : v.deltaFFPQty < 0 ? 'text-rose-600' : 'text-slate-400'}>
                      {formatDelta(v.deltaFFPQty)}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-slate-600">
                    {formatPHP(v.baseTotalSSF, true)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-slate-900 font-semibold">
                    {formatPHP(v.currentTotalSSF, true)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold">
                    <span className={v.deltaTotalSSF > 0 ? 'text-emerald-600' : v.deltaTotalSSF < 0 ? 'text-rose-600' : 'text-slate-400'}>
                      {formatDelta(v.deltaTotalSSF, true)}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                      v.activityType === 'Replenished' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      v.activityType === 'Dispatched' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      'bg-slate-50 text-slate-600 border border-slate-200'
                    }`}>
                      {v.activityType}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
