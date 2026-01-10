import { createContext, useContext, useState } from 'react';

const CompareContext = createContext();

export const useCompare = () => {
    const context = useContext(CompareContext);
    if (!context) {
        throw new Error('useCompare must be used within a CompareProvider');
    }
    return context;
};

export const CompareProvider = ({ children }) => {
    const [compareItems, setCompareItems] = useState([]);
    const MAX_COMPARE_ITEMS = 4;

    const addToCompare = (product) => {
        if (compareItems.length >= MAX_COMPARE_ITEMS) {
            return false; // Can't add more than 4 items
        }
        if (compareItems.find(item => item.id === product.id)) {
            return false; // Already in compare list
        }
        setCompareItems(prev => [...prev, product]);
        return true;
    };

    const removeFromCompare = (productId) => {
        setCompareItems(prev => prev.filter(item => item.id !== productId));
    };

    const toggleCompare = (product) => {
        if (isInCompare(product.id)) {
            removeFromCompare(product.id);
        } else {
            addToCompare(product);
        }
    };

    const isInCompare = (productId) => {
        return compareItems.some(item => item.id === productId);
    };

    const clearCompare = () => {
        setCompareItems([]);
    };

    const getCompareCount = () => compareItems.length;

    const canAddMore = () => compareItems.length < MAX_COMPARE_ITEMS;

    return (
        <CompareContext.Provider value={{
            compareItems,
            addToCompare,
            removeFromCompare,
            toggleCompare,
            isInCompare,
            clearCompare,
            getCompareCount,
            canAddMore,
            MAX_COMPARE_ITEMS
        }}>
            {children}
        </CompareContext.Provider>
    );
};
