import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, ShoppingCart, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import CartSidebar from './CartSidebar';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { getCartCount } = useCart();
    const { getFavoritesCount } = useFavorites();
    const cartCount = getCartCount();
    const favoritesCount = getFavoritesCount();
    const location = useLocation();

    // Check if we're on pages that should have transparent navbar (home, rent, buy)
    const isTransparentNavPage = location.pathname === '/' ||
        location.pathname === '/rent' ||
        location.pathname === '/buy';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Rent Gear', path: '/rent' },
        { name: 'Buy Gear', path: '/buy' },
        { name: 'Trek Kits', path: '/trek-kits' },
        { name: 'Eco-Friendly Gear', path: '/eco-friendly' }
    ];

    // Dynamic navbar classes based on page and scroll state
    const isHomePage = location.pathname === '/';

    const navbarClasses = isHomePage
        ? `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? 'bg-[#324B4C] '
            : 'bg-transparent'
        }`
        : 'fixed top-0 left-0 right-0 z-50 bg-white ';

    return (
        <>
            <nav className={navbarClasses}>
                <div className="container">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-10">
                            <Link to="/" className="flex items-center">
                                <img
                                    src={location.pathname === '/' ? "/assets/logo.png" : "/assets/logo-teal.png"}
                                    alt="Scoutripper"
                                    className="object-contain"
                                    style={{
                                        width: '140px',
                                        height: isHomePage ? '40px' : '48px',
                                        objectPosition: 'left'
                                    }}
                                />
                            </Link>

                            {/* Desktop Navigation - Left Side */}
                            <div className="hidden md:flex items-center gap-8">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`font-normal hover:text-teal-400 transition-colors font-['Jost'] text-[15px] ${isHomePage ? 'text-white' : 'text-[#324b4c]'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Right Side Icons */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            {/* Favorites Icon */}
                            <Link
                                to="/favorites"
                                className={`p-2 rounded-full relative transition-colors ${isHomePage ? 'text-white hover:bg-white/20' : 'text-slate-900 hover:bg-gray-100'
                                    }`}
                            >
                                <Heart className="w-5 h-5" />
                                {favoritesCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {favoritesCount}
                                    </span>
                                )}
                            </Link>

                            <Link
                                to="/login"
                                className={`p-2 rounded-full transition-colors ${isHomePage ? 'text-white hover:bg-white/20' : 'text-slate-900 hover:bg-gray-100'
                                    }`}
                            >
                                <User className="w-5 h-5" />
                            </Link>
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className={`p-2 rounded-full relative transition-colors ${isHomePage ? 'text-white hover:bg-white/20' : 'text-slate-900 hover:bg-gray-100'
                                    }`}
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            <button
                                className={`md:hidden p-2 rounded-lg transition-colors ${isHomePage ? 'text-white hover:bg-white/20' : 'text-slate-900 hover:bg-gray-100'
                                    }`}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`md:hidden border-t ${isTransparentNavPage && !isScrolled
                                ? 'bg-black/80 backdrop-blur-sm'
                                : 'bg-[#324B4C]'
                                }`}
                        >
                            <div className="container py-4 space-y-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className="block py-3 px-4 text-white hover:bg-white/20 rounded-lg transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <Link
                                    to="/favorites"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-2 py-3 px-4 w-full text-left text-white hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <Heart className="w-5 h-5" />
                                    Favorites
                                    {favoritesCount > 0 && (
                                        <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {favoritesCount}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Cart Sidebar */}
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />


        </>
    );
};

export default Navbar;
