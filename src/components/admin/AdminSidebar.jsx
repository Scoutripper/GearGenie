import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    X
} from 'lucide-react';

const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
];

const AdminSidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    const SidebarContent = ({ isMobile = false }) => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between px-4 py-6 border-b border-slate-700">
                <Link to="/admin" className="flex items-center gap-3 overflow-hidden">
                    <img
                        src="/assets/logo.png"
                        alt="Scoutripper"
                        className={`h-10 object-contain transition-all duration-300 ${(!isCollapsed || isMobile) ? 'w-[140px]' : 'w-10 object-left'}`}
                    />
                </Link>
                {isMobile && (
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => isMobile && setIsMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                                ${active
                                    ? 'bg-gradient-to-r from-[#4ec5c1] to-[#3ea09d] text-white shadow-lg shadow-[#4ec5c1]/20'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'group-hover:text-[#4ec5c1]'}`} />
                            <AnimatePresence>
                                {(!isCollapsed || isMobile) && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        className="text-sm font-medium whitespace-nowrap overflow-hidden"
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="px-3 py-4 border-t border-slate-700">
                <Link
                    to="/"
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 group"
                >
                    <LogOut className="w-5 h-5 flex-shrink-0 group-hover:text-red-400" />
                    <AnimatePresence>
                        {(!isCollapsed || isMobile) && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                className="text-sm font-medium whitespace-nowrap overflow-hidden"
                            >
                                Exit Admin
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>

                {/* Collapse Toggle - Desktop Only */}
                {!isMobile && (
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="w-full flex items-center justify-center gap-3 px-3 py-3 mt-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-5 h-5" />
                        ) : (
                            <>
                                <ChevronLeft className="w-5 h-5" />
                                <span className="text-sm font-medium">Collapse</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 260 }}
                className="hidden lg:flex flex-col bg-[#0f1419] min-h-screen fixed left-0 top-0 z-40"
            >
                <SidebarContent />
            </motion.aside>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen(false)}
                        className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />
                )}
            </AnimatePresence>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.aside
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="lg:hidden fixed left-0 top-0 w-[280px] h-full bg-[#0f1419] z-50"
                    >
                        <SidebarContent isMobile />
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminSidebar;
