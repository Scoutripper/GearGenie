import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, GitCompare } from 'lucide-react';
import { Link } from 'react-router-dom';
import AddToCartModal from './AddToCartModal';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCompare } from '../context/CompareContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();
    const { toggleCompare, isInCompare, canAddMore } = useCompare();
    const [showToast, setShowToast] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isProductFavorite = isFavorite(product.id);
    const isProductInCompare = isInCompare(product.id);

    // Calculate discount percentage if originalPrice exists
    const hasOffer = product.originalPrice && product.originalPrice > product.buyPrice;
    const discountPercent = hasOffer
        ? Math.round(((product.originalPrice - product.buyPrice) / product.originalPrice) * 100)
        : 0;

    const handleAddToCart = (productData) => {
        addToCart(productData);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    const handleFavoriteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(product);
    };

    const handleCompareClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isProductInCompare && !canAddMore()) {
            return;
        }
        toggleCompare(product);
    };

    const handleAddClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsModalOpen(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group"
        >
            <Link to={`/product/${product.id}`}>
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100">
                    {/* Image Container */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-white">
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                        />

                        {/* Top Left - Discount Badge */}
                        {hasOffer && (
                            <div className="absolute top-3 left-3 bg-amber-400 text-slate-900 px-3 py-1 rounded text-xs font-bold">
                                {discountPercent}% Off
                            </div>
                        )}

                        {/* Top Right - Favorite Button */}
                        <button
                            onClick={handleFavoriteClick}
                            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all border-2 ${isProductFavorite
                                ? 'bg-red-500 border-red-500 text-white'
                                : 'bg-white/90 border-slate-200 text-slate-500 hover:border-red-400 hover:text-red-500'
                                }`}
                        >
                            <Heart className={`w-4 h-4 ${isProductFavorite ? 'fill-current' : ''}`} />
                        </button>

                        {/* Bottom Left - Rating Badge */}
                        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="font-semibold text-sm text-slate-800">
                                {product.rating}
                            </span>
                            <span className="text-slate-400 text-sm">|</span>
                            <span className="text-slate-500 text-sm">
                                {product.reviewCount >= 1000
                                    ? `${(product.reviewCount / 1000).toFixed(1)}k`
                                    : product.reviewCount
                                }
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        {/* Category */}
                        <div className="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-1">
                            {product.category}
                        </div>

                        {/* Product Name */}
                        <h3 className="font-medium text-slate-800 mb-3 line-clamp-2 text-sm leading-snug group-hover:text-teal-600 transition-colors min-h-[2 rem]">
                            {product.name}
                        </h3>

                        {/* Price Section */}
                        <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-lg font-bold text-slate-900">
                                ₹{product.buyPrice.toLocaleString()}
                            </span>
                            {hasOffer && (
                                <>
                                    <span className="text-sm text-slate-400 line-through">
                                        ₹{product.originalPrice.toLocaleString()}
                                    </span>
                                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                        {discountPercent}% Off
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Compare Checkbox Row */}
                        <button
                            onClick={handleCompareClick}
                            className={`w-full flex items-center gap-2 py-2 px-3 rounded-lg mb-3 transition-all border ${isProductInCompare
                                ? 'bg-teal-50 border-teal-200'
                                : 'bg-slate-50 border-slate-100 hover:bg-teal-50 hover:border-teal-200'
                                }`}
                        >
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${isProductInCompare
                                ? 'bg-teal-500'
                                : 'border-2 border-teal-400'
                                }`}>
                                {isProductInCompare && (
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <GitCompare className="w-4 h-4 text-teal-500" />
                            <span className="text-sm font-medium text-teal-600">Compare</span>
                        </button>

                        {/* Add to Cart Button - Teal Color */}
                        <button
                            onClick={handleAddClick}
                            className="w-full py-2.5 rounded-lg text-sm font-semibold text-white uppercase tracking-wide transition-all hover:opacity-90"
                            style={{ backgroundColor: '#4EC5C1' }}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </Link>

            {/* Add to Cart Modal */}
            <AddToCartModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={product}
                onAddToCart={handleAddToCart}
            />

            {/* Toast Notification */}
            {showToast && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="fixed bottom-4 right-4 bg-teal-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
                >
                    ✓ Added to cart!
                </motion.div>
            )}
        </motion.div>
    );
};

export default ProductCard;
