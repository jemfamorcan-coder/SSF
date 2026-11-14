import React, { useState } from 'react';
import { OfficeSSFData, ChartCustomization } from '../../types/ssf';
import { formatPHP, formatNumber, isCurrencyMetric, getMetricShortLabel, getMetricLabel } from '../../utils/formatters';

interface InteractiveChartProps {
  data: OfficeSSFData[];
  customization: ChartCustomization;
  height?: number;
  title?: string;
  subtitle?: string;
}

interface HoverItem {
  office: OfficeSSFData;
  x: number;
  y: number;
  value: number;
  label?: string;
  breakdown?: { name: string; value: number; color: string }[];
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  data,
  customization,
  height = 380,
  title,
  subtitle
}) => {
  const [hovered, setHovered] = useState<HoverItem | null>(null);

  // 1. Filter data based on regionFilter
  let filteredData = [...data];
  if (customization.regionFilter === 'HUBS_ONLY') {
    filteredData = filteredData.filter(d => d.isHub);
  } else if (customization.regionFilter === 'FIELD_OFFICES_ONLY') {
    filteredData = filteredData.filter(d => !d.isHub && d.office !== 'DSWD CO');
  } else if (customization.regionFilter !== 'ALL') {
    filteredData = filteredData.filter(d => d.zone === customization.regionFilter);
  }

  // 2. Sort data based on sortBy
  if (customization.sortBy === 'value-desc') {
    filteredData.sort((a, b) => (b[customization.primaryMetric] || 0) - (a[customization.primaryMetric] || 0));
  } else if (customization.sortBy === 'value-asc') {
    filteredData.sort((a, b) => (a[customization.primaryMetric] || 0) - (b[customization.primaryMetric] || 0));
  } else if (customization.sortBy === 'name-asc') {
    filteredData.sort((a, b) => a.shortName.localeCompare(b.shortName));
  }

  // 3. Theme Colors
  const themeColors = {
    'dswd-classic': ['#1e40af', '#dc2626', '#f59e0b', '#0d9488', '#6366f1', '#475569'],
    'modern-emerald': ['#059669', '#0d9488', '#0284c7', '#6366f1', '#eab308', '#64748b'],
    'amber-sunset': ['#d97706', '#ea580c', '#e11d48', '#7c3aed', '#2563eb', '#52525b'],
    'corporate-navy': ['#1e3a8a', '#2563eb', '#38bdf8', '#0284c7', '#475569', '#94a3b8']
  }[customization.colorTheme];

  const primaryColor = themeColors[0];
  const secondaryColor = themeColors[1];
  const tertiaryColor = themeColors[2];
  const quaternaryColor = themeColors[3];

  const isCurrency = isCurrencyMetric(customization.primaryMetric);
  const formatVal = (v: number) => isCurrency ? formatPHP(v, true) : formatNumber(v, true);

  // ViewBox dimensions
  const svgWidth = 840;
  const svgHeight = height;
  const padding = { top: 30, right: 30, bottom: 65, left: 70 };
  const chartAreaWidth = svgWidth - padding.left - padding.right;
  const chartAreaHeight = svgHeight - padding.top - padding.bottom;

  // Max value calculation for scales
  let maxValue = 1;
  if (customization.chartType === 'stacked-bar') {
    maxValue = Math.max(
      1,
      ...filteredData.map(d => d.standbyFunds + d.ffpTotalCost + d.otherFoodCost + d.nonFoodReliefCost + d.otherNonFoodCost)
    );
  } else {
    maxValue = Math.max(1, ...filteredData.map(d => (d[customization.primaryMetric] as number) || 0));
  }
  // Add 10% headroom
  const yDomainMax = maxValue * 1.12;

  // Benchmark threshold value calculation
  const benchmarkValue = customization.thresholdValue ?? (
    customization.primaryMetric === 'standbyFunds' ? 1500000 :
    customization.primaryMetric === 'averageCostFFP' ? 656.96 :
    customization.primaryMetric === 'ffpQuantity' ? 200000 :
    maxValue * 0.4
  );

  return (
    <div className="relative w-full bg-white border border-slate-200 rounded-xl p-5 shadow-xs transition-all">
      {/* Chart Header */}
      {(title || subtitle) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
          <div>
            {title && (
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />
              <span className="font-medium text-slate-700">{getMetricShortLabel(customization.primaryMetric)}</span>
            </span>
            {customization.showThresholdLine && (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-t-2 border-dashed border-red-500" />
                <span className="text-red-600 font-medium">Benchmark ({formatVal(benchmarkValue)})</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* SVG Canvas Container */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[650px] font-sans select-none"
          onMouseLeave={() => setHovered(null)}
        >
          <defs>
            <linearGradient id={`grad-${customization.colorTheme}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.85" />
              <stop offset="100%" stopColor={primaryColor} stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.45" />
              <stop offset="100%" stopColor={primaryColor} stopOpacity="0.02" />
            </linearGradient>
            <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* Grid lines & Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const yPos = padding.top + chartAreaHeight * (1 - ratio);
            const val = yDomainMax * ratio;
            return (
              <g key={idx}>
                <line
                  x1={padding.left}
                  y1={yPos}
                  x2={svgWidth - padding.right}
                  y2={yPos}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray={ratio === 0 ? 'none' : '3 3'}
                />
                <text
                  x={padding.left - 8}
                  y={yPos + 4}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="inherit"
                >
                  {formatVal(val)}
                </text>
              </g>
            );
          })}

          {/* Threshold Line */}
          {customization.showThresholdLine && benchmarkValue <= yDomainMax && (
            <g>
              <line
                x1={padding.left}
                y1={padding.top + chartAreaHeight * (1 - benchmarkValue / yDomainMax)}
                x2={svgWidth - padding.right}
                y2={padding.top + chartAreaHeight * (1 - benchmarkValue / yDomainMax)}
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text
                x={svgWidth - padding.right - 4}
                y={padding.top + chartAreaHeight * (1 - benchmarkValue / yDomainMax) - 6}
                textAnchor="end"
                fill="#ef4444"
                fontSize="9"
                fontWeight="600"
              >
                Benchmark Threshold: {formatVal(benchmarkValue)}
              </text>
            </g>
          )}

          {/* 1. SINGLE BAR / COLUMN CHART */}
          {customization.chartType === 'single-bar' && (
            <g>
              {filteredData.map((d, index) => {
                const barCount = filteredData.length;
                const slotWidth = chartAreaWidth / barCount;
                const barWidth = Math.max(12, Math.min(32, slotWidth * 0.7));
                const val = (d[customization.primaryMetric] as number) || 0;
                const barHeight = Math.max(2, (val / yDomainMax) * chartAreaHeight);
                const x = padding.left + index * slotWidth + (slotWidth - barWidth) / 2;
                const y = padding.top + chartAreaHeight - barHeight;

                const isWarning = customization.primaryMetric === 'standbyFunds' && d.below15MFunds;
                const fillColor = isWarning ? '#ef4444' : primaryColor;

                return (
                  <g
                    key={d.id}
                    className="cursor-pointer transition-opacity"
                    onMouseEnter={e => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHovered({
                        office: d,
                        x: x + barWidth / 2,
                        y: y,
                        value: val
                      });
                    }}
                  >
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      fill={fillColor}
                      rx="3"
                      className="hover:opacity-80 transition-all"
                    />
                    {customization.showDataLabels && barWidth >= 20 && (
                      <text
                        x={x + barWidth / 2}
                        y={y - 5}
                        textAnchor="middle"
                        fill="#475569"
                        fontSize="8.5"
                        fontWeight="600"
                      >
                        {formatVal(val)}
                      </text>
                    )}
                    {/* X-axis Office Label */}
                    <text
                      x={x + barWidth / 2}
                      y={padding.top + chartAreaHeight + 16}
                      textAnchor="end"
                      transform={`rotate(-40, ${x + barWidth / 2}, ${padding.top + chartAreaHeight + 16})`}
                      fill="#64748b"
                      fontSize="9"
                      fontWeight="500"
                    >
                      {d.shortName}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* 2. GROUPED BAR */}
          {customization.chartType === 'grouped-bar' && (
            <g>
              {filteredData.map((d, index) => {
                const barCount = filteredData.length;
                const slotWidth = chartAreaWidth / barCount;
                const barWidth = Math.max(6, Math.min(15, slotWidth * 0.38));
                
                const val1 = (d[customization.primaryMetric] as number) || 0;
                // Secondary metric: e.g. NFRI or FFP
                const val2 = customization.primaryMetric === 'ffpTotalCost' ? d.nonFoodReliefCost :
                             customization.primaryMetric === 'standbyFunds' ? d.totalSSF * 0.1 :
                             d.ffpTotalCost;

                const bar1Height = Math.max(2, (val1 / yDomainMax) * chartAreaHeight);
                const bar2Height = Math.max(2, (val2 / yDomainMax) * chartAreaHeight);

                const x1 = padding.left + index * slotWidth + (slotWidth - barWidth * 2 - 2) / 2;
                const x2 = x1 + barWidth + 2;

                const y1 = padding.top + chartAreaHeight - bar1Height;
                const y2 = padding.top + chartAreaHeight - bar2Height;

                return (
                  <g
                    key={d.id}
                    className="cursor-pointer"
                    onMouseEnter={() => {
                      setHovered({
                        office: d,
                        x: x1 + barWidth,
                        y: Math.min(y1, y2),
                        value: val1,
                        breakdown: [
                          { name: getMetricShortLabel(customization.primaryMetric), value: val1, color: primaryColor },
                          { name: 'Comparison Relief', value: val2, color: secondaryColor }
                        ]
                      });
                    }}
                  >
                    <rect x={x1} y={y1} width={barWidth} height={bar1Height} fill={primaryColor} rx="2" />
                    <rect x={x2} y={y2} width={barWidth} height={bar2Height} fill={secondaryColor} rx="2" />
                    
                    <text
                      x={x1 + barWidth}
                      y={padding.top + chartAreaHeight + 16}
                      textAnchor="end"
                      transform={`rotate(-40, ${x1 + barWidth}, ${padding.top + chartAreaHeight + 16})`}
                      fill="#64748b"
                      fontSize="9"
                      fontWeight="500"
                    >
                      {d.shortName}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* 3. STACKED BAR (Stockpile Composition) */}
          {customization.chartType === 'stacked-bar' && (
            <g>
              {filteredData.map((d, index) => {
                const barCount = filteredData.length;
                const slotWidth = chartAreaWidth / barCount;
                const barWidth = Math.max(12, Math.min(28, slotWidth * 0.65));
                const x = padding.left + index * slotWidth + (slotWidth - barWidth) / 2;

                const hFFP = (d.ffpTotalCost / yDomainMax) * chartAreaHeight;
                const hNFRI = (d.nonFoodReliefCost / yDomainMax) * chartAreaHeight;
                const hOtherFood = (d.otherFoodCost / yDomainMax) * chartAreaHeight;
                const hOtherNF = (d.otherNonFoodCost / yDomainMax) * chartAreaHeight;
                const hStandby = (d.standbyFunds / yDomainMax) * chartAreaHeight;

                let curY = padding.top + chartAreaHeight;
                const yFFP = (curY -= hFFP);
                const yNFRI = (curY -= hNFRI);
                const yOtherFood = (curY -= hOtherFood);
                const yOtherNF = (curY -= hOtherNF);
                const yStandby = (curY -= hStandby);

                return (
                  <g
                    key={d.id}
                    className="cursor-pointer"
                    onMouseEnter={() => {
                      setHovered({
                        office: d,
                        x: x + barWidth / 2,
                        y: curY,
                        value: d.totalSSF,
                        breakdown: [
                          { name: 'Family Food Packs', value: d.ffpTotalCost, color: primaryColor },
                          { name: 'NFRI Items', value: d.nonFoodReliefCost, color: secondaryColor },
                          { name: 'Other Food', value: d.otherFoodCost, color: tertiaryColor },
                          { name: 'Other Non-Food', value: d.otherNonFoodCost, color: quaternaryColor },
                          { name: 'Standby Funds', value: d.standbyFunds, color: '#3b82f6' }
                        ]
                      });
                    }}
                  >
                    {/* Bottom to top */}
                    <rect x={x} y={yFFP} width={barWidth} height={hFFP} fill={primaryColor} />
                    <rect x={x} y={yNFRI} width={barWidth} height={hNFRI} fill={secondaryColor} />
                    <rect x={x} y={yOtherFood} width={barWidth} height={hOtherFood} fill={tertiaryColor} />
                    <rect x={x} y={yOtherNF} width={barWidth} height={hOtherNF} fill={quaternaryColor} />
                    <rect x={x} y={yStandby} width={barWidth} height={hStandby} fill="#3b82f6" rx="2" />

                    <text
                      x={x + barWidth / 2}
                      y={padding.top + chartAreaHeight + 16}
                      textAnchor="end"
                      transform={`rotate(-40, ${x + barWidth / 2}, ${padding.top + chartAreaHeight + 16})`}
                      fill="#64748b"
                      fontSize="9"
                      fontWeight="500"
                    >
                      {d.shortName}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* 4. HORIZONTAL BAR */}
          {customization.chartType === 'horizontal-bar' && (
            <g>
              {filteredData.slice(0, 15).map((d, index) => {
                const count = Math.min(15, filteredData.length);
                const slotHeight = chartAreaHeight / count;
                const barHeight = Math.max(8, slotHeight * 0.65);
                const val = (d[customization.primaryMetric] as number) || 0;
                const barWidth = Math.max(4, (val / yDomainMax) * chartAreaWidth);
                const y = padding.top + index * slotHeight + (slotHeight - barHeight) / 2;
                const x = padding.left + 50;

                return (
                  <g
                    key={d.id}
                    className="cursor-pointer"
                    onMouseEnter={() => {
                      setHovered({
                        office: d,
                        x: x + barWidth,
                        y: y + barHeight / 2,
                        value: val
                      });
                    }}
                  >
                    <text
                      x={x - 8}
                      y={y + barHeight / 2 + 3}
                      textAnchor="end"
                      fill="#475569"
                      fontSize="9.5"
                      fontWeight="500"
                    >
                      {d.shortName}
                    </text>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      fill={primaryColor}
                      rx="3"
                      className="hover:opacity-85"
                    />
                    <text
                      x={x + barWidth + 6}
                      y={y + barHeight / 2 + 3}
                      fill="#64748b"
                      fontSize="9"
                      fontWeight="600"
                    >
                      {formatVal(val)}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* 5. LINE / AREA TREND */}
          {customization.chartType === 'line-trend' && (
            <g>
              {(() => {
                const points = filteredData.map((d, index) => {
                  const slotWidth = chartAreaWidth / (filteredData.length - 1 || 1);
                  const val = (d[customization.primaryMetric] as number) || 0;
                  const x = padding.left + index * slotWidth;
                  const y = padding.top + chartAreaHeight - (val / yDomainMax) * chartAreaHeight;
                  return { x, y, office: d, val };
                });

                const linePath = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
                const areaPath = `${linePath} L ${points[points.length - 1]?.x} ${padding.top + chartAreaHeight} L ${points[0]?.x} ${padding.top + chartAreaHeight} Z`;

                return (
                  <>
                    <path d={areaPath} fill="url(#area-gradient)" />
                    <path d={linePath} fill="none" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" />
                    {points.map((p, i) => (
                      <g
                        key={i}
                        className="cursor-pointer"
                        onMouseEnter={() => {
                          setHovered({
                            office: p.office,
                            x: p.x,
                            y: p.y,
                            value: p.val
                          });
                        }}
                      >
                        <circle cx={p.x} cy={p.y} r="4.5" fill="#fff" stroke={primaryColor} strokeWidth="2.5" />
                        <text
                          x={p.x}
                          y={padding.top + chartAreaHeight + 16}
                          textAnchor="end"
                          transform={`rotate(-40, ${p.x}, ${padding.top + chartAreaHeight + 16})`}
                          fill="#64748b"
                          fontSize="9"
                        >
                          {p.office.shortName}
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}
            </g>
          )}

          {/* 6. DONUT / PIE */}
          {customization.chartType === 'donut' && (
            <g transform={`translate(${svgWidth / 2}, ${svgHeight / 2})`}>
              {(() => {
                const totalVal = filteredData.reduce((acc, d) => acc + ((d[customization.primaryMetric] as number) || 0), 0) || 1;
                const outerRadius = Math.min(chartAreaWidth, chartAreaHeight) / 2.3;
                const innerRadius = outerRadius * 0.58;
                let currentAngle = -Math.PI / 2;

                const topSlices = filteredData.slice(0, 8);
                const otherVal = filteredData.slice(8).reduce((acc, d) => acc + ((d[customization.primaryMetric] as number) || 0), 0);

                const slices = [
                  ...topSlices.map((d, i) => ({
                    office: d,
                    name: d.shortName,
                    val: (d[customization.primaryMetric] as number) || 0,
                    color: themeColors[i % themeColors.length]
                  })),
                  ...(otherVal > 0 ? [{
                    office: filteredData[0],
                    name: 'All Other Offices',
                    val: otherVal,
                    color: '#94a3b8'
                  }] : [])
                ];

                return (
                  <>
                    {slices.map((slice, i) => {
                      const sliceAngle = (slice.val / totalVal) * Math.PI * 2;
                      const startAngle = currentAngle;
                      const endAngle = currentAngle + sliceAngle;
                      currentAngle = endAngle;

                      const x1 = Math.cos(startAngle) * outerRadius;
                      const y1 = Math.sin(startAngle) * outerRadius;
                      const x2 = Math.cos(endAngle) * outerRadius;
                      const y2 = Math.sin(endAngle) * outerRadius;

                      const ix1 = Math.cos(endAngle) * innerRadius;
                      const iy1 = Math.sin(endAngle) * innerRadius;
                      const ix2 = Math.cos(startAngle) * innerRadius;
                      const iy2 = Math.sin(startAngle) * innerRadius;

                      const largeArc = sliceAngle > Math.PI ? 1 : 0;
                      const pathData = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2} Z`;

                      const midAngle = startAngle + sliceAngle / 2;
                      const tooltipX = svgWidth / 2 + Math.cos(midAngle) * (outerRadius + 10);
                      const tooltipY = svgHeight / 2 + Math.sin(midAngle) * (outerRadius + 10);

                      return (
                        <path
                          key={i}
                          d={pathData}
                          fill={slice.color}
                          stroke="#ffffff"
                          strokeWidth="2"
                          className="cursor-pointer hover:opacity-85 transition-opacity"
                          onMouseEnter={() => {
                            setHovered({
                              office: slice.office,
                              x: tooltipX,
                              y: tooltipY,
                              value: slice.val,
                              label: `${slice.name}: ${((slice.val / totalVal) * 100).toFixed(1)}%`
                            });
                          }}
                        />
                      );
                    })}

                    {/* Donut Center Label */}
                    <text textAnchor="middle" y="-6" fill="#64748b" fontSize="11" fontWeight="500">
                      National Total
                    </text>
                    <text textAnchor="middle" y="16" fill="#0f172a" fontSize="14" fontWeight="800">
                      {formatVal(totalVal)}
                    </text>
                  </>
                );
              })()}
            </g>
          )}

          {/* 7. RADAR / READINESS SPIDER */}
          {customization.chartType === 'radar' && (
            <g transform={`translate(${svgWidth / 2}, ${svgHeight / 2})`}>
              {(() => {
                const axes = [
                  { label: 'Standby Buffer', key: 'standbyFunds', max: 50000000 },
                  { label: 'FFP Volumes', key: 'ffpQuantity', max: 900000 },
                  { label: 'NFRI Stockpile', key: 'nonFoodReliefCost', max: 160000000 },
                  { label: 'Food Commodities', key: 'otherFoodCost', max: 60000000 },
                  { label: 'Cost Efficiency', key: 'averageCostFFP', max: 850 },
                  { label: 'Combined SSF', key: 'totalSSF', max: 700000000 }
                ];
                const radius = Math.min(chartAreaWidth, chartAreaHeight) / 2.3;
                const angleStep = (Math.PI * 2) / axes.length;

                // Levels
                const levels = [0.25, 0.5, 0.75, 1];

                return (
                  <>
                    {levels.map((lvl, lIdx) => {
                      const pts = axes.map((_, i) => {
                        const a = i * angleStep - Math.PI / 2;
                        return `${Math.cos(a) * radius * lvl},${Math.sin(a) * radius * lvl}`;
                      }).join(' ');
                      return (
                        <polygon
                          key={lIdx}
                          points={pts}
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="1"
                          strokeDasharray={lvl === 1 ? 'none' : '3 3'}
                        />
                      );
                    })}

                    {axes.map((ax, i) => {
                      const a = i * angleStep - Math.PI / 2;
                      const x = Math.cos(a) * radius;
                      const y = Math.sin(a) * radius;
                      const labelX = Math.cos(a) * (radius + 20);
                      const labelY = Math.sin(a) * (radius + 15);
                      return (
                        <g key={i}>
                          <line x1="0" y1="0" x2={x} y2={y} stroke="#cbd5e1" strokeWidth="1" />
                          <text
                            x={labelX}
                            y={labelY}
                            textAnchor="middle"
                            fill="#475569"
                            fontSize="9"
                            fontWeight="600"
                          >
                            {ax.label}
                          </text>
                        </g>
                      );
                    })}

                    {/* Regional Cluster Polygons */}
                    {['Luzon', 'Visayas', 'Mindanao'].map((zone, zIdx) => {
                      const zoneData = data.filter(d => d.zone === zone);
                      const color = themeColors[zIdx];

                      const points = axes.map((ax, i) => {
                        const a = i * angleStep - Math.PI / 2;
                        const avgVal = zoneData.reduce((acc, d) => acc + ((d[ax.key as keyof OfficeSSFData] as number) || 0), 0) / (zoneData.length || 1);
                        const ratio = Math.min(1, avgVal / ax.max);
                        return {
                          x: Math.cos(a) * radius * ratio,
                          y: Math.sin(a) * radius * ratio
                        };
                      });

                      const ptsString = points.map(p => `${p.x},${p.y}`).join(' ');

                      return (
                        <g key={zone}>
                          <polygon
                            points={ptsString}
                            fill={color}
                            fillOpacity="0.25"
                            stroke={color}
                            strokeWidth="2"
                          />
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </g>
          )}

          {/* 8. SCATTER: COST PER PACK vs QUANTITY */}
          {customization.chartType === 'scatter-cost-qty' && (
            <g>
              {(() => {
                const maxQty = Math.max(...filteredData.map(d => d.ffpQuantity), 100000);
                const minCost = 500;
                const maxCost = 850;

                return (
                  <>
                    {/* Scatter points */}
                    {filteredData.map(d => {
                      const costNorm = Math.min(1, Math.max(0, (d.averageCostFFP - minCost) / (maxCost - minCost)));
                      const qtyNorm = Math.min(1, d.ffpQuantity / maxQty);

                      const x = padding.left + costNorm * chartAreaWidth;
                      const y = padding.top + chartAreaHeight - qtyNorm * chartAreaHeight;

                      const isOutlier = d.averageCostFFP > 750;
                      const bubbleColor = isOutlier ? '#dc2626' : d.isHub ? '#0284c7' : primaryColor;
                      const bubbleRadius = d.isHub ? 8 : 5.5;

                      return (
                        <g
                          key={d.id}
                          className="cursor-pointer"
                          onMouseEnter={() => {
                            setHovered({
                              office: d,
                              x,
                              y,
                              value: d.averageCostFFP,
                              label: `${d.shortName} · ₱${d.averageCostFFP.toFixed(2)}/pack (${formatNumber(d.ffpQuantity)} packs)`
                            });
                          }}
                        >
                          <circle
                            cx={x}
                            cy={y}
                            r={bubbleRadius}
                            fill={bubbleColor}
                            fillOpacity="0.8"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                            className="hover:scale-125 transition-transform"
                          />
                          <text
                            x={x + 7}
                            y={y + 3}
                            fill="#64748b"
                            fontSize="8"
                            fontWeight="500"
                          >
                            {d.shortName}
                          </text>
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </g>
          )}
        </svg>

        {/* Floating Tooltip */}
        {hovered && (
          <div
            className="absolute z-30 pointer-events-none bg-slate-900 text-white rounded-lg p-3 text-xs shadow-xl border border-slate-700 min-w-[200px]"
            style={{
              left: `${Math.min(svgWidth - 210, Math.max(20, hovered.x - 20))}px`,
              top: `${Math.max(10, hovered.y - 100)}px`
            }}
          >
            <div className="font-bold text-slate-100 flex items-center justify-between border-b border-slate-700/80 pb-1.5 mb-1.5">
              <span>{hovered.office.office}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 font-mono">
                {hovered.office.zone}
              </span>
            </div>

            {hovered.label ? (
              <div className="text-slate-200 font-medium">{hovered.label}</div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-slate-300 mb-1">
                  <span>{getMetricShortLabel(customization.primaryMetric)}:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {formatVal(hovered.value)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>FFP Stockpile:</span>
                  <span className="font-mono">{formatNumber(hovered.office.ffpQuantity)} packs</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Avg Cost/Pack:</span>
                  <span className="font-mono">₱{hovered.office.averageCostFFP.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Breakdown bars if stacked or grouped */}
            {hovered.breakdown && (
              <div className="mt-2 pt-2 border-t border-slate-700/60 space-y-1">
                {hovered.breakdown.map((b, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }} />
                      <span>{b.name}</span>
                    </span>
                    <span className="font-mono text-slate-200">{formatPHP(b.value, true)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
