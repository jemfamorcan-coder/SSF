import { OfficeSSFData, RegionalPrepoData, RegionZone } from '../types/ssf';

export interface RegionalBaselineMetadata {
  officeMatch: string;
  warehouseLocation: string;
  totalPopulation: number;
  maxWarehouseCapacityFFP: number;
  rtefPacksEstimate: number;
  criticalItemAlerts?: string[];
}

export const REGIONAL_BASELINES: Record<string, RegionalBaselineMetadata> = {
  'DSWD CO': {
    officeMatch: 'DSWD CO',
    warehouseLocation: 'NROC (National Resource Operations Center), Pasay City',
    totalPopulation: 0, // Central reserve pool
    maxWarehouseCapacityFFP: 650000,
    rtefPacksEstimate: 150000,
    criticalItemAlerts: ['Central standby fund buffer maintained at ₱45.01M for nationwide emergency response']
  },
  'NRLMB LDRC': {
    officeMatch: 'NRLMB LDRC',
    warehouseLocation: 'Clark Freeport Special Economic Zone Hub, Pampanga',
    totalPopulation: 0, // Strategic multi-region logistics hub
    maxWarehouseCapacityFFP: 600000,
    rtefPacksEstimate: 145000,
    criticalItemAlerts: ['High throughput mechanized packaging hub servicing Northern & Central Luzon']
  },
  'NRLMB VDRC': {
    officeMatch: 'NRLMB VDRC',
    warehouseLocation: 'Upper Tingub, Mandaue City Logistics Complex, Cebu',
    totalPopulation: 0, // Visayas central packaging mega-hub
    maxWarehouseCapacityFFP: 750000,
    rtefPacksEstimate: 180000,
    criticalItemAlerts: ['Mechanized box-packing station running 2 shifts; 646,171 packs prepositioned']
  },
  'NRLMB MDRC': {
    officeMatch: 'NRLMB MDRC',
    warehouseLocation: 'Bago Aplaya, Talomo District Logistics Facility, Davao City',
    totalPopulation: 0, // Mindanao central logistics hub
    maxWarehouseCapacityFFP: 220000,
    rtefPacksEstimate: 75000,
    criticalItemAlerts: ['Inter-island maritime prepositioning ready for Sulu & Tawi-Tawi corridors']
  },
  'DSWD FO NCR': {
    officeMatch: 'DSWD FO NCR',
    warehouseLocation: 'Legarda Central Storage, Manila & Valenzuela Satellite Hub',
    totalPopulation: 13484462,
    maxWarehouseCapacityFFP: 120000,
    rtefPacksEstimate: 35000,
    criticalItemAlerts: ['Urban density buffer; rapid dispatch protocol activated for riverine LGUs']
  },
  'DSWD FO I': {
    officeMatch: 'DSWD FO I',
    warehouseLocation: 'Brgy. Biday, San Fernando City, La Union & Rosales Prepo Point',
    totalPopulation: 5301139,
    maxWarehouseCapacityFFP: 150000,
    rtefPacksEstimate: 42000,
    criticalItemAlerts: ['Storm surge zone prepositions in Pangasinan and Ilocos Sur coastal hubs active']
  },
  'DSWD FO II': {
    officeMatch: 'DSWD FO II',
    warehouseLocation: 'Regional Government Center, Carig Sur, Tuguegarao City, Cagayan',
    totalPopulation: 3685744,
    maxWarehouseCapacityFFP: 220000,
    rtefPacksEstimate: 58000,
    criticalItemAlerts: ['Cagayan River basin flood readiness protocol in place across 189K FFPs']
  },
  'DSWD FO III': {
    officeMatch: 'DSWD FO III',
    warehouseLocation: 'Maimpis Government Center, San Fernando, Pampanga & Fort Magsaysay Hub',
    totalPopulation: 12422172,
    maxWarehouseCapacityFFP: 950000,
    rtefPacksEstimate: 210000,
    criticalItemAlerts: ['Highest regional stockpile holding (827,823 FFPs); 87.1% capacity utilization']
  },
  'DSWD FO CALABARZON': {
    officeMatch: 'DSWD FO CALABARZON',
    warehouseLocation: 'Alabang Central Annex & GMA Cavite Regional Logistics Hub',
    totalPopulation: 16195042,
    maxWarehouseCapacityFFP: 260000,
    rtefPacksEstimate: 65000,
    criticalItemAlerts: ['Taal & Sierra Madre hazard buffers staged at Batangas and Quezon depots']
  },
  'DSWD FO MIMAROPA': {
    officeMatch: 'DSWD FO MIMAROPA',
    warehouseLocation: 'Calapan City Port Warehouse, Oriental Mindoro & Puerto Princesa Hub',
    totalPopulation: 3228558,
    maxWarehouseCapacityFFP: 240000,
    rtefPacksEstimate: 62000,
    criticalItemAlerts: ['Island-province maritime forward-bases loaded across Palawan, Romblon & Marinduque']
  },
  'DSWD FO V': {
    officeMatch: 'DSWD FO V',
    warehouseLocation: 'Brgy. Buraguis, Legazpi City & CamSur Pili Prepo Warehouse',
    totalPopulation: 6082165,
    maxWarehouseCapacityFFP: 480000,
    rtefPacksEstimate: 125000,
    criticalItemAlerts: ['Mayon hazard corridor & typhoon belt priority; 417,890 packs (87.1% warehouse capacity)']
  },
  'DSWD FO VI': {
    officeMatch: 'DSWD FO VI',
    warehouseLocation: 'Molo, Iloilo City & Antique / Capiz Satellite Warehouses',
    totalPopulation: 7954723,
    maxWarehouseCapacityFFP: 250000,
    rtefPacksEstimate: 68000,
    criticalItemAlerts: ['Panay coastal flooding reserves stocked; 208,639 FFPs ready for dispatch']
  },
  'DSWD FO NIR': {
    officeMatch: 'DSWD FO NIR',
    warehouseLocation: 'Bacolod City Warehouse & Dumaguete Port Prepositioning Depot',
    totalPopulation: 4611445,
    maxWarehouseCapacityFFP: 280000,
    rtefPacksEstimate: 72000,
    criticalItemAlerts: ['Negros Island integrated disaster readiness: 247,791 FFPs (88.5% capacity)']
  },
  'DSWD FO VII': {
    officeMatch: 'DSWD FO VII',
    warehouseLocation: 'Labangon, Cebu City & Tagbilaran Bohol Forward Warehouse',
    totalPopulation: 8081988,
    maxWarehouseCapacityFFP: 140000,
    rtefPacksEstimate: 45000,
    criticalItemAlerts: ['Backed by NRLMB VDRC mega-hub nearby in Mandaue for instant surge re-supply']
  },
  'DSWD FO VIII': {
    officeMatch: 'DSWD FO VIII',
    warehouseLocation: 'Magsaysay Blvd, Tacloban City & Northern Samar Catarman Hub',
    totalPopulation: 4547150,
    maxWarehouseCapacityFFP: 260000,
    rtefPacksEstimate: 70000,
    criticalItemAlerts: ['Pacific typhoon corridor frontline stockpile: 218,551 packs ready']
  },
  'DSWD FO IX': {
    officeMatch: 'DSWD FO IX',
    warehouseLocation: 'General Alvarez St., Zamboanga City & Pagadian Regional Hub',
    totalPopulation: 3875576,
    maxWarehouseCapacityFFP: 175000,
    rtefPacksEstimate: 48000,
    criticalItemAlerts: ['Zamboanga Peninsula and island municipality sea-lift prepositions established']
  },
  'DSWD FO X': {
    officeMatch: 'DSWD FO X',
    warehouseLocation: 'Masterson Ave., Upper Carmen, Cagayan de Oro City',
    totalPopulation: 5022768,
    maxWarehouseCapacityFFP: 270000,
    rtefPacksEstimate: 74000,
    criticalItemAlerts: ['Northern Mindanao central stockpile: 230,203 FFPs (85.3% warehouse utilization)']
  },
  'DSWD FO XI': {
    officeMatch: 'DSWD FO XI',
    warehouseLocation: 'Suazo St., Davao City & Tagum City Satellite Depot',
    totalPopulation: 5243536,
    maxWarehouseCapacityFFP: 160000,
    rtefPacksEstimate: 40000,
    criticalItemAlerts: ['Lowest unit packing cost nationwide (₱529.05/pack); 132,201 FFPs staged']
  },
  'DSWD FO XII': {
    officeMatch: 'DSWD FO XII',
    warehouseLocation: 'Purok Bumanaag, Brgy. Zone III, Koronadal City & GenSan Hub',
    totalPopulation: 4901486,
    maxWarehouseCapacityFFP: 210000,
    rtefPacksEstimate: 52000,
    criticalItemAlerts: ['SOCCSKSARGEN flood basin & quake fault monitoring reserves: 175,009 FFPs']
  },
  'DSWD FO CARAGA': {
    officeMatch: 'DSWD FO CARAGA',
    warehouseLocation: 'R. Palma St., Butuan City & Surigao Port Hub',
    totalPopulation: 2804788,
    maxWarehouseCapacityFFP: 220000,
    rtefPacksEstimate: 55000,
    criticalItemAlerts: ['Agusan River basin flood preparedness; 187,233 FFPs (85.1% capacity utilization)']
  },
  'DSWD FO CAR': {
    officeMatch: 'DSWD FO CAR',
    warehouseLocation: 'SN Oriental Warehouse, Loakan, Baguio City & Benguet Satellite',
    totalPopulation: 1797660,
    maxWarehouseCapacityFFP: 110000,
    rtefPacksEstimate: 32000,
    criticalItemAlerts: ['Highland landslide-isolated LGUs pre-stocked with 91,292 FFPs & cold-weather NFRI']
  }
};

