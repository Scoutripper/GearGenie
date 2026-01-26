import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Save,
    Bell,
    Shield,
    CreditCard,
    Globe,
    Mail,
    Upload
} from 'lucide-react';

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [saved, setSaved] = useState(false);

    const tabs = [
        { id: 'general', label: 'General', icon: Globe },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'payments', label: 'Payments', icon: CreditCard }
    ];

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage your store preferences</p>
                </div>
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors ${saved
                        ? 'bg-emerald-500 text-white'
                        : 'bg-[#4ec5c1] text-white hover:bg-[#3ea09d]'
                        }`}
                >
                    <Save className="w-4 h-4" />
                    {saved ? 'Saved!' : 'Save Changes'}
                </motion.button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === tab.id
                                        ? 'bg-[#4ec5c1]/10 text-[#4ec5c1]'
                                        : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Settings Content */}
                <div className="flex-1">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
                    >
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-slate-800">General Settings</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Store Name</label>
                                        <input
                                            type="text"
                                            defaultValue="Scoutripper"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/30 focus:border-[#4ec5c1]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Store Logo</label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gradient-to-br from-[#4ec5c1] to-[#3ea09d] rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                                                S
                                            </div>
                                            <button className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                                                <Upload className="w-4 h-4" />
                                                Upload New
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Contact Email</label>
                                        <input
                                            type="email"
                                            defaultValue="admin@scoutripper.com"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/30 focus:border-[#4ec5c1]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                                        <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/30">
                                            <option>INR (₹)</option>
                                            <option>USD ($)</option>
                                            <option>EUR (€)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
                                        <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/30">
                                            <option>Asia/Kolkata (IST)</option>
                                            <option>America/New_York (EST)</option>
                                            <option>Europe/London (GMT)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-slate-800">Notification Preferences</h2>

                                <div className="space-y-4">
                                    {[
                                        { title: 'New Orders', desc: 'Get notified when a new order is placed' },
                                        { title: 'Low Stock Alerts', desc: 'Alert when product stock is low' },
                                        { title: 'New User Registration', desc: 'Notification for new user signups' },
                                        { title: 'Order Status Updates', desc: 'Updates when order status changes' },
                                        { title: 'Weekly Reports', desc: 'Receive weekly analytics summary' }
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                            <div>
                                                <p className="text-sm font-medium text-slate-800">{item.title}</p>
                                                <p className="text-xs text-slate-500">{item.desc}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-[#4ec5c1]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4ec5c1]"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-slate-800">Security Settings</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/30 focus:border-[#4ec5c1]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/30 focus:border-[#4ec5c1]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/30 focus:border-[#4ec5c1]"
                                        />
                                    </div>

                                    <div className="pt-4 border-t border-slate-100">
                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                            <div>
                                                <p className="text-sm font-medium text-slate-800">Two-Factor Authentication</p>
                                                <p className="text-xs text-slate-500">Add extra security to your account</p>
                                            </div>
                                            <button className="px-4 py-2 bg-[#4ec5c1] text-white rounded-lg text-sm font-medium hover:bg-[#3ea09d]">
                                                Enable
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'payments' && (
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-slate-800">Payment Settings</h2>

                                <div className="space-y-4">
                                    {[
                                        { name: 'Razorpay', status: 'connected', icon: '💳' },
                                        { name: 'PayU', status: 'not_connected', icon: '💰' },
                                        { name: 'Cash on Delivery', status: 'enabled', icon: '💵' }
                                    ].map((gateway, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{gateway.icon}</span>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800">{gateway.name}</p>
                                                    <p className={`text-xs ${gateway.status === 'connected' || gateway.status === 'enabled'
                                                        ? 'text-emerald-600'
                                                        : 'text-slate-400'
                                                        }`}>
                                                        {gateway.status.replace('_', ' ')}
                                                    </p>
                                                </div>
                                            </div>
                                            <button className={`px-4 py-2 rounded-lg text-sm font-medium ${gateway.status === 'connected' || gateway.status === 'enabled'
                                                ? 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                                                : 'bg-[#4ec5c1] text-white hover:bg-[#3ea09d]'
                                                }`}>
                                                {gateway.status === 'connected' || gateway.status === 'enabled' ? 'Configure' : 'Connect'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
