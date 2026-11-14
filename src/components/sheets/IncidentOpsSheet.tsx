import React, { useState } from 'react';
import { OfficeSSFData } from '../../types/ssf';
import { calculateSummaryTotals, formatPHP, formatNumber } from '../../utils/formatters';
import { 
  Presentation, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  Share2, 
  Download,
  Boxes,
  ShieldCheck,
  Calendar
} from 'lucide-react';

interface IncidentOpsSheetProps {
  offices: OfficeSSFData[];
  asOfDate: string;
}

export const IncidentOpsSheet: React.FC<IncidentOpsSheetProps> = ({ offices, asOfDate }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const totals = calculateSummaryTotals(offices);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const coStandby = offices.find(o => o.office === 'DSWD CO')?.standbyFunds || 0;
  const foStandby = totals.totalStandbyFunds - coStandby;
  const hubs = offices.filter(o => o.isHub);
  const hubFFP = hubs.reduce((acc, h) => acc + h.ffpQuantity, 0);
  const hubCost = hubs.reduce((acc, h) => acc + h.ffpTotalCost, 0);

  const generateSlideText = () => {
    return `DSWD DISASTER RESPONSE MANAGEMENT BUREAU (DRMB)
STOCKPILE AND STANDBY FUNDS (SSF) EXECUTIVE SUMMARY
As of: ${asOfDate}

• TOTAL STANDBY FUNDS & STOCKPILE: ${formatPHP(totals.totalSSF)}
• STANDBY FUNDS (QRF): ${formatPHP(totals.totalStandbyFunds)}
  - Central Office (CO): ${formatPHP(coStandby)}
  - Field Offices (FOs): ${formatPHP(foStandby)}
• FAMILY FOOD PACKS (FFP): ${formatNumber(totals.totalFFPQuantity)} packs (Valued at ${formatPHP(totals.totalFFPCost)})
• OTHER FOOD COMMODITIES: ${formatPHP(totals.totalOtherFood)}
• NON-FOOD RELIEF ITEMS (NFRI): ${formatPHP(totals.totalNFRI)}
• OTHER NON-FOOD ITEMS: ${formatPHP(totals.totalOtherNF)}
• NATIONAL AVERAGE COST/PACK: ₱${totals.averageCostFFP.toFixed(2)}
• STRATEGIC HUBS (NRLMB LDRC/VDRC/MDRC): Staging ${formatNumber(hubFFP)} FFPs (${formatPHP(hubCost, true)})`;
  };

  return (
    <div className="space-y-6">
      {/* Presentation Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
              <Presentation className="w-4 h-4" />
              <span>Incident Operations Briefing & Slide Decks</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Standardized Command Center Briefing Deck
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Formatted as designated in the official spreadsheet for Incident Operators (IOs), NDRRMC sitreps, and cabinet presentations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(generateSlideText(), 'text')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-900 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
            >
              {copiedType === 'text' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied Deck!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Briefing Text</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Slide Visual Presentation Card (Ready for Screen Projection) */}
      <div className="bg-slate-900 text-white rounded-2xl p-7 shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4 mb-6">
          <div>
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              DSWD Disaster Response Management Bureau
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white mt-0.5">
              Stockpile and Standby Funds (SSF) Status
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>{asOfDate}</span>
          </div>
        </div>

        {/* Big Number Headline */}
        <div className="bg-gradient-to-r from-blue-950/80 to-indigo-950/80 border border-blue-800/50 rounded-xl p-5 mb-6">
          <div className="text-xs uppercase font-bold tracking-wider text-blue-300">
            Total Combined Standby Funds & Stockpiles
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white font-mono mt-1">
            {formatPHP(totals.totalSSF)}
          </div>
          <div className="text-xs text-slate-300 mt-1">
            {formatPHP(totals.totalStandbyFunds, true)} Standby Funds (QRF) + {formatPHP(totals.totalStockpileCost, true)} Relief Goods across 17 Field Offices & 3 National Hubs
          </div>
        </div>

        {/* 4 Core Slide Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4">
            <div className="text-[11px] font-semibold text-amber-400 uppercase">Standby Funds</div>
            <div className="text-xl font-bold font-mono text-white mt-1">
              {formatPHP(totals.totalStandbyFunds)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              CO: {formatPHP(coStandby, true)} · FOs: {formatPHP(foStandby, true)}
            </div>
          </div>

          <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4">
            <div className="text-[11px] font-semibold text-emerald-400 uppercase">Family Food Packs</div>
            <div className="text-xl font-bold font-mono text-white mt-1">
              {formatNumber(totals.totalFFPQuantity)} packs
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Valued at {formatPHP(totals.totalFFPCost, true)}
            </div>
          </div>

          <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4">
            <div className="text-[11px] font-semibold text-blue-400 uppercase">Non-Food Relief (NFRI)</div>
            <div className="text-xl font-bold font-mono text-white mt-1">
              {formatPHP(totals.totalNFRI, true)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Hygiene & Sleeping Kits
            </div>
          </div>

          <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4">
            <div className="text-[11px] font-semibold text-purple-400 uppercase">Other Food Commodities</div>
            <div className="text-xl font-bold font-mono text-white mt-1">
              {formatPHP(totals.totalOtherFood, true)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Raw Rice & Canned Reserves
            </div>
          </div>
        </div>

        {/* Slide Footer */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-6 mt-6 border-t border-slate-800">
          <span>Source: Disaster Response Management Bureau (DRMB) Consolidated Monitoring Sheet</span>
          <span>Approved for Public Release & Cabinet Briefing</span>
        </div>
      </div>

      {/* Customized Table for IOs (Standard Table Layout) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Customized Table: Incident Operations Reference
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Condensed layout matching the designated "FOR CUSTOMIZED TABLE: INCIDENT [DATE]" section
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold text-[11px]">
                <th className="py-2.5 px-3">OFFICE</th>
                <th className="py-2.5 px-3 text-right">STANDBY FUNDS</th>
                <th className="py-2.5 px-3 text-right">FFP QUANTITY</th>
                <th className="py-2.5 px-3 text-right">FFP TOTAL COST</th>
                <th className="py-2.5 px-3 text-right">OTHER FOOD</th>
                <th className="py-2.5 px-3 text-right">NFRI TOTAL COST</th>
                <th className="py-2.5 px-3 text-right font-bold text-slate-900">TOTAL SSF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {offices.map(o => (
                <tr key={o.id} className="hover:bg-slate-50/70">
                  <td className="py-2 px-3 font-medium text-slate-900">{o.office}</td>
                  <td className="py-2 px-3 text-right font-mono">{o.standbyFunds > 0 ? formatPHP(o.standbyFunds) : '—'}</td>
                  <td className="py-2 px-3 text-right font-mono font-medium">{o.ffpQuantity > 0 ? formatNumber(o.ffpQuantity) : '—'}</td>
                  <td className="py-2 px-3 text-right font-mono">{o.ffpTotalCost > 0 ? formatPHP(o.ffpTotalCost) : '—'}</td>
                  <td className="py-2 px-3 text-right font-mono">{o.otherFoodCost > 0 ? formatPHP(o.otherFoodCost) : '—'}</td>
                  <td className="py-2 px-3 text-right font-mono">{o.nonFoodReliefCost > 0 ? formatPHP(o.nonFoodReliefCost) : '—'}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-blue-900">{formatPHP(o.totalSSF)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                <td className="py-2.5 px-3">TOTAL</td>
                <td className="py-2.5 px-3 text-right font-mono">{formatPHP(totals.totalStandbyFunds)}</td>
                <td className="py-2.5 px-3 text-right font-mono">{formatNumber(totals.totalFFPQuantity)}</td>
                <td className="py-2.5 px-3 text-right font-mono">{formatPHP(totals.totalFFPCost)}</td>
                <td className="py-2.5 px-3 text-right font-mono">{formatPHP(totals.totalOtherFood)}</td>
                <td className="py-2.5 px-3 text-right font-mono">{formatPHP(totals.totalNFRI)}</td>
                <td className="py-2.5 px-3 text-right font-mono font-extrabold text-blue-950">{formatPHP(totals.totalSSF)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