/**
 * Computes live Prepositioning (Prepo) data combining incoming live SSF data
 * with demographic baselines and registered warehouse capacities.
 */
export function computePrepoData(offices: OfficeSSFData[]): RegionalPrepoData[] {
  return offices.map(office => {
    const meta = REGIONAL_BASELINES[office.office] || {
      officeMatch: office.office,
      warehouseLocation: 'Regional DSWD Warehouse',
      totalPopulation: 4500000,
      maxWarehouseCapacityFFP: 200000,
      rtefPacksEstimate: 45000
    };

    const isHub = office.isHub || office.office === 'DSWD CO';
    const totalPop = meta.totalPopulation;
    const vulnerableRate = 0.30; // 30% statutory benchmark for disaster planning
    const targetPop30 = Math.round(totalPop * vulnerableRate);
    const targetHouseholds = Math.round(targetPop30 / 5); // 5 members per standard Filipino family

    const maxCap = meta.maxWarehouseCapacityFFP;
    const utilizationPct = maxCap > 0 ? (office.ffpQuantity / maxCap) * 100 : 0;

    let warehouseStatus: 'Safe' | 'Optimal' | 'Near Capacity' | 'Critical' = 'Safe';
    if (utilizationPct >= 95) {
      warehouseStatus = 'Near Capacity';
    } else if (utilizationPct >= 80) {
      warehouseStatus = 'Optimal';
    } else if (utilizationPct < 40 && !isHub) {
      warehouseStatus = 'Critical';
    }

    const rtefPacks = meta.rtefPacksEstimate;
    // Standard DSWD RTEF cost: ~₱125 per fortified retort meal / emergency pouch
    const rtefCost = rtefPacks * 125;

    const coverageRatio = targetHouseholds > 0 
      ? (office.ffpQuantity / targetHouseholds) * 100 
      : 100;

    const bufferDays = targetHouseholds > 0 
      ? Math.round((office.ffpQuantity / (targetHouseholds * 0.12)) * 10) / 10 
      : 30;

    const totalPrepoValue = office.ffpTotalCost + office.nonFoodReliefCost + office.otherFoodCost + office.otherNonFoodCost;

    return {
      officeId: office.id,
      officeName: office.office,
      shortName: office.shortName,
      zone: office.zone,
      warehouseLocation: meta.warehouseLocation,
      isHub,
      totalPopulation: totalPop,
      vulnerableRate,
      targetPopulation30: targetPop30,
      targetHouseholds,
      maxWarehouseCapacityFFP: maxCap,
      currentWarehouseUtilizationPct: Math.round(utilizationPct * 10) / 10,
      warehouseStatus,
      ffpQuantity: office.ffpQuantity,
      ffpTotalCost: office.ffpTotalCost,
      nonFoodItemsCost: office.nonFoodReliefCost,
      readyToEatFoodPacks: rtefPacks,
      readyToEatFoodCost: rtefCost,
      otherFoodItemsCost: office.otherFoodCost,
      otherNonFoodCost: office.otherNonFoodCost,
      totalPrepoCommodityCost: totalPrepoValue,
      coverageRatio30Pct: Math.round(coverageRatio * 10) / 10,
      bufferDaysSufficiency: Math.min(60, bufferDays),
      criticalItemAlerts: meta.criticalItemAlerts
    };
  });
}

