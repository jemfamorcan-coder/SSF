import React, { useState, useEffect, useRef } from 'react';
import { 
  ActiveSheetId, 
  OfficeSSFData 
} from './types/ssf';
import { 
  INITIAL_OFFICES_DATA, 
  AVAILABLE_SHEETS, 
  GOOGLE_SHEET_BACKUP_URL 
} from './data/initialData';
import { fetchLiveGoogleSheet, generateSimulatedUpdate } from './services/sheetsSync';
import { Navbar } from './components/Navbar';
import { ConsolidatedSheet } from './components/sheets/ConsolidatedSheet';
import { ComparativeSheet } from './components/sheets/ComparativeSheet';
import { InfographicsSheet } from './components/sheets/InfographicsSheet';
import { LogisticsHubsSheet } from './components/sheets/LogisticsHubsSheet';
import { CriticalAlertsSheet } from './components/sheets/CriticalAlertsSheet';
import { IncidentOpsSheet } from './components/sheets/IncidentOpsSheet';
import { LiveEditorSheet } from './components/sheets/LiveEditorSheet';
import { PdfExportModal } from './components/PdfExportModal';
import { Building2, Calendar, ShieldCheck, FileSpreadsheet } from 'lucide-react';

export default function App() {
  const [activeSheet, setActiveSheet] = useState<ActiveSheetId>('consolidated');
  const [offices, setOffices] = useState<OfficeSSFData[]>(INITIAL_OFFICES_DATA);
  const [asOfDate, setAsOfDate] = useState<string>('29 October 2026, 06:00 AM');
  const [googleSheetUrl, setGoogleSheetUrl] = useState<string>(GOOGLE_SHEET_BACKUP_URL);
  
  // Real-time sync state
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncMessage, setLastSyncMessage] = useState<string>('Live real-time monitoring active');
  const [lastSyncedAt, setLastSyncedAt] = useState<string>(new Date().toLocaleTimeString());
  const [syncInterval, setSyncInterval] = useState<number>(30); // 30s live auto-refresh default

  // Simulation state
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([
    'Real-time monitoring active. Connected to DSWD DRMB live synchronization feed.'
  ]);

  // PDF Export Modal
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Manual or periodic Google Sheet Sync
  const handleSync = async () => {
    setIsSyncing(true);
    setLastSyncMessage('Synchronizing live rows with cloud feed...');

    const res = await fetchLiveGoogleSheet(googleSheetUrl);
    setIsSyncing(false);
    setLastSyncedAt(res.timestamp);
    setLastSyncMessage(res.message);

    if (res.success && res.data && res.data.length > 0) {
      setOffices(res.data);
      if (res.asOfDate) {
        setAsOfDate(res.asOfDate);
      }
      setToastMessage(`✓ Updated live: ${res.data.length} offices loaded (${res.asOfDate || asOfDate})`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  // Initial sync on mount
  useEffect(() => {
    handleSync();
  }, []);

  // Timer for auto-sync polling
  useEffect(() => {
    if (syncInterval <= 0) return;
    const timer = setInterval(() => {
      handleSync();
    }, syncInterval * 1000);
    return () => clearInterval(timer);
  }, [syncInterval, googleSheetUrl]);

  // Timer for live simulation stream
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setOffices(current => {
        const { updatedData, logMessage } = generateSimulatedUpdate(current);
        const timestamp = new Date().toLocaleTimeString();
        setSimulationLog(prev => [`[${timestamp}] ${logMessage}`, ...prev.slice(0, 19)]);
        return updatedData;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleResetData = () => {
    setOffices(INITIAL_OFFICES_DATA);
    setIsSimulating(false);
    setLastSyncMessage('Restored to official 29 Oct 2026 baseline data snapshot.');
  };

  const currentSheetDefinition = AVAILABLE_SHEETS.find(s => s.id === activeSheet) || AVAILABLE_SHEETS[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeSheet={activeSheet}
        onSelectSheet={setActiveSheet}
        sheets={AVAILABLE_SHEETS}
        asOfDate={asOfDate}
        isSyncing={isSyncing}
        onManualSync={handleSync}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
        isSimulating={isSimulating}
        lastSyncedAt={lastSyncedAt}
      />

      {/* Print-Only Executive Header */}
      <div className="hidden print:block p-8 border-b-2 border-slate-900 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-900 text-white rounded flex items-center justify-center font-bold">
              DSWD
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-slate-700">
                Republic of the Philippines · Department of Social Welfare and Development
              </div>
              <h1 className="text-xl font-black text-slate-900">
                Stockpile and Standby Funds (SSF) Monitoring Report
              </h1>
              <div className="text-xs text-slate-600 font-mono">
                Report Horizon: {asOfDate} · View: {currentSheetDefinition.name}
              </div>
            </div>
          </div>
          <div className="text-right text-xs text-slate-500 font-mono">
            <div>Printed: {new Date().toLocaleString()}</div>
            <div>DRMB Emergency Management Portal</div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Printable/Capturable Container */}
        <div id="pdf-report-canvas" className="space-y-6">
          {activeSheet === 'consolidated' && (
            <ConsolidatedSheet offices={offices} asOfDate={asOfDate} />
          )}

          {activeSheet === 'comparative' && (
            <ComparativeSheet offices={offices} asOfDate={asOfDate} />
          )}

          {activeSheet === 'infographics' && (
            <InfographicsSheet 
              offices={offices} 
              asOfDate={asOfDate}
              onManualSync={handleSync}
              isSyncing={isSyncing}
            />
          )}

          {activeSheet === 'logistics-hubs' && (
            <LogisticsHubsSheet offices={offices} />
          )}

          {activeSheet === 'critical-alerts' && (
            <CriticalAlertsSheet offices={offices} />
          )}

          {activeSheet === 'incident-ops' && (
            <IncidentOpsSheet offices={offices} asOfDate={asOfDate} />
          )}

          {activeSheet === 'live-editor' && (
            <LiveEditorSheet
              offices={offices}
              onUpdateOffices={setOffices}
              onResetData={handleResetData}
              googleSheetUrl={googleSheetUrl}
              onUpdateGoogleSheetUrl={setGoogleSheetUrl}
              onManualSync={handleSync}
              syncInterval={syncInterval}
              onSetSyncInterval={setSyncInterval}
              isSyncing={isSyncing}
              lastSyncMessage={lastSyncMessage}
              isSimulating={isSimulating}
              onToggleSimulation={() => setIsSimulating(!isSimulating)}
              simulationLog={simulationLog}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 print:hidden text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-700" />
            <span className="font-semibold text-slate-700">
              Department of Social Welfare and Development (DSWD)
            </span>
            <span>·</span>
            <span>Disaster Response Management Bureau (DRMB) / NRLMB</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Real-Time Sync Protocol</span>
            <span>·</span>
            <span>ISO 9001:2015 Compliant</span>
            <span>·</span>
            <span className="font-mono">Last Synchronized: {lastSyncedAt}</span>
          </div>
        </div>
      </footer>

      {/* PDF Export Modal */}
      <PdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        targetElementId="pdf-report-canvas"
        asOfDate={asOfDate}
        activeSheetName={currentSheetDefinition.name}
      />
    </div>
  );
}
