import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Load mock user from localStorage if it exists or force new identity
        const storedUser = localStorage.getItem('scoutripper_user');
        const defaultUser = {
            id: '1',
            firstName: 'Anshul',
            lastName: 'Singh',
            email: 'anshul@gmail.com',
            phone: '+91 98151 81405',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anshul',
            address: {
                line1: '123 Adventure St',
                line2: 'Trek Hills',
                city: 'Manali',
                state: 'Himachal Pradesh',
                country: 'India',
                zip: '175131'
            },
            joinedDate: 'Jan 2024',
            wishlist: [
                {
                    id: 1,
                    name: 'Quechua MH100 Camping Tent',
                    image: 'https://images.pexels.com/photos/2422265/pexels-photo-2422265.jpeg?auto=compress&cs=tinysrgb&w=600',
                    price: '₹2,499',
                    category: 'Tents'
                },
                {
                    id: 2,
                    name: 'Wildcraft Rucksack 45L',
                    image: 'https://images.pexels.com/photos/1230302/pexels-photo-1230302.jpeg?auto=compress&cs=tinysrgb&w=600',
                    price: '₹1,899',
                    category: 'Backpacks'
                },
                {
                    id: 3,
                    name: 'Trek 500 Hiking Boots',
                    image: 'https://images.pexels.com/photos/2562325/pexels-photo-2562325.jpeg?auto=compress&cs=tinysrgb&w=600',
                    price: '₹3,499',
                    category: 'Footwear'
                }
            ],
            bookings: [
                {
                    id: 'ORD-2024-001',
                    name: 'Forclaz Trek 900 Sleeping Bag',
                    image: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=600',
                    startDate: '10 Jan 2024',
                    endDate: '15 Jan 2024',
                    totalPrice: '₹1,200',
                    status: 'Completed',
                    orderDate: '05 Jan 2024'
                },
                {
                    id: 'ORD-2024-002',
                    name: 'Hiking Pole Set (Pair)',
                    image: 'https://images.pexels.com/photos/9312638/pexels-photo-9312638.jpeg?auto=compress&cs=tinysrgb&w=600',
                    startDate: '20 Feb 2024',
                    endDate: '25 Feb 2024',
                    totalPrice: '₹800',
                    status: 'Confirmed',
                    orderDate: '15 Feb 2024'
                }
            ]
        };

        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            // If it's the old user, force update to Anshul
            if (parsedUser.firstName === 'Nikhil' || parsedUser.firstName === 'Anshul') {
                setUser(defaultUser);
                localStorage.setItem('scoutripper_user', JSON.stringify(defaultUser));
            } else {
                setUser(parsedUser);
            }
        } else {
            // Default to Anshul for demonstration
            setUser(defaultUser);
            localStorage.setItem('scoutripper_user', JSON.stringify(defaultUser));
        }
    }, []);

    const login = (email, password) => {
        // Mock login logic
        const mockUser = {
            id: '1',
            firstName: 'Anshul',
            lastName: 'Singh',
            email: email || 'anshul@gmail.com',
            phone: '+91 98151 81405',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anshul',
            address: {
                line1: '123 Adventure St',
                line2: 'Trek Hills',
                city: 'Manali',
                state: 'Himachal Pradesh',
                country: 'India',
                zip: '175131'
            },
            joinedDate: 'Jan 2024'
        };
        setUser(mockUser);
        localStorage.setItem('scoutripper_user', JSON.stringify(mockUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('scoutripper_user');
    };

    const updateProfile = (updatedData) => {
        const newUser = { ...user, ...updatedData };
        setUser(newUser);
        localStorage.setItem('scoutripper_user', JSON.stringify(newUser));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
