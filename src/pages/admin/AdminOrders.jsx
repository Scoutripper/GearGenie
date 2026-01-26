import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Eye,
    ChevronDown,
    X,
    MapPin,
    Calendar,
    CreditCard,
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react';
import { adminOrders } from '../../data/adminData';

const AdminOrders = () => {
    const [orders, setOrders] = useState(adminOrders);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // Filter orders
    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / pageSize);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const getStatusConfig = (status) => {
        const configs = {
            delivered: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle },
            shipped: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Truck },
            processing: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Package },
            pending: { bg: 'bg-slate-100', text: 'text-slate-700', icon: Clock },
            cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle }
        };
        return configs[status] || configs.pending;
    };

    const handleStatusChange = (orderId, newStatus) => {
        setOrders(prev =>
            prev.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
    };

    const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage and track customer orders</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500">Total: {filteredOrders.length} orders</span>
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
                            placeholder="Search by order ID or customer..."
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
                        <option value="all">All Status</option>
                        {statusOptions.map(status => (
                            <option key={status} value={status} className="capitalize">{status}</option>
                        ))}
                    </select>
                </div>

                {/* Status Quick Filters */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {statusOptions.map(status => {
                        const config = getStatusConfig(status);
                        const count = orders.filter(o => o.status === status).length;
                        return (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status === statusFilter ? 'all' : status)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${statusFilter === status
                                    ? `${config.bg} ${config.text}`
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                <span className="capitalize">{status}</span>
                                <span className="opacity-70">({count})</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Order ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Items</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Total</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Payment</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginatedOrders.map((order, index) => {
                                const statusConfig = getStatusConfig(order.status);
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="px-4 py-4 text-sm font-medium text-slate-800">{order.id}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={order.customer.avatar}
                                                    alt={order.customer.name}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800">{order.customer.name}</p>
                                                    <p className="text-xs text-slate-500">{order.customer.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-600">
                                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-slate-800">₹{order.total.toLocaleString()}</td>
                                        <td className="px-4 py-4 text-sm text-slate-600">{order.paymentMethod}</td>
                                        <td className="px-4 py-4">
                                            <div className="relative group">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    className={`appearance-none px-3 py-1.5 pr-7 rounded-lg text-xs font-medium ${statusConfig.bg} ${statusConfig.text} border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/30`}
                                                >
                                                    {statusOptions.map(status => (
                                                        <option key={status} value={status} className="capitalize bg-white text-slate-700">
                                                            {status}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-500">{order.date}</td>
                                        <td className="px-4 py-4">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-2 text-slate-400 hover:text-[#4ec5c1] hover:bg-slate-100 rounded-lg transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredOrders.length)} of {filteredOrders.length}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-800">{selectedOrder.id}</h2>
                                    <p className="text-sm text-slate-500">Order Details</p>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Customer Info */}
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                    <img
                                        src={selectedOrder.customer.avatar}
                                        alt={selectedOrder.customer.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <div>
                                        <p className="font-medium text-slate-800">{selectedOrder.customer.name}</p>
                                        <p className="text-sm text-slate-500">{selectedOrder.customer.email}</p>
                                    </div>
                                </div>

                                {/* Order Info Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                        <Calendar className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-500">Order Date</p>
                                            <p className="text-sm font-medium text-slate-800">{selectedOrder.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                        <CreditCard className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-500">Payment</p>
                                            <p className="text-sm font-medium text-slate-800">{selectedOrder.paymentMethod}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl col-span-2">
                                        <MapPin className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="text-xs text-slate-500">Delivery Address</p>
                                            <p className="text-sm font-medium text-slate-800">{selectedOrder.address}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Items */}
                                <div>
                                    <h3 className="font-medium text-slate-800 mb-3">Order Items</h3>
                                    <div className="space-y-3">
                                        {selectedOrder.items.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800">{item.name}</p>
                                                    <p className="text-xs text-slate-500">Qty: {item.qty}</p>
                                                </div>
                                                <p className="text-sm font-medium text-slate-800">₹{item.price.toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200">
                                        <p className="font-medium text-slate-800">Total Amount</p>
                                        <p className="text-xl font-bold text-slate-800">₹{selectedOrder.total.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminOrders;
