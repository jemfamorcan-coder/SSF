import { OfficeSSFData, SheetSnapshot, SheetDefinition } from '../types/ssf';

export const GOOGLE_SHEET_BACKUP_URL = 'https://docs.google.com/spreadsheets/d/1gioui2ANixWGnBNg8Co53Fj03g8TH3gKC56uWEXkYA8/edit?gid=829168025#gid=829168025';

export const INITIAL_OFFICES_DATA: OfficeSSFData[] = [
  {
    id: 'dswd-co',
    office: 'DSWD CO',
    shortName: 'Central Office',
    zone: 'Central',
    isHub: false,
    standbyFunds: 45008553.07,
    ffpQuantity: 0,
    ffpTotalCost: 0,
    otherFoodCost: 0,
    nonFoodReliefCost: 0,
    otherNonFoodCost: 0,
    totalSSF: 45008553.07,
    averageCostFFP: 0,
    below15MFunds: false,
    notes: 'Central Quick Response Fund (QRF) standby pool available for national relief operations.'
  },
  {
    id: 'nrlmb-ldrc',
    office: 'NRLMB LDRC',
    shortName: 'LDRC (Luzon Hub)',
    zone: 'Luzon',
    isHub: true,
    standbyFunds: 0,
    ffpQuantity: 515303,
    ffpTotalCost: 344849932.60,
    otherFoodCost: 39976012.35,
    nonFoodReliefCost: 57561306.53,
    otherNonFoodCost: 50367920.47,
    totalSSF: 492755171.95,
    averageCostFFP: 627.07,
    below15MFunds: false,
    notes: 'Luzon Disaster Resource Center operating at 515,303 food packs capacity.'
  },
  {
    id: 'nrlmb-vdrc',
    office: 'NRLMB VDRC',
    shortName: 'VDRC (Visayas Hub)',
    zone: 'Visayas',
    isHub: true,
    standbyFunds: 0,
    ffpQuantity: 646171,
    ffpTotalCost: 394879879.28,
    otherFoodCost: 28619631.34,
    nonFoodReliefCost: 148361146.40,
    otherNonFoodCost: 20620971.57,
    totalSSF: 592481628.58,
    averageCostFFP: 631.12,
    below15MFunds: false,
    notes: 'Visayas mechanized packaging mega-hub maintaining 646,171 food packs.'
  },
  {
    id: 'nrlmb-mdrc',
    office: 'NRLMB MDRC',
    shortName: 'MDRC (Mindanao Hub)',
    zone: 'Mindanao',
    isHub: true,
    standbyFunds: 0,
    ffpQuantity: 166024,
    ffpTotalCost: 125531856.97,
    otherFoodCost: 11296048.00,
    nonFoodReliefCost: 85768665.44,
    otherNonFoodCost: 888540.23,
    totalSSF: 223485110.64,
    averageCostFFP: 793.63,
    below15MFunds: false,
    notes: 'Mindanao Disaster Resource Center supplying active relief in southern regions.'
  },
  {
    id: 'fo-ncr',
    office: 'DSWD FO NCR',
    shortName: 'FO NCR',
    zone: 'Luzon',
    isHub: false,
    standbyFunds: 3000000.00,
    ffpQuantity: 92142,
    ffpTotalCost: 56011613.06,
    otherFoodCost: 2544373.14,
    nonFoodReliefCost: 14225615.37,
    otherNonFoodCost: 1696416.75,
    totalSSF: 77478018.32,
    averageCostFFP: 610.93,
    below15MFunds: false
  },
  {
    id: 'fo-1',
    office: 'DSWD FO I',
    shortName: 'FO I (Ilocos)',
    zone: 'Luzon',
    isHub: false,
    standbyFunds: 2347671.00,
    ffpQuantity: 112815,
    ffpTotalCost: 68575306.74,
    otherFoodCost: 5812905.00,
    nonFoodReliefCost: 19976195.28,
    otherNonFoodCost: 680646.40,
    totalSSF: 97392724.42,
    averageCostFFP: 607.86,
    below15MFunds: false
  },
  {
    id: 'fo-2',
    office: 'DSWD FO II',
    shortName: 'FO II (Cagayan Valley)',
    zone: 'Luzon',
    isHub: false,
    standbyFunds: 3000000.00,
    ffpQuantity: 189384,
    ffpTotalCost: 109157511.83,
    otherFoodCost: 3542627.02,
    nonFoodReliefCost: 60356024.44,
    otherNonFoodCost: 2270396.18,
    totalSSF: 178326559.47,
    averageCostFFP: 575.82,
    below15MFunds: false
  },
  {
    id: 'fo-3',
    office: 'DSWD FO III',
    shortName: 'FO III (Central Luzon)',
    zone: 'Luzon',
    isHub: false,
    standbyFunds: 2993200.20,
    ffpQuantity: 827823,
    ffpTotalCost: 574627946.24,
    otherFoodCost: 5209546.34,
    nonFoodReliefCost: 57254224.40,
    otherNonFoodCost: 4539162.93,
    totalSSF: 644624080.11,
    averageCostFFP: 699.98,
    below15MFunds: false
  },
  {
    id: 'fo-calabarzon',
    office: 'DSWD FO CALABARZON',
    shortName: 'FO IV-A (CALABARZON)',
    zone: 'Luzon',
    isHub: false,
    standbyFunds: 3000000.00,
    ffpQuantity: 213295,
    ffpTotalCost: 131974163.41,
    otherFoodCost: 8913738.00,
    nonFoodReliefCost: 20934045.74,
    otherNonFoodCost: 1474548.44,
    totalSSF: 166296495.59,
    averageCostFFP: 618.30,
    below15MFunds: false
  },
  {
    id: 'fo-mimaropa',
    office: 'DSWD FO MIMAROPA',
    shortName: 'FO IV-B (MIMAROPA)',
    zone: 'Luzon',
    isHub: false,
    standbyFunds: 2842582.00,
    ffpQuantity: 199572,
    ffpTotalCost: 136254151.26,
    otherFoodCost: 10143621.70,
    nonFoodReliefCost: 37657397.27,
    otherNonFoodCost: 3115961.65,
    totalSSF: 190013713.88,
    averageCostFFP: 687.17,
    below15MFunds: false
  },
  {
    id: 'fo-5',
    office: 'DSWD FO V',
    shortName: 'FO V (Bicol)',
    zone: 'Luzon',
    isHub: false,
    standbyFunds: 2000000.00,
    ffpQuantity: 417890,
    ffpTotalCost: 316005460.87,
    otherFoodCost: 17776032.97,
    nonFoodReliefCost: 101565165.16,
    otherNonFoodCost: 23833053.03,
    totalSSF: 461179712.03,
    averageCostFFP: 694.70,
    below15MFunds: false,
    notes: 'Major Bicol response hub prepositioned with 417,890 packs (₱461.2M SSF).'
  },
  {
    id: 'fo-6',
    office: 'DSWD FO VI',
    shortName: 'FO VI (Western Visayas)',
    zone: 'Visayas',
    isHub: false,
    standbyFunds: 3000000.00,
    ffpQuantity: 208639,
    ffpTotalCost: 124666178.97,
    otherFoodCost: 20226666.00,
    nonFoodReliefCost: 41932503.67,
    otherNonFoodCost: 907895.23,
    totalSSF: 190733243.87,
    averageCostFFP: 593.52,
    below15MFunds: false
  },
  {
    id: 'fo-nir',
    office: 'DSWD FO NIR',
    shortName: 'FO NIR (Negros)',
    zone: 'Visayas',
    isHub: false,
    standbyFunds: 2722800.00,
    ffpQuantity: 247791,
    ffpTotalCost: 171994166.79,
    otherFoodCost: 4983450.00,
    nonFoodReliefCost: 35501639.24,
    otherNonFoodCost: 3294168.86,
    totalSSF: 218496224.89,
    averageCostFFP: 694.11,
    below15MFunds: false
  },
  {
    id: 'fo-7',
    office: 'DSWD FO VII',
    shortName: 'FO VII (Central Visayas)',
    zone: 'Visayas',
    isHub: false,
    standbyFunds: 2698843.28,
    ffpQuantity: 105143,
    ffpTotalCost: 60407592.37,
    otherFoodCost: 14640570.27,
    nonFoodReliefCost: 39480220.09,
    otherNonFoodCost: 2828721.70,
    totalSSF: 120055947.71,
    averageCostFFP: 568.13,
    below15MFunds: false
  },
  {
    id: 'fo-8',
    office: 'DSWD FO VIII',
    shortName: 'FO VIII (Eastern Visayas)',
    zone: 'Visayas',
    isHub: false,
    standbyFunds: 2575170.00,
    ffpQuantity: 218551,
    ffpTotalCost: 128052081.49,
    otherFoodCost: 14544219.09,
    nonFoodReliefCost: 26981350.87,
    otherNonFoodCost: 2917220.62,
    totalSSF: 175070042.07,
    averageCostFFP: 594.39,
    below15MFunds: false
  },
  {
    id: 'fo-9',
    office: 'DSWD FO IX',
    shortName: 'FO IX (Zamboanga)',
    zone: 'Mindanao',
    isHub: false,
    standbyFunds: 2493193.24,
    ffpQuantity: 143613,
    ffpTotalCost: 84552693.42,
    otherFoodCost: 9170702.00,
    nonFoodReliefCost: 57503405.43,
    otherNonFoodCost: 3863266.43,
    totalSSF: 157583260.52,
    averageCostFFP: 588.49,
    below15MFunds: false
  },
  {
    id: 'fo-10',
    office: 'DSWD FO X',
    shortName: 'FO X (Northern Mindanao)',
    zone: 'Mindanao',
    isHub: false,
    standbyFunds: 2836278.00,
    ffpQuantity: 230203,
    ffpTotalCost: 147978662.86,
    otherFoodCost: 15954149.74,
    nonFoodReliefCost: 37605497.86,
    otherNonFoodCost: 1190613.79,
    totalSSF: 205565202.25,
    averageCostFFP: 647.42,
    below15MFunds: false
  },
  {
    id: 'fo-11',
    office: 'DSWD FO XI',
    shortName: 'FO XI (Davao)',
    zone: 'Mindanao',
    isHub: false,
    standbyFunds: 2584960.00,
    ffpQuantity: 132201,
    ffpTotalCost: 69951614.60,
    otherFoodCost: 1269800.00,
    nonFoodReliefCost: 44121980.60,
    otherNonFoodCost: 7111788.30,
    totalSSF: 125040143.50,
    averageCostFFP: 529.05,
    below15MFunds: false,
    notes: 'Maintains highest cost-efficiency across all regions (₱529.05/pack).'
  },
  {
    id: 'fo-12',
    office: 'DSWD FO XII',
    shortName: 'FO XII (SOCCSKSARGEN)',
    zone: 'Mindanao',
    isHub: false,
    standbyFunds: 3000000.00,
    ffpQuantity: 175009,
    ffpTotalCost: 138619380.78,
    otherFoodCost: 13490956.00,
    nonFoodReliefCost: 64698921.03,
    otherNonFoodCost: 2434940.69,
    totalSSF: 222244198.50,
    averageCostFFP: 775.85,
    below15MFunds: false
  },
  {
    id: 'fo-caraga',
    office: 'DSWD FO CARAGA',
    shortName: 'FO CARAGA',
    zone: 'Mindanao',
    isHub: false,
    standbyFunds: 2742500.00,
    ffpQuantity: 187233,
    ffpTotalCost: 137331626.36,
    otherFoodCost: 19544246.00,
    nonFoodReliefCost: 26828570.73,
    otherNonFoodCost: 1969822.94,
    totalSSF: 188416766.03,
    averageCostFFP: 730.76,
    below15MFunds: false
  },
  {
    id: 'fo-car',
    office: 'DSWD FO CAR',
    shortName: 'FO CAR (Cordillera)',
    zone: 'Luzon',
    isHub: false,
    standbyFunds: 2579286.51,
    ffpQuantity: 91292,
    ffpTotalCost: 55504341.90,
    otherFoodCost: 4127481.96,
    nonFoodReliefCost: 35047958.42,
    otherNonFoodCost: 3658573.04,
    totalSSF: 100917641.83,
    averageCostFFP: 607.79,
    below15MFunds: false
  }
];

