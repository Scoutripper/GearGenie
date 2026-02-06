import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loginError, setLoginError] = useState(null);
    const isProcessingAuth = useRef(false);

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth State Change:", event);

            // Handle both initial session and sign in
            if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
                // Skip if already processing to prevent duplicate calls
                if (isProcessingAuth.current) {
                    console.log("Already processing auth, skipping...");
                    return;
                }

                isProcessingAuth.current = true;
                try {
                    await fetchProfile(session.user);
                } finally {
                    isProcessingAuth.current = false;
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                setLoading(false);
            } else if (event === 'INITIAL_SESSION' && !session) {
                // No active session
                console.log("No active session");
                setLoading(false);
            }
        });

        return () => {
            authListener?.subscription.unsubscribe();
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
            console.log("Fetching profile for:", userId);
            console.log("Starting database query...");

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

            console.log("Query completed. Data:", data, "Error:", error);

            if (error) {
                console.error('Error fetching profile:', error.message, error);
            } else if (data) {
                console.log("Profile found, setting user...");
                mapAndSetUser(data);
                console.log("User set successfully!");
            } else {
                console.log("No profile found for user");
            }
        } catch (error) {
            console.error('fetchProfile error (possibly timeout):', error.message);
        } finally {
            console.log("fetchProfile completed, setting loading to false");
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
        console.log("Attempting login...");
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

            console.log("Login successful, session:", data.session?.user?.id);

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

            console.log('Logout successful');
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

