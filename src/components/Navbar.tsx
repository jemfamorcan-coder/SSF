import React from 'react';
import { ActiveSheetId, SheetDefinition } from '../types/ssf';
import { 
  Building2, 
  FileSpreadsheet, 
  Download, 
  Printer, 
  RefreshCw, 
  Layers, 
  Activity, 
  PieChart, 
  ShieldAlert, 
  Presentation,
  CheckCircle2,
  Calendar,
  Globe
} from 'lucide-react';

interface NavbarProps {
  activeSheet: ActiveSheetId;
  onSelectSheet: (id: ActiveSheetId) => void;
  sheets: SheetDefinition[];
  asOfDate: string;
  isSyncing: boolean;
  onManualSync: () => void;
  onOpenPdfModal: () => void;
  isSimulating: boolean;
  lastSyncedAt: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSheet,
  onSelectSheet,
  sheets,
  asOfDate,
  isSyncing,
  onManualSync,
  onOpenPdfModal,
  isSimulating,
  lastSyncedAt
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs print:hidden">
      {/* Top Identity Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-slate-100">
          {/* Brand & Document Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 flex items-center justify-center text-white shadow-sm ring-1 ring-blue-700/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider uppercase text-blue-800">
                  DSWD Disaster Response Management Bureau
                </span>
                <span className="text-slate-300">·</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-[10px] font-mono font-bold tracking-wide text-emerald-800">
                  <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-amber-500 animate-ping' : 'bg-emerald-600 animate-pulse'}`} />
                  <span>{isSimulating ? 'SIMULATION STREAM' : 'LIVE MONITORING'}</span>
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
                Stockpile and Standby Funds (SSF) Monitoring Report
              </h1>
            </div>
          </div>

          {/* Quick Actions (PDF Export, Sync) */}
          <div className="flex items-center gap-2.5">
            {/* Timestamp */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg font-mono">
              <Calendar className="w-3.5 h-3.5 text-blue-700" />
              <span>{asOfDate}</span>
            </div>

            {/* Update / Sync Now */}
            <button
              onClick={onManualSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-950 bg-emerald-50/80 border border-emerald-300 rounded-lg hover:bg-emerald-100 disabled:opacity-50 transition-colors shadow-2xs cursor-pointer group"
              title="Update with latest live rows from Google Sheets / DRMB"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${isSyncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-300'}`} />
              <span>{isSyncing ? 'Syncing...' : 'Update Live Data'}</span>
            </button>

            {/* Export to PDF Button */}
            <button
              onClick={onOpenPdfModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export to PDF</span>
            </button>
          </div>
        </div>

        {/* Multi-Sheet Tab Navigation Bar */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
          {sheets.map(sheet => {
            const isActive = activeSheet === sheet.id;
            return (
              <button
                key={sheet.id}
                onClick={() => onSelectSheet(sheet.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title={sheet.description}
              >
                <span>{sheet.tabLabel}</span>
                {sheet.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      isActive 
                        ? 'bg-blue-800 text-blue-200' 
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {sheet.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
