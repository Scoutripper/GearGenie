import { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

const RentDateModal = ({ isOpen, onClose, product, onConfirm }) => {
    const today = new Date();
    const oneDayLater = new Date(today);
    oneDayLater.setDate(today.getDate() + 1);

    const [startDate, setStartDate] = useState(today.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(oneDayLater.toISOString().split('T')[0]);

    const calculateRentalDays = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays || 1;
    };

    const rentalDays = calculateRentalDays();
    const totalRentPrice = product?.rentPrice ? product.rentPrice * rentalDays : 0;

    const handleConfirm = () => {
        onConfirm({ startDate, endDate, days: rentalDays });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4 border-b">
                                <h3 className="font-bold text-lg">Select Rental Dates</h3>
                                <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>

                            <div className="p-5 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Duration</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-xs text-slate-500 mb-1 block">Start Date</span>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                                <input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-xs text-slate-500 mb-1 block">End Date</span>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                                <input
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                    min={startDate}
                                                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Daily Rate</span>
                                        <span className="font-medium">₹{product?.rentPrice}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Duration</span>
                                        <span className="font-medium">{rentalDays} {rentalDays === 1 ? 'Day' : 'Days'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                                        <span className="font-bold text-slate-900">Total Price</span>
                                        <span className="font-bold text-teal-600">₹{totalRentPrice}</span>
                                    </div>
                                </div>

                                <Button onClick={handleConfirm} className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold">
                                    Confirm & Add to Cart
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default RentDateModal;
