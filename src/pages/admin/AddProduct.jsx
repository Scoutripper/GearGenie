import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, X, ArrowLeft, ChevronDown, ChevronUp, Trash2, Package, Plus, Pencil } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { generateSKU, generateVariants } from '../../utils/variantHelpers';

const AddProduct = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [showVariantTable, setShowVariantTable] = useState(true);

    // Form state matching our schema
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        subcategory: '',
        buy_price: '',
        original_price: '',
        rent_price: '',
        stock_quantity: 10,
        description: '',
        images: [], // General/Global images
        colorImages: {}, // { "Red": [url1, url2], "Blue": [url3] }
        availability_type: 'both',
        sizes: '',
        colors: '',
        highlights: '',
        variants: [], // Array of variant objects
    });

    // Load product for editing
    useEffect(() => {
        if (location.state?.productToEdit) {
            const p = location.state.productToEdit;
            setIsEditing(true);
            setEditId(p.id);
            setFormData({
                name: p.name || '',
                category: p.category || 'Footwear',
                buy_price: p.buy_price || '',
                original_price: p.original_price || '',
                rent_price: p.rent_price || '',
                stock_quantity: p.stock_quantity || 0,
                description: p.description || '',
                images: p.images || [],
                colorImages: p.specifications?.color_images || {},
                availability_type: p.availability_type || 'both',
                sizes: Array.isArray(p.sizes) ? p.sizes.join(', ') : (p.sizes || ''),
                colors: Array.isArray(p.colors) ? p.colors.join(', ') : (p.colors || ''),
                highlights: Array.isArray(p.highlights) ? p.highlights.join('\n') : (p.highlights || ''),
                variants: [], // Will be loaded below
            });

            // Fetch existing variants for this product
            const fetchVariants = async () => {
                const { data, error } = await supabase
                    .from('product_variants')
                    .select('*')
                    .eq('product_id', p.id)
                    .order('color', { ascending: true });

                if (!error && data && data.length > 0) {
                    setFormData(prev => ({ ...prev, variants: data }));
                    setShowVariantTable(true);
                }
            };
            fetchVariants();
        }
    }, [location]);

    // Generate variants manually if needed
    const syncVariants = () => {
        const colors = formData.colors.split(',').map(s => s.trim()).filter(Boolean);
        const sizes = formData.sizes.split(',').map(s => s.trim()).filter(Boolean);

        if (colors.length === 0 || sizes.length === 0 || !formData.name) {
            alert("Please enter Name, Colors, and Sizes first.");
            return;
        }

        const newVariants = generateVariants(formData.name, colors, sizes, {
            rent_price: parseFloat(formData.rent_price) || 0,
            buy_price: parseFloat(formData.buy_price) || 0,
            original_price: parseFloat(formData.original_price) || 0,
            stock_quantity: parseInt(formData.stock_quantity) || 10,
            availability_type: formData.availability_type
        });

        setFormData(prev => ({ ...prev, variants: newVariants }));
        setShowVariantTable(true);
    };

    // Auto-sync when empty or for fresh products
    useEffect(() => {
        if (formData.variants.length === 0 && formData.colors && formData.sizes && formData.name) {
            syncVariants();
        }
    }, [formData.colors, formData.sizes, formData.name]);

    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    
    // Category States
    const [newCategory, setNewCategory] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [addingCategoryLoading, setAddingCategoryLoading] = useState(false);

    // Subcategory States
    const [newSubcategory, setNewSubcategory] = useState('');
    const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
    const [addingSubcategoryLoading, setAddingSubcategoryLoading] = useState(false);

    // Fetch categories from Supabase
    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name', { ascending: true });
            
            if (error) {
                console.error('Error fetching categories:', error);
            } else {
                setCategories(data || []);
            }
        };

        fetchCategories();
    }, []);

    // Fetch subcategories when category changes
    useEffect(() => {
        const fetchSubcategories = async () => {
            setSubcategories([]);
            if (!formData.category) return;

            // Find the category object to get ID
            const selectedCat = categories.find(c => c.name === formData.category);
            if (!selectedCat) return;

            const { data, error } = await supabase
                .from('subcategories')
                .select('*')
                .eq('category_id', selectedCat.id)
                .order('name', { ascending: true });

            if (error) {
                console.error('Error fetching subcategories:', error);
            } else {
                setSubcategories(data || []);
            }
        };
        fetchSubcategories();
    }, [formData.category, categories]);

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;

        try {
            setAddingCategoryLoading(true);
            const { data, error } = await supabase
                .from('categories')
                .insert([{ name: newCategory.trim() }])
                .select()
                .single();

            if (error) throw error;

            // Update local state
            setCategories(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
            setFormData(prev => ({ ...prev, category: data.name })); // Auto-select new category
            setNewCategory('');
            setIsAddingCategory(false);
        } catch (error) {
            console.error('Error adding category:', error);
            alert('Error adding category: ' + error.message);
        } finally {
            setAddingCategoryLoading(false);
        }
    };

    const handleDeleteCategory = async () => {
        if (!formData.category) return;
        const selectedCat = categories.find(c => c.name === formData.category);
        if (!selectedCat) return;

        if (!window.confirm(`Are you sure you want to delete category "${selectedCat.name}"? This will allow delete all its subcategories.`)) return;

        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', selectedCat.id);

            if (error) throw error;

            setCategories(prev => prev.filter(c => c.id !== selectedCat.id));
            setFormData(prev => ({ ...prev, category: '', subcategory: '' }));
            setSubcategories([]);
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Error deleting category: ' + error.message);
        }
    };

    const handleRenameCategory = async () => {
        if (!formData.category) return;
        const selectedCat = categories.find(c => c.name === formData.category);
        if (!selectedCat) return;

        const newName = prompt("Enter new name for category:", selectedCat.name);
        if (!newName || newName === selectedCat.name) return;

        try {
            const { error } = await supabase
                .from('categories')
                .update({ name: newName.trim() })
                .eq('id', selectedCat.id);

            if (error) throw error;

            setCategories(prev => prev.map(c => c.id === selectedCat.id ? { ...c, name: newName.trim() } : c));
            setFormData(prev => ({ ...prev, category: newName.trim() }));
        } catch (error) {
            console.error('Error renaming category:', error);
            alert('Error renaming category: ' + error.message);
        }
    };

    const handleAddSubcategory = async () => {
        if (!newSubcategory.trim() || !formData.category) return;
        const selectedCat = categories.find(c => c.name === formData.category);
        if (!selectedCat) return;

        try {
            setAddingSubcategoryLoading(true);
            const { data, error } = await supabase
                .from('subcategories')
                .insert([{ category_id: selectedCat.id, name: newSubcategory.trim() }])
                .select()
                .single();

            if (error) throw error;

            setSubcategories(prev => [...prev, data]);
            setFormData(prev => ({ ...prev, subcategory: data.name }));
            setNewSubcategory('');
            setIsAddingSubcategory(false);
        } catch (error) {
            console.error('Error adding subcategory:', error);
            alert('Error adding subcategory: ' + error.message);
        } finally {
            setAddingSubcategoryLoading(false);
        }
    };

    const handleDeleteSubcategory = async () => {
        if (!formData.subcategory) return;
        const selectedSub = subcategories.find(s => s.name === formData.subcategory);
        if (!selectedSub) return;

        if (!window.confirm(`Delete subcategory "${selectedSub.name}"?`)) return;

        try {
            const { error } = await supabase
                .from('subcategories')
                .delete()
                .eq('id', selectedSub.id);

            if (error) throw error;

            setSubcategories(prev => prev.filter(s => s.id !== selectedSub.id));
            setFormData(prev => ({ ...prev, subcategory: '' }));
        } catch (error) {
            console.error('Error deleting subcategory:', error);
            alert('Error deleting subcategory: ' + error.message);
        }
    };

    const handleRenameSubcategory = async () => {
        if (!formData.subcategory) return;
        const selectedSub = subcategories.find(s => s.name === formData.subcategory);
        if (!selectedSub) return;

        const newName = prompt("Enter new name for subcategory:", selectedSub.name);
        if (!newName || newName === selectedSub.name) return;

        try {
            const { error } = await supabase
                .from('subcategories')
                .update({ name: newName.trim() })
                .eq('id', selectedSub.id);

            if (error) throw error;

            setSubcategories(prev => prev.map(s => s.id === selectedSub.id ? { ...s, name: newName.trim() } : s));
            setFormData(prev => ({ ...prev, subcategory: newName.trim() }));
        } catch (error) {
            console.error('Error renaming subcategory:', error);
            alert('Error renaming subcategory: ' + error.message);
        }
    };


    const handleColorImageUpload = async (event, colorKey) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) return;

            const files = Array.from(event.target.files);
            const newImages = [];

            for (const file of files) {
                const fileExt = file.name.split('.').pop();
                const fileName = `product-${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('product-images')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(filePath);

                if (data) newImages.push(data.publicUrl);
            }

            if (colorKey === 'general') {
                setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    colorImages: {
                        ...prev.colorImages,
                        [colorKey]: [...(prev.colorImages[colorKey] || []), ...newImages]
                    }
                }));
            }

        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveColorImage = (indexToRemove, colorKey) => {
        if (colorKey === 'general') {
            setFormData(prev => ({
                ...prev,
                images: prev.images.filter((_, index) => index !== indexToRemove)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                colorImages: {
                    ...prev.colorImages,
                    [colorKey]: prev.colorImages[colorKey].filter((_, index) => index !== indexToRemove)
                }
            }));
        }
    };

    // Update a single variant field
    const handleVariantChange = (index, field, value) => {
        setFormData(prev => {
            const updated = [...prev.variants];
            updated[index] = { ...updated[index], [field]: value };
            // Auto-toggle in_stock based on stock_quantity
            if (field === 'stock_quantity') {
                updated[index].in_stock = parseInt(value) > 0;
            }
            return { ...prev, variants: updated };
        });
    };

    // Remove a variant row
    const handleRemoveVariant = (index) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index)
        }));
    };

    // Apply product-level price to all variants
    const applyPriceToAll = () => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants.map(v => ({
                ...v,
                rent_price: prev.rent_price || v.rent_price,
                buy_price: prev.buy_price || v.buy_price,
                original_price: prev.original_price || v.original_price,
            }))
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            // Aggregate all images for the main 'images' column
            const generalImages = formData.images;
            const variantImages = Object.values(formData.colorImages).flat();
            const allUniqueImages = [...new Set([...generalImages, ...variantImages])];

            const productData = {
                name: formData.name,
                category: formData.category,
                subcategory: formData.subcategory,
                buy_price: parseFloat(formData.buy_price) || 0,
                original_price: parseFloat(formData.original_price) || parseFloat(formData.buy_price) || 0,
                rent_price: parseFloat(formData.rent_price) || 0,
                stock_quantity: parseInt(formData.stock_quantity) || 0,
                description: formData.description,
                availability_type: formData.availability_type,
                images: allUniqueImages,
                highlights: formData.highlights.split('\n').map(s => s.trim()).filter(s => s !== ''),
                sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s !== ''),
                colors: formData.colors.split(',').map(s => s.trim()).filter(s => s !== ''),
                specifications: {
                    color_images: formData.colorImages
                },
                in_stock: parseInt(formData.stock_quantity) > 0,
                rating: 4.5,
                review_count: 0
            };

            let productId = editId;

            if (isEditing) {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', editId);
                if (error) throw error;
            } else {
                const { data, error } = await supabase
                    .from('products')
                    .insert([productData])
                    .select()
                    .single();
                if (error) throw error;
                productId = data.id;
            }

            // --- Variant Management ---
            console.log("Submitting variants:", formData.variants);
            if (formData.variants.length > 0 && productId) {
                // If editing, delete old variants first
                if (isEditing) {
                    console.log("Deleting old variants for product:", productId);
                    const { error: deleteError } = await supabase
                        .from('product_variants')
                        .delete()
                        .eq('product_id', productId);
                    if (deleteError) {
                        console.error('Error deleting old variants:', deleteError);
                    }
                }

                // Insert all variants
                const variantsToInsert = formData.variants.map(variant => ({
                    product_id: productId,
                    sku: variant.sku,
                    color: variant.color,
                    size: variant.size,
                    variant_images: variant.variant_images || (formData.colorImages && formData.colorImages[variant.color]) || [],
                    rent_price: parseFloat(variant.rent_price) || 0,
                    buy_price: parseFloat(variant.buy_price) || 0,
                    original_price: parseFloat(variant.original_price) || 0,
                    stock_quantity: parseInt(variant.stock_quantity) || 0,
                    in_stock: parseInt(variant.stock_quantity) > 0,
                    availability_type: variant.availability_type || formData.availability_type
                }));

                console.log("Inserting variants to DB:", variantsToInsert);
                console.table(variantsToInsert);
                const { error: variantError } = await supabase
                    .from('product_variants')
                    .insert(variantsToInsert);

                if (variantError) {
                    console.error('Error inserting variants:', variantError);
                    alert('Product saved but variant error: ' + variantError.message);
                } else {
                    console.log("Variants inserted successfully");
                }
            } else {
                console.log("No variants to insert. Length:", formData.variants.length, "ProductID:", productId);
            }

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
                    <h1 className="text-2xl font-bold text-slate-800">{isEditing ? 'Edit Product' : 'Add Products'}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/admin/products')} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors">
                        Discard
                    </button>
                    <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors">
                        Save Draft
                    </button>
                    <button onClick={handleSubmit} disabled={loading} className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 flex items-center gap-2">
                        {loading ? 'Processing...' : isEditing ? 'Update Product' : 'Publish Product'}
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
                                <label className="block text-sm font-medium text-slate-700 mb-2">Highlights (One per line)</label>
                                <textarea
                                    rows={4}
                                    value={formData.highlights}
                                    onChange={e => setFormData({ ...formData, highlights: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/20 focus:border-[#4ec5c1] transition-all resize-none"
                                    placeholder="Enter each highlight on a new line&#10;• Durable&#10;• Lightweight"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Product Images */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        {/* General Images */}
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-slate-700 mb-3">General / Default Images</h3>
                            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 hover:bg-slate-50 transition-colors">
                                <input
                                    type="file"
                                    id="general-upload"
                                    onChange={(e) => handleColorImageUpload(e, 'general')}
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                />
                                {formData.images.length > 0 && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                                        {formData.images.map((img, index) => (
                                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden group border border-slate-200">
                                                <img src={img} alt="General" className="w-full h-full object-cover" />
                                                <button
                                                    onClick={() => handleRemoveColorImage(index, 'general')}
                                                    className="absolute top-1 right-1 p-1 bg-white/90 rounded-full text-red-500 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="text-center cursor-pointer" onClick={() => document.getElementById('general-upload').click()}>
                                    <div className="flex items-center justify-center gap-2 text-slate-500 hover:text-[#4ec5c1]">
                                        <Upload className="w-5 h-5" />
                                        <span className="text-sm font-medium">Add General Images</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Color Specific Images */}
                        {formData.colors.split(',').filter(c => c.trim()).map((colorRaw, i) => {
                            const color = colorRaw.trim();
                            const colorImgs = formData.colorImages[color] || [];

                            return (
                                <div key={i} className="mb-6">
                                    <h3 className="text-sm font-bold text-slate-700 mb-3">Images for {color}</h3>
                                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 hover:bg-slate-50 transition-colors">
                                        <input
                                            type="file"
                                            id={`upload-${i}`}
                                            onChange={(e) => handleColorImageUpload(e, color)}
                                            className="hidden"
                                            accept="image/*"
                                            multiple
                                        />
                                        {colorImgs.length > 0 && (
                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                                                {colorImgs.map((img, index) => (
                                                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden group border border-slate-200">
                                                        <img src={img} alt={color} className="w-full h-full object-cover" />
                                                        <button
                                                            onClick={() => handleRemoveColorImage(index, color)}
                                                            className="absolute top-1 right-1 p-1 bg-white/90 rounded-full text-red-500 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <div className="text-center cursor-pointer" onClick={() => document.getElementById(`upload-${i}`).click()}>
                                            <div className="flex items-center justify-center gap-2 text-slate-500 hover:text-[#4ec5c1]">
                                                <Upload className="w-5 h-5" />
                                                <span className="text-sm font-medium">Add {color} Images</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-800">Product Images</h2>
                            <button
                                onClick={() => {
                                    const url = prompt("Enter image URL:");
                                    if (url) setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
                                }}
                                className="text-sm font-medium text-[#4ec5c1] hover:underline"
                            >
                                Add media from URL
                            </button>
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

                            {/* Auto-generated variants info */}
                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4" />
                                        <span>{formData.variants.length} variants generated</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={syncVariants}
                                        className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 transition-colors"
                                    >
                                        Auto-Generate Grid
                                    </button>
                                </div>
                                {formData.variants.length > 0 && (
                                    <button
                                        onClick={() => setShowVariantTable(!showVariantTable)}
                                        className="flex items-center gap-1 text-sm font-medium text-[#4ec5c1] hover:text-[#3ba8a4] transition-colors"
                                    >
                                        {showVariantTable ? 'Hide' : 'Manage'} Variants
                                        {showVariantTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Variant Stock Management Table */}
                    {showVariantTable && formData.variants.length > 0 && (
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-slate-800">Variant Stock Management</h2>
                                <button
                                    onClick={applyPriceToAll}
                                    className="text-xs font-medium px-3 py-1.5 bg-[#4ec5c1]/10 text-[#4ec5c1] rounded-lg hover:bg-[#4ec5c1]/20 transition-colors"
                                >
                                    Apply Product Price to All
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-slate-50 text-left">
                                            <th className="px-3 py-2.5 rounded-l-lg text-xs font-semibold text-slate-600 uppercase">SKU</th>
                                            <th className="px-3 py-2.5 text-xs font-semibold text-slate-600 uppercase">Color</th>
                                            <th className="px-3 py-2.5 text-xs font-semibold text-slate-600 uppercase">Size</th>
                                            <th className="px-3 py-2.5 text-xs font-semibold text-slate-600 uppercase">Stock</th>
                                            <th className="px-3 py-2.5 text-xs font-semibold text-slate-600 uppercase">Rent ₹</th>
                                            <th className="px-3 py-2.5 text-xs font-semibold text-slate-600 uppercase">Buy ₹</th>
                                            <th className="px-3 py-2.5 text-xs font-semibold text-slate-600 uppercase">MRP ₹</th>
                                            <th className="px-3 py-2.5 rounded-r-lg text-xs font-semibold text-slate-600 uppercase"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {formData.variants.map((variant, index) => (
                                            <tr key={`${variant.color}-${variant.size}-${index}`} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-3 py-2.5">
                                                    <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                                        {variant.sku}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2.5 font-medium text-slate-700">{variant.color}</td>
                                                <td className="px-3 py-2.5 font-medium text-slate-700">{variant.size}</td>
                                                <td className="px-3 py-2.5">
                                                    <input
                                                        type="number"
                                                        value={variant.stock_quantity}
                                                        onChange={e => handleVariantChange(index, 'stock_quantity', e.target.value)}
                                                        className="w-16 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#4ec5c1]/30 focus:border-[#4ec5c1]"
                                                        min="0"
                                                    />
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <input
                                                        type="number"
                                                        value={variant.rent_price}
                                                        onChange={e => handleVariantChange(index, 'rent_price', e.target.value)}
                                                        className="w-20 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#4ec5c1]/30 focus:border-[#4ec5c1]"
                                                        min="0"
                                                    />
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <input
                                                        type="number"
                                                        value={variant.buy_price}
                                                        onChange={e => handleVariantChange(index, 'buy_price', e.target.value)}
                                                        className="w-20 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#4ec5c1]/30 focus:border-[#4ec5c1]"
                                                        min="0"
                                                    />
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <input
                                                        type="number"
                                                        value={variant.original_price}
                                                        onChange={e => handleVariantChange(index, 'original_price', e.target.value)}
                                                        className="w-20 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:ring-1 focus:ring-[#4ec5c1]/30 focus:border-[#4ec5c1]"
                                                        min="0"
                                                    />
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <button
                                                        onClick={() => handleRemoveVariant(index)}
                                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
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
                                <div className="flex gap-2">
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/20 focus:border-[#4ec5c1] transition-all"
                                    >
                                        <option value="" disabled>Select a category</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingCategory(!isAddingCategory)}
                                        className={`p-3 border border-slate-200 rounded-xl hover:bg-slate-200 transition-colors text-slate-600 ${isAddingCategory ? 'bg-slate-200' : 'bg-slate-100'}`}
                                        title="Add new category"
                                    >
                                        {isAddingCategory ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                    </button>
                                    {formData.category && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={handleRenameCategory}
                                                className="p-3 bg-slate-100 border border-slate-200 rounded-xl hover:bg-slate-200 transition-colors text-slate-600"
                                                title="Rename category"
                                            >
                                                <Pencil className="w-5 h-5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleDeleteCategory}
                                                className="p-3 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors text-red-500"
                                                title="Delete category"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                </div>
                                {isAddingCategory && (
                                    <div className="mt-3 flex gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <input
                                            type="text"
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                            placeholder="New Category Name"
                                            className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/20 focus:border-[#4ec5c1] text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddCategory}
                                            disabled={addingCategoryLoading}
                                            className="px-4 py-2 bg-[#4ec5c1] text-white font-medium rounded-xl hover:bg-[#3ba8a4] transition-colors text-sm whitespace-nowrap"
                                        >
                                            {addingCategoryLoading ? 'Adding...' : 'Add'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Subcategory Section */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Sub Category</label>
                                <div className="flex gap-2">
                                    <select
                                        value={formData.subcategory}
                                        onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                                        disabled={!formData.category} // Disable if no category selected
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/20 focus:border-[#4ec5c1] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="" disabled>Select a sub category</option>
                                        {subcategories.map(s => (
                                            <option key={s.id} value={s.name}>{s.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingSubcategory(!isAddingSubcategory)}
                                        disabled={!formData.category}
                                        className={`p-3 border border-slate-200 rounded-xl transition-colors text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed ${isAddingSubcategory ? 'bg-slate-200' : 'bg-slate-100 hover:bg-slate-200'}`}
                                        title="Add new subcategory"
                                    >
                                        {isAddingSubcategory ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                    </button>
                                    {formData.subcategory && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={handleRenameSubcategory}
                                                className="p-3 bg-slate-100 border border-slate-200 rounded-xl hover:bg-slate-200 transition-colors text-slate-600"
                                                title="Rename subcategory"
                                            >
                                                <Pencil className="w-5 h-5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleDeleteSubcategory}
                                                className="p-3 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors text-red-500"
                                                title="Delete subcategory"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                </div>
                                {isAddingSubcategory && (
                                    <div className="mt-3 flex gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <input
                                            type="text"
                                            value={newSubcategory}
                                            onChange={(e) => setNewSubcategory(e.target.value)}
                                            placeholder="New Subcategory Name"
                                            className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4ec5c1]/20 focus:border-[#4ec5c1] text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddSubcategory}
                                            disabled={addingSubcategoryLoading}
                                            className="px-4 py-2 bg-[#4ec5c1] text-white font-medium rounded-xl hover:bg-[#3ba8a4] transition-colors text-sm whitespace-nowrap"
                                        >
                                            {addingSubcategoryLoading ? 'Adding...' : 'Add'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
