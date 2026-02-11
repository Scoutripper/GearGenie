import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Load cart from localStorage on init
        const savedCart = localStorage.getItem('scoutripper_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('scoutripper_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (productData) => {
        // Validation for availability type
        if (productData.availability_type === 'rent' && productData.type === 'buy') {
            alert('This product is only available for rent');
            return;
        }
        if (productData.availability_type === 'buy' && productData.type === 'rent') {
            alert('This product is only available for purchase');
            return;
        }

        const newItem = {
            id: `${productData.id}-${productData.type}-${Date.now()}`,
            productId: productData.id,
            name: productData.name,
            image: productData.images?.[0] || productData.image,
            price: productData.type === 'rent' ? productData.rentPrice : productData.buyPrice,
            type: productData.type || 'buy',
            days: productData.type === 'rent' ? (productData.days || 1) : 0,
            quantity: productData.quantity || 1,
            size: productData.size || '',
            startDate: productData.startDate || '',
            endDate: productData.endDate || '',
        };

        setCartItems((prev) => [...prev, newItem]);
    };

    const removeFromCart = (itemId) => {
        setCartItems(cartItems.filter((item) => item.id !== itemId));
    };

    const updateQuantity = (itemId, quantity) => {
        if (quantity < 1) return;
        setCartItems(
            cartItems.map((item) =>
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            const itemPrice = item.type === 'rent' ? item.price * item.days : item.price;
            return total + itemPrice * item.quantity;
        }, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartCount,
                getCartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