// Baseline comparative data from the spreadsheet (18 October 2026, 06:00 PM)
export const BASELINE_COMPARATIVE_DATA: Record<string, {
  standbyFunds: number;
  ffpQuantity: number;
  ffpTotalCost: number;
  otherFoodCost: number;
  nonFoodReliefCost: number;
  otherNonFoodCost: number;
  totalSSF: number;
}> = {
  'DSWD CO': {
    standbyFunds: 41999099.91,
    ffpQuantity: 0,
    ffpTotalCost: 0,
    otherFoodCost: 0,
    nonFoodReliefCost: 0,
    otherNonFoodCost: 0,
    totalSSF: 41999099.91
  },
  'NRLMB LDRC': {
    standbyFunds: 0,
    ffpQuantity: 170112,
    ffpTotalCost: 106672086.30,
    otherFoodCost: 11221198.44,
    nonFoodReliefCost: 59561345.79,
    otherNonFoodCost: 50272411.10,
    totalSSF: 227727041.63
  },
  'NRLMB VDRC': {
    standbyFunds: 0,
    ffpQuantity: 499395,
    ffpTotalCost: 315177542.52,
    otherFoodCost: 54828667.34,
    nonFoodReliefCost: 152884874.16,
    otherNonFoodCost: 18467024.95,
    totalSSF: 541358108.97
  },
  'NRLMB MDRC': {
    standbyFunds: 0,
    ffpQuantity: 152361,
    ffpTotalCost: 120918341.85,
    otherFoodCost: 11296048.00,
    nonFoodReliefCost: 81244937.68,
    otherNonFoodCost: 848114.23,
    totalSSF: 214307441.76
  },
  'DSWD FO NCR': {
    standbyFunds: 3000000.00,
    ffpQuantity: 62640,
    ffpTotalCost: 38268590.95,
    otherFoodCost: 3999140.14,
    nonFoodReliefCost: 13997067.67,
    otherNonFoodCost: 1696416.75,
    totalSSF: 60961215.51
  },
  'DSWD FO I': {
    standbyFunds: 2347671.00,
    ffpQuantity: 112918,
    ffpTotalCost: 68637990.49,
    otherFoodCost: 3427150.00,
    nonFoodReliefCost: 20050096.17,
    otherNonFoodCost: 680646.40,
    totalSSF: 95143554.06
  },
  'DSWD FO II': {
    standbyFunds: 3000000.00,
    ffpQuantity: 198306,
    ffpTotalCost: 114188895.99,
    otherFoodCost: 3542627.02,
    nonFoodReliefCost: 60415736.03,
    otherNonFoodCost: 2270396.18,
    totalSSF: 183417655.22
  },
  'DSWD FO III': {
    standbyFunds: 2993200.20,
    ffpQuantity: 827056,
    ffpTotalCost: 578926655.17,
    otherFoodCost: 5209546.34,
    nonFoodReliefCost: 57254224.40,
    otherNonFoodCost: 4539162.93,
    totalSSF: 648922789.04
  },
  'DSWD FO CALABARZON': {
    standbyFunds: 3000000.00,
    ffpQuantity: 218261,
    ffpTotalCost: 134950538.11,
    otherFoodCost: 8913738.00,
    nonFoodReliefCost: 22119694.74,
    otherNonFoodCost: 1474548.44,
    totalSSF: 170458519.29
  },
  'DSWD FO MIMAROPA': {
    standbyFunds: 2842582.00,
    ffpQuantity: 185983,
    ffpTotalCost: 127801105.26,
    otherFoodCost: 10143621.70,
    nonFoodReliefCost: 37828125.51,
    otherNonFoodCost: 3137711.65,
    totalSSF: 181753146.12
  },
  'DSWD FO V': {
    standbyFunds: 2000000.00,
    ffpQuantity: 420343,
    ffpTotalCost: 292010922.25,
    otherFoodCost: 17776269.16,
    nonFoodReliefCost: 101663814.58,
    otherNonFoodCost: 23867773.53,
    totalSSF: 437318779.52
  },
  'DSWD FO VI': {
    standbyFunds: 3000000.00,
    ffpQuantity: 208767,
    ffpTotalCost: 123907849.02,
    otherFoodCost: 20226666.00,
    nonFoodReliefCost: 41972841.27,
    otherNonFoodCost: 907895.23,
    totalSSF: 190015251.52
  },
  'DSWD FO NIR': {
    standbyFunds: 2722800.00,
    ffpQuantity: 247791,
    ffpTotalCost: 171994166.79,
    otherFoodCost: 4983450.00,
    nonFoodReliefCost: 35501639.24,
    otherNonFoodCost: 3294168.86,
    totalSSF: 218496224.89
  },
  'DSWD FO VII': {
    standbyFunds: 2698843.28,
    ffpQuantity: 90415,
    ffpTotalCost: 51367596.12,
    otherFoodCost: 14653576.27,
    nonFoodReliefCost: 39488402.97,
    otherNonFoodCost: 2828721.70,
    totalSSF: 111037140.34
  },
  'DSWD FO VIII': {
    standbyFunds: 2575170.00,
    ffpQuantity: 225051,
    ffpTotalCost: 133767394.07,
    otherFoodCost: 14544219.09,
    nonFoodReliefCost: 27000402.87,
    otherNonFoodCost: 2917220.62,
    totalSSF: 180804406.65
  },
  'DSWD FO IX': {
    standbyFunds: 2493193.24,
    ffpQuantity: 144311,
    ffpTotalCost: 84925022.17,
    otherFoodCost: 9993524.00,
    nonFoodReliefCost: 57613044.43,
    otherNonFoodCost: 3863266.43,
    totalSSF: 158888050.27
  },
  'DSWD FO X': {
    standbyFunds: 2836278.00,
    ffpQuantity: 235188,
    ffpTotalCost: 152266271.37,
    otherFoodCost: 16353119.74,
    nonFoodReliefCost: 37712885.84,
    otherNonFoodCost: 1193595.71,
    totalSSF: 210362150.66
  },
  'DSWD FO XI': {
    standbyFunds: 2830170.00,
    ffpQuantity: 137534,
    ffpTotalCost: 72762279.37,
    otherFoodCost: 10271200.00,
    nonFoodReliefCost: 52368863.87,
    otherNonFoodCost: 7073519.30,
    totalSSF: 145306032.54
  },
  'DSWD FO XII': {
    standbyFunds: 3000000.00,
    ffpQuantity: 183676,
    ffpTotalCost: 142504233.10,
    otherFoodCost: 13500536.00,
    nonFoodReliefCost: 18422044.03,
    otherNonFoodCost: 2434940.69,
    totalSSF: 179861753.82
  },
  'DSWD FO CARAGA': {
    standbyFunds: 2742500.00,
    ffpQuantity: 157769,
    ffpTotalCost: 115291925.64,
    otherFoodCost: 19224550.00,
    nonFoodReliefCost: 27006521.99,
    otherNonFoodCost: 1969822.94,
    totalSSF: 166235320.57
  },
  'DSWD FO CAR': {
    standbyFunds: 2655915.00,
    ffpQuantity: 92455,
    ffpTotalCost: 56193260.98,
    otherFoodCost: 4248947.41,
    nonFoodReliefCost: 38196511.42,
    otherNonFoodCost: 3847423.11,
    totalSSF: 105142057.92
  }
};

