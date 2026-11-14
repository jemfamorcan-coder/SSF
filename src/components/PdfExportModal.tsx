import React, { useState } from 'react';
import { FileText, Printer, Download, X, CheckCircle2, Loader2, Shield } from 'lucide-react';
import { exportDashboardToPDF, triggerBrowserPrint } from '../utils/pdfExport';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetElementId: string;
  asOfDate: string;
  activeSheetName: string;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  targetElementId,
  asOfDate,
  activeSheetName
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState('');
  const [includeTable, setIncludeTable] = useState(true);
  const [includeCharts, setIncludeCharts] = useState(true);

  if (!isOpen) return null;

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      setProgress(5);
      setStageText('Initializing PDF rendering engine...');

      const filename = `DSWD_SSF_Report_${activeSheetName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;

      await exportDashboardToPDF(targetElementId, {
        reportTitle: 'Stockpile and Standby Funds (SSF) Monitoring Report',
        asOfDate,
        includeCharts,
        includeTable,
        filename,
        onProgress: (p, s) => {
          setProgress(p);
          setStageText(s);
        }
      });

      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 800);
    } catch (err) {
      console.error('PDF Export Error:', err);
      setIsExporting(false);
      setStageText('PDF generation failed. Please try again or use Browser Print.');
    }
  };

  const handleNativePrint = () => {
    onClose();
    setTimeout(() => {
      triggerBrowserPrint();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Export Report to PDF
              </h3>
              <p className="text-xs text-slate-500">
                Department of Social Welfare and Development · DRMB
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-4 space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>Target View:</span>
              <strong className="text-slate-900">{activeSheetName}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Reporting Horizon:</span>
              <span className="font-mono text-slate-800">{asOfDate}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Standard Format:</span>
              <span className="text-slate-800">A4 Landscape · 300 DPI Rendering</span>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeCharts}
                onChange={e => setIncludeCharts(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span className="font-medium">Include Interactive Visualizations & Charts</span>
            </label>
            <label className="flex items-center gap-2 text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeTable}
                onChange={e => setIncludeTable(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span className="font-medium">Include Consolidated Office Ledger Tables</span>
            </label>
          </div>

          {/* Progress Indicator */}
          {isExporting && (
            <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-blue-900 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-700" />
                  <span>{stageText}</span>
                </span>
                <span className="font-mono font-bold text-blue-800">{progress}%</span>
              </div>
              <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handleNativePrint}
            disabled={isExporting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Browser Print / Vector PDF</span>
          </button>

          <button
            type="button"
            onClick={handleExportPDF}
            disabled={isExporting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating PDF...' : 'Download PDF Document'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
