import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Premium Design Constants
const PRIMARY_COLOR = '#4ec5c1';
const GRID_COLOR = '#f1f5f9';
const TEXT_COLOR = '#94a3b8';

/**
 * STRIPED PATTERN COMPONENT
 * Adds that premium hatched look from your reference photos
 */
const ChartPatterns = () => (
    <svg style={{ height: 0, width: 0, position: 'absolute' }}>
        <defs>
            <pattern id="hatched" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="4" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            </pattern>
        </defs>
    </svg>
);

/**
 * REVENUE ANALYTICS BAR CHART
 * Matches the rounded, hatched, high-end look from your screenshot
 */
export const BarChart = ({ data, height = 280, color = PRIMARY_COLOR }) => {
    const [hoveredBar, setHoveredBar] = useState(null);
    if (!data || data.length === 0) return null;

    const values = data.map(d => Number(d.value || d.count || 0));
    const maxValue = Math.max(...values, 10);

    const viewWidth = 100;
    const viewHeight = 60;
    const padding = { top: 12, right: 8, bottom: 12, left: 8 };
    const chartWidth = viewWidth - padding.left - padding.right;
    const chartHeight = viewHeight - padding.top - padding.bottom;

    const barWidth = (chartWidth / data.length) * 0.55;
    const barGap = (chartWidth / data.length) * 0.45;

    // Grid lines logic
    const gridSteps = [0, 0.25, 0.5, 0.75, 1];

    return (
        <div className="relative w-full" style={{ height: `${height}px` }}>
            <ChartPatterns />

            {/* Legend for Tooltip (Matches screenshot exactly) */}
            <AnimatePresence>
                {hoveredBar && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute z-50 pointer-events-none"
                        style={{
                            left: `${(hoveredBar.x / viewWidth) * 100}%`,
                            top: `${(hoveredBar.y / viewHeight) * 100}%`,
                            transform: 'translate(-50%, -100%) translateY(-15px)'
                        }}
                    >
                        <div className="bg-[#FF5C35] text-white px-3 py-1.5 rounded-lg shadow-lg text-[11px] font-bold relative">
                            {hoveredBar.isCurrency ? '₹' : ''}{hoveredBar.value.toLocaleString()}
                            {/* Triangle Tip */}
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#FF5C35] rotate-45" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <svg viewBox={`0 0 ${viewWidth} ${viewHeight}`} className="w-full h-full overflow-visible">
                {/* Horizontal Dashed Grid Lines */}
                {gridSteps.map((step, i) => (
                    <g key={i}>
                        <line
                            x1={padding.left}
                            y1={padding.top + (chartHeight * step)}
                            x2={viewWidth - padding.right}
                            y2={padding.top + (chartHeight * step)}
                            stroke={GRID_COLOR}
                            strokeWidth="0.2"
                            strokeDasharray="1,1"
                        />
                        <text
                            x={padding.left - 2}
                            y={padding.top + (chartHeight * step) + 1}
                            textAnchor="end"
                            className="fill-slate-300 text-[3px] font-medium"
                        >
                            {Math.round(maxValue * (1 - step) / 1000)}k
                        </text>
                    </g>
                ))}

                {data.map((d, i) => {
                    const val = Number(d.value || d.count || 0);
                    const bHeight = (val / maxValue) * chartHeight;
                    const x = padding.left + (i * (barWidth + barGap)) + barGap / 2;
                    const y = padding.top + chartHeight - bHeight;

                    return (
                        <g key={i}
                            className="cursor-pointer group"
                            onMouseEnter={() => setHoveredBar({ ...d, x: x + barWidth / 2, y, value: val, isCurrency: !!d.value })}
                            onMouseLeave={() => setHoveredBar(null)}
                        >
                            {/* Base Bar */}
                            <motion.rect
                                initial={{ height: 0, y: padding.top + chartHeight }}
                                animate={{ height: bHeight, y }}
                                transition={{ type: "spring", damping: 15, stiffness: 100, delay: i * 0.05 }}
                                x={x}
                                width={barWidth}
                                rx={barWidth / 2} // Perfectly rounded as per screenshot
                                fill={color}
                                className="transition-all duration-300 group-hover:brightness-110"
                            />

                            {/* Mask with Stripes Layer */}
                            <motion.rect
                                initial={{ height: 0, y: padding.top + chartHeight }}
                                animate={{ height: bHeight, y }}
                                x={x}
                                width={barWidth}
                                rx={barWidth / 2}
                                fill="url(#hatched)"
                                className="pointer-events-none"
                            />

                            {/* Active Point (Circle at the top) */}
                            {hoveredBar?.name === d.name && (
                                <motion.circle
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    cx={x + barWidth / 2}
                                    cy={y + 1}
                                    r="1.2"
                                    fill="white"
                                    stroke={color}
                                    strokeWidth="0.5"
                                />
                            )}

                            {/* Label */}
                            <text
                                x={x + barWidth / 2}
                                y={viewHeight - 2}
                                textAnchor="middle"
                                className="fill-slate-400 font-bold"
                                style={{ fontSize: '3.5px' }}
                            >
                                {d.label || d.name}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

/**
 * ORDER STATUS DONUT CHART
 * Matches the clean, thin, striped logic from your second photo
 */
export const DonutChart = ({ data, size = 200 }) => {
    const [hoveredIdx, setHoveredIdx] = useState(null);
    if (!data || data.length === 0) return null;

    const total = data.reduce((sum, d) => sum + Number(d.count || d.value || 0), 0);
    const radius = 35;
    const strokeWidth = 14;
    const center = 50;

    let cumulativePercent = 0;

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <ChartPatterns />
            <div className="relative" style={{ width: size, height: size }}>
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 overflow-visible">
                    {/* Background Track */}
                    <circle cx={center} cy={center} r={radius} fill="none" stroke="#f8fafc" strokeWidth={strokeWidth} />

                    {data.map((d, i) => {
                        const count = Number(d.count || d.value || 0);
                        const percent = count / total;
                        const circumference = 2 * Math.PI * radius;

                        // Calculate offset based on cumulative percentage
                        const strokeDashoffset = -cumulativePercent * circumference;
                        const dasharray = `${percent * circumference} ${circumference}`;
                        cumulativePercent += percent;

                        return (
                            <g key={i}>
                                <motion.circle
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        strokeWidth: hoveredIdx === i ? strokeWidth + 2 : strokeWidth
                                    }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    cx={center}
                                    cy={center}
                                    r={radius}
                                    fill="none"
                                    stroke={d.color}
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={dasharray}
                                    strokeDashoffset={strokeDashoffset}
                                    className="cursor-pointer transition-all duration-300"
                                    onMouseEnter={() => setHoveredIdx(i)}
                                    onMouseLeave={() => setHoveredIdx(null)}
                                />
                                {/* Redundant Pattern Layer */}
                                <motion.circle
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    cx={center} cy={center} r={radius} fill="none"
                                    stroke="url(#hatched)"
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={dasharray}
                                    strokeDashoffset={strokeDashoffset}
                                    className="pointer-events-none"
                                />
                            </g>
                        );
                    })}
                </svg>

                {/* Center Stats */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-slate-800 leading-none">{total}</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1">Orders</span>
                </div>
            </div>

            {/* Premium Legend with Counts (from your photo) */}
            {/* Premium Legend with Counts (Synchronized with chart colors) */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 mt-8 px-4 w-full">
                {data.map((d, i) => (
                    <div key={i} className={`flex items-center gap-3 transition-all duration-200 ${hoveredIdx !== null && hoveredIdx !== i ? 'opacity-40 scale-95' : 'opacity-100 scale-100'}`}>
                        <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: d.color }} />
                        <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-slate-700 capitalize leading-none">{d.name}</span>
                            <span className="text-[10px] font-medium text-slate-400 mt-1">{d.count || d.value} Orders</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/**
 * REVENUE OVERVIEW LINE CHART
 * Styled to match the Bar Chart's clean, modern feel
 */
export const LineChart = ({ data, height = 280, color = PRIMARY_COLOR }) => {
    const [hoveredPoint, setHoveredPoint] = useState(null);
    if (!data || data.length === 0) return null;

    const values = data.map(d => Number(d.value || 0));
    const maxValue = Math.max(...values, 100);
    const minValue = 0;
    const range = maxValue - minValue || 1;

    const viewWidth = 100;
    const viewHeight = 60;
    const padding = { top: 12, right: 10, bottom: 12, left: 10 };
    const chartWidth = viewWidth - padding.left - padding.right;
    const chartHeight = viewHeight - padding.top - padding.bottom;

    const points = data.map((d, i) => ({
        x: padding.left + (i / (data.length - 1)) * chartWidth,
        y: padding.top + chartHeight - ((Number(d.value)) / range) * chartHeight,
        ...d
    }));

    const linePath = points.map((p, i) => i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`).join(' ');

    return (
        <div className="relative w-full" style={{ height: `${height}px` }}>
            <AnimatePresence>
                {hoveredPoint && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute z-50 pointer-events-none"
                        style={{
                            left: `${(hoveredPoint.x / viewWidth) * 100}%`,
                            top: `${(hoveredPoint.y / viewHeight) * 100}%`,
                            transform: 'translate(-50%, -100%) translateY(-15px)'
                        }}
                    >
                        <div className="bg-slate-800 text-white px-3 py-1.5 rounded-lg shadow-xl text-[11px] font-bold">
                            ₹{Number(hoveredPoint.value).toLocaleString()}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <svg viewBox={`0 0 ${viewWidth} ${viewHeight}`} className="w-full h-full overflow-visible">
                {/* Dashed Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((step, i) => (
                    <line key={i} x1={padding.left} y1={padding.top + (chartHeight * step)} x2={viewWidth - padding.right} y2={padding.top + (chartHeight * step)} stroke={GRID_COLOR} strokeWidth="0.2" strokeDasharray="1,1" />
                ))}

                <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    d={linePath}
                    fill="none"
                    stroke={color}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                />

                {points.map((p, i) => (
                    <g key={i}>
                        <circle cx={p.x} cy={p.y} r="5" fill="transparent" className="cursor-pointer"
                            onMouseEnter={() => setHoveredPoint(p)}
                            onMouseLeave={() => setHoveredPoint(null)} />
                        <motion.circle cx={p.x} cy={p.y} r={hoveredPoint?.label === p.label ? "1.8" : "1"} fill="white" stroke={color} strokeWidth="0.8" />
                    </g>
                ))}

                {points.map((p, i) => (
                    <text key={i} x={p.x} y={viewHeight - 2} textAnchor="middle" className="fill-slate-400 font-bold" style={{ fontSize: '3.5px' }}>{p.label}</text>
                ))}
            </svg>
        </div>
    );
};

export default { BarChart, DonutChart, LineChart };
