import React from 'react';
import { OfficeSSFData } from '../../types/ssf';
import { formatPHP, formatNumber } from '../../utils/formatters';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Info,
  Scale
} from 'lucide-react';

interface CriticalAlertsSheetProps {
  offices: OfficeSSFData[];
}

export const CriticalAlertsSheet: React.FC<CriticalAlertsSheetProps> = ({ offices }) => {
  const STANDBY_ALERT_THRESHOLD = 1500000; // ₱1.5M threshold from spreadsheet column
  const NATIONAL_AVG_COST = 656.96;

  const fieldOffices = offices.filter(o => !o.isHub && o.office !== 'DSWD CO');

  // Below 1.5M alert
  const belowThresholdOffices = fieldOffices.filter(o => o.standbyFunds < STANDBY_ALERT_THRESHOLD);
  // Watchlist (between 1.5M and 2.5M)
  const watchlistOffices = fieldOffices.filter(
    o => o.standbyFunds >= STANDBY_ALERT_THRESHOLD && o.standbyFunds <= 2500000
  );

  // Unit Cost Outliers (> ₱700)
  const highCostOffices = offices.filter(o => o.averageCostFFP > 700);
  // Unit Cost Leaders (< ₱600)
  const lowCostOffices = offices.filter(o => o.averageCostFFP > 0 && o.averageCostFFP < 600);

  return (
    <div className="space-y-6">
      {/* Critical Threshold Overview Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>Operational Risk & Threshold Monitoring</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Standby Fund Thresholds & Unit Cost Variance Analysis
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Active surveillance of the <strong>Below ₱1.5M Standby Funds</strong> mandatory alert trigger and procurement unit-cost anomalies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg border text-right ${
              belowThresholdOffices.length > 0 
                ? 'bg-rose-50 border-rose-200 text-rose-950' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-950'
            }`}>
              <div className="text-[11px] font-semibold uppercase">Below ₱1.5M Trigger</div>
              <div className="text-xl font-black font-mono mt-0.5">
                {belowThresholdOffices.length > 0 ? `${belowThresholdOffices.length} Alerts Active` : '0 Breaches (Compliant)'}
              </div>
              <div className="text-[10px] font-medium text-slate-500">
                Minimum Regional Liquidity Standard
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Below 1.5M Standby Watchlist + Unit Cost Outliers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Standby Fund Compliance & Watchlist */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Standby Funds Liquidity & Watchlist
              </h3>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              Threshold: ₱1,500,000.00
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-2.5">
            DSWD guidelines require field offices to request Central Office replenishment before standby funds fall under ₱1.5M.
          </p>

          {/* Breach List if any */}
          {belowThresholdOffices.length > 0 ? (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg space-y-2">
              <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Urgent Replenishment Required ({belowThresholdOffices.length})</span>
              </div>
              {belowThresholdOffices.map(o => (
                <div key={o.id} className="flex items-center justify-between text-xs bg-white p-2 rounded border border-rose-200">
                  <span className="font-semibold text-slate-900">{o.office}</span>
                  <span className="font-mono font-bold text-rose-600">{formatPHP(o.standbyFunds)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs text-emerald-900">
                <span className="font-bold">Full Liquidity Compliance:</span> All 17 Regional Field Offices currently maintain standby funds above the ₱1,500,000.00 minimum threshold.
              </div>
            </div>
          )}

          {/* Watchlist Offices */}
          <div className="mt-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Elevated Watchlist (Approaching Threshold)</span>
              <span className="text-slate-500 font-normal">{watchlistOffices.length} Field Offices</span>
            </h4>
            <div className="space-y-2">
              {watchlistOffices.map(o => {
                const bufferRemaining = o.standbyFunds - STANDBY_ALERT_THRESHOLD;
                return (
                  <div key={o.id} className="p-2.5 border border-amber-200/80 bg-amber-50/30 rounded-lg text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-900">
                      <span>{o.office}</span>
                      <span className="font-mono text-amber-900">{formatPHP(o.standbyFunds)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                      <span>Buffer Above Threshold:</span>
                      <span className="font-mono font-medium text-emerald-700">+{formatPHP(bufferRemaining)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Unit Cost Variance & Price Anomaly Detection */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Unit Cost Variance & Outliers
              </h3>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              National Avg: ₱{NATIONAL_AVG_COST.toFixed(2)}
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-2.5">
            Variance in unit cost per Family Food Pack reflects regional procurement logistics, island freight charges, and packaging suppliers.
          </p>

          {/* High Cost Outliers */}
          <div className="mt-4">
            <div className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>High Unit-Cost Outliers (&gt; ₱700 / pack)</span>
              <span className="text-slate-500 font-normal">{highCostOffices.length} Centers</span>
            </div>
            <div className="space-y-2">
              {highCostOffices.map(o => {
                const diff = o.averageCostFFP - NATIONAL_AVG_COST;
                return (
                  <div key={o.id} className="p-2.5 border border-rose-100 bg-rose-50/30 rounded-lg text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-900">
                      <span>{o.office}</span>
                      <span className="font-mono text-rose-700 font-bold">₱{o.averageCostFFP.toFixed(2)} / pack</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                      <span>Variance vs National Standard:</span>
                      <span className="font-mono text-rose-600 font-semibold">+₱{diff.toFixed(2)} (+{((diff / NATIONAL_AVG_COST) * 100).toFixed(1)}%)</span>
                    </div>
                    {o.notes && (
                      <div className="text-[10px] text-slate-500 mt-1 italic">
                        {o.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Low Cost Leaders */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Cost Efficiency Leaders (&lt; ₱600 / pack)</span>
              <span className="text-slate-500 font-normal">{lowCostOffices.length} Centers</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {lowCostOffices.slice(0, 4).map(o => (
                <div key={o.id} className="p-2 border border-emerald-100 bg-emerald-50/30 rounded-lg">
                  <div className="font-semibold text-slate-800 truncate">{o.shortName}</div>
                  <div className="font-mono font-bold text-emerald-700 mt-0.5">
                    ₱{o.averageCostFFP.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nearly Expiring & NFI Variance Note from Document */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 text-blue-700 rounded-lg shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              For Nearly Expiring, FFP and NFI Variances (FIFO Quality Control Protocol)
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              As referenced in row 29 of the official monitoring document, DSWD maintains First-In, First-Out (FIFO) distribution protocols. Food packs nearing 6 months shelf life are prioritized for immediate deployment to feeding programs or rapid disaster response, preventing commodity wastage. Non-Food Item (NFI) variances are reconciled bi-weekly with regional asset registries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
