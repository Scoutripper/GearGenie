import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Eye,
    Package,
    X,
    RefreshCw,
    Upload
} from 'lucide-react';
import { supabase } from '../../supabaseClient';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Footwear',
        buy_price: 0,
        original_price: 0,
        rent_price: 0,
        stock_quantity: 0,
        rating: 4.5,
        review_count: 0,
        description: '',
        image_url: '',
        highlights: '',
        availability_type: 'both',
        sizes: 'S, M, L, XL',
        colors: 'Black, Blue, Grey'
    });
    const [currentPage, setCurrentPage] = useState(1);
    const location = useLocation();
    const navigate = useNavigate();
    const pageSize = 8;

    const APP_CATEGORIES = ['Footwear', 'Apparel', 'Equipment', 'Tents', 'Accessories', 'Gadgets'];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const mapped = (data || []).map(p => ({
                ...p,
                image: p.images?.[0] || 'https://placehold.co/150',
                price: p.buy_price,
                rentPrice: p.rent_price,
                stock: p.stock_quantity,
                sales: 0
            }));

            setProducts(mapped);
        } catch (error) {
            console.error('Error fetching products:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (location.state?.openAddModal) {
            setIsEditing(false);
            setFormData({
                name: '',
                category: 'Footwear',
                buy_price: 0,
                original_price: 0,
                rent_price: 0,
                stock_quantity: 0,
                rating: 4.5,
                review_count: 0,
                description: '',
                image_url: '',
                availability_type: 'both'
            });
            setShowAddModal(true);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const dynamicCategories = ['all', ...new Set(products.map(p => p.category))];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const getStatusBadge = (product) => {
        if (product.stock <= 0) return { style: 'bg-red-100 text-red-700', label: 'Out of Stock' };
        if (product.stock <= 5) return { style: 'bg-amber-100 text-amber-700', label: 'Low Stock' };
        return { style: 'bg-emerald-100 text-emerald-700', label: 'Active' };
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            // First attempt to delete the product directly
            const { error } = await supabase.from('products').delete().eq('id', id);

            if (error) {
                // Check for foreign key violation (PostgreSQL code 23503) from order_items
                if (error.code === '23503') {
                    const forceDelete = confirm(
                        "This product is part of existing orders. Normal deletion is blocked to preserve order history.\n\n" +
                        "Do you want to FORCE DELETE it? This will remove the product from all past order receipts permanently."
                    );

                    if (forceDelete) {
                        // 1. Delete associated order items first to clear the constraint
                        const { error: depsError } = await supabase
                            .from('order_items')
                            .delete()
                            .eq('product_id', id);

                        if (depsError) {
                            throw new Error(`Failed to delete order history: ${depsError.message}`);
                        }

                        // 2. Retry deleting the product
                        const { error: retryError } = await supabase
                            .from('products')
                            .delete()
                            .eq('id', id);

                        if (retryError) throw retryError;

                        // Success
                        setProducts(prev => prev.filter(p => p.id !== id));
                        alert("Product and its order history deleted successfully.");
                    }
                } else {
                    throw error;
                }
            } else {
                setProducts(prev => prev.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Error processing request: " + error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const productData = {
                name: formData.name,
                category: formData.category,
                buy_price: parseFloat(formData.buy_price) || 0,
                original_price: parseFloat(formData.original_price) || parseFloat(formData.buy_price) || 0,
                rent_price: parseFloat(formData.rent_price) || 0,
                rating: parseFloat(formData.rating) || 0,
                review_count: parseInt(formData.review_count) || 0,
                stock_quantity: parseInt(formData.stock_quantity) || 0,
                description: formData.description,
                availability_type: formData.availability_type,
                images: [formData.image_url],
                highlights: formData.highlights.split(',').map(s => s.trim()).filter(s => s !== ''),
                sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s !== ''),
                colors: formData.colors.split(',').map(s => s.trim()).filter(s => s !== ''),
                in_stock: parseInt(formData.stock_quantity) > 0
            };
            if (isEditing) {
                const { error } = await supabase.from('products').update(productData).eq('id', selectedProduct.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('products').insert([productData]);
                if (error) throw error;
            }
            setShowAddModal(false);
            fetchProducts();
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (event) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                return; // User cancelled
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `product-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to Supabase Storage - using 'product-images' bucket
            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            if (data) {
                setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
            }

        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Products</h1>
                    <p className="text-slate-500 text-sm mt-1">Real database inventory</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/admin/products/addproducts')} className="px-4 py-2 bg-[#4ec5c1] text-white rounded-xl text-sm font-medium hover:bg-[#3ea09d] flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Product
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                </div>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                    {dynamicCategories.map(cat => <option key={cat} value={cat} className="capitalize">{cat}</option>)}
                </select>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 uppercase text-[10px] font-bold text-slate-500 tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Rent</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading && products.length === 0 ? (
                            <tr><td colSpan="7" className="px-6 py-12 text-center text-slate-400">Loading...</td></tr>
                        ) : filteredProducts.length === 0 ? (
                            <tr><td colSpan="7" className="px-6 py-12 text-center text-slate-400">No products found.</td></tr>
                        ) : paginatedProducts.map((p) => {
                            const status = getStatusBadge(p);
                            return (
                                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <img
                                            src={p.image || 'https://via.placeholder.com/150?text=No+Image'}
                                            className="w-10 h-10 rounded-lg object-cover"
                                            onError={(e) => { e.target.src = 'https://placehold.co/150?text=Error'; }}
                                        />
                                        <span className="text-sm font-medium text-slate-800 truncate max-w-[150px]">{p.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{p.category}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">₹{p.price.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">₹{p.rentPrice}/d</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{p.stock}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${status.style}`}>{status.label}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => {
                                                navigate('/admin/products/addproducts', { state: { productToEdit: p } });
                                            }} className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-500 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl w-full max-w-xl p-8 overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-800">{isEditing ? 'Edit Product' : 'Add Product'}</h2>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-6 h-6 text-slate-400" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Product Name</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm">
                                        {APP_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Availability</label>
                                    <select
                                        value={formData.availability_type}
                                        onChange={(e) => setFormData({ ...formData, availability_type: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm"
                                    >
                                        <option value="both">Rent & Buy Both</option>
                                        <option value="rent">Rent Only</option>
                                        <option value="buy">Buy Only</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Original Price (₹)</label>
                                    <input type="number" value={formData.original_price} onChange={(e) => setFormData({ ...formData, original_price: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm" placeholder="M.R.P" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Buy Price (₹)</label>
                                    <input type="number" value={formData.buy_price} onChange={(e) => setFormData({ ...formData, buy_price: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Rent Price (₹)</label>
                                    <input type="number" value={formData.rent_price} onChange={(e) => setFormData({ ...formData, rent_price: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Rating (0-5)</label>
                                    <input type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Review Count</label>
                                    <input type="number" value={formData.review_count} onChange={(e) => setFormData({ ...formData, review_count: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Stock Quantity</label>
                                    <input type="number" value={formData.stock_quantity} onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm" required />
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Image URL or Upload</label>
                                    <div className="flex gap-2">
                                        <input type="text" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm" placeholder="https://..." />
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploading}
                                            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2"
                                        >
                                            <Upload className="w-4 h-4" />
                                            {uploading ? 'Uploading...' : 'Browse'}
                                        </button>
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Highlights (Comma separated)</label>
                                    <input type="text" value={formData.highlights} onChange={(e) => setFormData({ ...formData, highlights: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm" placeholder="Durable, Lightweight, Pro grade" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Sizes (Comma separated)</label>
                                    <input type="text" value={formData.sizes} onChange={(e) => setFormData({ ...formData, sizes: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm" placeholder="S, M, L, XL" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Colors (Comma separated)</label>
                                    <input type="text" value={formData.colors} onChange={(e) => setFormData({ ...formData, colors: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm" placeholder="Black, Grey, Blue" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm resize-none"></textarea>
                            </div>
                            <button type="submit" disabled={loading} className="w-full py-4 bg-[#4ec5c1] text-white rounded-2xl font-bold shadow-xl shadow-[#4ec5c1]/20 hover:bg-[#3ea09d] transition-all">
                                {loading ? 'Processing...' : isEditing ? 'Update Product' : 'Create Product'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
