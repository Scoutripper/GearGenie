import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

    const calculateTotal = () => {
        return getCartTotal();
    };

    const subtotal = calculateTotal();
    const delivery = subtotal > 500 ? 0 : 50;
    const total = subtotal + delivery;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen pt-24 pb-12">
                <div className="container">
                    <div className="max-w-md mx-auto text-center py-20">
                        <ShoppingBag className="w-24 h-24 text-slate-300 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                        <p className="text-slate-600 mb-8">
                            Start adding some awesome trekking gear!
                        </p>
                        <Link to="/products">
                            <Button>Browse Products</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50">
            <div className="container">
                <h1 className="text-3xl md:text-4xl font-bold mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <Card key={item.id}>
                                <div className="flex gap-4">
                                    {/* Image */}
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />

                                    {/* Details */}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                                        <div className="text-sm text-slate-600 mb-2">
                                            {item.size && <span>Size: {item.size}</span>}
                                            {item.color && <span className="ml-4">Color: {item.color}</span>}
                                        </div>
                                        <div className="font-semibold text-primary-600">
                                            {item.type === 'rent' ? (
                                                <span>
                                                    ₹{item.price}/day × {item.days} days = ₹
                                                    {item.price * item.days}
                                                </span>
                                            ) : (
                                                <span>₹{item.price}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quantity & Remove */}
                                    <div className="flex flex-col items-end justify-between">
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 border border-slate-300 rounded hover:bg-slate-50"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center font-medium">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 border border-slate-300 rounded hover:bg-slate-50"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24">
                            <h3 className="text-xl font-semibold mb-6">Order Summary</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Delivery</span>
                                    <span>{delivery === 0 ? 'Free' : `₹${delivery} `}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span className="text-primary-600">₹{total}</span>
                                </div>
                            </div>

                            {delivery > 0 && (
                                <p className="text-sm text-slate-600 mb-4">
                                    Add ₹{500 - subtotal} more for free delivery
                                </p>
                            )}

                            <Link to="/checkout">
                                <Button className="w-full mb-3">Proceed to Checkout</Button>
                            </Link>

                            <Link to="/products">
                                <Button variant="secondary" className="w-full">
                                    Continue Shopping
                                </Button>
                            </Link>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
