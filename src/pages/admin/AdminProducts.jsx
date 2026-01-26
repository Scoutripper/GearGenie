import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    Eye,
    MoreVertical,
    Package,
    X
} from 'lucide-react';
import { adminProducts } from '../../data/adminData';

const AdminProducts = () => {
    const [products, setProducts] = useState(adminProducts);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const location = useLocation();
    const pageSize = 8;

    useEffect(() => {
        if (location.state?.openAddModal) {
            setShowAddModal(true);
            // Optional: Clear state so it doesn't reopen on refresh, 
            // but modifying history during render/effect might be tricky. 
            // For now, it's fine as a simple trigger.
            window.history.replaceState({}, document.title)
        }
    }, [location]);

    const categories = [...new Set(adminProducts.map(p => p.category))];

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / pageSize);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const getStatusBadge = (status) => {
        const styles = {
            active: 'bg-emerald-100 text-emerald-700',
            out_of_stock: 'bg-red-100 text-red-700',
            low_stock: 'bg-amber-100 text-amber-700'
        };
        const labels = {
            active: 'Active',
            out_of_stock: 'Out of Stock',
            low_stock: 'Low Stock'
        };
        return { style: styles[status] || styles.active, label: labels[status] || status };
    };

    const handleDeleteProduct = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            setProducts(prev => prev.filter(p => p.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Products</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage your product inventory</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4ec5c1] text-white rounded-xl font-medium hover:bg-[#3ea09d] transition-colors shadow-lg shadow-[#4ec5c1]/20"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/30 focus:border-[#4ec5c1] transition-all"
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => {
                            setCategoryFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/30"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

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
                        <option value="active">Active</option>
                        <option value="low_stock">Low Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Product</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Category</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Price</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Rent Price</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Stock</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Sales</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginatedProducts.map((product, index) => {
                                const status = getStatusBadge(product.status);
                                return (
                                    <motion.tr
                                        key={product.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                                <span className="text-sm font-medium text-slate-800 max-w-[200px] truncate">
                                                    {product.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-slate-600">{product.category}</td>
                                        <td className="px-4 py-4 text-sm font-medium text-slate-800">₹{product.price.toLocaleString()}</td>
                                        <td className="px-4 py-4 text-sm text-slate-600">₹{product.rentPrice}/day</td>
                                        <td className="px-4 py-4 text-sm text-slate-600">{product.stock}</td>
                                        <td className="px-4 py-4 text-sm text-slate-600">{product.sales}</td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.style}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setSelectedProduct(product)}
                                                    className="p-2 text-slate-400 hover:text-[#4ec5c1] hover:bg-slate-100 rounded-lg transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-slate-100 rounded-lg transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
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
                            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredProducts.length)} of {filteredProducts.length}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-800">Product Details</h2>
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <img
                                src={selectedProduct.image.replace('w=100', 'w=400')}
                                alt={selectedProduct.name}
                                className="w-full h-48 object-cover rounded-xl mb-4"
                            />
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">{selectedProduct.name}</h3>
                            <p className="text-sm text-[#4ec5c1] font-medium mb-4">{selectedProduct.category}</p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-3 rounded-xl">
                                    <p className="text-xs text-slate-500">Buy Price</p>
                                    <p className="text-lg font-bold text-slate-800">₹{selectedProduct.price.toLocaleString()}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl">
                                    <p className="text-xs text-slate-500">Rent Price</p>
                                    <p className="text-lg font-bold text-slate-800">₹{selectedProduct.rentPrice}/day</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl">
                                    <p className="text-xs text-slate-500">Stock</p>
                                    <p className="text-lg font-bold text-slate-800">{selectedProduct.stock} units</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl">
                                    <p className="text-xs text-slate-500">Total Sales</p>
                                    <p className="text-lg font-bold text-slate-800">{selectedProduct.sales}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button className="flex-1 py-2.5 bg-[#4ec5c1] text-white rounded-xl font-medium hover:bg-[#3ea09d] transition-colors">
                                    Edit Product
                                </button>
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-800">Add New Product</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <form className="space-y-6" onSubmit={(e) => {
                                e.preventDefault();
                                // Handle form submission logic here
                                alert("Product added successfully! (Demo)");
                                setShowAddModal(false);
                            }}>
                                {/* Image Upload Placeholder */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">Product Image</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-xl hover:border-[#4ec5c1] transition-colors cursor-pointer bg-slate-50">
                                        <div className="space-y-1 text-center">
                                            <div className="mx-auto h-12 w-12 text-slate-400">
                                                <Package className="h-12 w-12" />
                                            </div>
                                            <div className="flex text-sm text-slate-600">
                                                <label className="relative cursor-pointer rounded-md font-medium text-[#4ec5c1] hover:text-[#3ea09d]">
                                                    <span>Upload a file</span>
                                                    <input type="file" className="sr-only" />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">Product Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Quechua MH100"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/30 focus:border-[#4ec5c1] transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">Category</label>
                                        <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/30 focus:border-[#4ec5c1] transition-all">
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">Price (₹)</label>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/30 focus:border-[#4ec5c1] transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">Rent Price (₹/day)</label>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/30 focus:border-[#4ec5c1] transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">Stock</label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/30 focus:border-[#4ec5c1] transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-slate-700">Status</label>
                                        <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/30 focus:border-[#4ec5c1] transition-all">
                                            <option value="active">Active</option>
                                            <option value="low_stock">Low Stock</option>
                                            <option value="out_of_stock">Out of Stock</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">Description</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Product description..."
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/30 focus:border-[#4ec5c1] transition-all resize-none"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-2.5 bg-[#4ec5c1] text-white rounded-xl font-medium hover:bg-[#3ea09d] transition-colors shadow-lg shadow-[#4ec5c1]/20"
                                    >
                                        Add Product
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
