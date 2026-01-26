import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    UserPlus,
    Mail,
    Phone,
    Calendar,
    ShoppingBag,
    Eye,
    X,
    ToggleLeft,
    ToggleRight
} from 'lucide-react';
import { adminUsers } from '../../data/adminData';

const AdminUsers = () => {
    const [users, setUsers] = useState(adminUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / pageSize);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const toggleUserStatus = (userId) => {
        setUsers(prev =>
            prev.map(user =>
                user.id === userId
                    ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
                    : user
            )
        );
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Users</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage registered users and their accounts</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500">
                        {users.filter(u => u.status === 'active').length} active of {users.length} users
                    </span>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/30 focus:border-[#4ec5c1] transition-all"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/30"
                    >
                        <option value="all">All Users</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedUsers.map((user, index) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src={user.avatar}
                                    alt={`${user.firstName} ${user.lastName}`}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div>
                                    <h3 className="font-semibold text-slate-800">
                                        {user.firstName} {user.lastName}
                                    </h3>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${user.status === 'active'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        {user.status}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleUserStatus(user.id)}
                                className={`transition-colors ${user.status === 'active' ? 'text-emerald-500' : 'text-slate-400'}`}
                            >
                                {user.status === 'active' ? (
                                    <ToggleRight className="w-8 h-8" />
                                ) : (
                                    <ToggleLeft className="w-8 h-8" />
                                )}
                            </button>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-slate-500">
                                <Mail className="w-4 h-4" />
                                <span className="truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500">
                                <Phone className="w-4 h-4" />
                                <span>{user.phone}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <p className="text-lg font-bold text-slate-800">{user.ordersCount}</p>
                                    <p className="text-xs text-slate-500">Orders</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-slate-800">₹{(user.totalSpent / 1000).toFixed(1)}k</p>
                                    <p className="text-xs text-slate-500">Spent</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedUser(user)}
                                className="p-2 text-slate-400 hover:text-[#4ec5c1] hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <Eye className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-slate-500">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* User Detail Modal */}
            <AnimatePresence>
                {selectedUser && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-800">User Profile</h2>
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6">
                                {/* User Header */}
                                <div className="text-center mb-6">
                                    <img
                                        src={selectedUser.avatar}
                                        alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                                        className="w-20 h-20 rounded-full mx-auto mb-3"
                                    />
                                    <h3 className="text-xl font-bold text-slate-800">
                                        {selectedUser.firstName} {selectedUser.lastName}
                                    </h3>
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${selectedUser.status === 'active'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        {selectedUser.status}
                                    </span>
                                </div>

                                {/* User Info */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                        <Mail className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-500">Email</p>
                                            <p className="text-sm font-medium text-slate-800">{selectedUser.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                        <Phone className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-500">Phone</p>
                                            <p className="text-sm font-medium text-slate-800">{selectedUser.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                        <Calendar className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-500">Joined</p>
                                            <p className="text-sm font-medium text-slate-800">{selectedUser.joinedDate}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="bg-gradient-to-br from-[#4ec5c1]/10 to-[#4ec5c1]/5 p-4 rounded-xl text-center">
                                        <ShoppingBag className="w-6 h-6 text-[#4ec5c1] mx-auto mb-2" />
                                        <p className="text-2xl font-bold text-slate-800">{selectedUser.ordersCount}</p>
                                        <p className="text-xs text-slate-500">Total Orders</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-4 rounded-xl text-center">
                                        <p className="text-2xl font-bold text-slate-800 mt-2">₹{selectedUser.totalSpent.toLocaleString()}</p>
                                        <p className="text-xs text-slate-500">Total Spent</p>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-400 text-center mt-4">
                                    Last active: {selectedUser.lastActive}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminUsers;
