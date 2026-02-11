import { useState, useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { supabase } from '../supabaseClient';

const ProductListing = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState('popularity');
    const [filters, setFilters] = useState({
        categories: [],
        difficulty: [],
        weather: [],
        inStock: null,
        priceRange: { min: 0, max: 5000 },
        inStock: null,
        availabilityType: [],
        priceRange: { min: 0, max: 5000 },
        days: { from: 0, to: 30 },
    });

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch products from Supabase
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*');

                if (error) throw error;

                if (data && data.length > 0) {
                    // Map snake_case from DB to camelCase used by components
                    const mappedProducts = data.map(p => ({
                        ...p,
                        rentPrice: p.rent_price,
                        buyPrice: p.buy_price,
                        originalPrice: p.original_price,
                        reviewCount: p.review_count,
                        image: p.images?.[0], // Fallback for components expecting 'image'
                        inStock: p.in_stock,
                    }));
                    setProducts(mappedProducts);
                }
            } catch (err) {
                console.error("Error fetching products:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Apply filters whenever filters change
    useEffect(() => {
        let result = [...products];

        // Filter by category
        if (filters.categories.length > 0) {
            result = result.filter((product) =>
                filters.categories.some((cat) =>
                    product.category.toLowerCase().includes(cat.toLowerCase())
                )
            );
        }

        // Filter by difficulty
        if (filters.difficulty.length > 0) {
            result = result.filter((product) =>
                product.difficulty?.some((d) => filters.difficulty.includes(d))
            );
        }

        // Filter by weather
        if (filters.weather.length > 0) {
            result = result.filter((product) =>
                product.weather?.some((w) => filters.weather.includes(w))
            );
        }

        // Filter by availability (stock)
        if (filters.inStock !== null) {
            result = result.filter((product) => product.inStock === filters.inStock);
        }

        // Filter by availability type (Rent/Buy)
        if (filters.availabilityType && filters.availabilityType.length > 0) {
            result = result.filter((product) => {
                // If filtering for Rent, show Rent or Both
                const showRent = filters.availabilityType.includes('rent') && (product.availability_type === 'rent' || product.availability_type === 'both' || !product.availability_type);
                // If filtering for Buy, show Buy or Both
                const showBuy = filters.availabilityType.includes('buy') && (product.availability_type === 'buy' || product.availability_type === 'both' || !product.availability_type);

                return showRent || showBuy;
            });
        }

        // Filter by price range
        result = result.filter(
            (product) =>
                (product.rentPrice >= filters.priceRange.min &&
                    product.rentPrice <= filters.priceRange.max) ||
                (product.buyPrice >= filters.priceRange.min &&
                    product.buyPrice <= filters.priceRange.max)
        );

        // Sort products
        if (sortBy === 'price-low') {
            result.sort((a, b) => (a.rentPrice || a.buyPrice) - (b.rentPrice || b.buyPrice));
        } else if (sortBy === 'price-high') {
            result.sort((a, b) => (b.rentPrice || b.buyPrice) - (a.rentPrice || a.buyPrice));
        } else if (sortBy === 'rating') {
            result.sort((a, b) => b.rating - a.rating);
        }

        setFilteredProducts(result);
    }, [products, filters, sortBy]);

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Products' },
    ];

    return (
        <div className="pt-20 pb-8 bg-white">
            <div className="w-full bg-[#F5F5F5]">
                <div className="container px-4 sm:px-6 lg:px-8 py-3">
                    <Breadcrumb items={breadcrumbItems} />
                </div>
            </div>

            <div className="container px-4 sm:px-6 lg:px-8">

                <div className="mt-4 sm:mt-6 mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Trekking Gear</h1>
                    <p className="text-sm sm:text-base text-slate-600">
                        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} available
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-start">
                    {/* Desktop Filters */}
                    <div className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
                        <FilterSidebar
                            isOpen={true}
                            filters={filters}
                            setFilters={setFilters}
                            products={products}
                        />
                    </div>

                    {/* Products */}
                    <div className="flex-1 min-w-0">
                        {/* Products Header - aligns with filter header on desktop */}
                        <div className="hidden lg:flex items-center justify-between p-4 mb-4 bg-white border border-slate-200 rounded-xl">
                            <span className="text-base font-bold text-slate-800 uppercase tracking-wide">
                                {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''}
                            </span>
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-slate-600">Sort by:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                                >
                                    <option value="popularity">Most Popular</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Highest Rated</option>
                                </select>
                            </div>
                        </div>

                        {/* Mobile Sort & Filter */}
                        <div className="flex lg:hidden items-center justify-between mb-4 sm:mb-6">
                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="flex items-center gap-2 px-3 sm:px-4 py-2 border rounded-lg hover:bg-slate-100 text-sm sm:text-base"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                Filters
                            </button>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-2 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            >
                                <option value="popularity">Most Popular</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                            </select>
                        </div>

                        {/* Product Grid */}
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 sm:py-20">
                                <p className="text-lg sm:text-xl text-slate-500 mb-4">No products found</p>
                                <p className="text-sm sm:text-base text-slate-400">Try adjusting your filters</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Sidebar - Hidden on desktop */}
            <div className="lg:hidden">
                <FilterSidebar
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    filters={filters}
                    setFilters={setFilters}
                    products={products}
                />
            </div>
        </div>
    );
};

export default ProductListing;