export const INITIAL_SNAPSHOT: SheetSnapshot = {
  reportTitle: 'Stockpile and Standby Funds (SSF) Monitoring Report',
  asOfDate: '29 October 2026, 06:00 AM',
  googleSheetUrl: GOOGLE_SHEET_BACKUP_URL,
  lastSyncedAt: new Date().toISOString(),
  offices: INITIAL_OFFICES_DATA
};

export const AVAILABLE_SHEETS: SheetDefinition[] = [
  {
    id: 'consolidated',
    name: 'Consolidated SSF Report',
    tabLabel: 'Main SSF Report',
    description: 'Master operational view as of 29 Oct 2026 with customizable interactive charts and regional breakdown.',
    badge: 'Live'
  },
  {
    id: 'comparative',
    name: 'Incident Comparative & Trend Analysis',
    tabLabel: 'Incident Variance',
    description: 'Variance tracking across disaster operations comparing baseline (18 Oct) vs current operational status (29 Oct).',
    badge: 'Δ Delta'
  },
  {
    id: 'infographics',
    name: 'Executive Infographics & Prepo Matrix',
    tabLabel: 'Executive Infographics',
    description: 'Macro SSF allocation with Stockpile Commodity Composition and Regional Prepositioning (Prepo) Matrix (30% Pop, Warehouse Cap, FFP, NFRI, RTEF, OFI).',
    badge: 'Prepo Sheet'
  },
  {
    id: 'logistics-hubs',
    name: 'National Logistics Hubs (NRLMB)',
    tabLabel: 'NRLMB Hubs',
    description: 'Strategic production and mechanization hubs: LDRC (Luzon), VDRC (Visayas), MDRC (Mindanao).',
    badge: 'Hubs'
  },
  {
    id: 'critical-alerts',
    name: 'Critical Thresholds & Buffer Monitoring',
    tabLabel: 'Alerts & Buffer',
    description: 'Offices below ₱1.5M threshold, unit cost outliers, and near-expiring stockpiles.',
    badge: 'Thresholds'
  },
  {
    id: 'incident-ops',
    name: 'Customized Table & Slides for IOs',
    tabLabel: 'Custom Table / Slides',
    description: 'Standardized DSWD DRMB briefing format for Incident Operators, press releases, and command center slides.',
    badge: 'Briefing'
  },
  {
    id: 'live-editor',
    name: 'Real-Time Sync & Live Spreadsheet Editor',
    tabLabel: 'Live Sync & Grid',
    description: 'Live bidirectional spreadsheet editor, Google Sheet connector, simulation engine, and file importer.',
    badge: 'Live Sync'
  }
];
