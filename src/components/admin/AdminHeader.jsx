import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Bell,
    Menu,
    ChevronDown,
    User,
    Settings,
    LogOut,
    Check,
    Package,
    ShoppingCart,
    AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';

// Notifications will be loaded dynamically from recent admin data

const AdminHeader = ({ onMenuClick }) => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const notifRef = useRef(null);
    const profileRef = useRef(null);
    const [notifications, setNotifications] = useState([]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Load admin notifications (recent orders) from serverless endpoint
    useEffect(() => {
        let mounted = true;

        const loadNotifications = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.access_token) return;

                const resp = await fetch('/api/admin/dashboard', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!resp.ok) return;
                const json = await resp.json();
                const recent = json.recentOrders || [];

                const mapped = recent.map((r, i) => ({
                    id: `order-${r.id}-${i}`,
                    type: 'order',
                    message: `New order received #${r.id}`,
                    time: r.date || '',
                    read: false,
                    raw: r
                }));

                if (mounted) setNotifications(mapped);
            } catch (e) {
                console.error('Failed to load notifications', e);
            }
        };

        loadNotifications();

        return () => { mounted = false; };
    }, []);

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'order':
                return <ShoppingCart className="w-4 h-4 text-[#4ec5c1]" />;
            case 'stock':
                return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            default:
                return <Package className="w-4 h-4 text-blue-500" />;
        }
    };

    return (
        <header className="bg-white border-b border-slate-200 px-4 lg:px-8 py-4 sticky top-0 z-30">
            <div className="flex items-center justify-between gap-4">
                {/* Left: Mobile Menu + Search */}
                <div className="flex items-center gap-4 flex-1">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Search Bar */}
                    <div className="hidden sm:flex items-center flex-1 max-w-md">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search orders, products, users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/30 focus:border-[#4ec5c1] transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Right: Notifications + Profile */}
                <div className="flex items-center gap-2 lg:gap-4">
                    {/* Notifications */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                setShowProfile(false);
                            }}
                            className="relative p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        <AnimatePresence>
                            {showNotifications && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
                                >
                                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                                        <h3 className="font-semibold text-slate-800">Notifications</h3>
                                        <button className="text-xs text-[#4ec5c1] hover:underline">Mark all read</button>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((notif) => (
                                                <div
                                                    key={notif.id}
                                                    className={`px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 ${!notif.read ? 'bg-[#4ec5c1]/5' : ''}`}
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                        {getNotificationIcon(notif.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-slate-700">{notif.message}</p>
                                                        <p className="text-xs text-slate-400 mt-0.5">{notif.time}</p>
                                                    </div>
                                                    {!notif.read && (
                                                        <div className="w-2 h-2 bg-[#4ec5c1] rounded-full flex-shrink-0 mt-2" />
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-sm text-slate-500">No notifications</div>
                                        )}
                                    </div>
                                    <div className="px-4 py-3 border-t border-slate-100">
                                        <button className="w-full text-center text-sm text-[#4ec5c1] font-medium hover:underline">
                                            View all notifications
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => {
                                setShowProfile(!showProfile);
                                setShowNotifications(false);
                            }}
                            className="flex items-center gap-2 p-1.5 pr-3 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            <img
                                src={user?.profilePic || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                                alt="Admin"
                                className="w-8 h-8 rounded-lg object-cover"
                            />
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-slate-800">
                                    {user?.firstName || 'Admin'} {user?.lastName || 'User'}
                                </p>
                                <p className="text-xs text-slate-500">Administrator</p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
                        </button>

                        <AnimatePresence>
                            {showProfile && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
                                >
                                    <div className="px-4 py-3 border-b border-slate-100">
                                        <p className="font-medium text-slate-800">{user?.firstName} {user?.lastName}</p>
                                        <p className="text-xs text-slate-500">{user?.email}</p>
                                    </div>
                                    <div className="py-2">
                                        <button className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                                            <User className="w-4 h-4" />
                                            View Profile
                                        </button>
                                        <button className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                                            <Settings className="w-4 h-4" />
                                            Settings
                                        </button>
                                    </div>
                                    <div className="py-2 border-t border-slate-100">
                                        <button className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors">
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
