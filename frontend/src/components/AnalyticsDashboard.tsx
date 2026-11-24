/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TopicVolume, KeywordHit } from '../types';

interface AnalyticsDashboardProps {
  documentsCount: number;
}

const TOPICS_DATA: TopicVolume[] = [
  { label: 'Equipment Manuals', volume: 4200 },
  { label: 'Evacuation Routes', volume: 3100 },
  { label: 'Hazard Reports', volume: 2800 },
  { label: 'First Aid', volume: 1900 },
  { label: 'Training Logs', volume: 1500 },
  { label: 'Shift Schedules', volume: 900 },
];

const KEYWORDS_DATA: KeywordHit[] = [
  { word: 'Ventilation Protocol', hits: '1.2k hits' },
  { word: 'PPE Compliance', hits: '854 hits' },
  { word: 'Gas Leak Procedure', hits: 'Rapid Spk', critical: true },
  { word: 'Shift Handover Log', hits: '432 hits' },
];

// Activity data for different timelines
const TIMELINE_DATA = {
  '7D': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    queries: [310, 420, 390, 580, 510, 680, 710],
    indexed: [120, 120, 180, 180, 200, 310, 310],
  },
  '30D': {
    labels: ['Day 1', 'Day 5', 'Day 10', 'Day 15', 'Day 20', 'Day 25', 'Day 30'],
    queries: [1200, 1350, 1250, 1800, 1600, 2100, 2300],
    indexed: [500, 500, 800, 800, 850, 1200, 1250],
  },
  '90D': {
    labels: ['Month 1', 'Month 2', 'Month 3'],
    queries: [3900, 5100, 7200],
    indexed: [1400, 2800, 4100],
  },
};

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  documentsCount,
}) => {
  const [timeline, setTimeline] = useState<'7D' | '30D' | '90D'>('30D');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [hoveredLineIndex, setHoveredLineIndex] = useState<number | null>(null);

  const activeActivity = TIMELINE_DATA[timeline];

  // Dynamically calculate documents index
  const displayDocsCount = documentsCount === 5 ? 12483 : 12478 + (documentsCount - 5);

  // SVG Helper measurements for the Bar Chart
  const barChartWidth = 600;
  const barChartHeight = 220;
  const maxVolume = 4500;
  const paddingX = 40;
  const paddingY = 20;

  // SVG Helper measurements for the Line Chart
  const lineChartWidth = 800;
  const lineChartHeight = 240;
  const maxActivityVal = timeline === '90D' ? 8000 : timeline === '7D' ? 800 : 2500;

  return (
    <main className="flex-1 p-6 md:p-8 max-w-[1440px] mx-auto w-full animate-fade-in text-slate-105">
      
      {/* Page Header */}
      <div className="mb-8 font-sans">
        <h2 className="text-2xl md:text-3.5xl font-black text-slate-100 tracking-tight leading-none">
          System Analytics
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Real-time overview of document usage and user engagement across active sites.
        </p>
      </div>

      {/* Metrics Cards (Bento Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 font-sans">
        
        {/* Card 1 */}
        <div id="stat-docs" className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-705 hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              Total Documents Indexed
            </span>
            <span className="material-symbols-outlined text-blue-500">folder_data</span>
          </div>
          <div className="text-3xl md:text-4xl font-extrabold text-slate-100 leading-none font-mono">
            {displayDocsCount.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 mt-3 text-xs">
            <span className="material-symbols-outlined text-[15px] text-emerald-500 font-bold">
              arrow_upward
            </span>
            <span className="text-emerald-400 font-black">+2.4%</span>{' '}
            <span className="text-slate-500">from last month</span>
          </div>
        </div>

        {/* Card 2 */}
        <div id="stat-queries" className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-705 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/5 rounded-bl-full pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              Total Questions Asked
            </span>
            <span className="material-symbols-outlined text-blue-500">forum</span>
          </div>
          <div className="text-3xl md:text-4xl font-extrabold text-slate-100 leading-none relative z-10 font-mono">
            84,201
          </div>
          <div className="flex items-center gap-1 mt-3 text-xs relative z-10">
            <span className="material-symbols-outlined text-[15px] text-emerald-500 font-bold">
              arrow_upward
            </span>
            <span className="text-emerald-400 font-black">+15%</span>{' '}
            <span className="text-slate-500">vs 30 days ago</span>
          </div>
        </div>

        {/* Card 3 */}
        <div id="stat-users" className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-750 hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              Active Field Users
            </span>
            <span className="material-symbols-outlined text-blue-500">group</span>
          </div>
          <div className="text-3xl md:text-4xl font-extrabold text-slate-100 leading-none font-mono">
            1,842
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-350">Currently online across 4 active sites</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Bar Chart Container */}
        <div className="col-span-1 lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col shadow-md">
          <div className="border-b border-slate-800 pb-4 mb-4">
            <h3 className="text-base md:text-lg text-slate-100 font-bold tracking-tight">
              Most Common Topics Queried
            </h3>
            <p className="text-xs text-slate-450 mt-1">
              Based on NLP categorization of field user inquiries (Last 30 Days)
            </p>
          </div>

          {/* SVG Bar Chart */}
          <div className="flex-1 relative min-h-[300px] w-full flex items-center justify-center font-sans">
            <svg
              viewBox={`0 0 ${barChartWidth} ${barChartHeight}`}
              className="w-full h-full"
              style={{ maxHeight: '280px' }}
            >
              {/* Y Grid lines */}
              {[0, 1500, 3000, 4500].map((tick) => {
                const yPos =
                  barChartHeight -
                  paddingY -
                  ((barChartHeight - 2 * paddingY) * tick) / maxVolume;
                return (
                  <g key={tick} className="opacity-60">
                    <line
                      x1={paddingX}
                      y1={yPos}
                      x2={barChartWidth - paddingX}
                      y2={yPos}
                      stroke="#1e293b"
                      strokeWidth={1}
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingX - 8}
                      y={yPos + 4.5}
                      textAnchor="end"
                      fontSize="9"
                      fontWeight="bold"
                      fill="#64748b"
                    >
                      {tick}
                    </text>
                  </g>
                );
              })}

              {/* Rendering Interactive Bars */}
              {TOPICS_DATA.map((item, index) => {
                const barSpacing = (barChartWidth - 2 * paddingX) / TOPICS_DATA.length;
                const barWidth = barSpacing * 0.55;
                const barHeight = ((barChartHeight - 2 * paddingY) * item.volume) / maxVolume;
                const xPos = paddingX + index * barSpacing + barSpacing * 0.15;
                const yPos = barChartHeight - paddingY - barHeight;

                return (
                  <g
                    key={index}
                    onMouseEnter={() => setHoveredBarIndex(index)}
                    onMouseLeave={() => setHoveredBarIndex(null)}
                    className="cursor-pointer group"
                  >
                    {/* SVG Rect bar */}
                    <rect
                      x={xPos}
                      y={yPos}
                      width={barWidth}
                      height={barHeight}
                      rx={4}
                      fill={hoveredBarIndex === index ? '#2563eb' : '#1e293b'}
                      className="transition-all duration-200"
                    />

                    {/* Labels under the bars */}
                    <text
                      x={xPos + barWidth / 2}
                      y={barChartHeight - paddingY + 14}
                      textAnchor="middle"
                      fontSize="8"
                      fontWeight="700"
                      fill="#91a3b8"
                      transform={`rotate(-12 ${xPos + barWidth / 2} ${barChartHeight - paddingY + 14})`}
                    >
                      {item.label}
                    </text>

                    {/* Floating Hover stats tooltip */}
                    {hoveredBarIndex === index && (
                      <g className="animate-fade-in">
                        <rect
                          x={xPos - 15}
                          y={yPos - 25}
                          width={barWidth + 30}
                          height={20}
                          rx={3}
                          fill="#020617"
                          stroke="#1e293b"
                          strokeWidth={1}
                        />
                        <text
                          x={xPos + barWidth / 2}
                          y={yPos - 12}
                          textAnchor="middle"
                          fontSize="9"
                          fontWeight="bold"
                          fill="#ffffff"
                        >
                          {item.volume.toLocaleString()} Qs
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Trending Keywords lists */}
        <div className="col-span-1 lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col shadow-md">
          <div className="border-b border-slate-800 pb-4 mb-4">
            <h3 className="text-base md:text-lg text-slate-100 font-bold tracking-tight">
              Trending Keywords
            </h3>
            <p className="text-xs text-slate-455 mt-1">
              High-frequency terms in safety chats
            </p>
          </div>

          <div className="flex-1 flex flex-col gap-3 font-sans">
            {KEYWORDS_DATA.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  item.critical
                    ? 'bg-red-500/10 border-red-550 text-red-400'
                    : 'bg-slate-950/65 border-slate-850 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.critical && (
                    <span className="material-symbols-outlined text-red-400 text-[18px]">warning</span>
                  )}
                  <span
                    className={`text-xs font-bold ${
                      item.critical ? 'text-red-400 font-extrabold' : 'text-slate-200'
                    }`}
                  >
                    {item.word}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm ${
                    item.critical ? 'bg-red-500/20 text-red-300' : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {item.hits}
                </span>
              </div>
            ))}

            <div className="mt-auto pt-4 text-center">
              <button className="text-xs font-bold text-blue-400 hover:text-blue-300 cursor-pointer transition-colors">
                View Full Semantic Report
              </button>
            </div>
          </div>
        </div>

        {/* Line Graph: User Activity Over Time */}
        <div className="col-span-1 lg:col-span-12 bg-slate-900 border border-slate-804 rounded-xl p-6 flex flex-col mt-2 shadow-md">
          <div className="border-b border-slate-800 pb-4 mb-4 flex flex-col gap-3 md:flex-row justify-between md:items-center">
            <div className="font-sans">
              <h3 className="text-base md:text-lg text-slate-100 font-bold tracking-tight">
                System Activity Over Time
              </h3>
              <p className="text-xs text-slate-450 mt-1">
                Daily interaction volume vs Document updates
              </p>
            </div>

            {/* Timeline selector */}
            <div className="flex gap-1.5 self-start md:self-auto bg-slate-950 p-1 rounded-lg border border-slate-800">
              {(['7D', '30D', '90D'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTimeline(t);
                    setHoveredLineIndex(null);
                  }}
                  className={`px-3 py-1 font-bold text-[10px] uppercase rounded-md transition-all cursor-pointer ${
                    timeline === t
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="flex-1 relative min-h-[350px] w-full flex items-center justify-center font-sans">
            <svg
              viewBox={`0 0 ${lineChartWidth} ${lineChartHeight}`}
              className="w-full h-full"
              style={{ maxHeight: '310px' }}
            >
              <defs>
                <linearGradient id="areaGradientLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Y Axis line grids */}
              {[0, 0.5, 1].map((ratio) => {
                const val = Math.round(maxActivityVal * ratio);
                const yPos = lineChartHeight - paddingY - (lineChartHeight - 2 * paddingY) * ratio;
                return (
                  <g key={ratio} className="opacity-50">
                    <line
                      x1={paddingX}
                      y1={yPos}
                      x2={lineChartWidth - paddingX}
                      y2={yPos}
                      stroke="#1e293b"
                      strokeWidth={1}
                    />
                    <text
                      x={paddingX - 8}
                      y={yPos + 4.5}
                      textAnchor="end"
                      fontSize="9"
                      fontWeight="bold"
                      fill="#64748b"
                    >
                      {val.toLocaleString()}
                    </text>
                  </g>
                );
              })}

              {/* Draw comparative static/dashed Line (Documents Indexed) */}
              {(() => {
                const points = activeActivity.indexed.map((val, idx) => {
                  const xSpacing = (lineChartWidth - 2 * paddingX) / (activeActivity.indexed.length - 1);
                  const x = paddingX + idx * xSpacing;
                  const y =
                    lineChartHeight -
                    paddingY -
                    ((lineChartHeight - 2 * paddingY) * val) / maxActivityVal;
                  return `${x},${y}`;
                });

                return (
                  <polyline
                    fill="none"
                    stroke="#475569"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    points={points.join(' ')}
                  />
                );
              })()}

              {/* Draw smooth Cubic Bezier Line & area fill for User Queries */}
              {(() => {
                const pointsCount = activeActivity.queries.length;
                const xSpacing = (lineChartWidth - 2 * paddingX) / (pointsCount - 1);

                // Build path nodes
                const pathCoordinates = activeActivity.queries.map((val, idx) => {
                  const x = paddingX + idx * xSpacing;
                  const y =
                    lineChartHeight -
                    paddingY -
                    ((lineChartHeight - 2 * paddingY) * val) / maxActivityVal;
                  return { x, y };
                });

                // Cubic Bezier curve algorithm helper
                let pathD = `M ${pathCoordinates[0].x} ${pathCoordinates[0].y}`;
                for (let i = 0; i < pathCoordinates.length - 1; i++) {
                  const p0 = pathCoordinates[i];
                  const p1 = pathCoordinates[i + 1];
                  const cpX1 = p0.x + xSpacing / 3;
                  const cpY1 = p0.y;
                  const cpX2 = p1.x - xSpacing / 3;
                  const cpY2 = p1.y;
                  pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
                }

                const areaD = `${pathD} L ${pathCoordinates[pointsCount - 1].x} ${lineChartHeight - paddingY} L ${pathCoordinates[0].x} ${lineChartHeight - paddingY} Z`;

                return (
                  <>
                    {/* Shadow Area below curves */}
                    <path d={areaD} fill="url(#areaGradientLine)" />
                    {/* Primary Highlight Curve Line */}
                    <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth={3} />

                    {/* Plot interactive nodes */}
                    {pathCoordinates.map((pt, idx) => (
                      <g
                        key={idx}
                        onMouseEnter={() => setHoveredLineIndex(idx)}
                        onMouseLeave={() => setHoveredLineIndex(null)}
                        className="cursor-pointer"
                      >
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={hoveredLineIndex === idx ? 6.5 : 4}
                          fill="#090e1a"
                          stroke="#3b82f6"
                          strokeWidth={2.5}
                          className="transition-all duration-150"
                        />
                        
                        {/* Display corresponding tooltips on hover */}
                        {hoveredLineIndex === idx && (
                          <g className="animate-fade-in">
                            <rect
                              x={pt.x - 45}
                              y={pt.y - 35}
                              width={90}
                              height={22}
                              rx={4}
                              fill="#020617"
                              stroke="#1e293b"
                              strokeWidth={1}
                            />
                            <text
                              x={pt.x}
                              y={pt.y - 21}
                              textAnchor="middle"
                              fontSize="9.5"
                              fontWeight="bold"
                              fill="#ffffff"
                            >
                              {activeActivity.queries[idx].toLocaleString()} Queries
                            </text>
                          </g>
                        )}
                      </g>
                    ))}
                  </>
                );
              })()}

              {/* X Axis label tick marks */}
              {activeActivity.labels.map((lbl, idx) => {
                const pointsCount = activeActivity.labels.length;
                const xSpacing = (lineChartWidth - 2 * paddingX) / (pointsCount - 1);
                const x = paddingX + idx * xSpacing;
                return (
                  <text
                    key={idx}
                    x={x}
                    y={lineChartHeight - paddingY + 14}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="bold"
                    fill="#64748b"
                  >
                    {lbl}
                  </text>
                );
              })}

            </svg>
          </div>

          {/* Graph Legends indicator */}
          <div className="flex gap-6 mt-4 justify-end text-[10px] font-bold px-4">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-[#3b82f6]"></span>
              <span className="text-slate-400 uppercase tracking-widest">User Queries volume</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 border-t-2 border-dashed border-[#475569]"></span>
              <span className="text-slate-400 uppercase tracking-widest">Documents Indexed comparison</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};
