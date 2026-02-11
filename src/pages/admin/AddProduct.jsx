import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, X, ArrowLeft } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const AddProduct = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form state matching our schema
    const [formData, setFormData] = useState({
        name: '',
        category: 'Footwear',
        buy_price: '',
        original_price: '',
        rent_price: '',
        stock_quantity: 10,
        description: '',
        image_url: '',
        availability_type: 'both',
        sizes: '',
        colors: '',
        highlights: ''
    });

    const categories = ['Footwear', 'Apparel', 'Equipment', 'Tents', 'Accessories', 'Gadgets'];

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

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const productData = {
                name: formData.name,
                category: formData.category,
                buy_price: parseFloat(formData.buy_price) || 0,
                original_price: parseFloat(formData.original_price) || parseFloat(formData.buy_price) || 0,
                rent_price: parseFloat(formData.rent_price) || 0,
                stock_quantity: parseInt(formData.stock_quantity) || 0,
                description: formData.description,
                availability_type: formData.availability_type,
                images: [formData.image_url],
                highlights: formData.highlights.split(',').map(s => s.trim()).filter(s => s !== ''),
                sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s !== ''),
                colors: formData.colors.split(',').map(s => s.trim()).filter(s => s !== ''),
                in_stock: parseInt(formData.stock_quantity) > 0,
                rating: 4.5,
                review_count: 0
            };

            const { error } = await supabase.from('products').insert([productData]);
            if (error) throw error;

            navigate('/admin/products');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin/products')} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-800">Add Products</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/admin/products')} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors">
                        Discard
                    </button>
                    <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors">
                        Save Draft
                    </button>
                    <button onClick={handleSubmit} disabled={loading} className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 flex items-center gap-2">
                        {loading ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Product Details */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-800 mb-6">Product Details</h2>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/20 focus:border-[#4ec5c1] transition-all"
                                    placeholder="Product Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Description (Optional)</label>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/20 focus:border-[#4ec5c1] transition-all resize-none"
                                    placeholder="Set a description to the product for better visibility."
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Highlights (Comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.highlights}
                                    onChange={e => setFormData({ ...formData, highlights: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/20 focus:border-[#4ec5c1] transition-all"
                                    placeholder="Durable, Lightweight..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Product Images */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-800">Product Images</h2>
                            <button
                                onClick={() => {
                                    const url = prompt("Enter image URL:");
                                    if (url) setFormData(prev => ({ ...prev, image_url: url }));
                                }}
                                className="text-sm font-medium text-[#4ec5c1] hover:underline"
                            >
                                Add media from URL
                            </button>
                        </div>

                        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                className="hidden"
                                accept="image/*"
                            />
                            {formData.image_url ? (
                                <div className="relative aspect-video w-full max-w-sm mx-auto overflow-hidden rounded-lg">
                                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, image_url: '' }); }}
                                        className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-white"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                                        <Upload className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">Drop your images here</p>
                                        <p className="text-xs text-slate-400 mt-1">PNG or JPG (max. 5MB)</p>
                                        {uploading && <p className="text-sm text-[#4ec5c1] mt-2">Uploading...</p>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Variants */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-800 mb-6">Variants</h2>
                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Sizes (Comma separated)</label>
                                    <input
                                        type="text"
                                        value={formData.sizes}
                                        onChange={e => setFormData({ ...formData, sizes: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/20 focus:border-[#4ec5c1] transition-all"
                                        placeholder="S, M, L, XL"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Colors (Comma separated)</label>
                                    <input
                                        type="text"
                                        value={formData.colors}
                                        onChange={e => setFormData({ ...formData, colors: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/20 focus:border-[#4ec5c1] transition-all"
                                        placeholder="Black, Blue, Red"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Pricing */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-800 mb-6">Pricing</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Base Price (MRP) ₹</label>
                                <input
                                    type="number"
                                    value={formData.original_price}
                                    onChange={e => setFormData({ ...formData, original_price: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/20 focus:border-[#4ec5c1] transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Discounted Price (Sell) ₹</label>
                                <input
                                    type="number"
                                    value={formData.buy_price}
                                    onChange={e => setFormData({ ...formData, buy_price: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/20 focus:border-[#4ec5c1] transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Rent Price (Per Day) ₹</label>
                                <input
                                    type="number"
                                    value={formData.rent_price}
                                    onChange={e => setFormData({ ...formData, rent_price: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/20 focus:border-[#4ec5c1] transition-all"
                                />
                            </div>
                            <div className="pt-4 border-t border-slate-100">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-sm font-medium text-slate-700">In stock</span>
                                    <div className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.stock_quantity > 0}
                                            onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.checked ? 10 : 0 })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4ec5c1]"></div>
                                    </div>
                                </label>
                                {formData.stock_quantity > 0 && (
                                    <div className="mt-2">
                                        <label className="block text-xs text-slate-500 mb-1">Quantity</label>
                                        <input
                                            type="number"
                                            value={formData.stock_quantity}
                                            onChange={e => setFormData({ ...formData, stock_quantity: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                                            placeholder="Qty"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Status / Availability */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-800 mb-6">Status</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Availability Type</label>
                                <select
                                    value={formData.availability_type}
                                    onChange={e => setFormData({ ...formData, availability_type: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/20 focus:border-[#4ec5c1] transition-all"
                                >
                                    <option value="both">Rent & Buy Both</option>
                                    <option value="rent">Rent Only</option>
                                    <option value="buy">Buy Only</option>
                                </select>
                                <p className="text-xs text-slate-500 mt-2">
                                    Set how this product can be purchased.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-800 mb-6">Categories</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/20 focus:border-[#4ec5c1] transition-all"
                                >
                                    {categories.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
