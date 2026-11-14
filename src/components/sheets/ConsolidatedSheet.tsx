import React, { useState } from 'react';
import { OfficeSSFData, ChartCustomization } from '../../types/ssf';
import { 
  formatPHP, 
  formatNumber, 
  calculateSummaryTotals 
} from '../../utils/formatters';
import { InteractiveChart } from '../charts/InteractiveChart';
import { ChartControls } from '../ChartControls';
import { 
  Coins, 
  Package, 
  Boxes, 
  ShieldAlert, 
  ArrowUpRight, 
  Search, 
  Download,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface ConsolidatedSheetProps {
  offices: OfficeSSFData[];
  asOfDate: string;
}

export const ConsolidatedSheet: React.FC<ConsolidatedSheetProps> = ({
  offices,
  asOfDate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [zoneFilter, setZoneFilter] = useState<'ALL' | 'Central' | 'Luzon' | 'Visayas' | 'Mindanao'>('ALL');
  const [chartCustomization, setChartCustomization] = useState<ChartCustomization>({
    chartType: 'grouped-bar',
    primaryMetric: 'totalSSF',
    regionFilter: 'ALL',
    colorTheme: 'dswd-classic',
    sortBy: 'value-desc',
    unitScale: 'auto',
    showThresholdLine: true,
    showDataLabels: true
  });

  const totals = calculateSummaryTotals(offices);

  const filteredOffices = offices.filter(o => {
    const matchesSearch = o.office.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.shortName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = zoneFilter === 'ALL' || o.zone === zoneFilter;
    return matchesSearch && matchesZone;
  });

  const exportTableCSV = () => {
    const headers = [
      'Office',
      'Standby Funds (PHP)',
      'FFP Quantity',
      'FFP Total Cost (PHP)',
      'Other Food Items (PHP)',
      'NFRI Total Cost (PHP)',
      'Other Non-Food (PHP)',
      'Total SSF (PHP)',
      'Average Cost/FFP'
    ];
    const rows = offices.map(o => [
      `"${o.office}"`,
      o.standbyFunds.toFixed(2),
      o.ffpQuantity,
      o.ffpTotalCost.toFixed(2),
      o.otherFoodCost.toFixed(2),
      o.nonFoodReliefCost.toFixed(2),
      o.otherNonFoodCost.toFixed(2),
      o.totalSSF.toFixed(2),
      o.averageCostFFP.toFixed(2)
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DSWD_Consolidated_SSF_${asOfDate.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Executive KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total SSF */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Standby Funds & Stockpile
            </span>
            <span className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <Boxes className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
              {formatPHP(totals.totalSSF)}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
              <span className="font-medium text-emerald-600 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                100% Operational
              </span>
              <span>·</span>
              <span>{totals.officeCount} Reporting Centers</span>
            </div>
          </div>
        </div>

        {/* Standby Funds */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Standby Funds (QRF)
            </span>
            <span className="p-2 bg-amber-50 text-amber-700 rounded-lg">
              <Coins className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
              {formatPHP(totals.totalStandbyFunds)}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
              <span className="text-slate-700 font-medium">DSWD CO: {formatPHP(offices.find(o => o.office === 'DSWD CO')?.standbyFunds || 0, true)}</span>
              <span>·</span>
              <span>FOs: {formatPHP(totals.totalStandbyFunds - (offices.find(o => o.office === 'DSWD CO')?.standbyFunds || 0), true)}</span>
            </div>
          </div>
        </div>

        {/* Family Food Packs */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Family Food Packs (FFP)
            </span>
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <Package className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
              {formatNumber(totals.totalFFPQuantity)} <span className="text-sm font-semibold text-slate-500">packs</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
              <span className="font-medium text-slate-700">Valued at {formatPHP(totals.totalFFPCost, true)}</span>
              <span>·</span>
              <span>Avg ₱{totals.averageCostFFP.toFixed(2)}/pk</span>
            </div>
          </div>
        </div>

        {/* Relief Commodities (NFRI & Food) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Other Food & Non-Food Relief
            </span>
            <span className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
              {formatPHP(totals.totalNFRI + totals.totalOtherFood + totals.totalOtherNF)}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
              <span>NFRI: {formatPHP(totals.totalNFRI, true)}</span>
              <span>·</span>
              <span>Food: {formatPHP(totals.totalOtherFood, true)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Customizer & Visualizer */}
      <div className="space-y-4">
        <ChartControls
          customization={chartCustomization}
          onChange={updated => setChartCustomization(prev => ({ ...prev, ...updated }))}
        />

        <InteractiveChart
          data={offices}
          customization={chartCustomization}
          title="Jurisdiction Allocation & Relief Resource Matrix"
          subtitle={`Interactive visualization of ${offices.length} Field Offices and Logistics Hubs as of ${asOfDate}`}
          height={390}
        />
      </div>

      {/* Comprehensive Operational Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Detailed SSF Monitoring Ledger
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Official consolidated inventory across Central Office, NRLMB hubs, and 17 regional field offices
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search office..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
              />
            </div>

            {/* Zone Filter */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 p-0.5 rounded-lg text-xs">
              {(['ALL', 'Luzon', 'Visayas', 'Mindanao'] as const).map(z => (
                <button
                  key={z}
                  onClick={() => setZoneFilter(z)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                    zoneFilter === z ? 'bg-blue-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {z}
                </button>
              ))}
            </div>

            {/* CSV Export */}
            <button
              onClick={exportTableCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Scrollable Table Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 font-semibold text-[11px]">
                <th className="py-3 px-3.5 sticky left-0 bg-slate-100 z-10">Office / Logistics Hub</th>
                <th className="py-3 px-3">Cluster</th>
                <th className="py-3 px-3 text-right">Standby Funds (PHP)</th>
                <th className="py-3 px-3 text-right">FFP Quantity</th>
                <th className="py-3 px-3 text-right">FFP Total Cost</th>
                <th className="py-3 px-3 text-right">Other Food</th>
                <th className="py-3 px-3 text-right">NFRI Total Cost</th>
                <th className="py-3 px-3 text-right">Other Non-Food</th>
                <th className="py-3 px-3.5 text-right font-bold text-slate-900">Total SSF</th>
                <th className="py-3 px-3 text-right">Avg Cost/FFP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
              {filteredOffices.map((row) => (
                <tr 
                  key={row.id} 
                  className={`hover:bg-blue-50/40 transition-colors ${row.isHub ? 'bg-slate-50/50' : ''}`}
                >
                  <td className="py-2.5 px-3.5 font-medium text-slate-900 sticky left-0 bg-white hover:bg-blue-50/40 z-10 flex items-center gap-2">
                    {row.isHub ? (
                      <span className="w-2 h-2 rounded-full bg-indigo-600" title="NRLMB Resource Center" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                    <span>{row.office}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                    {row.zone}
                  </td>
                  <td className={`py-2.5 px-3 text-right font-mono ${row.standbyFunds === 0 ? 'text-slate-400' : 'text-slate-900'}`}>
                    {row.standbyFunds > 0 ? formatPHP(row.standbyFunds) : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-900">
                    {row.ffpQuantity > 0 ? formatNumber(row.ffpQuantity) : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                    {row.ffpTotalCost > 0 ? formatPHP(row.ffpTotalCost) : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                    {row.otherFoodCost > 0 ? formatPHP(row.otherFoodCost) : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                    {row.nonFoodReliefCost > 0 ? formatPHP(row.nonFoodReliefCost) : '—'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                    {row.otherNonFoodCost > 0 ? formatPHP(row.otherNonFoodCost) : '—'}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono font-bold text-blue-900 bg-blue-50/30">
                    {formatPHP(row.totalSSF)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                    {row.averageCostFFP > 0 ? `₱${row.averageCostFFP.toFixed(2)}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Grand Total Footer */}
            <tfoot>
              <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                <td className="py-3 px-3.5 sticky left-0 bg-slate-100 z-10">
                  NATIONAL TOTAL
                </td>
                <td className="py-3 px-3 text-slate-500 text-[11px]">
                  ALL REGIONS
                </td>
                <td className="py-3 px-3 text-right font-mono text-blue-950">
                  {formatPHP(totals.totalStandbyFunds)}
                </td>
                <td className="py-3 px-3 text-right font-mono text-blue-950">
                  {formatNumber(totals.totalFFPQuantity)}
                </td>
                <td className="py-3 px-3 text-right font-mono text-blue-950">
                  {formatPHP(totals.totalFFPCost)}
                </td>
                <td className="py-3 px-3 text-right font-mono text-blue-950">
                  {formatPHP(totals.totalOtherFood)}
                </td>
                <td className="py-3 px-3 text-right font-mono text-blue-950">
                  {formatPHP(totals.totalNFRI)}
                </td>
                <td className="py-3 px-3 text-right font-mono text-blue-950">
                  {formatPHP(totals.totalOtherNF)}
                </td>
                <td className="py-3 px-3.5 text-right font-mono font-extrabold text-blue-950 bg-blue-100/60">
                  {formatPHP(totals.totalSSF)}
                </td>
                <td className="py-3 px-3 text-right font-mono text-blue-950">
                  ₱{totals.averageCostFFP.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
