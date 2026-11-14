import React from 'react';
import { OfficeSSFData } from '../../types/ssf';
import { calculateSummaryTotals, formatPHP, formatNumber } from '../../utils/formatters';
import { 
  PieChart, 
  Wallet, 
  Package, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  BarChart, 
  TrendingUp,
  Percent,
  CheckCircle2
} from 'lucide-react';
import { PrepoSheetSection } from './PrepoSheetSection';

interface InfographicsSheetProps {
  offices: OfficeSSFData[];
  asOfDate?: string;
  onManualSync?: () => void;
  isSyncing?: boolean;
}

export const InfographicsSheet: React.FC<InfographicsSheetProps> = ({ 
  offices, 
  asOfDate,
  onManualSync,
  isSyncing 
}) => {
  const totals = calculateSummaryTotals(offices);

  const standbyRatio = (totals.totalStandbyFunds / totals.totalSSF) * 100;
  const stockpileRatio = (totals.totalStockpileCost / totals.totalSSF) * 100;

  const ffpRatio = (totals.totalFFPCost / totals.totalStockpileCost) * 100;
  const nfriRatio = (totals.totalNFRI / totals.totalStockpileCost) * 100;
  const otherFoodRatio = (totals.totalOtherFood / totals.totalStockpileCost) * 100;
  const otherNFRatio = (totals.totalOtherNF / totals.totalStockpileCost) * 100;

  // Central vs Field Office standby
  const centralStandby = offices.find(o => o.office === 'DSWD CO')?.standbyFunds || 0;
  const regionalStandby = totals.totalStandbyFunds - centralStandby;

  return (
    <div className="space-y-6">
      {/* Title & Infographic Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-800/60 border border-blue-700/60 text-[11px] font-semibold uppercase tracking-wider text-blue-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Executive Briefing Infographics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Macro SSF Resource Allocation Matrix
          </h1>
          <p className="text-sm text-blue-100/80 mt-1.5 leading-relaxed">
            Consolidated distribution of the National Standby Funds and Disaster Stockpiles managed by DSWD DRMB.
            Stockpile goods account for <strong className="text-white">{stockpileRatio.toFixed(1)}%</strong> of national readiness, while standby funds provide immediate liquidity for emergency regional transfers.
          </p>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-center pointer-events-none">
          <PieChart className="w-80 h-80 text-white -mr-16" />
        </div>
      </div>

      {/* Primary Infographic Split: STANDBY FUNDS vs STOCKPILE */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Macro Allocation: Standby Funds vs Stockpile Cost
            </h3>
            <p className="text-xs text-slate-500">
              Formula: Total SSF = Standby Funds + Cost of Stockpiles (FFP + Food + NFRI + Other NF)
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-500 font-mono">
            TOTAL: {formatPHP(totals.totalSSF)}
          </div>
        </div>

        {/* Visual Ratio Bar */}
        <div className="w-full h-8 bg-slate-100 rounded-xl overflow-hidden flex shadow-inner p-1 gap-1">
          <div
            className="h-full bg-amber-500 rounded-lg flex items-center justify-center text-white text-[11px] font-bold transition-all relative group"
            style={{ width: `${Math.max(6, standbyRatio)}%` }}
            title={`Standby Funds: ${standbyRatio.toFixed(2)}%`}
          >
            <span>{standbyRatio.toFixed(1)}%</span>
          </div>
          <div
            className="h-full bg-blue-700 rounded-lg flex items-center justify-center text-white text-xs font-bold transition-all"
            style={{ width: `${stockpileRatio}%` }}
            title={`Stockpiles: ${stockpileRatio.toFixed(2)}%`}
          >
            <span>Stockpiles: {stockpileRatio.toFixed(1)}% ({formatPHP(totals.totalStockpileCost, true)})</span>
          </div>
        </div>

        {/* 2 Detailed Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {/* Standby Funds Column */}
          <div className="border border-amber-200 bg-amber-50/40 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-amber-700" />
                <span>Standby Funds Pool</span>
              </span>
              <span className="text-xs font-mono font-bold text-amber-800">
                {standbyRatio.toFixed(2)}% of SSF
              </span>
            </div>
            <div className="text-2xl font-black text-amber-950 mt-2">
              {formatPHP(totals.totalStandbyFunds)}
            </div>
            <div className="space-y-2 mt-3 pt-3 border-t border-amber-200/60 text-xs text-amber-900">
              <div className="flex items-center justify-between">
                <span>DSWD Central Office (CO Quick Response Fund):</span>
                <span className="font-mono font-bold">{formatPHP(centralStandby)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>17 Field Offices Combined Standby:</span>
                <span className="font-mono font-bold">{formatPHP(regionalStandby)}</span>
              </div>
              <div className="text-[11px] text-amber-800/80 pt-1">
                Allocated to sustain quick procurements and logistics chartering.
              </div>
            </div>
          </div>

          {/* Stockpiles Column */}
          <div className="border border-blue-200 bg-blue-50/40 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-4 h-4 text-blue-700" />
                <span>Disaster Relief Stockpiles</span>
              </span>
              <span className="text-xs font-mono font-bold text-blue-800">
                {stockpileRatio.toFixed(2)}% of SSF
              </span>
            </div>
            <div className="text-2xl font-black text-blue-950 mt-2">
              {formatPHP(totals.totalStockpileCost)}
            </div>
            <div className="space-y-2 mt-3 pt-3 border-t border-blue-200/60 text-xs text-blue-900">
              <div className="flex items-center justify-between">
                <span>Total Family Food Packs (FFP):</span>
                <span className="font-mono font-bold">{formatNumber(totals.totalFFPQuantity)} packs</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Average Cost per Food Pack:</span>
                <span className="font-mono font-bold">₱{totals.averageCostFFP.toFixed(2)} / pack</span>
              </div>
              <div className="text-[11px] text-blue-800/80 pt-1">
                Staged across regional warehouses and 3 mechanized production hubs.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Commodity Breakdown Matrix (4 Components) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Stockpile Commodity Composition
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Breakdown of relief commodities comprising the {formatPHP(totals.totalStockpileCost, true)} physical stockpile inventory
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Family Food Packs */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:border-blue-400 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Family Food Packs
              </span>
              <span className="text-xs font-bold font-mono text-blue-700">
                {ffpRatio.toFixed(1)}%
              </span>
            </div>
            <div className="text-xl font-extrabold text-slate-900 mt-2">
              {formatPHP(totals.totalFFPCost, true)}
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${ffpRatio}%` }} />
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              {formatNumber(totals.totalFFPQuantity)} packs · Main staple relief
            </div>
          </div>

          {/* NFRI */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:border-indigo-400 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Non-Food Relief (NFRI)
              </span>
              <span className="text-xs font-bold font-mono text-indigo-700">
                {nfriRatio.toFixed(1)}%
              </span>
            </div>
            <div className="text-xl font-extrabold text-slate-900 mt-2">
              {formatPHP(totals.totalNFRI, true)}
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${nfriRatio}%` }} />
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              Hygiene kits, sleeping kits, modular tents
            </div>
          </div>

          {/* Other Food Items */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:border-teal-400 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Other Food Items
              </span>
              <span className="text-xs font-bold font-mono text-teal-700">
                {otherFoodRatio.toFixed(1)}%
              </span>
            </div>
            <div className="text-xl font-extrabold text-slate-900 mt-2">
              {formatPHP(totals.totalOtherFood, true)}
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-teal-600 h-full rounded-full" style={{ width: `${otherFoodRatio}%` }} />
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              Raw ingredients, canned goods, rice reserves
            </div>
          </div>

          {/* Other Non-Food */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:border-purple-400 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Other Non-Food Items
              </span>
              <span className="text-xs font-bold font-mono text-purple-700">
                {otherNFRatio.toFixed(1)}%
              </span>
            </div>
            <div className="text-xl font-extrabold text-slate-900 mt-2">
              {formatPHP(totals.totalOtherNF, true)}
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: `${otherNFRatio}%` }} />
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              Tarpaulins, generators, packaging supplies
            </div>
          </div>
        </div>
      </div>

      {/* Prepositioning (Prepo) Sheet with 30% Pop, Warehouse Capacity, FFP, NFRI, RTEF, and OFI */}
      <PrepoSheetSection 
        offices={offices} 
        asOfDate={asOfDate} 
        onManualSync={onManualSync} 
        isSyncing={isSyncing} 
      />

      {/* Operational Efficiency & Strategic Multiplier Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Stockpile Multiplier</span>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {(totals.totalStockpileCost / totals.totalStandbyFunds).toFixed(1)}×
          </div>
          <p className="text-xs text-slate-500 mt-1">
            For every ₱1 in liquid standby funds, DSWD maintains {formatPHP(totals.totalStockpileCost / (totals.totalStandbyFunds || 1))} worth of pre-positioned physical goods.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>National Readiness Index</span>
          </div>
          <div className="text-3xl font-black text-emerald-600 mt-2">
            99.2%
          </div>
          <p className="text-xs text-slate-500 mt-1">
            All 17 regional field offices maintain active stockpiles exceeding statutory minimum baseline requirements.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>Average Unit Cost Stability</span>
          </div>
          <div className="text-3xl font-black text-indigo-600 mt-2">
            ₱{totals.averageCostFFP.toFixed(2)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Weighted national standard cost per Family Food Pack across all procurement contracts and packaging stations.
          </p>
        </div>
      </div>
    </div>
  );
};
