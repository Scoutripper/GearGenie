import { useState } from 'react';
import { X, GitCompare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import CompareModal from './CompareModal';

const CompareBar = () => {
    const { compareItems, removeFromCompare, clearCompare, getCompareCount } = useCompare();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();
    const count = getCompareCount();

    // Only show on product listing pages
    const allowedPaths = ['/rent', '/buy', '/products'];
    const shouldShow = allowedPaths.some(path => location.pathname.startsWith(path));

    if (count === 0 || !shouldShow) return null;

    return (
        <>
            {/* Compare Bar */}
            <AnimatePresence>
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-teal-500 shadow-2xl z-40 px-4 py-3"
                >
                    <div className="container mx-auto flex items-center justify-between gap-4">
                        {/* Left - Icon and Count */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-teal-600 font-semibold">
                                <GitCompare className="w-5 h-5" />
                                <span>Compare ({count}/4)</span>
                            </div>
                        </div>

                        {/* Center - Product Thumbnails */}
                        <div className="flex-1 flex items-center gap-2 justify-center">
                            {compareItems.map((product) => (
                                <div key={product.id} className="relative group">
                                    <img
                                        src={product.images?.[0] || product.image || 'https://placehold.co/48x48?text=N/A'}
                                        alt={product.name}
                                        className="w-12 h-12 object-cover rounded-lg border-2 border-slate-200"
                                    />
                                    <button
                                        onClick={() => removeFromCompare(product.id)}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            {/* Empty slots */}
                            {[...Array(4 - count)].map((_, i) => (
                                <div
                                    key={`empty-${i}`}
                                    className="w-12 h-12 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50"
                                />
                            ))}
                        </div>

                        {/* Right - Actions */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={clearCompare}
                                className="px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                disabled={count < 2}
                                className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${count >= 2
                                    ? 'bg-teal-500 text-white hover:bg-teal-600'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                Compare Now
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Compare Modal */}
            <CompareModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default CompareBar;
