import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    ArrowUpRight,
    Clock,
    UserPlus,
    AlertTriangle,
    XCircle
} from 'lucide-react';
import StatCard from '../../components/admin/StatCard';
import { LineChart, DonutChart } from '../../components/admin/MiniChart';
import {
    dashboardStats,
    revenueData,
    orderStatusData,
    adminOrders,
    recentActivity,
    topProducts
} from '../../data/adminData';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const getActivityIcon = (iconName) => {
        const icons = {
            ShoppingCart: <ShoppingCart className="w-4 h-4 text-[#4ec5c1]" />,
            UserPlus: <UserPlus className="w-4 h-4 text-blue-500" />,
            Package: <Package className="w-4 h-4 text-emerald-500" />,
            AlertTriangle: <AlertTriangle className="w-4 h-4 text-amber-500" />,
            XCircle: <XCircle className="w-4 h-4 text-red-500" />
        };
        return icons[iconName] || <Package className="w-4 h-4" />;
    };

    const getStatusBadge = (status) => {
        const styles = {
            delivered: 'bg-emerald-100 text-emerald-700',
            shipped: 'bg-blue-100 text-blue-700',
            processing: 'bg-amber-100 text-amber-700',
            pending: 'bg-slate-100 text-slate-700',
            cancelled: 'bg-red-100 text-red-700'
        };
        return styles[status] || styles.pending;
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-1">Welcome back! Here's what's happening today.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/products', { state: { openAddModal: true } })}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4ec5c1] text-white rounded-xl font-medium hover:bg-[#3ea09d] transition-colors shadow-lg shadow-[#4ec5c1]/20"
                >
                    <Package className="w-4 h-4" />
                    Add Product
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <StatCard
                    title="Total Revenue"
                    value={dashboardStats.totalRevenue.value}
                    change={dashboardStats.totalRevenue.change}
                    trend={dashboardStats.totalRevenue.trend}
                    period={dashboardStats.totalRevenue.period}
                    icon={DollarSign}
                    gradient="teal"
                />
                <StatCard
                    title="Total Orders"
                    value={dashboardStats.totalOrders.value}
                    change={dashboardStats.totalOrders.change}
                    trend={dashboardStats.totalOrders.trend}
                    period={dashboardStats.totalOrders.period}
                    icon={ShoppingCart}
                    gradient="blue"
                />
                <StatCard
                    title="Total Users"
                    value={dashboardStats.totalUsers.value}
                    change={dashboardStats.totalUsers.change}
                    trend={dashboardStats.totalUsers.trend}
                    period={dashboardStats.totalUsers.period}
                    icon={Users}
                    gradient="purple"
                />
                <StatCard
                    title="Products"
                    value={dashboardStats.totalProducts.value}
                    change={dashboardStats.totalProducts.change}
                    trend={dashboardStats.totalProducts.trend}
                    period={dashboardStats.totalProducts.period}
                    icon={Package}
                    gradient="amber"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">Revenue Overview</h2>
                            <p className="text-sm text-slate-500">Last 7 days performance</p>
                        </div>
                        <select className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/30">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>Last 90 days</option>
                        </select>
                    </div>
                    <div className="h-[250px]">
                        <LineChart data={revenueData} height={250} />
                    </div>
                </motion.div>

                {/* Order Status Donut */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
                >
                    <h2 className="text-lg font-semibold text-slate-800 mb-6">Order Status</h2>
                    <div className="flex justify-center mb-6">
                        <DonutChart data={orderStatusData} size={150} />
                    </div>
                    <div className="space-y-3">
                        {orderStatusData.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-sm text-slate-600">{item.status}</span>
                                </div>
                                <span className="text-sm font-medium text-slate-800">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-slate-800">Recent Orders</h2>
                        <button className="text-sm text-[#4ec5c1] font-medium flex items-center gap-1 hover:underline">
                            View All <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs font-semibold text-slate-500 uppercase">
                                    <th className="pb-3">Order ID</th>
                                    <th className="pb-3">Customer</th>
                                    <th className="pb-3">Total</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {adminOrders.slice(0, 5).map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-3 text-sm font-medium text-slate-800">{order.id}</td>
                                        <td className="py-3">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={order.customer.avatar}
                                                    alt={order.customer.name}
                                                    className="w-7 h-7 rounded-full"
                                                />
                                                <span className="text-sm text-slate-700">{order.customer.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 text-sm font-medium text-slate-800">₹{order.total.toLocaleString()}</td>
                                        <td className="py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-sm text-slate-500">{order.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Activity Feed */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
                >
                    <h2 className="text-lg font-semibold text-slate-800 mb-6">Recent Activity</h2>
                    <div className="space-y-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                                    {getActivityIcon(activity.icon)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-slate-700">{activity.message}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock className="w-3 h-3 text-slate-400" />
                                        <span className="text-xs text-slate-400">{activity.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Top Products */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-slate-800">Top Selling Products</h2>
                    <button className="text-sm text-[#4ec5c1] font-medium flex items-center gap-1 hover:underline">
                        View All <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {topProducts.map((product, index) => (
                        <div
                            key={product.id}
                            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4ec5c1] to-[#3ea09d] flex items-center justify-center text-white font-bold">
                                #{index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-800 truncate">{product.name}</p>
                                <p className="text-xs text-slate-500">{product.sales} sales</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default AdminDashboard;
