import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Calendar, MapPin, CreditCard, CheckCircle, ShieldCheck, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';

const CheckoutFlow = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { cartItems, getCartTotal } = useCart();
    const [currentStep, setCurrentStep] = useState(1); // 1: Order Summary, 2: Delivery, 3: Payment, 4: Confirmation

    // Get the filter from URL (all, rent, or buy)
    const checkoutFilter = searchParams.get('filter') || 'all';

    // Filter cart items based on checkout filter
    const checkoutItems = cartItems.filter((item) => {
        if (checkoutFilter === 'all') return true;
        return item.type === checkoutFilter;
    });

    // Scroll to top whenever step changes
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, [currentStep]);

    // Form states
    const [deliveryMethod, setDeliveryMethod] = useState('home');

    // For rent-only checkout, force pickup as the only delivery option
    useEffect(() => {
        if (checkoutFilter === 'rent') {
            setDeliveryMethod('pickup');
        }
    }, [checkoutFilter]);

    // Damage protection state
    const [isDamageProtection, setIsDamageProtection] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        city: '',
        pincode: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvv: '',
        name: '',
    });

    // Calculate totals based on filtered items only
    const rentalSubtotal = checkoutItems
        .filter((item) => item.type === 'rent')
        .reduce((total, item) => total + item.price * item.days * item.quantity, 0);
    const purchaseSubtotal = checkoutItems
        .filter((item) => item.type === 'buy')
        .reduce((total, item) => total + item.price * item.quantity, 0);
    const subtotal = rentalSubtotal + purchaseSubtotal;
    const deposit = Math.floor(rentalSubtotal * 0.3);
    const deliveryCharge = deliveryMethod === 'home' ? 99 : 0;
    const damageProtectionCost = isDamageProtection ? 99 : 0;
    const totalToPay = subtotal + deposit + deliveryCharge + damageProtectionCost;

    const steps = [
        { number: 1, title: 'Order Summary', icon: CheckCircle },
        { number: 2, title: 'Delivery', icon: MapPin },
        { number: 3, title: 'Payment', icon: CreditCard },
        { number: 4, title: 'Confirmation', icon: Check },
    ];

    const handleContinue = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        } else {
            // Handle order completion
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-white pt-20">
            {/* Header with Progress Stepper */}
            <div className="sticky top-20 z-30">
                <div className="w-full bg-[#F5F5F5] border-b">
                    <div className="container px-4 sm:px-6 lg:px-8 py-3">
                        {/* Breadcrumb Navigation */}
                        <div className="flex items-center gap-2 text-sm flex-wrap">
                            <button
                                onClick={() => navigate('/')}
                                className="text-slate-500 hover:text-teal-600 transition-colors"
                            >
                                Home
                            </button>
                            <span className="text-slate-400">&gt;</span>
                            <button
                                onClick={() => navigate(checkoutFilter === 'buy' ? '/buy' : '/rent')}
                                className="text-slate-500 hover:text-teal-600 transition-colors"
                            >
                                {checkoutFilter === 'buy' ? 'Buy Gear' : 'Rent Gear'}
                            </button>
                            {steps.map((step) => (
                                <span key={step.number} className="flex items-center gap-2">
                                    <span className="text-slate-400">&gt;</span>
                                    {step.number < currentStep ? (
                                        <button
                                            onClick={() => setCurrentStep(step.number)}
                                            className="text-slate-500 hover:text-teal-600 transition-colors"
                                        >
                                            {step.title}
                                        </button>
                                    ) : step.number === currentStep ? (
                                        <span className="text-slate-800 font-medium">
                                            {step.title}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400">
                                            {step.title}
                                        </span>
                                    )}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white border-b">
                    <div className="max-w-4xl mx-auto px-4 py-3">
                        {/* Progress Stepper */}
                        <div className="flex items-start justify-between max-w-2xl mx-auto px-8 overflow-visible">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isCompleted = currentStep > step.number;
                                const isActive = currentStep === step.number;

                                return (
                                    <div key={step.number} className="flex items-start flex-1 min-w-0">
                                        {/* Step Circle and Label */}
                                        <div className="flex flex-col items-center flex-shrink-0">
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isActive
                                                    ? 'bg-primary-500 text-white'
                                                    : isCompleted
                                                        ? 'bg-primary-500 text-white'
                                                        : 'bg-slate-100 text-slate-400'
                                                    }`}
                                            >
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span
                                                className={`text-xs mt-2 font-medium text-center whitespace-nowrap ${isActive || isCompleted ? 'text-slate-800' : 'text-slate-400'
                                                    }`}
                                            >
                                                {step.title}
                                            </span>
                                        </div>
                                        {/* Connector Line */}
                                        {index < steps.length - 1 && (
                                            <div className="flex-1 flex items-center pt-6 px-3">
                                                <div
                                                    className={`h-[2px] w-full ${isCompleted ? 'bg-teal-600' : 'bg-slate-200'
                                                        }`}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Step 1: Order Summary */}
                {currentStep === 1 && (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold">Order Summary</h1>

                        {/* Rental Items */}
                        {checkoutItems.filter((item) => item.type === 'rent').length > 0 && (
                            <div className="bg-white rounded-2xl p-6 border">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-semibold text-lg">Rental Items</h2>
                                </div>
                                <div className="space-y-4">
                                    {checkoutItems
                                        .filter((item) => item.type === 'rent')
                                        .map((item) => (
                                            <div key={item.id} className="flex gap-4">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-20 h-20 object-cover rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="font-semibold">{item.name}</h3>
                                                            <div className="text-sm text-slate-500">
                                                                Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                                                            </div>
                                                            {/* Rental Dates */}
                                                            {item.startDate && item.endDate && (
                                                                <div className="flex items-center gap-1.5 mt-1 text-xs text-teal-700 bg-teal-50 px-2 py-1 rounded-md w-fit">
                                                                    <Calendar className="w-3 h-3" />
                                                                    <span>{item.startDate} - {item.endDate}</span>
                                                                </div>
                                                            )}
                                                            <div className="text-sm text-teal-600 font-medium mt-1">
                                                                ₹{item.price}/day × {item.days} days
                                                            </div>
                                                        </div>
                                                        <div className="text-right font-semibold">
                                                            ₹{item.price * item.days * item.quantity}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                                <div className="border-t mt-4 pt-3 flex justify-between font-semibold">
                                    <span>Rental Subtotal</span>
                                    <span>₹{rentalSubtotal}</span>
                                </div>
                            </div>
                        )}

                        {/* Purchase Items */}
                        {checkoutItems.filter((item) => item.type === 'buy').length > 0 && (
                            <div className="bg-white rounded-2xl p-6 border">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-semibold text-lg">Purchase Items</h2>
                                </div>
                                <div className="space-y-4">
                                    {checkoutItems
                                        .filter((item) => item.type === 'buy')
                                        .map((item) => (
                                            <div key={item.id} className="flex gap-4">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-20 h-20 object-cover rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="font-semibold">{item.name}</h3>
                                                            <div className="text-sm text-slate-500">
                                                                Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                                                            </div>
                                                        </div>
                                                        <div className="text-right font-semibold">₹{item.price * item.quantity}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                                <div className="border-t mt-4 pt-3 flex justify-between font-semibold">
                                    <span>Purchase Subtotal</span>
                                    <span>₹{purchaseSubtotal}</span>
                                </div>
                            </div>
                        )}

                        {/* Damage Protection (Optional) - Only for rentals */}
                        {rentalSubtotal > 0 && (
                            <div className="bg-white rounded-2xl p-6 border">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="mt-1"
                                        checked={isDamageProtection}
                                        onChange={(e) => setIsDamageProtection(e.target.checked)}
                                    />
                                    <div className="flex-1">
                                        <div className="font-semibold">Add Damage Protection — ₹99</div>
                                        <div className="text-sm text-slate-600 mt-1">
                                            Covers accidental damage during your trek. You'll still need to return the gear, but you
                                            won't pay for repairs.
                                        </div>
                                    </div>
                                </label>
                            </div>
                        )}

                        {/* Price Summary */}
                        <div className="bg-white rounded-2xl p-6 border">
                            <div className="space-y-3">
                                {rentalSubtotal > 0 && (
                                    <div className="flex justify-between">
                                        <span>Rental total</span>
                                        <span>₹{rentalSubtotal}</span>
                                    </div>
                                )}
                                {purchaseSubtotal > 0 && (
                                    <div className="flex justify-between">
                                        <span>Purchase total</span>
                                        <span>₹{purchaseSubtotal}</span>
                                    </div>
                                )}
                                {deposit > 0 && (
                                    <div className="flex justify-between">
                                        <span>Refundable deposit</span>
                                        <span>₹{deposit}</span>
                                    </div>
                                )}
                                {isDamageProtection && (
                                    <div className="flex justify-between">
                                        <span>Damage Protection</span>
                                        <span>₹99</span>
                                    </div>
                                )}
                                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                                    <span>Total to pay</span>
                                    <span className="text-teal-600">₹{totalToPay}</span>
                                </div>
                            </div>
                            {deposit > 0 && (
                                <div className="text-xs text-slate-500 mt-3">
                                    ₹{deposit} deposit will be refunded when you return the gear in good condition.
                                </div>
                            )}
                        </div>

                        {/* Cancellation Policy */}
                        <div className="bg-slate-50 rounded-xl p-4 text-sm">
                            <h3 className="font-semibold mb-2">Cancellation Policy</h3>
                            <p className="text-slate-600">
                                Free cancellation up to 48 hours before pickup. After that, a ₹100 fee applies.
                            </p>
                        </div>

                        <Button onClick={handleContinue} className="w-full bg-#4EC5C1 hover:bg-teal-700 py-4 rounded-xl">
                            Continue →
                        </Button>
                    </div>
                )}

                {/* Step 2: Delivery Details */}
                {currentStep === 2 && (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold">Delivery Details</h1>

                        {/* Delivery Method */}
                        <div className="bg-white rounded-2xl p-6 border">
                            <h3 className="font-semibold mb-4">Delivery Method</h3>
                            <div className="space-y-3">
                                {/* Home Delivery - Only for purchase items, not for rent-only checkout */}
                                {checkoutFilter !== 'rent' && (
                                    <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                                        <input
                                            type="radio"
                                            name="delivery"
                                            checked={deliveryMethod === 'home'}
                                            onChange={() => setDeliveryMethod('home')}
                                            className="w-5 h-5 text-teal-600"
                                        />
                                        <div className="flex-1">
                                            <div className="font-semibold">Home Delivery</div>
                                            <div className="text-sm text-slate-600">Delivered 1 day before your trek starts</div>
                                        </div>
                                        <div className="font-semibold">₹99</div>
                                    </label>
                                )}

                                <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                                    <input
                                        type="radio"
                                        name="delivery"
                                        checked={deliveryMethod === 'pickup'}
                                        onChange={() => setDeliveryMethod('pickup')}
                                        className="w-5 h-5 text-teal-600"
                                    />
                                    <div className="flex-1">
                                        <div className="font-semibold">Store Pickup</div>
                                        <div className="text-sm text-slate-600">Pick up from our store</div>
                                    </div>
                                    <div className="font-semibold text-teal-600">Free</div>
                                </label>

                                {/* Note for rental items */}
                                {checkoutFilter === 'rent' && (
                                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-sm text-teal-700">
                                        <strong>Note:</strong> Rental items are only available for store pickup.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Delivery Form */}
                        <div className="bg-white rounded-2xl p-6 border">
                            <h3 className="font-semibold mb-4">Contact Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">First Name</label>
                                    <input
                                        type="text"
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                                {deliveryMethod === 'home' && (
                                    <>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium mb-2">Address</label>
                                            <input
                                                type="text"
                                                placeholder="Street address"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">City</label>
                                            <select
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            >
                                                <option value="">Select city</option>
                                                <option value="delhi">Delhi</option>
                                                <option value="mumbai">Mumbai</option>
                                                <option value="bangalore">Bangalore</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Pincode</label>
                                            <input
                                                type="text"
                                                placeholder="110001"
                                                value={formData.pincode}
                                                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Need Help */}
                        <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3">
                            <Phone className="w-5 h-5 text-blue-600" />
                            <div className="text-sm">
                                <span className="font-semibold">Need help?</span> Call us at{' '}
                                <a href="tel:+919876543210" className="text-blue-600 font-semibold">
                                    +91 98765 43210
                                </a>{' '}
                                (10am - 6pm)
                            </div>
                        </div>

                        <Button onClick={handleContinue} className="w-full bg-#4EC5C1 hover:bg-teal-700 py-4 rounded-xl">
                            Continue →
                        </Button>
                    </div>
                )}

                {/* Step 3: Payment */}
                {currentStep === 3 && (
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold">Payment</h1>

                        {/* Amount Summary */}
                        <div className="bg-white rounded-2xl p-6 border">
                            <div className="space-y-2 mb-4">
                                {rentalSubtotal > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Rental items</span>
                                        <span>₹{rentalSubtotal}</span>
                                    </div>
                                )}
                                {purchaseSubtotal > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Purchase items</span>
                                        <span>₹{purchaseSubtotal}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Deposit (refundable)</span>
                                    <span>₹{deposit}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                                    <span>Amount to pay</span>
                                    <span className="text-teal-600">₹{totalToPay}</span>
                                </div>
                            </div>
                        </div>

                        {/* Guest Checkout Notice
                        <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-900">
                            ✓ You can checkout as a guest — no account required
                        </div> */}

                        {/* Payment Method */}
                        <div className="bg-white rounded-2xl p-6 border">
                            <h3 className="font-semibold mb-4">Payment Method</h3>
                            <div className="space-y-3 mb-6">
                                <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer hover:bg-slate-50">
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod === 'card'}
                                        onChange={() => setPaymentMethod('card')}
                                        className="w-5 h-5 text-teal-600"
                                    />
                                    <div className="flex-1">
                                        <div className="font-semibold">Credit / Debit Card</div>
                                    </div>
                                    <CreditCard className="w-5 h-5 text-slate-400" />
                                </label>

                                <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer hover:bg-slate-50">
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod === 'upi'}
                                        onChange={() => setPaymentMethod('upi')}
                                        className="w-5 h-5 text-teal-600"
                                    />
                                    <div className="flex-1">
                                        <div className="font-semibold">UPI</div>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer hover:bg-slate-50">
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod === 'netbanking'}
                                        onChange={() => setPaymentMethod('netbanking')}
                                        className="w-5 h-5 text-teal-600"
                                    />
                                    <div className="flex-1">
                                        <div className="font-semibold">Net Banking</div>
                                    </div>
                                </label>
                            </div>

                            {/* Card Details Form */}
                            {paymentMethod === 'card' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Card Number</label>
                                        <input
                                            type="text"
                                            placeholder="1234 5678 9012 3456"
                                            value={cardDetails.number}
                                            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Expiry Date</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                value={cardDetails.expiry}
                                                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">CVV</label>
                                            <input
                                                type="text"
                                                placeholder="123"
                                                value={cardDetails.cvv}
                                                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Name on Card</label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            value={cardDetails.name}
                                            onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Security Info */}
                        <div className="bg-slate-50 rounded-xl p-4 flex items-start gap-3 text-sm">
                            <ShieldCheck className="w-5 h-5 text-slate-500 mt-0.5" />
                            <div className="text-slate-600">
                                Your payment is secured with 256-bit encryption
                            </div>
                        </div>

                        <Button onClick={handleContinue} className="w-full bg-#4EC5C1 hover:bg-teal-700 py-4 rounded-xl">
                            Pay & Confirm →
                        </Button>
                    </div>
                )}

                {/* Step 4: Confirmation */}
                {currentStep === 4 && (
                    <div className="space-y-6 text-center py-12">
                        <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
                            <Check className="w-10 h-10 text-teal-600" />
                        </div>
                        <h1 className="text-3xl font-bold">Order Confirmed!</h1>
                        <p className="text-slate-600 max-w-md mx-auto">
                            Your order has been confirmed. We'll send you a confirmation email with your order details and
                            tracking information.
                        </p>

                        <div className="bg-white rounded-2xl p-6 border max-w-md mx-auto text-left">
                            <div className="text-sm text-slate-600 mb-1">Order ID</div>
                            <div className="font-mono font-semibold text-lg">#SR{Date.now().toString().slice(-8)}</div>

                            <div className="mt-4 pt-4 border-t">
                                <div className="text-sm text-slate-600 mb-1">Total Amount</div>
                                <div className="text-2xl font-bold text-primary-500">₹{totalToPay}</div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <Button onClick={() => navigate('/')} variant="outline" className="rounded-xl">
                                Back to Home
                            </Button>
                            <Button onClick={() => navigate('/products')} className="bg-#4EC5C1 hover:bg-teal-700 rounded-xl">
                                Continue Shopping
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutFlow;