export interface PrepoNationalSummary {
  nationalTotalPopulation: number;
  national30PctTargetPopulation: number;
  national30PctTargetHouseholds: number;
  totalMaxWarehouseCapacity: number;
  totalFFPPrepositioned: number;
  totalWarehouseUtilizationPct: number;
  totalRTEFPacks: number;
  totalRTEFCost: number;
  totalNFRICost: number;
  totalOtherFoodCost: number;
  totalPrepoCommoditiesCost: number;
  average30PctCoverageRatio: number;
}

export function computePrepoNationalSummary(data: RegionalPrepoData[]): PrepoNationalSummary {
  const regionalOnly = data.filter(d => !d.isHub);
  
  const nationalTotalPopulation = regionalOnly.reduce((acc, d) => acc + d.totalPopulation, 0);
  const national30PctTargetPopulation = regionalOnly.reduce((acc, d) => acc + d.targetPopulation30, 0);
  const national30PctTargetHouseholds = regionalOnly.reduce((acc, d) => acc + d.targetHouseholds, 0);

  const totalMaxWarehouseCapacity = data.reduce((acc, d) => acc + d.maxWarehouseCapacityFFP, 0);
  const totalFFPPrepositioned = data.reduce((acc, d) => acc + d.ffpQuantity, 0);
  const totalWarehouseUtilizationPct = totalMaxWarehouseCapacity > 0 
    ? (totalFFPPrepositioned / totalMaxWarehouseCapacity) * 100 
    : 0;

  const totalRTEFPacks = data.reduce((acc, d) => acc + d.readyToEatFoodPacks, 0);
  const totalRTEFCost = data.reduce((acc, d) => acc + d.readyToEatFoodCost, 0);
  const totalNFRICost = data.reduce((acc, d) => acc + d.nonFoodItemsCost, 0);
  const totalOtherFoodCost = data.reduce((acc, d) => acc + d.otherFoodItemsCost, 0);
  const totalPrepoCommoditiesCost = data.reduce((acc, d) => acc + d.totalPrepoCommodityCost, 0);

  const average30PctCoverageRatio = national30PctTargetHouseholds > 0
    ? (totalFFPPrepositioned / national30PctTargetHouseholds) * 100
    : 0;

  return {
    nationalTotalPopulation,
    national30PctTargetPopulation,
    national30PctTargetHouseholds,
    totalMaxWarehouseCapacity,
    totalFFPPrepositioned,
    totalWarehouseUtilizationPct: Math.round(totalWarehouseUtilizationPct * 10) / 10,
    totalRTEFPacks,
    totalRTEFCost,
    totalNFRICost,
    totalOtherFoodCost,
    totalPrepoCommoditiesCost,
    average30PctCoverageRatio: Math.round(average30PctCoverageRatio * 10) / 10
  };
}
