import React, { useState, useMemo } from 'react';
import { OfficeSSFData, RegionalPrepoData, RegionZone } from '../../types/ssf';
import { computePrepoData, computePrepoNationalSummary } from '../../data/prepoData';
import { 
  Building2, 
  Warehouse, 
  Users, 
  Package, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  ArrowUpDown, 
  Layers, 
  UtensilsCrossed, 
  Sparkles,
  MapPin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  RefreshCw
} from 'lucide-react';

interface PrepoSheetSectionProps {
  offices: OfficeSSFData[];
  asOfDate?: string;
  onManualSync?: () => void;
  isSyncing?: boolean;
}

export const PrepoSheetSection: React.FC<PrepoSheetSectionProps> = ({ 
  offices, 
  asOfDate = '29 October 2026, 06:00 AM',
  onManualSync,
  isSyncing = false
}) => {
  const [selectedZone, setSelectedZone] = useState<'ALL' | RegionZone | 'HUBS'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'targetPop' | 'capacity' | 'utilization' | 'ffpQty' | 'totalCost'>('utilization');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedOfficeDetail, setSelectedOfficeDetail] = useState<RegionalPrepoData | null>(null);

  // Compute prepo dataset from live offices
  const prepoData = useMemo(() => computePrepoData(offices), [offices]);
  const nationalSummary = useMemo(() => computePrepoNationalSummary(prepoData), [prepoData]);

  // Format currency helpers
  const formatPHP = (val: number, compact: boolean = false) => {
    if (compact) {
      if (val >= 1_000_000_000) return `₱${(val / 1_000_000_000).toFixed(2)}B`;
      if (val >= 1_000_000) return `₱${(val / 1_000_000).toFixed(2)}M`;
      if (val >= 1_000) return `₱${(val / 1_000).toFixed(1)}k`;
      return `₱${val.toLocaleString()}`;
    }
    return `₱${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatNumber = (val: number) => val.toLocaleString('en-US');

  // Filter & sort
  const filteredData = useMemo(() => {
    return prepoData.filter(item => {
      // Zone filter
      if (selectedZone === 'HUBS' && !item.isHub) return false;
      if (selectedZone !== 'ALL' && selectedZone !== 'HUBS' && item.zone !== selectedZone) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.officeName.toLowerCase().includes(q) || item.shortName.toLowerCase().includes(q);
        const matchesWarehouse = item.warehouseLocation.toLowerCase().includes(q);
        const matchesZone = item.zone.toLowerCase().includes(q);
        if (!matchesName && !matchesWarehouse && !matchesZone) return false;
      }

      return true;
    }).sort((a, b) => {
      let diff = 0;
      switch (sortBy) {
        case 'name':
          diff = a.officeName.localeCompare(b.officeName);
          break;
        case 'targetPop':
          diff = a.targetPopulation30 - b.targetPopulation30;
          break;
        case 'capacity':
          diff = a.maxWarehouseCapacityFFP - b.maxWarehouseCapacityFFP;
          break;
        case 'utilization':
          diff = a.currentWarehouseUtilizationPct - b.currentWarehouseUtilizationPct;
          break;
        case 'ffpQty':
          diff = a.ffpQuantity - b.ffpQuantity;
          break;
        case 'totalCost':
          diff = a.totalPrepoCommodityCost - b.totalPrepoCommodityCost;
          break;
        default:
          diff = 0;
      }
      return sortOrder === 'desc' ? -diff : diff;
    });
  }, [prepoData, selectedZone, searchQuery, sortBy, sortOrder]);

  const handleSort = (key: typeof sortBy) => {
    if (sortBy === key) {
      setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  const exportPrepoCSV = () => {
    const headers = [
      'Office Name',
      'Zone',
      'Warehouse Location',
      'Total Population',
      '30% Target Vulnerable Pop',
      'Target Households (5/family)',
      'Max Warehouse Capacity (FFP)',
      'Current Utilization (%)',
      'Warehouse Status',
      'Family Food Packs (FFP) Qty',
      'FFP Total Cost (PHP)',
      'Non-Food Relief Items NFRI (PHP)',
      'Ready-to-Eat Food RTEF Packs',
      'RTEF Total Cost (PHP)',
      'Other Food Items OFI (PHP)',
      'Other Non-Food Items (PHP)',
      'Total Prepo Commodity Cost (PHP)',
      '30% Household Coverage Ratio (%)'
    ];

    const rows = filteredData.map(d => [
      `"${d.officeName}"`,
      `"${d.zone}"`,
      `"${d.warehouseLocation}"`,
      d.totalPopulation,
      d.targetPopulation30,
      d.targetHouseholds,
      d.maxWarehouseCapacityFFP,
      `"${d.currentWarehouseUtilizationPct}%"`,
      `"${d.warehouseStatus}"`,
      d.ffpQuantity,
      d.ffpTotalCost,
      d.nonFoodItemsCost,
      d.readyToEatFoodPacks,
      d.readyToEatFoodCost,
      d.otherFoodItemsCost,
      d.otherNonFoodCost,
      d.totalPrepoCommodityCost,
      `"${d.coverageRatio30Pct}%"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DSWD_Prepo_Matrix_${asOfDate.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs mt-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <Warehouse className="w-3.5 h-3.5 text-blue-600" />
              Prepositioning (Prepo) Matrix
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live DRMB Benchmark · {asOfDate}
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 mt-1.5">
            Regional Prepositioning & Demographic Disaster Vulnerability
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 max-w-3xl">
            Prepositioned relief matrix incorporating <span className="font-semibold text-slate-700">30% of Total Population variables</span> (vulnerable family planning target), registered <span className="font-semibold text-slate-700">Maximum Warehouse Capacity</span>, <span className="font-semibold text-slate-700">Family Food Packs (FFP)</span>, <span className="font-semibold text-slate-700">Non-Food Relief Items (NFRI)</span>, <span className="font-semibold text-slate-700">Ready-to-Eat Food (RTEF)</span>, and <span className="font-semibold text-slate-700">Other Food Items (OFI)</span>.
          </p>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {onManualSync && (
            <button
              onClick={onManualSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 disabled:opacity-50 transition-colors cursor-pointer"
              title="Refresh and auto-sync live rows from DRMB"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Updating...' : 'Update Data'}</span>
            </button>
          )}

          <button
            onClick={exportPrepoCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs"
            title="Download Prepositioning Matrix as CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Prepo CSV</span>
          </button>

          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${viewMode === 'table' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Matrix Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${viewMode === 'cards' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Warehouse Cards
            </button>
          </div>
        </div>
      </div>

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 my-5">
        {/* 30% Pop Target */}
        <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-3.5 hover:border-blue-300 transition-colors">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 uppercase tracking-wide">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>30% Pop. Target</span>
          </div>
          <div className="text-lg font-black text-slate-900 mt-1">
            {(nationalSummary.national30PctTargetPopulation / 1_000_000).toFixed(2)}M
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {formatNumber(nationalSummary.national30PctTargetHouseholds)} vulnerable families
          </div>
        </div>

        {/* Max Warehouse Capacity & Utilization */}
        <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-3.5 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 uppercase tracking-wide">
            <div className="flex items-center gap-1.5">
              <Warehouse className="w-3.5 h-3.5 text-emerald-600" />
              <span>Warehouse Capacity</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 font-bold">
              {nationalSummary.totalWarehouseUtilizationPct}%
            </span>
          </div>
          <div className="text-lg font-black text-slate-900 mt-1">
            {formatNumber(nationalSummary.totalMaxWarehouseCapacity)}
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div 
              className="bg-emerald-600 h-full rounded-full" 
              style={{ width: `${Math.min(100, nationalSummary.totalWarehouseUtilizationPct)}%` }} 
            />
          </div>
        </div>

        {/* Family Food Packs */}
        <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-3.5 hover:border-indigo-300 transition-colors">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 uppercase tracking-wide">
            <Package className="w-3.5 h-3.5 text-indigo-600" />
            <span>Family Food Packs</span>
          </div>
          <div className="text-lg font-black text-slate-900 mt-1">
            {formatNumber(nationalSummary.totalFFPPrepositioned)}
          </div>
          <div className="text-[10px] text-indigo-600 font-semibold mt-0.5">
            {nationalSummary.average30PctCoverageRatio.toFixed(1)}% buffer coverage
          </div>
        </div>

        {/* Non-Food Items (NFRI) */}
        <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-3.5 hover:border-purple-300 transition-colors">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 uppercase tracking-wide">
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            <span>Non-Food Items (NFRI)</span>
          </div>
          <div className="text-lg font-black text-slate-900 mt-1">
            {formatPHP(nationalSummary.totalNFRICost, true)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Hygiene & sleeping kits, tents
          </div>
        </div>

        {/* Ready to Eat Food (RTEF) */}
        <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-3.5 hover:border-amber-300 transition-colors">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 uppercase tracking-wide">
            <UtensilsCrossed className="w-3.5 h-3.5 text-amber-600" />
            <span>Ready-to-Eat (RTEF)</span>
          </div>
          <div className="text-lg font-black text-slate-900 mt-1">
            {formatNumber(nationalSummary.totalRTEFPacks)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {formatPHP(nationalSummary.totalRTEFCost, true)} emergency rations
          </div>
        </div>

        {/* Other Food Items (OFI) */}
        <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-3.5 hover:border-teal-300 transition-colors">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Other Food (OFI)</span>
          </div>
          <div className="text-lg font-black text-slate-900 mt-1">
            {formatPHP(nationalSummary.totalOtherFoodCost, true)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Raw rice reserves & canned goods
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        {/* Zone Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          {(['ALL', 'Luzon', 'Visayas', 'Mindanao', 'HUBS'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedZone(tab)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                selectedZone === tab
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'ALL' ? 'All Locations' : tab === 'HUBS' ? 'Strategic Hubs' : tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search region, office, or hub..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3.5">
                  <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-blue-700">
                    <span>Office / Warehouse</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3 px-3 text-center">Zone</th>
                <th className="py-3 px-3 text-right">
                  <button onClick={() => handleSort('targetPop')} className="flex items-center justify-end gap-1 w-full hover:text-blue-700">
                    <span>30% Pop. Target</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3 px-3 text-right">
                  <button onClick={() => handleSort('capacity')} className="flex items-center justify-end gap-1 w-full hover:text-blue-700">
                    <span>Warehouse Cap.</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3 px-3 text-center">
                  <button onClick={() => handleSort('utilization')} className="flex items-center justify-center gap-1 w-full hover:text-blue-700">
                    <span>Capacity %</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3 px-3 text-right">
                  <button onClick={() => handleSort('ffpQty')} className="flex items-center justify-end gap-1 w-full hover:text-blue-700">
                    <span>Family Food Packs</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3 px-3 text-right">Non-Food (NFRI)</th>
                <th className="py-3 px-3 text-right">RTEF (Pouches)</th>
                <th className="py-3 px-3 text-right">Other Food (OFI)</th>
                <th className="py-3 px-3 text-right">
                  <button onClick={() => handleSort('totalCost')} className="flex items-center justify-end gap-1 w-full hover:text-blue-700">
                    <span>Total Prepo SSF</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3 px-3 text-center">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {filteredData.map((item, idx) => {
                const isCriticalCap = item.currentWarehouseUtilizationPct >= 95;
                const isOptimalCap = item.currentWarehouseUtilizationPct >= 80 && item.currentWarehouseUtilizationPct < 95;

                return (
                  <tr 
                    key={item.officeId}
                    className={`hover:bg-blue-50/40 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'} ${item.isHub ? 'font-medium' : ''}`}
                  >
                    {/* Office / Warehouse */}
                    <td className="py-3 px-3.5">
                      <div className="flex items-start gap-2">
                        <div className={`mt-0.5 p-1 rounded-md ${item.isHub ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                          {item.isHub ? <Warehouse className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{item.shortName}</span>
                            {item.isHub && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                                Strategic Hub
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 max-w-[200px] truncate" title={item.warehouseLocation}>
                            <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                            <span className="truncate">{item.warehouseLocation}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Zone */}
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.zone === 'Luzon' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                        item.zone === 'Visayas' ? 'bg-teal-50 text-teal-800 border border-teal-200' :
                        item.zone === 'Mindanao' ? 'bg-purple-50 text-purple-800 border border-purple-200' :
                        'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}>
                        {item.zone}
                      </span>
                    </td>

                    {/* 30% Pop. Target */}
                    <td className="py-3 px-3 text-right">
                      {item.totalPopulation > 0 ? (
                        <div>
                          <div className="font-bold text-slate-900 font-mono">
                            {formatNumber(item.targetPopulation30)}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {formatNumber(item.targetHouseholds)} families (30%)
                          </div>
                        </div>
                      ) : (
                        <div className="text-slate-400 italic text-[11px]">
                          National Logistics Buffer
                        </div>
                      )}
                    </td>

                    {/* Warehouse Capacity */}
                    <td className="py-3 px-3 text-right font-mono font-medium text-slate-800">
                      {formatNumber(item.maxWarehouseCapacityFFP)} packs
                    </td>

                    {/* Capacity Utilization % */}
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex flex-col items-center min-w-[70px]">
                        <span className={`text-[11px] font-mono font-bold ${
                          isCriticalCap ? 'text-rose-700' : isOptimalCap ? 'text-amber-700' : 'text-emerald-700'
                        }`}>
                          {item.currentWarehouseUtilizationPct}%
                        </span>
                        <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                          <div 
                            className={`h-full rounded-full ${
                              isCriticalCap ? 'bg-rose-600' : isOptimalCap ? 'bg-amber-500' : 'bg-emerald-600'
                            }`}
                            style={{ width: `${Math.min(100, item.currentWarehouseUtilizationPct)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Family Food Packs */}
                    <td className="py-3 px-3 text-right">
                      <div className="font-bold text-slate-900 font-mono">
                        {formatNumber(item.ffpQuantity)}
                      </div>
                      <div className="text-[10px] text-blue-700 font-semibold font-mono">
                        {formatPHP(item.ffpTotalCost, true)}
                      </div>
                    </td>

                    {/* Non-Food (NFRI) */}
                    <td className="py-3 px-3 text-right font-mono text-slate-800">
                      {formatPHP(item.nonFoodItemsCost, true)}
                    </td>

                    {/* RTEF */}
                    <td className="py-3 px-3 text-right">
                      <div className="font-mono text-slate-800">
                        {formatNumber(item.readyToEatFoodPacks)}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {formatPHP(item.readyToEatFoodCost, true)}
                      </div>
                    </td>

                    {/* Other Food Items */}
                    <td className="py-3 px-3 text-right font-mono text-slate-800">
                      {formatPHP(item.otherFoodItemsCost, true)}
                    </td>

                    {/* Total Prepo SSF */}
                    <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono">
                      {formatPHP(item.totalPrepoCommodityCost, true)}
                    </td>

                    {/* Detail button */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => setSelectedOfficeDetail(item)}
                        className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Prepo Sheet Specifications"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* National Totals Row */}
            <tfoot>
              <tr className="bg-slate-100 font-extrabold text-slate-900 border-t-2 border-slate-300">
                <td className="py-3 px-3.5">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-700" />
                    <span>NATIONAL TOTAL / READINESS</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    PHILIPPINES
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-mono">
                  <div>{formatNumber(nationalSummary.national30PctTargetPopulation)}</div>
                  <div className="text-[10px] text-slate-500 font-normal">
                    {formatNumber(nationalSummary.national30PctTargetHouseholds)} families
                  </div>
                </td>
                <td className="py-3 px-3 text-right font-mono">
                  {formatNumber(nationalSummary.totalMaxWarehouseCapacity)} packs
                </td>
                <td className="py-3 px-3 text-center font-mono text-emerald-800">
                  {nationalSummary.totalWarehouseUtilizationPct}%
                </td>
                <td className="py-3 px-3 text-right font-mono">
                  <div>{formatNumber(nationalSummary.totalFFPPrepositioned)}</div>
                  <div className="text-[10px] text-blue-700">
                    {formatPHP(prepoData.reduce((acc, d) => acc + d.ffpTotalCost, 0), true)}
                  </div>
                </td>
                <td className="py-3 px-3 text-right font-mono">
                  {formatPHP(nationalSummary.totalNFRICost, true)}
                </td>
                <td className="py-3 px-3 text-right font-mono">
                  <div>{formatNumber(nationalSummary.totalRTEFPacks)}</div>
                  <div className="text-[10px] text-slate-500 font-normal">
                    {formatPHP(nationalSummary.totalRTEFCost, true)}
                  </div>
                </td>
                <td className="py-3 px-3 text-right font-mono">
                  {formatPHP(nationalSummary.totalOtherFoodCost, true)}
                </td>
                <td className="py-3 px-3 text-right font-mono text-blue-900">
                  {formatPHP(nationalSummary.totalPrepoCommoditiesCost, true)}
                </td>
                <td className="py-3 px-3 text-center text-slate-400">
                  —
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Warehouse Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map(item => {
            const isCriticalCap = item.currentWarehouseUtilizationPct >= 95;
            const isOptimalCap = item.currentWarehouseUtilizationPct >= 80 && item.currentWarehouseUtilizationPct < 95;

            return (
              <div 
                key={item.officeId}
                className="bg-slate-50/70 border border-slate-200 rounded-xl p-4.5 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.zone === 'Luzon' ? 'bg-amber-100 text-amber-800' :
                          item.zone === 'Visayas' ? 'bg-teal-100 text-teal-800' :
                          item.zone === 'Mindanao' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {item.zone}
                        </span>
                        {item.isHub && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-100 text-indigo-800">
                            Strategic Hub
                          </span>
                        )}
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-1.5">
                        {item.shortName}
                      </h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{item.warehouseLocation}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                        isCriticalCap ? 'bg-rose-100 text-rose-800' :
                        isOptimalCap ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.currentWarehouseUtilizationPct}% Cap
                      </span>
                    </div>
                  </div>

                  {/* Demographic & Capacity Row */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                        30% Pop. Target
                      </span>
                      <span className="font-bold text-slate-800 font-mono">
                        {item.totalPopulation > 0 ? formatNumber(item.targetPopulation30) : 'National Buffer'}
                      </span>
                      {item.totalPopulation > 0 && (
                        <span className="text-[10px] text-slate-500 block">
                          {formatNumber(item.targetHouseholds)} families
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                        Warehouse Capacity
                      </span>
                      <span className="font-bold text-slate-800 font-mono">
                        {formatNumber(item.maxWarehouseCapacityFFP)} packs
                      </span>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                        <div 
                          className={`h-full rounded-full ${isCriticalCap ? 'bg-rose-500' : isOptimalCap ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(100, item.currentWarehouseUtilizationPct)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4 Commodity Pills */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200 text-xs">
                    <div className="bg-white p-2 rounded-lg border border-slate-150">
                      <div className="text-[10px] font-semibold text-slate-500 uppercase">Family Food Packs</div>
                      <div className="font-extrabold text-blue-900 font-mono mt-0.5">{formatNumber(item.ffpQuantity)}</div>
                      <div className="text-[10px] text-blue-600 font-mono">{formatPHP(item.ffpTotalCost, true)}</div>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-slate-150">
                      <div className="text-[10px] font-semibold text-slate-500 uppercase">Non-Food (NFRI)</div>
                      <div className="font-extrabold text-purple-900 font-mono mt-0.5">{formatPHP(item.nonFoodItemsCost, true)}</div>
                      <div className="text-[10px] text-slate-500">Hygiene & Tents</div>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-slate-150">
                      <div className="text-[10px] font-semibold text-slate-500 uppercase">Ready-to-Eat (RTEF)</div>
                      <div className="font-extrabold text-amber-900 font-mono mt-0.5">{formatNumber(item.readyToEatFoodPacks)}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{formatPHP(item.readyToEatFoodCost, true)}</div>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-slate-150">
                      <div className="text-[10px] font-semibold text-slate-500 uppercase">Other Food (OFI)</div>
                      <div className="font-extrabold text-teal-900 font-mono mt-0.5">{formatPHP(item.otherFoodItemsCost, true)}</div>
                      <div className="text-[10px] text-slate-500">Raw Rice & Canned</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block">Total Prepo Assets</span>
                    <span className="font-extrabold text-slate-900 font-mono">{formatPHP(item.totalPrepoCommodityCost, true)}</span>
                  </div>
                  <button
                    onClick={() => setSelectedOfficeDetail(item)}
                    className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                  >
                    View Matrix
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Prepo Inspection Modal */}
      {selectedOfficeDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold">
                  <Warehouse className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">
                    {selectedOfficeDetail.officeName}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedOfficeDetail.warehouseLocation}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOfficeDetail(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-5 space-y-4 text-xs">
              {/* 30% Population Benchmark Box */}
              <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-1.5 font-bold text-blue-900 uppercase text-[11px]">
                  <Users className="w-4 h-4 text-blue-700" />
                  <span>30% Target Vulnerable Population Baseline</span>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-3 text-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Total Regional Population</span>
                    <span className="text-sm font-bold font-mono">
                      {selectedOfficeDetail.totalPopulation > 0 ? formatNumber(selectedOfficeDetail.totalPopulation) : 'National Reserve Hub'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">30% Vulnerable Pop. Target</span>
                    <span className="text-sm font-bold font-mono text-blue-800">
                      {selectedOfficeDetail.totalPopulation > 0 ? formatNumber(selectedOfficeDetail.targetPopulation30) : 'Strategic Buffer'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Target Vulnerable Households</span>
                    <span className="text-sm font-bold font-mono text-blue-800">
                      {selectedOfficeDetail.totalPopulation > 0 ? formatNumber(selectedOfficeDetail.targetHouseholds) : 'Multi-Regional'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warehouse Capacity & Utilization */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 uppercase text-[11px]">
                    <Warehouse className="w-4 h-4 text-emerald-600" />
                    <span>Warehouse Capacity & Storage Saturation</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-700">
                    {selectedOfficeDetail.currentWarehouseUtilizationPct}% Utilized
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2.5">
                  <div 
                    className={`h-full rounded-full ${selectedOfficeDetail.currentWarehouseUtilizationPct >= 95 ? 'bg-rose-500' : 'bg-emerald-600'}`}
                    style={{ width: `${Math.min(100, selectedOfficeDetail.currentWarehouseUtilizationPct)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-2">
                  <span>Prepositioned: {formatNumber(selectedOfficeDetail.ffpQuantity)} packs</span>
                  <span>Max Rated Capacity: {formatNumber(selectedOfficeDetail.maxWarehouseCapacityFFP)} packs</span>
                </div>
              </div>

              {/* Commodities Matrix */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <h5 className="font-bold text-slate-900 mb-3 text-[11px] uppercase tracking-wider">
                  Prepositioned Relief Commodity Specifications
                </h5>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-150">
                    <div>
                      <span className="font-bold text-slate-900 block">Family Food Packs (FFP)</span>
                      <span className="text-[11px] text-slate-500">{formatNumber(selectedOfficeDetail.ffpQuantity)} standard 6-kg family rations</span>
                    </div>
                    <span className="font-bold font-mono text-blue-700">{formatPHP(selectedOfficeDetail.ffpTotalCost)}</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-150">
                    <div>
                      <span className="font-bold text-slate-900 block">Non-Food Relief Items (NFRI)</span>
                      <span className="text-[11px] text-slate-500">Hygiene kits, sleeping kits, kitchen sets, modular evacuation tents</span>
                    </div>
                    <span className="font-bold font-mono text-purple-700">{formatPHP(selectedOfficeDetail.nonFoodItemsCost)}</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-150">
                    <div>
                      <span className="font-bold text-slate-900 block">Ready-to-Eat Food (RTEF)</span>
                      <span className="text-[11px] text-slate-500">{formatNumber(selectedOfficeDetail.readyToEatFoodPacks)} emergency retort meal pouches & arroz caldo</span>
                    </div>
                    <span className="font-bold font-mono text-amber-700">{formatPHP(selectedOfficeDetail.readyToEatFoodCost)}</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-150">
                    <div>
                      <span className="font-bold text-slate-900 block">Other Food Items (OFI)</span>
                      <span className="text-[11px] text-slate-500">Raw rice buffer stock, vacuum-packed tuna/sardines, instant beverages</span>
                    </div>
                    <span className="font-bold font-mono text-teal-700">{formatPHP(selectedOfficeDetail.otherFoodItemsCost)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200">
                  <span className="font-bold text-slate-700 uppercase text-[11px]">Total Prepositioned Stockpile Value</span>
                  <span className="font-black text-sm text-slate-900 font-mono">
                    {formatPHP(selectedOfficeDetail.totalPrepoCommodityCost)}
                  </span>
                </div>
              </div>

              {/* Logistical & Operational Alerts */}
              {selectedOfficeDetail.criticalItemAlerts && selectedOfficeDetail.criticalItemAlerts.length > 0 && (
                <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900">
                  <span className="font-bold block mb-1">Operational Logistics Notes:</span>
                  <ul className="list-disc list-inside space-y-0.5">
                    {selectedOfficeDetail.criticalItemAlerts.map((alert, i) => (
                      <li key={i}>{alert}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-5 pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedOfficeDetail(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-colors"
              >
                Close Specification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
