import { useState, useEffect } from 'react';
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
import { supabase } from '../../supabaseClient';

const AdminAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        conversionRate: 0
    });
    const [revenueData, setRevenueData] = useState([]);
    const [statusData, setStatusData] = useState([]);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

            let allOrders = [];
            let userCount = 0;

            if (isLocal) {
                const [usersRes, ordersRes] = await Promise.all([
                    supabase.from('profiles').select('*', { count: 'exact', head: true }),
                    supabase.from('orders').select('total_amount, created_at, status')
                ]);
                allOrders = ordersRes.data || [];
                userCount = usersRes.count || 0;
            } else {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.access_token) throw new Error("No session");

                const response = await fetch("/api/admin/analytics", {
                    headers: { Authorization: `Bearer ${session.access_token}` },
                });
                if (!response.ok) throw new Error("API failure");
                const result = await response.json();
                allOrders = result.orders || [];
                userCount = result.userCount || 0;
            }

            const totalRevenue = allOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
            const conv = userCount > 0 ? ((allOrders.length / userCount) * 100).toFixed(1) : 0;

            setStats({
                totalUsers: userCount,
                totalOrders: allOrders.length,
                totalRevenue: totalRevenue,
                conversionRate: conv
            });

            // Process Charts
            const days = [...Array(7)].map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - i);
                return d.toISOString().split('T')[0];
            }).reverse();

            const dailyRevenue = days.map(date => ({
                label: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
                value: allOrders
                    .filter(o => o.created_at.startsWith(date))
                    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0)
            }));
            setRevenueData(dailyRevenue);

            const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
            const colors = ['#94a3b8', '#f59e0b', '#3b82f6', '#10b981', '#ef4444'];
            const distribution = statuses.map((status, i) => ({
                name: status,
                count: allOrders.filter(o => o.status === status).length,
                color: colors[i]
            })).filter(d => d.count > 0);
            setStatusData(distribution);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const summaryStats = [
        { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, change: '+0%', icon: DollarSign, color: 'teal' },
        { label: 'Total Orders', value: stats.totalOrders.toLocaleString(), change: '+0%', icon: ShoppingCart, color: 'blue' },
        { label: 'Total Users', value: stats.totalUsers.toLocaleString(), change: '+0%', icon: Users, color: 'purple' },
        { label: 'Conversion Rate', value: `${stats.conversionRate}%`, change: '+0%', icon: TrendingUp, color: 'green' }
    ];

    const colorMap = {
        teal: { bg: 'from-[#4ec5c1]/10 to-[#4ec5c1]/5', icon: 'bg-[#4ec5c1]' },
        blue: { bg: 'from-blue-500/10 to-blue-500/5', icon: 'bg-blue-500' },
        purple: { bg: 'from-purple-500/10 to-purple-500/5', icon: 'bg-purple-500' },
        green: { bg: 'from-emerald-500/10 to-emerald-500/5', icon: 'bg-emerald-500' }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
                    <p className="text-slate-500 text-sm mt-1">Real database insights from Supabase</p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors">
                    <Download className="w-4 h-4" /> Export Report
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryStats.map((stat, index) => {
                    const Icon = stat.icon;
                    const colors = colorMap[stat.color];
                    return (
                        <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className={`bg-gradient-to-br ${colors.bg} rounded-2xl p-5 border border-slate-100 shadow-sm`}>
                            <div className="flex items-center justify-between mb-3">
                                <div className={`p-2.5 rounded-xl ${colors.icon} text-white`}><Icon className="w-5 h-5" /></div>
                                <span className="text-sm font-medium text-slate-400">Stable</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-100 flex flex-col h-[400px]">
                    <h3 className="font-semibold text-slate-800 mb-6">Revenue Trend</h3>
                    <div className="flex-1 w-full">
                        {revenueData.length > 0 ? (
                            <LineChart data={revenueData} color="#4ec5c1" />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <TrendingUp className="w-8 h-8 text-slate-200 mb-2" />
                                <p className="text-sm text-slate-400">Not enough data for trend</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-100 flex flex-col h-[400px]">
                    <h3 className="font-semibold text-slate-800 mb-6">Order Status</h3>
                    <div className="flex-1 w-full">
                        {statusData.length > 0 ? (
                            <DonutChart data={statusData} />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                                <ShoppingCart className="w-8 h-8 text-slate-200 mb-2" />
                                <p className="text-sm text-slate-400">No status data to show</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
