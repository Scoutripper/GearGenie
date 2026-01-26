import { motion } from 'framer-motion';
import {
    TrendingUp,
    DollarSign,
    ShoppingCart,
    Users,
    ArrowUpRight,
    Download
} from 'lucide-react';
import { LineChart, BarChart, DonutChart } from '../../components/admin/MiniChart';
import {
    monthlyRevenueData,
    orderStatusData,
    categoryData,
    topProducts
} from '../../data/adminData';

const AdminAnalytics = () => {
    // Summary stats
    const summaryStats = [
        { label: 'Total Revenue', value: '₹12,45,890', change: '+18.2%', icon: DollarSign, color: 'teal' },
        { label: 'Total Orders', value: '3,892', change: '+12.5%', icon: ShoppingCart, color: 'blue' },
        { label: 'Total Users', value: '8,543', change: '+25.1%', icon: Users, color: 'purple' },
        { label: 'Conversion Rate', value: '3.2%', change: '+0.5%', icon: TrendingUp, color: 'green' }
    ];

    const colorMap = {
        teal: { bg: 'from-[#4ec5c1]/10 to-[#4ec5c1]/5', icon: 'bg-[#4ec5c1]' },
        blue: { bg: 'from-blue-500/10 to-blue-500/5', icon: 'bg-blue-500' },
        purple: { bg: 'from-purple-500/10 to-purple-500/5', icon: 'bg-purple-500' },
        green: { bg: 'from-emerald-500/10 to-emerald-500/5', icon: 'bg-emerald-500' }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
                    <p className="text-slate-500 text-sm mt-1">Track performance and business insights</p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors">
                    <Download className="w-4 h-4" />
                    Export Report
                </button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryStats.map((stat, index) => {
                    const Icon = stat.icon;
                    const colors = colorMap[stat.color];
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`bg-gradient-to-br ${colors.bg} bg-white rounded-2xl p-5 border border-slate-100 shadow-sm`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={`p-2.5 rounded-xl ${colors.icon} text-white`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium text-emerald-600 flex items-center gap-0.5">
                                    <ArrowUpRight className="w-3 h-3" />
                                    {stat.change}
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">Revenue Trend</h2>
                            <p className="text-sm text-slate-500">Monthly revenue performance</p>
                        </div>
                        <select className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/30">
                            <option>Last 6 months</option>
                            <option>Last 12 months</option>
                            <option>This year</option>
                        </select>
                    </div>
                    <div className="h-[250px]">
                        <LineChart
                            data={monthlyRevenueData.map(d => ({ ...d, label: d.month }))}
                            height={250}
                            color="#4ec5c1"
                        />
                    </div>
                </motion.div>

                {/* Category Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">Revenue by Category</h2>
                            <p className="text-sm text-slate-500">Category-wise breakdown</p>
                        </div>
                    </div>
                    <div className="h-[250px]">
                        <BarChart
                            data={categoryData.map(d => ({ ...d, value: d.revenue }))}
                            height={250}
                            color="#4ec5c1"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Status Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
                >
                    <h2 className="text-lg font-semibold text-slate-800 mb-6">Order Status</h2>
                    <div className="flex justify-center mb-6">
                        <DonutChart data={orderStatusData} size={150} />
                    </div>
                    <div className="space-y-2">
                        {orderStatusData.map((item, index) => (
                            <div key={index} className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-sm text-slate-600">{item.status}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-slate-800">{item.count}</span>
                                    <span className="text-xs text-slate-400">
                                        {((item.count / orderStatusData.reduce((a, b) => a + b.count, 0)) * 100).toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Top Products */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">Top Performing Products</h2>
                            <p className="text-sm text-slate-500">Based on sales volume</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {topProducts.map((product, index) => {
                            const maxSales = Math.max(...topProducts.map(p => p.sales));
                            const percentage = (product.sales / maxSales) * 100;

                            return (
                                <div key={product.id} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-[#4ec5c1]">#{index + 1}</span>
                                            <span className="text-sm font-medium text-slate-800">{product.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-medium text-slate-800">{product.sales} sales</span>
                                            <span className="text-xs text-slate-400 ml-2">₹{(product.revenue / 1000).toFixed(0)}k</span>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                                            className="h-full bg-gradient-to-r from-[#4ec5c1] to-[#3ea09d] rounded-full"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* Category Performance Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
            >
                <h2 className="text-lg font-semibold text-slate-800 mb-6">Category Performance</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs font-semibold text-slate-500 uppercase border-b border-slate-100">
                                <th className="pb-3">Category</th>
                                <th className="pb-3">Products</th>
                                <th className="pb-3">Revenue</th>
                                <th className="pb-3">Share</th>
                                <th className="pb-3">Performance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {categoryData.map((category, index) => {
                                const totalRevenue = categoryData.reduce((a, b) => a + b.revenue, 0);
                                const share = ((category.revenue / totalRevenue) * 100).toFixed(1);

                                return (
                                    <tr key={category.name} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 text-sm font-medium text-slate-800">{category.name}</td>
                                        <td className="py-4 text-sm text-slate-600">{category.products}</td>
                                        <td className="py-4 text-sm font-medium text-slate-800">₹{(category.revenue / 1000).toFixed(0)}k</td>
                                        <td className="py-4 text-sm text-slate-600">{share}%</td>
                                        <td className="py-4">
                                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${share}%` }}
                                                    transition={{ duration: 0.8, delay: index * 0.05 }}
                                                    className="h-full bg-[#4ec5c1] rounded-full"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminAnalytics;
