import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, Share2, Calendar, ShoppingBag, Mountain, Cloud, User, Loader2 } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import ImageGallery from '../components/ImageGallery';
import Accordion from '../components/Accordion';
import Button from '../components/Button';
import Card from '../components/Card';
import RentDateModal from '../components/RentDateModal';
import { supabase } from '../supabaseClient';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [purchaseType, setPurchaseType] = useState('rent');
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [rentalDays, setRentalDays] = useState(1);
    const [isRentModalOpen, setIsRentModalOpen] = useState(false);
    const { addToCart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                if (data) {
                    const mapped = {
                        ...data,
                        rentPrice: data.rent_price,
                        buyPrice: data.buy_price,
                        reviewCount: data.review_count,
                        highlights: data.highlights || ["Durable material", "Lightweight design", "Professional grade"],
                        sizes: data.sizes || ['S', 'M', 'L', 'XL'],
                        colors: data.colors || ['Black', 'Blue', 'Grey'],
                        inStock: data.in_stock,
                    };
                    setProduct(mapped);
                    // Set initial purchase type based on availability
                    if (mapped.availability_type === 'buy') {
                        setPurchaseType('buy');
                    } else if (mapped.availability_type === 'rent') {
                        setPurchaseType('rent');
                    }
                    setSelectedSize(mapped.sizes[0]);
                    setSelectedColor(mapped.colors[0]);
                }
            } catch (err) {
                console.error("Error fetching product:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
                <p className="text-slate-500 font-medium">Loading Product Details...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Product not found</h2>
                    <Button onClick={() => navigate('/products')}>Back to Products</Button>
                </div>
            </div>
        );
    }

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Products', path: '/products' },
        { label: product.name },
    ];

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-5 h-5 ${i < Math.floor(rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-slate-300'
                    }`}
            />
        ));
    };

    const handleRentConfirm = ({ startDate, endDate, days }) => {
        addToCart({
            ...product,
            type: 'rent',
            quantity,
            size: selectedSize,
            color: selectedColor,
            days,
            startDate,
            endDate
        });
        setIsRentModalOpen(false);
    };

    const handleBuyNow = () => {
        if (product.sizes && !selectedSize) {
            alert("Please select a size.");
            return;
        }

        addToCart({
            ...product,
            type: 'buy',
            quantity,
            size: selectedSize,
            color: selectedColor
        });
    };

    const handleRentClick = () => {
        if (product.sizes && !selectedSize) {
            alert("Please select a size.");
            return;
        }
        setIsRentModalOpen(true);
    };

    const currentPrice = purchaseType === 'rent' ? product.rentPrice : product.buyPrice;
    const refundableDeposit = purchaseType === 'rent' ? Math.floor(product.buyPrice * 0.3) : 0;

    // Sample trek recommendations
    const recommendedTreks = [
        { name: 'Kedarkantha Trek', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80' },
        { name: 'Triund Trek', image: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&q=80' },
        { name: 'Hampta Pass Trek', image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=400&q=80' },
    ];

    return (
        <div className="pt-20">
            {/* Breadcrumb section matching Listing & Checkout */}
            <div className="w-full bg-[#F5F5F5] border-b mb-8">
                <div className="container px-4 sm:px-6 lg:px-8 py-3">
                    <Breadcrumb items={breadcrumbItems} />
                </div>
            </div>

            <main className="container px-4 sm:px-6 lg:px-8 pb-12">

                {/* Product Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Left: Image Gallery */}
                    <div>
                        <ImageGallery images={product.images} productName={product.name} />

                        {/* Product Details Accordion */}
                        <div className="mt-8">
                            <h2 className="text-2xl font-bold mb-4">Product Details</h2>
                            <Accordion
                                items={[
                                    {
                                        title: 'Specifications',
                                        content: (
                                            <div className="space-y-2 text-slate-600">
                                                <div className="flex justify-between py-2 border-b">
                                                    <span>Brand</span>
                                                    <span className="font-medium text-slate-900">{product.category}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b">
                                                    <span>Category</span>
                                                    <span className="font-medium text-slate-900">{product.category}</span>
                                                </div>
                                                {product.sizes && (
                                                    <div className="flex justify-between py-2 border-b">
                                                        <span>Available Sizes</span>
                                                        <span className="font-medium text-slate-900">{product.sizes.join(', ')}</span>
                                                    </div>
                                                )}
                                                {product.colors && (
                                                    <div className="flex justify-between py-2 border-b">
                                                        <span>Available Colors</span>
                                                        <span className="font-medium text-slate-900">{product.colors.join(', ')}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between py-2 border-b">
                                                    <span>Weight</span>
                                                    <span className="font-medium text-slate-900">Varies by size</span>
                                                </div>
                                            </div>
                                        ),
                                    },
                                    {
                                        title: 'Care & Usage',
                                        content: (
                                            <div className="space-y-3 text-slate-600">
                                                <div>
                                                    <h4 className="font-semibold text-slate-900 mb-2">Before Use:</h4>
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        <li>Check all zippers, buckles, and fastenings</li>
                                                        <li>Ensure the product is clean and dry</li>
                                                        <li>Read all care instructions carefully</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-slate-900 mb-2">After Use:</h4>
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        <li>Clean the product as per instructions</li>
                                                        <li>Dry completely before storage</li>
                                                        <li>Store in a cool, dry place</li>
                                                        <li>Avoid direct sunlight during storage</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-slate-900 mb-2">Washing:</h4>
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        <li>Hand wash recommended for best results</li>
                                                        <li>Use mild detergent</li>
                                                        <li>Do not bleach or iron</li>
                                                        <li>Air dry only</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        ),
                                    },
                                    {
                                        title: 'Rental Policy',
                                        content: (
                                            <div className="space-y-3 text-slate-600">
                                                <p>Our rental policy ensures you have a smooth experience:</p>
                                                <ul className="list-disc pl-5 space-y-2">
                                                    <li>
                                                        <strong>Rental Period:</strong> Minimum 3 days, can be extended based on availability
                                                    </li>
                                                    <li>
                                                        <strong>Delivery:</strong> Free delivery for orders above ₹500. Otherwise ₹50 delivery charges apply
                                                    </li>
                                                    <li>
                                                        <strong>Pickup & Return:</strong> Schedule pickup and return at your convenience within the rental period
                                                    </li>
                                                    <li>
                                                        <strong>Late Returns:</strong> ₹100/day late fee after grace period of 6 hours
                                                    </li>
                                                    <li>
                                                        <strong>Cancellation:</strong> Free cancellation up to 48 hours before rental start date
                                                    </li>
                                                    <li>
                                                        <strong>Hygiene:</strong> All items are professionally cleaned and sanitized before delivery
                                                    </li>
                                                </ul>
                                            </div>
                                        ),
                                    },
                                    {
                                        title: 'Damage & Deposit Policy',
                                        content: (
                                            <div className="space-y-3 text-slate-600">
                                                <p className="font-medium text-slate-900">
                                                    Refundable Deposit: ₹{Math.floor(product.buyPrice * 0.3)}
                                                </p>
                                                <p>
                                                    A refundable security deposit is collected to cover potential damages. This deposit is fully refundable upon return of the gear in good condition.
                                                </p>
                                                <div>
                                                    <h4 className="font-semibold text-slate-900 mb-2">Deposit Refund Timeline:</h4>
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        <li>Inspection completed within 24 hours of return</li>
                                                        <li>Deposit refunded within 3-5 business days</li>
                                                        <li>Refund processed to original payment method</li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-slate-900 mb-2">Damage Charges:</h4>
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        <li>Minor wear and tear: No charges</li>
                                                        <li>Repairable damage: Actual repair cost deducted from deposit</li>
                                                        <li>Major damage/loss: Full product value charged</li>
                                                        <li>Stains/odors: Dry cleaning charges apply (₹200-500)</li>
                                                    </ul>
                                                </div>
                                                <p className="text-sm bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                                                    <strong>Note:</strong> We recommend purchasing rental insurance for complete peace of mind. Insurance covers accidental damages up to 80% of product value.
                                                </p>
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-3">{product.name}</h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex gap-1">{renderStars(product.rating)}</div>
                            <span className="text-sm text-slate-600">
                                {product.rating} ({product.reviewCount} reviews)
                            </span>
                        </div>

                        {product.rentPrice !== undefined && product.rentPrice !== null && (product.availability_type === 'both' || !product.availability_type) && (
                            <div className="bg-slate-50 rounded-xl p-1 flex gap-1 mb-4">
                                <button
                                    onClick={() => setPurchaseType('rent')}
                                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${purchaseType === 'rent'
                                        ? 'bg-white text-teal-600 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    Rent
                                </button>
                                <button
                                    onClick={() => setPurchaseType('buy')}
                                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${purchaseType === 'buy'
                                        ? 'bg-white text-teal-600 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    Buy
                                </button>
                            </div>
                        )}

                        {/* Pricing */}
                        <Card className="mb-4 bg-gradient-to-br from-teal-50 to-white border-teal-100">
                            <div className="space-y-2">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-slate-600 text-sm">
                                        {purchaseType === 'rent' ? 'Rental Price' : 'Purchase Price'}
                                    </span>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-teal-600">
                                            ₹{Number(currentPrice || 0).toLocaleString()}
                                        </span>
                                        {purchaseType === 'rent' && (
                                            <span className="text-sm text-slate-500">/day</span>
                                        )}
                                    </div>
                                </div>

                                {purchaseType === 'rent' && (
                                    <>
                                        <div className="border-t pt-2 flex items-center justify-between text-sm">
                                            <span className="text-slate-600">Refundable Deposit</span>
                                            <span className="font-semibold text-slate-900">₹{refundableDeposit}</span>
                                        </div>

                                        <div className="border-t pt-2 flex items-center justify-between">
                                            <span className="font-semibold">Total Amount</span>
                                            <span className="text-xl font-bold text-teal-600">
                                                ₹{currentPrice * rentalDays + refundableDeposit}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </Card>

                        {/* Size Selection */}
                        {product.sizes && (
                            <div className="mb-4">
                                <h3 className="font-semibold mb-2">Select Size</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 text-sm border-2 rounded-lg transition-all font-medium ${selectedSize === size
                                                ? 'border-teal-500 bg-teal-50 text-teal-700'
                                                : 'border-slate-300 hover:border-slate-400'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Color Selection */}
                        {product.colors && (
                            <div className="mb-6">
                                <h3 className="font-semibold mb-3 text-lg">Select Color</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`px-6 py-3 border-2 rounded-xl transition-all font-medium ${selectedColor === color
                                                ? 'border-teal-500 bg-teal-50 text-teal-700'
                                                : 'border-slate-300 hover:border-slate-400'
                                                }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Primary Action Button */}
                        <Button
                            onClick={purchaseType === 'buy' ? handleBuyNow : handleRentClick}
                            className="w-full mb-3 bg-primary-500 hover:bg-teal-700 text-white py-3 rounded-xl"
                            icon={purchaseType === 'rent' ? Calendar : ShoppingBag}
                        >
                            {purchaseType === 'rent' ? 'Rent for Selected Dates' : 'Buy Now'}
                        </Button>

                        {/* Secondary Actions */}
                        <div className="grid grid-cols-2 gap-2 mb-6">
                            <button
                                onClick={() => {
                                    if (!user) {
                                        alert("Please login to add items to your wishlist.");
                                        navigate('/login');
                                        return;
                                    }
                                    toggleFavorite(product);
                                }}
                                className={`flex items-center justify-center gap-2 py-2 text-sm border-2 rounded-lg transition-colors ${isFavorite(product.id)
                                    ? 'border-red-200 bg-red-50 text-red-600'
                                    : 'border-slate-300 hover:border-slate-400 text-slate-700'
                                    }`}
                            >
                                <Heart className={`w-4 h-4 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                                <span>{isFavorite(product.id) ? 'Saved' : 'Wishlist'}</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 py-2 text-sm border-2 border-slate-300 rounded-lg hover:border-slate-400 transition-colors">
                                <Share2 className="w-4 h-4" />
                                <span>Share</span>
                            </button>
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <h3 className="font-semibold text-lg mb-2">Product Description</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Highlights */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-lg mb-2">Key Features</h3>
                            <ul className="space-y-1.5">
                                {product.highlights.map((highlight, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm">
                                        <span className="text-teal-500 mt-0.5">✓</span>
                                        <span className="text-slate-700">{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Suitability Feature Box */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <h3 className="font-semibold mb-3">Is this right for your trek?</h3>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center">
                                    <Mountain className="w-6 h-6 mx-auto mb-1.5 text-teal-600" />
                                    <div className="text-xs text-slate-500 mb-0.5">Difficulty</div>
                                    <div className="text-sm font-semibold text-slate-900">
                                        {product.difficulty?.[0] || 'Easy'}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <Cloud className="w-6 h-6 mx-auto mb-1.5 text-teal-600" />
                                    <div className="text-xs text-slate-500 mb-0.5">Weather</div>
                                    <div className="text-sm font-semibold text-slate-900">
                                        {product.weather?.join('/') || 'Rain/Dry'}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <User className="w-6 h-6 mx-auto mb-1.5 text-teal-600" />
                                    <div className="text-xs text-slate-500 mb-0.5">Experience</div>
                                    <div className="text-sm font-semibold text-slate-900">Beginner</div>
                                </div>
                            </div>
                        </div>

                        {/* Add to Cart Modal */}
                        {/* Rent Date Modal */}
                        <RentDateModal
                            isOpen={isRentModalOpen}
                            onClose={() => setIsRentModalOpen(false)}
                            product={product}
                            onConfirm={handleRentConfirm}
                        />
                    </div>
                </div>

                {/* Commonly Used on These Treks */}
                <div className="border-t pt-12">
                    <h2 className="text-3xl font-bold mb-8">Commonly Used on These Treks</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recommendedTreks.map((trek, index) => (
                            <div
                                key={index}
                                className="group cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                            >
                                <div className="aspect-video overflow-hidden">
                                    <img
                                        src={trek.image}
                                        alt={trek.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-4 bg-white">
                                    <h3 className="font-semibold text-lg text-slate-900 group-hover:text-teal-600 transition-colors">
                                        {trek.name}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* You May Also Like - Related Products */}
                <div className="border-t pt-12 mt-12">
                    <h2 className="text-3xl font-bold mb-8">You May Also Like</h2>
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-slate-500">More products coming soon from our database.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProductDetail;
