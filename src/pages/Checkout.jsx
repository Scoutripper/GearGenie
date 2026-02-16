import { useState } from 'react';
import { CreditCard, Smartphone, Wallet, Shield } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const Checkout = () => {
    const [paymentMethod, setPaymentMethod] = useState('card');

    const paymentMethods = [
        { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
        { id: 'upi', label: 'UPI', icon: Smartphone },
        { id: 'cod', label: 'Cash on Delivery', icon: Wallet },
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50">
            <div className="container max-w-5xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Details */}
                        <Card>
                            <h3 className="text-xl font-semibold mb-6">Shipping Details</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="John"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Address</label>
                                    <textarea
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        rows="3"
                                        placeholder="Street address"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">City</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="Mumbai"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">State</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="Maharashtra"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Pincode
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="400001"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Payment Method */}
                        <Card>
                            <h3 className="text-xl font-semibold mb-6">Payment Method</h3>
                            <div className="space-y-3 mb-6">
                                {paymentMethods.map((method) => {
                                    const Icon = method.icon;
                                    return (
                                        <label
                                            key={method.id}
                                            className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === method.id
                                                    ? 'border-primary-500 bg-primary-50'
                                                    : 'border-slate-200 hover:border-slate-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="payment"
                                                value={method.id}
                                                checked={paymentMethod === method.id}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="w-5 h-5 text-primary-500"
                                            />
                                            <Icon className="w-5 h-5 text-slate-600" />
                                            <span className="font-medium">{method.label}</span>
                                        </label>
                                    );
                                })}
                            </div>

                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Shield className="w-5 h-5 text-green-600" />
                                <span>Secure payment processing</span>
                            </div>
                        </Card>
                    </div>

                    {/* Order Summary (Sticky) */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24">
                            <h3 className="text-xl font-semibold mb-6">Order Summary</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex gap-3">
                                    <img
                                        src="https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=100&q=80"
                                        alt="Product"
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium line-clamp-2">
                                            Quechua Trek 100 Trekking Shoes
                                        </p>
                                        <p className="text-sm text-slate-600">Qty: 1</p>
                                        <p className="text-sm font-semibold text-primary-600">
                                            ₹3,999
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <img
                                        src="https://images.unsplash.com/photo-1544923246-77307c1b56fd?w=100&q=80"
                                        alt="Product"
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium line-clamp-2">
                                            Wildcraft Packable Down Jacket
                                        </p>
                                        <p className="text-sm text-slate-600">Rent: 5 days</p>
                                        <p className="text-sm font-semibold text-primary-600">
                                            ₹1,250
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4 space-y-2 mb-6">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span>₹5,249</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Delivery</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                                    <span>Total</span>
                                    <span className="text-primary-600">₹5,249</span>
                                </div>
                            </div>

                            <Button className="w-full">Place Order</Button>

                            <p className="text-xs text-slate-500 text-center mt-4">
                                By placing this order, you agree to our{' '}
                                <a href="#" className="text-primary-600 hover:underline">
                                    Terms & Conditions
                                </a>
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
