import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import Breadcrumb from '../components/Breadcrumb';

const Favorites = () => {
    const { favorites, clearFavorites } = useFavorites();

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Favorites' },
    ];

    return (
        <div className="pt-20 pb-12 bg-white min-h-screen">
            {/* Breadcrumb section matching Listing & Checkout */}
            <div className="w-full bg-[#F5F5F5] border-b mb-8">
                <div className="container px-4 sm:px-6 lg:px-8 py-3">
                    <Breadcrumb items={breadcrumbItems} />
                </div>
            </div>

            <div className="container px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <Heart className="w-8 h-8 text-red-500 fill-current" />
                            Wishlist
                        </h1>
                        <p className="text-slate-600 mt-2">
                            {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
                        </p>
                    </div>
                    {favorites.length > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearFavorites}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear All
                        </Button>
                    )}
                </div>

                {/* Favorites Grid */}
                {favorites.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {favorites.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-12 h-12 text-slate-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">
                            No favorites yet
                        </h2>
                        <p className="text-slate-600 mb-8 max-w-md mx-auto">
                            Start exploring our amazing trekking gear and save your favorite items here for easy access later.
                        </p>
                        <Link to="/products">
                            <Button variant="primary" className="gap-2">
                                <ShoppingCart className="w-5 h-5" />
                                Browse Products
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Favorites;
