export type RegionZone = 'Central' | 'Luzon' | 'Visayas' | 'Mindanao';

export interface OfficeSSFData {
  id: string;
  office: string;
  shortName: string;
  zone: RegionZone;
  isHub: boolean;
  standbyFunds: number;
  ffpQuantity: number;
  ffpTotalCost: number;
  otherFoodCost: number;
  nonFoodReliefCost: number;
  otherNonFoodCost: number;
  totalSSF: number;
  averageCostFFP: number;
  // Metadata & flags
  below15MFunds: boolean;
  notes?: string;
}

export interface SheetSnapshot {
  reportTitle: string;
  asOfDate: string;
  googleSheetUrl: string;
  lastSyncedAt: string;
  offices: OfficeSSFData[];
}

export interface ComparativeVariance {
  office: string;
  shortName: string;
  zone: RegionZone;
  // 18 Oct
  baseStandbyFunds: number;
  baseFFPQty: number;
  baseTotalSSF: number;
  // 20 Oct
  currentStandbyFunds: number;
  currentFFPQty: number;
  currentTotalSSF: number;
  // Variance
  deltaFFPQty: number;
  deltaFFPQtyPercent: number;
  deltaTotalSSF: number;
  deltaStandbyFunds: number;
  activityType: 'Replenished' | 'Dispatched' | 'Stable';
}

export type ChartType = 
  | 'grouped-bar'
  | 'stacked-bar'
  | 'horizontal-bar'
  | 'single-bar'
  | 'line-trend'
  | 'donut'
  | 'radar'
  | 'scatter-cost-qty';

export type MetricKey = 
  | 'totalSSF'
  | 'standbyFunds'
  | 'ffpQuantity'
  | 'ffpTotalCost'
  | 'otherFoodCost'
  | 'nonFoodReliefCost'
  | 'otherNonFoodCost'
  | 'averageCostFFP';

export type ColorTheme = 'dswd-classic' | 'modern-emerald' | 'amber-sunset' | 'corporate-navy';

export interface ChartCustomization {
  chartType: ChartType;
  primaryMetric: MetricKey;
  secondaryMetric?: MetricKey;
  regionFilter: 'ALL' | RegionZone | 'HUBS_ONLY' | 'FIELD_OFFICES_ONLY';
  colorTheme: ColorTheme;
  sortBy: 'none' | 'value-desc' | 'value-asc' | 'name-asc';
  unitScale: 'auto' | 'millions' | 'thousands' | 'raw';
  showThresholdLine: boolean;
  thresholdValue?: number;
  showDataLabels: boolean;
}

export type ActiveSheetId = 
  | 'consolidated'
  | 'comparative'
  | 'infographics'
  | 'logistics-hubs'
  | 'critical-alerts'
  | 'incident-ops'
  | 'live-editor';

export interface SheetDefinition {
  id: ActiveSheetId;
  name: string;
  tabLabel: string;
  description: string;
  badge?: string;
}

export interface RegionalPrepoData {
  officeId: string;
  officeName: string;
  shortName: string;
  zone: RegionZone;
  warehouseLocation: string;
  isHub: boolean;
  // Demographic variables
  totalPopulation: number;
  vulnerableRate: number; // 0.30 (30%)
  targetPopulation30: number; // totalPopulation * 0.30
  targetHouseholds: number; // targetPopulation30 / 5
  // Warehouse capacity variables
  maxWarehouseCapacityFFP: number;
  currentWarehouseUtilizationPct: number;
  warehouseStatus: 'Safe' | 'Optimal' | 'Near Capacity' | 'Critical';
  // Commodities
  ffpQuantity: number;
  ffpTotalCost: number;
  nonFoodItemsCost: number; // NFRI
  readyToEatFoodPacks: number; // RTEF
  readyToEatFoodCost: number;
  otherFoodItemsCost: number; // OFI
  otherNonFoodCost: number;
  totalPrepoCommodityCost: number;
  // Coverage & Readiness
  coverageRatio30Pct: number; // (ffpQuantity / targetHouseholds) * 100
  bufferDaysSufficiency: number;
  criticalItemAlerts?: string[];
}
