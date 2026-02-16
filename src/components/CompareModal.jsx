import { X, Check, Minus, Star, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompare } from '../context/CompareContext';
import { Link } from 'react-router-dom';

const CompareModal = ({ isOpen, onClose }) => {
    const { compareItems, removeFromCompare, clearCompare } = useCompare();

    const specifications = [
        { key: 'weight', label: 'Weight' },
        { key: 'material', label: 'Material' },
        { key: 'waterproof', label: 'Waterproof' },
        { key: 'capacity', label: 'Capacity' },
        { key: 'warranty', label: 'Warranty' },
        { key: 'temperatureRating', label: 'Temperature Rating' },
        { key: 'bestFor', label: 'Best For' },
    ];

    const getSpecValue = (product, specKey) => {
        return product.specifications?.[specKey] || null;
    };

    const handleClearAll = () => {
        clearCompare();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-4 md:inset-8 bg-white rounded-2xl z-50 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <span className="text-teal-600">🔄</span>
                                Compare Products ({compareItems.length})
                            </h2>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleClearAll}
                                    className="px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    Clear All
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-auto p-6">
                            {/* Product Headers */}
                            <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${compareItems.length}, 1fr)` }}>
                                {/* Empty cell for spec labels */}
                                <div></div>

                                {/* Product Cards */}
                                {compareItems.map((product) => (
                                    <div key={product.id} className="text-center">
                                        <div className="relative mb-3">
                                            <img
                                                src={product.images?.[0] || product.image || 'https://placehold.co/400x200?text=No+Image'}
                                                alt={product.name}
                                                className="w-full h-40 object-cover rounded-xl"
                                            />
                                            <button
                                                onClick={() => removeFromCompare(product.id)}
                                                className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 hover:text-white p-1.5 rounded-full transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
                                        <div className="flex items-center justify-center gap-1 text-sm mb-2">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span>{product.rating}</span>
                                            <span className="text-slate-400">({product.reviewCount || 0})</span>
                                        </div>
                                        <div className="text-lg font-bold text-teal-600 mb-3">
                                            ₹{product.rentPrice}/day
                                        </div>
                                        <Link
                                            to={`/product/${product.id}`}
                                            onClick={onClose}
                                            className="inline-flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Add to Cart
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            {/* Specifications Table */}
                            <div className="mt-8">
                                <h3 className="text-lg font-bold mb-4">Specifications</h3>
                                <div className="border rounded-xl overflow-hidden">
                                    {specifications.map((spec, index) => (
                                        <div
                                            key={spec.key}
                                            className={`grid gap-4 ${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}
                                            style={{ gridTemplateColumns: `200px repeat(${compareItems.length}, 1fr)` }}
                                        >
                                            {/* Spec Label */}
                                            <div className="p-4 font-medium text-slate-700 border-r">
                                                {spec.label}
                                            </div>

                                            {/* Spec Values */}
                                            {compareItems.map((product) => {
                                                const value = getSpecValue(product, spec.key);
                                                return (
                                                    <div key={product.id} className="p-4 flex items-center gap-2">
                                                        {value ? (
                                                            <>
                                                                <Check className="w-4 h-4 text-teal-500 flex-shrink-0" />
                                                                <span className={spec.key === 'bestFor' ? 'text-teal-600' : ''}>
                                                                    {value}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Minus className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                                <span className="text-slate-400">Not specified</span>
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CompareModal;
