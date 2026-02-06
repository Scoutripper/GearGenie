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

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const [usersRes, ordersRes] = await Promise.all([
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('orders').select('*', { count: 'exact', head: true })
            ]);

            setStats({
                totalUsers: usersRes.count || 0,
                totalOrders: ordersRes.count || 0,
                totalRevenue: 0, // Need real aggregation
                conversionRate: 0
            });
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
                <div className="bg-white rounded-2xl p-6 border border-slate-100 h-[350px] flex flex-col items-center justify-center text-center">
                    <div className="p-4 bg-slate-50 rounded-full mb-4"><TrendingUp className="w-8 h-8 text-slate-300" /></div>
                    <h3 className="font-semibold text-slate-800">Revenue Trend</h3>
                    <p className="text-sm text-slate-500 max-w-[250px] mt-2">Charts will appear once you have weekly sales data in Supabase.</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-100 h-[350px] flex flex-col items-center justify-center text-center">
                    <div className="p-4 bg-slate-50 rounded-full mb-4"><DollarSign className="w-8 h-8 text-slate-300" /></div>
                    <h3 className="font-semibold text-slate-800">Category breakdown</h3>
                    <p className="text-sm text-slate-500 max-w-[250px] mt-2">Category analytics will sync automatically with product sales.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
