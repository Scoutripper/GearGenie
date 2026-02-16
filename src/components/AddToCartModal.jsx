import { useState } from 'react';
import { X, ShoppingBag, Calendar, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

const AddToCartModal = ({ isOpen, onClose, product, onAddToCart }) => {
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);

    // Get today's date and 1 day from now
    const today = new Date();
    const oneDayLater = new Date(today);
    oneDayLater.setDate(today.getDate() + 1);

    const [startDate, setStartDate] = useState(today.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(oneDayLater.toISOString().split('T')[0]);

    // Calculate rental days based on selected dates
    const calculateRentalDays = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays || 1;
    };

    const rentalDays = calculateRentalDays();

    const canRent = !!product.rentPrice && (product.availability_type === 'rent' || product.availability_type === 'both' || !product.availability_type);
    const canBuy = !!product.buyPrice && (product.availability_type === 'buy' || product.availability_type === 'both' || !product.availability_type);

    const rentPrice = product.rentPrice ? product.rentPrice * quantity * rentalDays : 0;
    const buyPrice = product.buyPrice * quantity;

    const handleRent = () => {
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            alert('Please select a size');
            return;
        }
        onAddToCart({
            ...product,
            type: 'rent',
            quantity,
            size: selectedSize,
            days: rentalDays,
            startDate,
            endDate,
        });
        onClose();
    };

    const handleBuy = () => {
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            alert('Please select a size');
            return;
        }
        onAddToCart({
            ...product,
            type: 'buy',
            quantity,
            size: selectedSize,
        });
        onClose();
    };

    if (!isOpen) return null;

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
                        className="fixed inset-0 bg-black/50 z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                            {/* Header */}
                            <div className="sticky top-0 bg-white border-b px-5 py-3.5 flex items-center justify-between rounded-t-2xl z-10">
                                <h2 className="text-lg font-bold">Choose an option</h2>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-5 space-y-4">
                                {/* Select Size */}
                                {product.sizes && product.sizes.length > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-medium text-slate-700">Select Size</label>
                                            <a
                                                href="/size-guide"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1"
                                            >
                                                <span>📏</span> Size Guide
                                            </a>
                                        </div>
                                        <select
                                            value={selectedSize}
                                            onChange={(e) => setSelectedSize(e.target.value)}
                                            className="w-full px-3 py-2.5 text-sm border-2 border-teal-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-700"
                                        >
                                            <option value="">Choose your size</option>
                                            {product.sizes.map((size) => (
                                                <option key={size} value={size}>
                                                    {size}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Quantity */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                                    <div className="flex items-center justify-center gap-3">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 border-2 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-10 h-10 border-2 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Rental Dates */}
                                {canRent && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Rental Dates</label>
                                        <div className="grid grid-cols-2 gap-3 mb-2">
                                            <div className="relative">
                                                <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
                                                <input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    className="w-full pl-8 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                />
                                            </div>
                                            <div className="relative">
                                                <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
                                                <input
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                    min={startDate}
                                                    className="w-full pl-8 pr-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-600 text-center">{rentalDays} days rental</p>
                                    </div>
                                )}

                                {/* Pricing Cards */}
                                <div className={canRent && canBuy ? "grid grid-cols-2 gap-3 pt-2" : "flex justify-center pt-2"}>
                                    {/* Rent Option */}
                                    {canRent && (
                                        <div className={`border-2 border-teal-500 rounded-xl p-4 bg-teal-50/30 ${!canBuy ? 'w-full max-w-sm' : ''}`}>
                                            <div className="flex items-center justify-center mb-2">
                                                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                                                    <ShoppingBag className="w-5 h-5 text-teal-600" />
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xs font-bold text-teal-700 uppercase tracking-wide mb-1.5">
                                                    RENT
                                                </div>
                                                <div className="text-2xl font-bold mb-1">₹{rentPrice}</div>
                                                <div className="text-xs text-slate-600 mb-3">
                                                    ₹{product.rentPrice}/day × {quantity} × {rentalDays}d
                                                </div>
                                                <Button
                                                    onClick={handleRent}
                                                    className="w-full bg-[#4EC5C1] hover:bg-teal-700 text-white py-2.5 text-sm rounded-lg font-semibold"
                                                >
                                                    Rent Now
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Buy Option */}
                                    {canBuy && (
                                        <div className={`border-2 rounded-xl p-4 ${canRent ? 'border-slate-300 bg-white' : 'border-teal-500 bg-teal-50/30 w-full max-w-sm'}`}>
                                            <div className="flex items-center justify-center mb-2">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${canRent ? 'bg-slate-100' : 'bg-teal-100'}`}>
                                                    <ShoppingBag className={`w-5 h-5 ${canRent ? 'text-slate-600' : 'text-teal-600'}`} />
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className={`text-xs font-bold uppercase tracking-wide mb-1.5 ${canRent ? 'text-slate-700' : 'text-teal-700'}`}>
                                                    BUY
                                                </div>
                                                <div className="text-2xl font-bold mb-1">₹{buyPrice}</div>
                                                <div className="text-xs text-slate-600 mb-3 invisible">.</div>
                                                <Button
                                                    onClick={handleBuy}
                                                    className={`w-full py-2.5 text-sm rounded-lg font-semibold ${canRent
                                                        ? 'bg-white border-2 border-slate-300 hover:bg-slate-50 text-slate-900'
                                                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                                                        }`}
                                                >
                                                    Buy Now
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AddToCartModal;
