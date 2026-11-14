import React from 'react';
import { 
  ChartCustomization, 
  ChartType, 
  MetricKey, 
  ColorTheme 
} from '../types/ssf';
import { 
  BarChart3, 
  Layers, 
  AlignLeft, 
  LineChart, 
  PieChart, 
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  Palette,
  Radar as RadarIcon,
  ScatterChart
} from 'lucide-react';
import { getMetricLabel } from '../utils/formatters';

interface ChartControlsProps {
  customization: ChartCustomization;
  onChange: (updated: Partial<ChartCustomization>) => void;
  availableMetrics?: MetricKey[];
  compact?: boolean;
}

export const CHART_TYPE_OPTIONS: { type: ChartType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { type: 'grouped-bar', label: 'Grouped Bar', icon: BarChart3 },
  { type: 'stacked-bar', label: 'Stacked Bar', icon: Layers },
  { type: 'horizontal-bar', label: 'Ranking Bar', icon: AlignLeft },
  { type: 'single-bar', label: 'Column Chart', icon: BarChart3 },
  { type: 'line-trend', label: 'Area / Trend', icon: LineChart },
  { type: 'donut', label: 'Donut Share', icon: PieChart },
  { type: 'radar', label: 'Regional Radar', icon: RadarIcon },
  { type: 'scatter-cost-qty', label: 'Cost vs Qty', icon: ScatterChart }
];

export const METRIC_OPTIONS: { key: MetricKey; label: string }[] = [
  { key: 'totalSSF', label: 'Total SSF & Stockpile' },
  { key: 'standbyFunds', label: 'Standby Funds' },
  { key: 'ffpQuantity', label: 'Family Food Packs (Qty)' },
  { key: 'ffpTotalCost', label: 'Family Food Packs (Cost)' },
  { key: 'nonFoodReliefCost', label: 'Non-Food Relief Items (NFRI)' },
  { key: 'otherFoodCost', label: 'Other Food Items' },
  { key: 'otherNonFoodCost', label: 'Other Non-Food Items' },
  { key: 'averageCostFFP', label: 'Average Cost per FFP' }
];

export const THEME_OPTIONS: { theme: ColorTheme; label: string; colors: string[] }[] = [
  { theme: 'dswd-classic', label: 'DSWD Official Navy & Crimson', colors: ['#1e40af', '#dc2626', '#f59e0b', '#0d9488'] },
  { theme: 'modern-emerald', label: 'Resilience Emerald & Teal', colors: ['#059669', '#0d9488', '#0284c7', '#6366f1'] },
  { theme: 'amber-sunset', label: 'Emergency Alert Amber', colors: ['#d97706', '#ea580c', '#e11d48', '#7c3aed'] },
  { theme: 'corporate-navy', label: 'Executive Slate & Sapphire', colors: ['#0f172a', '#2563eb', '#38bdf8', '#64748b'] }
];

export const ChartControls: React.FC<ChartControlsProps> = ({
  customization,
  onChange,
  availableMetrics = METRIC_OPTIONS.map(m => m.key),
  compact = false
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-700" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Interactive Chart Customizer
          </span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-500">
            {getMetricLabel(customization.primaryMetric)}
          </span>
        </div>

        {/* Quick Toggles */}
        <div className="flex items-center gap-2 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900 select-none">
            <input
              type="checkbox"
              checked={customization.showDataLabels}
              onChange={e => onChange({ showDataLabels: e.target.checked })}
              className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span>Data Labels</span>
          </label>
          <span className="text-slate-300">|</span>
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900 select-none">
            <input
              type="checkbox"
              checked={customization.showThresholdLine}
              onChange={e => onChange({ showThresholdLine: e.target.checked })}
              className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span>Benchmark Line</span>
          </label>
        </div>
      </div>

      {/* Chart Types Pill Selector (Functional buttons) */}
      <div className="mb-3">
        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
          Visualization Mode
        </label>
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-lg">
          {CHART_TYPE_OPTIONS.map(opt => {
            const Icon = opt.icon;
            const isActive = customization.chartType === opt.type;
            return (
              <button
                key={opt.type}
                type="button"
                onClick={() => onChange({ chartType: opt.type })}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-white text-blue-900 shadow-xs font-semibold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Configuration Grid */}
      <div className={`grid gap-3 ${compact ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'}`}>
        {/* Metric Selector */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Primary Metric
          </label>
          <select
            value={customization.primaryMetric}
            onChange={e => onChange({ primaryMetric: e.target.value as MetricKey })}
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          >
            {METRIC_OPTIONS.filter(m => availableMetrics.includes(m.key)).map(m => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Region Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" />
            <span>Regional Scope</span>
          </label>
          <select
            value={customization.regionFilter}
            onChange={e => onChange({ regionFilter: e.target.value as ChartCustomization['regionFilter'] })}
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          >
            <option value="ALL">All Jurisdictions (National)</option>
            <option value="Luzon">Luzon Cluster & NCR</option>
            <option value="Visayas">Visayas Cluster</option>
            <option value="Mindanao">Mindanao Cluster</option>
            <option value="HUBS_ONLY">Strategic Hubs (NRLMB L/V/MDRC)</option>
            <option value="FIELD_OFFICES_ONLY">Field Offices (FO) Only</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3 text-slate-400" />
            <span>Ordering</span>
          </label>
          <select
            value={customization.sortBy}
            onChange={e => onChange({ sortBy: e.target.value as ChartCustomization['sortBy'] })}
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          >
            <option value="none">Official Spreadsheet Sequence</option>
            <option value="value-desc">Highest First (Descending)</option>
            <option value="value-asc">Lowest First (Ascending)</option>
            <option value="name-asc">Alphabetical (Office Name)</option>
          </select>
        </div>

        {/* Theme Palette */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Palette className="w-3 h-3 text-slate-400" />
            <span>Color Palette</span>
          </label>
          <select
            value={customization.colorTheme}
            onChange={e => onChange({ colorTheme: e.target.value as ColorTheme })}
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          >
            {THEME_OPTIONS.map(th => (
              <option key={th.theme} value={th.theme}>
                {th.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
