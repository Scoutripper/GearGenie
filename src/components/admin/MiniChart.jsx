import { motion } from 'framer-motion';

// Simple Line Chart using SVG
export const LineChart = ({ data, height = 200, color = '#4ec5c1', showLabels = true }) => {
    if (!data || data.length === 0) return null;

    const values = data.map(d => d.value);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue || 1;

    // Use fixed viewBox dimensions for consistent scaling
    const viewBoxWidth = 100;
    const viewBoxHeight = 60;
    const padding = { top: 8, right: 8, bottom: showLabels ? 16 : 8, left: 8 };
    const chartWidth = viewBoxWidth - padding.left - padding.right;
    const chartHeight = viewBoxHeight - padding.top - padding.bottom;

    const points = data.map((d, i) => {
        const x = padding.left + (i / (data.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - ((d.value - minValue) / range) * chartHeight;
        return { x, y, ...d };
    });

    const linePath = points.map((p, i) =>
        i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
    ).join(' ');

    const areaPath = `${linePath} L ${points[points.length - 1].x} ${viewBoxHeight - padding.bottom} L ${points[0].x} ${viewBoxHeight - padding.bottom} Z`;

    return (
        <div className="w-full overflow-hidden" style={{ height: `${height}px` }}>
            <svg
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Gradient for area fill */}
                <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Area Fill */}
                <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    d={areaPath}
                    fill="url(#areaGradient)"
                />

                {/* Line */}
                <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    d={linePath}
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Data Points */}
                {points.map((p, i) => (
                    <motion.circle
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.05 }}
                        cx={p.x}
                        cy={p.y}
                        r="2"
                        fill="white"
                        stroke={color}
                        strokeWidth="1.5"
                    />
                ))}

                {/* X-axis Labels */}
                {showLabels && points.map((p, i) => (
                    <text
                        key={i}
                        x={p.x}
                        y={viewBoxHeight - 4}
                        textAnchor="middle"
                        className="fill-slate-400"
                        style={{ fontSize: '4px' }}
                    >
                        {p.day || p.month || p.label}
                    </text>
                ))}
            </svg>
        </div>
    );
};

// Simple Bar Chart using SVG
export const BarChart = ({ data, height = 200, color = '#4ec5c1', showLabels = true }) => {
    if (!data || data.length === 0) return null;

    const values = data.map(d => d.value || d.revenue || d.count);
    const maxValue = Math.max(...values);

    // Use fixed viewBox dimensions for consistent scaling
    const viewBoxWidth = 100;
    const viewBoxHeight = 60;
    const padding = { top: 8, right: 4, bottom: showLabels ? 16 : 8, left: 4 };
    const chartWidth = viewBoxWidth - padding.left - padding.right;
    const chartHeight = viewBoxHeight - padding.top - padding.bottom;
    const barWidth = (chartWidth / data.length) * 0.6;
    const barGap = (chartWidth / data.length) * 0.4;

    return (
        <div className="w-full overflow-hidden" style={{ height: `${height}px` }}>
            <svg
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
            >
                {data.map((d, i) => {
                    const value = d.value || d.revenue || d.count;
                    const barHeight = (value / maxValue) * chartHeight;
                    const x = padding.left + (i * (barWidth + barGap)) + barGap / 2;
                    const y = padding.top + chartHeight - barHeight;

                    return (
                        <g key={i}>
                            <motion.rect
                                initial={{ height: 0, y: padding.top + chartHeight }}
                                animate={{ height: barHeight, y }}
                                transition={{ duration: 0.5, delay: i * 0.05 }}
                                x={x}
                                width={barWidth}
                                rx="1"
                                fill={d.color || color}
                                className="hover:opacity-80 transition-opacity cursor-pointer"
                            />
                            {showLabels && (
                                <text
                                    x={x + barWidth / 2}
                                    y={viewBoxHeight - 4}
                                    textAnchor="middle"
                                    className="fill-slate-400"
                                    style={{ fontSize: '3px' }}
                                >
                                    {(d.name || d.status || d.label || '').substring(0, 6)}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

// Donut Chart for status breakdown
export const DonutChart = ({ data, size = 120 }) => {
    if (!data || data.length === 0) return null;

    const total = data.reduce((sum, d) => sum + d.count, 0);
    const radius = 40;
    const strokeWidth = 12;
    const center = 50;

    let cumulativePercent = 0;

    return (
        <svg viewBox="0 0 100 100" width={size} height={size}>
            {data.map((d, i) => {
                const percent = d.count / total;
                const startAngle = cumulativePercent * 360;
                const endAngle = (cumulativePercent + percent) * 360;
                cumulativePercent += percent;

                const startRad = (startAngle - 90) * Math.PI / 180;
                const endRad = (endAngle - 90) * Math.PI / 180;

                const x1 = center + radius * Math.cos(startRad);
                const y1 = center + radius * Math.sin(startRad);
                const x2 = center + radius * Math.cos(endRad);
                const y2 = center + radius * Math.sin(endRad);

                const largeArcFlag = percent > 0.5 ? 1 : 0;

                const pathData = `
                    M ${x1} ${y1}
                    A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
                `;

                return (
                    <motion.path
                        key={i}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        d={pathData}
                        fill="none"
                        stroke={d.color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                    />
                );
            })}

            {/* Center text */}
            <text x={center} y={center - 4} textAnchor="middle" className="text-[10px] font-bold fill-slate-800">
                {total}
            </text>
            <text x={center} y={center + 8} textAnchor="middle" className="text-[6px] fill-slate-400">
                Total
            </text>
        </svg>
    );
};

// Mini sparkline for quick trends
export const Sparkline = ({ data, width = 80, height = 30, color = '#4ec5c1' }) => {
    if (!data || data.length === 0) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((value, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height}>
            <motion.polyline
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default { LineChart, BarChart, DonutChart, Sparkline };
