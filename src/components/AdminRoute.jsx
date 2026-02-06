import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Show nothing or a loading spinner while checking auth status
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#4ec5c1] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium font-['Jost']">Verifying Admin Access...</p>
                </div>
            </div>
        );
    }

    // If not logged in, send to login
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If logged in but NOT an admin, send to home
    if (user.role !== 'admin') {
        console.warn("Unauthorised access attempt to Admin Dashboard by:", user.email);
        return <Navigate to="/" replace />;
    }

    // If admin, show the content
    return children;
};

export default AdminRoute;
