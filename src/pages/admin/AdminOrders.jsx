import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Eye,
    ChevronDown,
    X,
    MapPin,
    Calendar,
    CreditCard,
    Truck,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { supabaseAdmin } from '../../supabaseAdminClient';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            // Use admin client to fetch orders with customer profiles (bypasses RLS)
            const { data, error } = await supabaseAdmin
                .from('orders')
                .select(`
                    *,
                    customer:profiles(first_name, last_name, email, avatar_url),
                    items:order_items(product_name, quantity, price)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const mapped = (data || []).map(o => ({
                id: o.id.slice(0, 8),
                fullId: o.id,
                customer: {
                    name: `${o.customer?.first_name || ''} ${o.customer?.last_name || ''}`.trim() || 'User',
                    email: o.customer?.email || 'N/A',
                    profilePic: o.customer?.avatar_url || `https://ui-avatars.com/api/?name=${o.customer?.email}`
                },
                itemsCount: o.items?.length || 0,
                items: o.items?.map(i => ({
                    name: i.product_name,
                    qty: i.quantity,
                    price: i.price
                })) || [],
                total: o.total_amount,
                paymentMethod: 'Prepaid', // Default for now
                status: o.status,
                address: o.shipping_address || 'No shipping address provided',
                date: new Date(o.created_at).toLocaleDateString()
            }));

            setOrders(mapped);
        } catch (error) {
            console.error('Error fetching orders:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orders.find(o => o.id === orderId).fullId);

            if (error) throw error;

            setOrders(prev =>
                prev.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            alert("Failed to update status: " + error.message);
        }
    };

    // Filter orders
    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const getStatusConfig = (status) => {
        const configs = {
            delivered: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle },
            shipped: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Truck },
            processing: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock },
            pending: { bg: 'bg-slate-100', text: 'text-slate-700', icon: Clock },
            cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle }
        };
        return configs[status] || configs.pending;
    };

    const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
                    <p className="text-slate-500 text-sm mt-1">Real orders from Supabase</p>
                </div>
                <div className="text-sm text-slate-500 font-medium">
                    Total: {orders.length} orders
                </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4">
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
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Order ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Items</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Total</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="7" className="py-12 text-center text-slate-500">Loading orders...</td></tr>
                            ) : paginatedOrders.length === 0 ? (
                                <tr><td colSpan="7" className="py-12 text-center text-slate-500">No orders found.</td></tr>
                            ) : paginatedOrders.map((order, index) => {
                                const statusConfig = getStatusConfig(order.status);
                                return (
                                    <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-4 text-sm font-medium text-slate-800">#{order.id}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={order.customer.profilePic} className="w-8 h-8 rounded-full bg-slate-100" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800">{order.customer.name}</p>
                                                    <p className="text-xs text-slate-500">{order.customer.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-600">{order.itemsCount}</td>
                                        <td className="px-4 py-4 text-sm font-medium text-slate-800">₹{order.total.toLocaleString()}</td>
                                        <td className="px-4 py-4">
                                            <div className="relative">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    className={`appearance-none px-3 py-1.5 pr-7 rounded-lg text-xs font-medium ${statusConfig.bg} ${statusConfig.text} border-0 cursor-pointer`}
                                                >
                                                    {statusOptions.map(status => (
                                                        <option key={status} value={status} className="capitalize bg-white text-slate-700">{status}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-500">{order.date}</td>
                                        <td className="px-4 py-4">
                                            <button onClick={() => setSelectedOrder(order)} className="p-2 text-slate-400 hover:text-[#4ec5c1] hover:bg-slate-100 rounded-lg"><Eye className="w-4 h-4" /></button>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl max-w-2xl w-full p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold">Order #{selectedOrder.id}</h2>
                                <button onClick={() => setSelectedOrder(null)}><X className="w-5 h-5" /></button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-xs text-slate-500 mb-1">Customer</p>
                                        <p className="font-medium">{selectedOrder.customer.name}</p>
                                        <p className="text-sm text-slate-500">{selectedOrder.customer.email}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-xs text-slate-500 mb-1">Shipping Address</p>
                                        <p className="text-sm font-medium">{selectedOrder.address}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-2">Order Items</p>
                                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                        {selectedOrder.items.map((item, i) => (
                                            <div key={i} className="flex justify-between text-sm p-2 bg-slate-50 rounded-lg">
                                                <span>{item.name} x {item.qty}</span>
                                                <span className="font-medium">₹{item.price.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-4 pt-4 border-t font-bold text-lg">
                                        <span>Total</span>
                                        <span>₹{selectedOrder.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="w-full mt-6 py-3 bg-[#4ec5c1] text-white rounded-xl font-bold">Close</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminOrders;
