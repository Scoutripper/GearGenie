import { useState } from 'react';
import { X, Trash2, ShoppingCart, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from './Button';

const CartSidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'rent', 'buy'

    // Filter items based on active tab
    const filteredItems = cartItems.filter((item) => {
        if (activeTab === 'all') return true;
        return item.type === activeTab;
    });

    // Get counts for each tab
    const rentCount = cartItems.filter(item => item.type === 'rent').length;
    const buyCount = cartItems.filter(item => item.type === 'buy').length;

    // Calculate totals based on FILTERED items (active tab)
    const subtotal = filteredItems.reduce((total, item) => {
        if (item.type === 'rent') {
            return total + (item.price * (item.days || 1) * item.quantity);
        }
        return total + (item.price * item.quantity);
    }, 0);

    const deposit = filteredItems.reduce((total, item) => {
        if (item.type === 'rent') {
            return total + Math.floor((item.price * (item.days || 1)) * 0.3);
        }
        return total;
    }, 0);

    const totalAmount = subtotal + deposit;

    const handleProceedToCheckout = () => {
        onClose();
        // Pass the active tab filter to checkout so only those items are processed
        navigate(`/checkout-flow?filter=${activeTab}`);
    };

    const tabs = [
        { id: 'all', label: 'All', count: cartItems.length },
        { id: 'rent', label: 'Rent', count: rentCount },
        { id: 'buy', label: 'Buy', count: buyCount },
    ];

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
                        className="fixed inset-0 bg-black/50 z-40"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-white shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <ShoppingCart className="w-6 h-6" />
                                Your Cart
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="px-6 py-3 border-b bg-slate-50">
                            <div className="flex gap-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${activeTab === tab.id
                                            ? 'bg-teal-600 text-white shadow-sm'
                                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                            }`}
                                    >
                                        {tab.label}
                                        {tab.count > 0 && (
                                            <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.id
                                                ? 'bg-white/20 text-white'
                                                : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {tab.count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Cart Items - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {filteredItems.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ShoppingCart className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <p className="text-slate-500">
                                        {activeTab === 'all'
                                            ? 'Your cart is empty'
                                            : `No ${activeTab === 'rent' ? 'rental' : 'purchase'} items`
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredItems.map((item) => (
                                        <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4">
                                            <div className="flex gap-3">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-20 h-20 object-cover rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h4 className="font-semibold text-sm">{item.name}</h4>
                                                            <span className={`inline-block px-2 py-0.5 text-xs rounded-full mt-1 ${item.type === 'rent'
                                                                ? 'bg-teal-50 text-teal-700'
                                                                : 'bg-blue-50 text-blue-700'
                                                                }`}>
                                                                {item.type === 'rent' ? 'Rent' : 'Buy'}
                                                            </span>
                                                            {item.size && (
                                                                <span className="text-xs text-slate-500 ml-2">
                                                                    {item.size}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="p-1 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    {/* Show rental dates for rental items */}
                                                    {item.type === 'rent' && item.days && (
                                                        <div className="flex items-center gap-1.5 mb-2 text-xs text-teal-700 bg-teal-50 px-2 py-1 rounded-md w-fit">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <span>
                                                                {item.startDate && item.endDate
                                                                    ? `${item.startDate} - ${item.endDate}`
                                                                    : `${item.days} days rental`
                                                                }
                                                            </span>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 border border-slate-300 rounded-lg">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                className="p-1.5 hover:bg-slate-100 rounded-l-lg"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span className="px-3 text-sm font-medium">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="p-1.5 hover:bg-slate-100 rounded-r-lg"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-semibold">
                                                                ₹{item.type === 'rent' ? item.price : item.price}
                                                                {item.type === 'rent' && <span className="text-xs text-slate-500">/day</span>}
                                                            </div>
                                                            {item.type === 'rent' && item.days && (
                                                                <div className="text-xs text-slate-500 mt-0.5">
                                                                    Total: ₹{item.price * item.days * item.quantity}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer - Pricing & Checkout */}
                        {cartItems.length > 0 && (
                            <div className="border-t p-6 bg-white">
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Subtotal</span>
                                        <span className="font-medium">₹{subtotal}</span>
                                    </div>
                                    {deposit > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">Refundable deposit</span>
                                            <span className="font-medium">₹{deposit}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                                        <span>Total</span>
                                        <span className="text-teal-600">₹{totalAmount}</span>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-500 mb-4">
                                    Deposit refunded when gear is returned in good condition
                                </p>

                                <Button
                                    onClick={handleProceedToCheckout}
                                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl"
                                >
                                    Proceed to Checkout →
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;
