import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFExportOptions {
  reportTitle: string;
  asOfDate: string;
  includeCharts: boolean;
  includeTable: boolean;
  filename?: string;
  onProgress?: (progress: number, stage: string) => void;
}

export async function exportDashboardToPDF(
  elementId: string,
  options: PDFExportOptions
): Promise<void> {
  const { 
    reportTitle, 
    asOfDate, 
    filename = 'DSWD_SSF_Monitoring_Report.pdf',
    onProgress 
  } = options;

  onProgress?.(15, 'Preparing document for high-resolution render...');

  const sourceElement = document.getElementById(elementId);
  if (!sourceElement) {
    throw new Error(`Element with id "${elementId}" not found for PDF export.`);
  }

  // Scroll to top to ensure complete render
  window.scrollTo(0, 0);

  onProgress?.(35, 'Capturing charts and data tables...');

  // Use html2canvas with scale 2 for crisp retina text
  const canvas = await html2canvas(sourceElement, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: 1280
  });

  onProgress?.(70, 'Compiling PDF document pages...');

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  
  // A4 Landscape format: 297mm x 210mm
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgProps = pdf.getImageProperties(imgData);
  const imgWidth = pdfWidth;
  const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

  let heightLeft = imgHeight;
  let position = 0;

  // First Page
  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  // Add subsequent pages if content overflows
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  onProgress?.(95, 'Finalizing download...');
  pdf.save(filename);
  onProgress?.(100, 'Complete!');
}

export function triggerBrowserPrint() {
  window.print();
}
