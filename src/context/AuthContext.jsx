import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loginError, setLoginError] = useState(null);
    const isProcessingAuth = useRef(false);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // 1. Get initial session FIRST
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    await fetchProfile(session.user);
                } else {
                    setLoading(false);
                }

                // 2. Then listen for future changes
                const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {

                    if (event === 'SIGNED_IN' && session) {
                        if (isProcessingAuth.current) return;
                        isProcessingAuth.current = true;
                        try {
                            await fetchProfile(session.user);
                        } finally {
                            isProcessingAuth.current = false;
                        }
                    } else if (event === 'SIGNED_OUT') {
                        setUser(null);
                        setLoading(false);
                    }
                });

                return subscription;
            } catch (error) {
                console.error("Auth initialization error:", error);
                setLoading(false);
            }
        };

        const subscriptionPromise = initializeAuth();

        return () => {
            subscriptionPromise.then(sub => sub?.unsubscribe());
        };
    }, []);

    const fetchProfile = async (sessionOrId) => {
        if (!sessionOrId) {
            setLoading(false);
            return;
        }

        // Handle both string ID and User object
        const userId = typeof sessionOrId === 'string' ? sessionOrId : sessionOrId.id;

        if (!userId) {
            console.error("fetchProfile called with invalid ID:", sessionOrId);
            setLoading(false);
            return;
        }

        try {
            // fetching profile for userId

            // Create timeout promise
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Query timeout after 8 seconds')), 8000);
            });

            // Create query promise
            const queryPromise = supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            // Race between query and timeout
            const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

            if (error) {
                console.error('Error fetching profile:', error.message, error);
            } else if (data) {
                mapAndSetUser(data);
            }
        } catch (error) {
            console.error('fetchProfile error (possibly timeout):', error.message);
        } finally {
            setLoading(false);
        }
    };

    const mapAndSetUser = (data) => {
        setUser({
            ...data,
            firstName: data.first_name,
            lastName: data.last_name,
            profilePic: data.avatar_url || `https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y`,
            address: data.address_json
        });
    };

    const login = async (email, password) => {
        setLoginError(null);
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error("Login failed:", error);
                setLoginError(error.message);
                setLoading(false);
                throw error;
            }

            // login successful

            // Manually fetch profile after successful login
            if (data.session?.user) {
                await fetchProfile(data.session.user);
            }

            return data;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const signup = async (email, password, metadata) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: metadata.firstName,
                    last_name: metadata.lastName,
                }
            }
        });
        if (error) throw error;
        return data;
    };

    const logout = async () => {
        try {
            // Clear user state first to prevent UI from showing logged-in state
            setUser(null);
            setLoading(true);

            // Sign out with global scope to clear all sessions
            const { error } = await supabase.auth.signOut({ scope: 'global' });

            if (error) {
                console.error('Logout error:', error);
                throw error;
            }

            // logout successful
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (updatedData) => {
        if (!user) return;

        // Map camelCase back to snake_case for DB
        const dbData = {
            first_name: updatedData.firstName !== undefined ? updatedData.firstName : user.firstName,
            last_name: updatedData.lastName !== undefined ? updatedData.lastName : user.lastName,
            phone: updatedData.phone !== undefined ? updatedData.phone : user.phone,
            avatar_url: updatedData.profilePic !== undefined ? updatedData.profilePic : user.profilePic,
            about_yourself: updatedData.about_yourself !== undefined ? updatedData.about_yourself : user.about_yourself,
            address_json: updatedData.address !== undefined ? updatedData.address : user.address
        };

        const { error } = await supabase
            .from('profiles')
            .update(dbData)
            .eq('id', user.id);

        if (error) throw error;

        // Refresh local state
        await fetchProfile(user);
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginError, login, signup, logout, updateProfile }}>
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