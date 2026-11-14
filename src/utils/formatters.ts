import { MetricKey, OfficeSSFData, ComparativeVariance } from '../types/ssf';
import { BASELINE_COMPARATIVE_DATA } from '../data/initialData';

export function formatPHP(value: number, compact: boolean = false): string {
  if (value === undefined || value === null || isNaN(value)) return '₱0.00';
  
  if (compact) {
    const absVal = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    if (absVal >= 1_000_000_000) {
      return `${sign}₱${(absVal / 1_000_000_000).toFixed(2)}B`;
    }
    if (absVal >= 1_000_000) {
      return `${sign}₱${(absVal / 1_000_000).toFixed(2)}M`;
    }
    if (absVal >= 1_000) {
      return `${sign}₱${(absVal / 1_000).toFixed(1)}k`;
    }
    return `${sign}₱${absVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  return '₱' + value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function formatNumber(value: number, compact: boolean = false): string {
  if (value === undefined || value === null || isNaN(value)) return '0';
  if (compact) {
    const absVal = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    if (absVal >= 1_000_000) {
      return `${sign}${(absVal / 1_000_000).toFixed(2)}M`;
    }
    if (absVal >= 1_000) {
      return `${sign}${(absVal / 1_000).toFixed(1)}k`;
    }
    return `${sign}${absVal.toLocaleString('en-US')}`;
  }
  return value.toLocaleString('en-US');
}

export function formatDelta(delta: number, isCurrency: boolean = false): string {
  if (delta === 0) return '0';
  const prefix = delta > 0 ? '+' : '';
  if (isCurrency) {
    return prefix + formatPHP(delta, true);
  }
  return prefix + formatNumber(delta, true);
}

export function getMetricLabel(key: MetricKey): string {
  switch (key) {
    case 'totalSSF':
      return 'Total Standby Funds & Stockpile';
    case 'standbyFunds':
      return 'Standby Funds';
    case 'ffpQuantity':
      return 'Family Food Packs (FFP) Quantity';
    case 'ffpTotalCost':
      return 'Family Food Packs (FFP) Total Cost';
    case 'otherFoodCost':
      return 'Other Food Items Total Cost';
    case 'nonFoodReliefCost':
      return 'Non-Food Relief Items (NFRI) Total Cost';
    case 'otherNonFoodCost':
      return 'Other Non-Food Items Total Cost';
    case 'averageCostFFP':
      return 'Average Cost per FFP';
    default:
      return key;
  }
}

export function getMetricShortLabel(key: MetricKey): string {
  switch (key) {
    case 'totalSSF':
      return 'Total SSF';
    case 'standbyFunds':
      return 'Standby Funds';
    case 'ffpQuantity':
      return 'FFP Qty';
    case 'ffpTotalCost':
      return 'FFP Cost';
    case 'otherFoodCost':
      return 'Other Food';
    case 'nonFoodReliefCost':
      return 'NFRI Cost';
    case 'otherNonFoodCost':
      return 'Other NF';
    case 'averageCostFFP':
      return 'Avg Cost/FFP';
    default:
      return key;
  }
}

export function isCurrencyMetric(key: MetricKey): boolean {
  return key !== 'ffpQuantity';
}

export function calculateSummaryTotals(offices: OfficeSSFData[]) {
  const totalStandbyFunds = offices.reduce((acc, curr) => acc + curr.standbyFunds, 0);
  const totalFFPQuantity = offices.reduce((acc, curr) => acc + curr.ffpQuantity, 0);
  const totalFFPCost = offices.reduce((acc, curr) => acc + curr.ffpTotalCost, 0);
  const totalOtherFood = offices.reduce((acc, curr) => acc + curr.otherFoodCost, 0);
  const totalNFRI = offices.reduce((acc, curr) => acc + curr.nonFoodReliefCost, 0);
  const totalOtherNF = offices.reduce((acc, curr) => acc + curr.otherNonFoodCost, 0);
  const totalStockpileCost = totalFFPCost + totalOtherFood + totalNFRI + totalOtherNF;
  const totalSSF = totalStandbyFunds + totalStockpileCost;
  const averageCostFFP = totalFFPQuantity > 0 ? totalFFPCost / totalFFPQuantity : 0;

  return {
    totalStandbyFunds,
    totalFFPQuantity,
    totalFFPCost,
    totalOtherFood,
    totalNFRI,
    totalOtherNF,
    totalStockpileCost,
    totalSSF,
    averageCostFFP,
    officeCount: offices.length,
    hubsCount: offices.filter(o => o.isHub).length,
    fieldOfficeCount: offices.filter(o => !o.isHub && o.office !== 'DSWD CO').length
  };
}

export function computeComparativeVariances(offices: OfficeSSFData[]): ComparativeVariance[] {
  return offices.map(curr => {
    const base = BASELINE_COMPARATIVE_DATA[curr.office] || {
      standbyFunds: curr.standbyFunds,
      ffpQuantity: curr.ffpQuantity,
      ffpTotalCost: curr.ffpTotalCost,
      otherFoodCost: curr.otherFoodCost,
      nonFoodReliefCost: curr.nonFoodReliefCost,
      otherNonFoodCost: curr.otherNonFoodCost,
      totalSSF: curr.totalSSF
    };

    const deltaFFPQty = curr.ffpQuantity - base.ffpQuantity;
    const deltaFFPQtyPercent = base.ffpQuantity > 0 ? (deltaFFPQty / base.ffpQuantity) * 100 : 0;
    const deltaTotalSSF = curr.totalSSF - base.totalSSF;
    const deltaStandbyFunds = curr.standbyFunds - base.standbyFunds;

    let activityType: 'Replenished' | 'Dispatched' | 'Stable' = 'Stable';
    if (deltaFFPQty > 0) activityType = 'Replenished';
    else if (deltaFFPQty < 0) activityType = 'Dispatched';

    return {
      office: curr.office,
      shortName: curr.shortName,
      zone: curr.zone,
      baseStandbyFunds: base.standbyFunds,
      baseFFPQty: base.ffpQuantity,
      baseTotalSSF: base.totalSSF,
      currentStandbyFunds: curr.standbyFunds,
      currentFFPQty: curr.ffpQuantity,
      currentTotalSSF: curr.totalSSF,
      deltaFFPQty,
      deltaFFPQtyPercent,
      deltaTotalSSF,
      deltaStandbyFunds,
      activityType
    };
  });
}
