import React, { useState } from 'react';
import { OfficeSSFData } from '../../types/ssf';
import { formatPHP, formatNumber } from '../../utils/formatters';
import { 
  RefreshCw, 
  Play, 
  Pause, 
  Upload, 
  RotateCcw, 
  FileSpreadsheet, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Zap,
  Save,
  Sliders,
  ClipboardPaste,
  Sparkles,
  Check,
  X
} from 'lucide-react';
import { parseSSFCSV } from '../../services/sheetsSync';
import { INITIAL_OFFICES_DATA } from '../../data/initialData';

interface LiveEditorSheetProps {
  offices: OfficeSSFData[];
  onUpdateOffices: (newOffices: OfficeSSFData[]) => void;
  onResetData: () => void;
  googleSheetUrl: string;
  onUpdateGoogleSheetUrl: (url: string) => void;
  onManualSync: () => void;
  syncInterval: number;
  onSetSyncInterval: (interval: number) => void;
  isSyncing: boolean;
  lastSyncMessage: string;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  simulationLog: string[];
}

export const LiveEditorSheet: React.FC<LiveEditorSheetProps> = ({
  offices,
  onUpdateOffices,
  onResetData,
  googleSheetUrl,
  onUpdateGoogleSheetUrl,
  onManualSync,
  syncInterval,
  onSetSyncInterval,
  isSyncing,
  lastSyncMessage,
  isSimulating,
  onToggleSimulation,
  simulationLog
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState<boolean>(false);
  const [pastedRawText, setPastedRawText] = useState<string>('');
  const [pasteFeedback, setPasteFeedback] = useState<string | null>(null);

  const handleLoadLatest29Oct = async () => {
    try {
      const resp = await fetch('/assets/aistudio/Stockpile_and_Standby_Funds__SSF__Monitoring_Report_56c2f776');
      if (resp.ok) {
        const text = await resp.text();
        const parsed = parseSSFCSV(text);
        if (parsed.length > 0) {
          onUpdateOffices(parsed);
          setUploadError(null);
          return;
        }
      }
      // If direct fetch didn't return, fallback to initial data (29 Oct)
      onUpdateOffices(INITIAL_OFFICES_DATA);
    } catch {
      onUpdateOffices(INITIAL_OFFICES_DATA);
    }
  };

  const handleApplyPastedData = () => {
    if (!pastedRawText.trim()) {
      setPasteFeedback('Please paste data rows from Google Sheets or CSV.');
      return;
    }
    try {
      const parsed = parseSSFCSV(pastedRawText);
      if (parsed.length > 0) {
        onUpdateOffices(parsed);
        setIsPasteModalOpen(false);
        setPastedRawText('');
        setPasteFeedback(null);
      } else {
        setPasteFeedback('Could not recognize any valid DSWD/NRLMB rows in pasted text.');
      }
    } catch (e) {
      setPasteFeedback('Failed to parse pasted text. Ensure rows are copied from Google Sheets or CSV.');
    }
  };

  const handleCellChange = (
    officeId: string, 
    field: keyof OfficeSSFData, 
    value: string
  ) => {
    const numericValue = parseFloat(value.replace(/[^0-9.-]/g, '')) || 0;
    const updated = offices.map(o => {
      if (o.id !== officeId) return o;
      
      const copy = { ...o, [field]: numericValue };
      // Recalculate derived totals
      copy.totalSSF = copy.standbyFunds + copy.ffpTotalCost + copy.otherFoodCost + copy.nonFoodReliefCost + copy.otherNonFoodCost;
      copy.averageCostFFP = copy.ffpQuantity > 0 ? copy.ffpTotalCost / copy.ffpQuantity : 0;
      copy.below15MFunds = copy.standbyFunds < 1500000 && !copy.isHub && !copy.office.includes('CO');
      return copy;
    });
    onUpdateOffices(updated);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseSSFCSV(text);
        if (parsed.length > 0) {
          onUpdateOffices(parsed);
        } else {
          setUploadError('Could not identify valid SSF columns in file.');
        }
      } catch (err) {
        setUploadError('Failed to parse uploaded CSV file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Real-Time Sync & Connector Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
              <Globe className="w-4 h-4" />
              <span>Real-Time Google Sheets Cloud Sync Engine</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Live Spreadsheet Connectivity & In-Memory Data Grid
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sync directly with Google Sheets or modify cells in real time to visualize changes instantly across all dashboard views.
            </p>
          </div>

          {/* Sync Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Auto Sync Interval */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium">Auto-Sync:</span>
              <select
                value={syncInterval}
                onChange={e => onSetSyncInterval(Number(e.target.value))}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Manual Only (Off)</option>
                <option value={15}>Every 15 Seconds</option>
                <option value={30}>Every 30 Seconds</option>
                <option value={60}>Every 1 Minute</option>
                <option value={300}>Every 5 Minutes</option>
              </select>
            </div>

            {/* Manual Sync Button */}
            <button
              onClick={onManualSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>

            {/* Live Simulation Stream */}
            <button
              onClick={onToggleSimulation}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                isSimulating 
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm animate-pulse' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {isSimulating ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Simulating Live Stream</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Simulate Live Incident Stream</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Google Sheet URL Bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={googleSheetUrl}
              onChange={e => onUpdateGoogleSheetUrl(e.target.value)}
              placeholder="Paste Google Spreadsheet URL or export CSV link..."
              className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg pl-3 pr-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleLoadLatest29Oct}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer shadow-2xs"
            title="Load the latest 29 October 2026 06:00 AM DRMB operational dataset"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Load 29 Oct Live Data</span>
          </button>

          <button
            onClick={() => setIsPasteModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            title="Paste copied rows directly from Google Sheets or Excel"
          >
            <ClipboardPaste className="w-3.5 h-3.5 text-blue-700" />
            <span>Paste Table</span>
          </button>

          <label className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Upload CSV</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={onResetData}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
            title="Reset to official 23 Oct 2026 baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Quick Paste Modal */}
        {isPasteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                    <ClipboardPaste className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Paste Spreadsheet Data from Google Sheets
                    </h3>
                    <p className="text-xs text-slate-500">
                      Highlight cells in your Google Sheet, press Ctrl+C (Cmd+C), and paste directly below:
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPasteModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <textarea
                  value={pastedRawText}
                  onChange={e => setPastedRawText(e.target.value)}
                  placeholder="Paste rows here (e.g. DSWD CO, NRLMB LDRC, FO NCR... with numbers)..."
                  className="w-full h-48 p-3 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none"
                />
              </div>

              {pasteFeedback && (
                <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2.5 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{pasteFeedback}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleLoadLatest29Oct}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                >
                  Or click here to load 29 Oct live snapshot
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPasteModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplyPastedData}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Apply to Dashboard</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sync Status / Info Message */}
        <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-100 text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lastSyncMessage}</span>
          </div>
          {syncInterval > 0 && (
            <span className="text-blue-700 font-mono">
              Auto-sync active (every {syncInterval}s)
            </span>
          )}
        </div>

        {uploadError && (
          <div className="mt-2 text-xs text-rose-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{uploadError}</span>
          </div>
        )}
      </div>

      {/* Live Stream Telemetry Log (if simulating) */}
      {isSimulating && (
        <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs shadow-md border border-slate-800">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Zap className="w-4 h-4 animate-bounce" />
              <span>LIVE INCIDENT STREAM ACTIVE</span>
            </div>
            <span className="text-[10px] text-slate-400">Updates triggering every 3 seconds</span>
          </div>
          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {simulationLog.slice(0, 6).map((log, i) => (
              <div key={i} className="text-slate-300 flex items-center gap-2">
                <span className="text-emerald-400">›</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Editable Spreadsheet Grid */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Interactive In-Memory SSF Data Grid
            </h3>
            <p className="text-xs text-slate-500">
              Double-click or edit any cell below. All charts, graphs, and total aggregations update instantaneously!
            </p>
          </div>
          <div className="text-[11px] font-medium text-slate-500">
            Editing {offices.length} offices · Auto-calculated columns locked
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse font-sans">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 text-[11px] font-semibold">
                <th className="py-2.5 px-3 sticky left-0 bg-slate-100 z-10">OFFICE</th>
                <th className="py-2.5 px-3 text-right">STANDBY FUNDS (₱)</th>
                <th className="py-2.5 px-3 text-right">FFP QUANTITY</th>
                <th className="py-2.5 px-3 text-right">FFP TOTAL COST (₱)</th>
                <th className="py-2.5 px-3 text-right">OTHER FOOD (₱)</th>
                <th className="py-2.5 px-3 text-right">NFRI COST (₱)</th>
                <th className="py-2.5 px-3 text-right">OTHER NF (₱)</th>
                <th className="py-2.5 px-3 text-right font-bold text-slate-900">TOTAL SSF (₱)</th>
                <th className="py-2.5 px-3 text-right">AVG COST/FFP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {offices.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-2 px-3 font-medium text-slate-900 sticky left-0 bg-white hover:bg-blue-50/40 z-10 whitespace-nowrap">
                    {row.office}
                  </td>

                  {/* Editable: Standby Funds */}
                  <td className="py-1 px-2 text-right">
                    <input
                      type="number"
                      value={row.standbyFunds}
                      onChange={e => handleCellChange(row.id, 'standbyFunds', e.target.value)}
                      className="w-28 text-right font-mono py-1 px-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded transition-colors text-slate-900"
                    />
                  </td>

                  {/* Editable: FFP Quantity */}
                  <td className="py-1 px-2 text-right">
                    <input
                      type="number"
                      value={row.ffpQuantity}
                      onChange={e => handleCellChange(row.id, 'ffpQuantity', e.target.value)}
                      className="w-24 text-right font-mono py-1 px-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded transition-colors font-semibold text-slate-900"
                    />
                  </td>

                  {/* Editable: FFP Total Cost */}
                  <td className="py-1 px-2 text-right">
                    <input
                      type="number"
                      value={row.ffpTotalCost}
                      onChange={e => handleCellChange(row.id, 'ffpTotalCost', e.target.value)}
                      className="w-28 text-right font-mono py-1 px-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded transition-colors text-slate-800"
                    />
                  </td>

                  {/* Editable: Other Food Cost */}
                  <td className="py-1 px-2 text-right">
                    <input
                      type="number"
                      value={row.otherFoodCost}
                      onChange={e => handleCellChange(row.id, 'otherFoodCost', e.target.value)}
                      className="w-24 text-right font-mono py-1 px-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded transition-colors text-slate-700"
                    />
                  </td>

                  {/* Editable: NFRI Cost */}
                  <td className="py-1 px-2 text-right">
                    <input
                      type="number"
                      value={row.nonFoodReliefCost}
                      onChange={e => handleCellChange(row.id, 'nonFoodReliefCost', e.target.value)}
                      className="w-28 text-right font-mono py-1 px-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded transition-colors text-slate-800"
                    />
                  </td>

                  {/* Editable: Other NF */}
                  <td className="py-1 px-2 text-right">
                    <input
                      type="number"
                      value={row.otherNonFoodCost}
                      onChange={e => handleCellChange(row.id, 'otherNonFoodCost', e.target.value)}
                      className="w-24 text-right font-mono py-1 px-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white rounded transition-colors text-slate-700"
                    />
                  </td>

                  {/* Calculated: Total SSF */}
                  <td className="py-2 px-3 text-right font-mono font-bold text-blue-900 bg-blue-50/20 whitespace-nowrap">
                    {formatPHP(row.totalSSF)}
                  </td>

                  {/* Calculated: Avg Cost */}
                  <td className="py-2 px-3 text-right font-mono text-slate-700 whitespace-nowrap">
                    {row.averageCostFFP > 0 ? `₱${row.averageCostFFP.toFixed(2)}` : '—'}
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
