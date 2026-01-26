import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Sidebar */}
            <AdminSidebar
                isCollapsed={sidebarCollapsed}
                setIsCollapsed={setSidebarCollapsed}
                isMobileOpen={mobileMenuOpen}
                setIsMobileOpen={setMobileMenuOpen}
            />

            {/* Main Content Area */}
            <motion.div
                initial={false}
                animate={{ marginLeft: sidebarCollapsed ? 80 : 260 }}
                className="min-h-screen transition-all duration-300 hidden lg:block"
            >
                <AdminHeader onMenuClick={() => setMobileMenuOpen(true)} />
                <main className="p-6 lg:p-8">
                    <Outlet />
                </main>
            </motion.div>

            {/* Mobile Layout */}
            <div className="lg:hidden">
                <AdminHeader onMenuClick={() => setMobileMenuOpen(true)} />
                <main className="p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
