import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within FavoritesProvider');
    }
    return context;
};

export const FavoritesProvider = ({ children }) => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);

    // Initial load from local storage (for guests)
    useEffect(() => {
        try {
            const savedFavorites = localStorage.getItem('scoutripper_favorites');
            if (savedFavorites && !user) {
                setFavorites(JSON.parse(savedFavorites));
            }
        } catch (err) {
            console.error("Error loading favorites from localStorage:", err);
        }
    }, [user]);

    // Save to local storage for guests
    useEffect(() => {
        if (!user) {
            localStorage.setItem('scoutripper_favorites', JSON.stringify(favorites));
        }
    }, [favorites, user]);

    // Sync with Supabase when logged in
    useEffect(() => {
        if (user) {
            fetchWishlist();
        }
    }, [user]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('wishlist')
                .select(`
                    product_id,
                    products (*)
                `)
                .eq('user_id', user.id);

            if (error) throw error;

            if (data) {
                const mapped = data
                    .filter(item => item.products) // Ensure product exists
                    .map(item => ({
                        ...item.products,
                        image: item.products.images?.[0] || 'https://via.placeholder.com/150',
                        price: `₹${item.products.buy_price?.toLocaleString() || 'N/A'}`
                    }));
                setFavorites(mapped);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const addToFavorites = async (product) => {
        if (favorites.some((fav) => fav.id === product.id)) return;

        if (user) {
            try {
                const { error } = await supabase
                    .from('wishlist')
                    .insert([{ user_id: user.id, product_id: product.id }]);
                if (error) throw error;
                setFavorites(prev => [...prev, product]);
            } catch (error) {
                console.error('Error adding to wishlist:', error.message);
            }
        } else {
            setFavorites(prev => [...prev, product]);
        }
    };

    const removeFromFavorites = async (productId) => {
        if (user) {
            try {
                const { error } = await supabase
                    .from('wishlist')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('product_id', productId);
                if (error) throw error;
                setFavorites(prev => prev.filter(p => p.id !== productId));
            } catch (error) {
                console.error('Error removing from wishlist:', error.message);
            }
        } else {
            setFavorites(prev => prev.filter(p => p.id !== productId));
        }
    };

    const toggleFavorite = (product) => {
        if (isFavorite(product.id)) {
            removeFromFavorites(product.id);
        } else {
            addToFavorites(product);
        }
    };

    const isFavorite = (productId) => {
        return favorites.some((fav) => fav.id === productId);
    };

    const getFavoritesCount = () => {
        return favorites.length;
    };

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                loading,
                addToFavorites,
                removeFromFavorites,
                toggleFavorite,
                isFavorite,
                getFavoritesCount,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
};
