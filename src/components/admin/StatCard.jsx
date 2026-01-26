import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, change, trend, period, icon: Icon, gradient }) => {
    const isPositive = trend === 'up';

    const gradients = {
        teal: 'from-[#4ec5c1]/10 to-[#4ec5c1]/5',
        blue: 'from-blue-500/10 to-blue-500/5',
        purple: 'from-purple-500/10 to-purple-500/5',
        amber: 'from-amber-500/10 to-amber-500/5',
        green: 'from-emerald-500/10 to-emerald-500/5'
    };

    const iconColors = {
        teal: 'bg-[#4ec5c1] text-white',
        blue: 'bg-blue-500 text-white',
        purple: 'bg-purple-500 text-white',
        amber: 'bg-amber-500 text-white',
        green: 'bg-emerald-500 text-white'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className={`bg-gradient-to-br ${gradients[gradient] || gradients.teal} bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300`}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${iconColors[gradient] || iconColors.teal}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                    {isPositive ? (
                        <TrendingUp className="w-4 h-4" />
                    ) : (
                        <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{change}</span>
                </div>
            </div>

            <div className="space-y-1">
                <p className="text-slate-500 text-sm font-medium">{title}</p>
                <p className="text-3xl font-bold text-slate-800">{value}</p>
                <p className="text-xs text-slate-400">{period}</p>
            </div>
        </motion.div>
    );
};

export default StatCard;
