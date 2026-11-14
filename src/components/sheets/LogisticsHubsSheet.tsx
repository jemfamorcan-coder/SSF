import React from 'react';
import { OfficeSSFData } from '../../types/ssf';
import { formatNumber, formatPHP } from '../../utils/formatters';
import { 
  Building2, 
  Truck, 
  Boxes, 
  MapPin, 
  CheckCircle, 
  Anchor, 
  Plane, 
  ArrowRight 
} from 'lucide-react';

interface LogisticsHubsSheetProps {
  offices: OfficeSSFData[];
}

export const LogisticsHubsSheet: React.FC<LogisticsHubsSheetProps> = ({ offices }) => {
  const hubs = offices.filter(o => o.isHub);
  const totalHubFFP = hubs.reduce((acc, h) => acc + h.ffpQuantity, 0);
  const totalHubSSF = hubs.reduce((acc, h) => acc + h.totalSSF, 0);
  const totalHubNFRI = hubs.reduce((acc, h) => acc + h.nonFoodReliefCost, 0);

  const nationalFFP = offices.reduce((acc, o) => acc + o.ffpQuantity, 0);
  const hubSharePercent = nationalFFP > 0 ? (totalHubFFP / nationalFFP) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Strategic Hubs Overview Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4" />
              <span>National Resource and Logistics Management Bureau (NRLMB)</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Mechanized Production Hubs & Disaster Resource Centers
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Strategic pre-positioning mega-warehouses equipped with mechanized box-making and conveyor assembly systems capable of surging production during national state of calamity declarations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-right">
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Hub Staged FFPs</div>
              <div className="text-xl font-black text-indigo-950 font-mono">
                {formatNumber(totalHubFFP)} <span className="text-xs font-normal text-slate-500">packs</span>
              </div>
              <div className="text-[10px] text-indigo-700 font-medium">
                {hubSharePercent.toFixed(1)}% of National Total
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-right">
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Hub Valuation</div>
              <div className="text-xl font-black text-slate-900 font-mono">
                {formatPHP(totalHubSSF, true)}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                Stockpile Goods Only (₱0 Standby)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Mega Hub Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {hubs.map((hub) => {
          const isVDRC = hub.office.includes('VDRC');
          const isLDRC = hub.office.includes('LDRC');
          const isMDRC = hub.office.includes('MDRC');

          const locationName = isLDRC 
            ? 'Luzon Disaster Resource Center (Pasay / Clark Corridor)'
            : isVDRC 
            ? 'Visayas Disaster Resource Center (Mandaue, Cebu)'
            : 'Mindanao Disaster Resource Center (Davao City)';

          const badgeColor = isVDRC ? 'bg-blue-600' : isLDRC ? 'bg-emerald-600' : 'bg-purple-600';
          const cardBorder = isVDRC ? 'border-blue-300 ring-2 ring-blue-100' : 'border-slate-200';

          return (
            <div 
              key={hub.id} 
              className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between ${cardBorder}`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${badgeColor}`} />
                    <span className="font-bold text-slate-900 text-sm">{hub.office}</span>
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {hub.zone} Hub
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{locationName}</span>
                </div>

                {/* Primary Metric */}
                <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">
                    Family Food Packs Ready
                  </div>
                  <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
                    {formatNumber(hub.ffpQuantity)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600 mt-1">
                    <span>Valued at:</span>
                    <span className="font-mono font-semibold">{formatPHP(hub.ffpTotalCost, true)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600 mt-0.5">
                    <span>Average Unit Cost:</span>
                    <span className="font-mono font-semibold">₱{hub.averageCostFFP.toFixed(2)}/pack</span>
                  </div>
                </div>

                {/* Secondary Relatives */}
                <div className="space-y-2 mt-4 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Non-Food Relief (NFRI):</span>
                    <span className="font-mono font-semibold text-slate-900">{formatPHP(hub.nonFoodReliefCost, true)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Raw Food Commodities:</span>
                    <span className="font-mono font-semibold text-slate-900">{formatPHP(hub.otherFoodCost, true)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Other Non-Food Goods:</span>
                    <span className="font-mono font-semibold text-slate-900">{formatPHP(hub.otherNonFoodCost, true)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 font-bold text-slate-900">
                    <span>Total Center Value:</span>
                    <span className="font-mono text-blue-900">{formatPHP(hub.totalSSF, true)}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Operational Role Note */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                {hub.notes}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hub vs Field Office Mechanics Matrix */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          Strategic Distribution Architecture: Production Hubs vs Regional Warehouses
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          NRLMB hubs act as central stockpilers with packaging mechanization, feeding 17 regional field offices via sea and air cargo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-indigo-100 bg-indigo-50/30 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 uppercase">
              <Truck className="w-4 h-4 text-indigo-700" />
              <span>Inter-Island Logistics Corridors</span>
            </div>
            <ul className="mt-3 space-y-2 text-xs text-indigo-950">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                <span><strong>VDRC (Cebu)</strong> provides direct maritime RoRo and air transport to FO VI (Western Visayas), FO VII, FO VIII (Eastern Visayas), and NIR.</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                <span><strong>LDRC (Luzon)</strong> backs up Northern & Southern Luzon FOs (CAR, Regions I, II, III, CALABARZON, MIMAROPA, and Bicol FO V).</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                <span><strong>MDRC (Mindanao)</strong> guarantees rapid overland deployment to FO IX, X, XI, XII, and CARAGA.</span>
              </li>
            </ul>
          </div>

          <div className="p-4 border border-slate-200 bg-slate-50/50 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase">
              <Boxes className="w-4 h-4 text-slate-700" />
              <span>Inventory Buffer Status</span>
            </div>
            <div className="mt-3 space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span>Hub Share of National FFPs:</span>
                <span className="font-mono font-bold text-slate-900">{hubSharePercent.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Field Office Pre-positioned Share:</span>
                <span className="font-mono font-bold text-slate-900">{(100 - hubSharePercent).toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Combined Staged Relief Value:</span>
                <span className="font-mono font-bold text-blue-900">{formatPHP(totalHubSSF)}</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Satisfies NDRRMC Pre-Disaster Risk Assessment (PDRA) minimum buffer mandates for catastrophic typhoon scenarios.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
