import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    ClipboardList,
    Heart,
    Settings,
    LogOut,
    Upload,
    ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { supabase } from '../supabaseClient';

const UserProfile = () => {
    const { user, logout, updateProfile, loading: authLoading } = useAuth();
    const { favorites, toggleFavorite, loading: favLoading } = useFavorites();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialTab = searchParams.get('tab') || 'Settings';
    const [activeTab, setActiveTab] = useState(initialTab);
    const [settingsTab, setSettingsTab] = useState('Personal Information');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [wishlistTab, setWishlistTab] = useState('Products'); // Moved here to avoid hook error

    // Sync tab with URL
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && tab !== activeTab) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        setSearchParams({ tab: tabName });
    };

    // Form state
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.phone || '',
        about: user?.about_yourself || '',
        addressLine1: user?.address?.line1 || '',
        addressLine2: user?.address?.line2 || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        country: user?.address?.country || '',
        zipCode: user?.address?.zipCode || '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (event) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to Supabase Storage - using 'avatars' bucket
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // Get Public URL from avatars bucket
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Save to Profile
            await updateProfile({
                profilePic: publicUrl
            });

            alert('Profile picture updated!');
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            await updateProfile({
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                about_yourself: formData.about,
                address: {
                    line1: formData.addressLine1,
                    line2: formData.addressLine2,
                    city: formData.city,
                    state: formData.state,
                    country: formData.country,
                    zipCode: formData.zipCode
                }
            });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Update profile full error:', error);
            const errorMsg = error.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
            alert('Failed to update profile: ' + errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Show loading spinner while Auth is verifying
    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#E8F5F3] flex items-center justify-center pt-20">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#4DB8AC] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium font-['Jost']">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="pt-32 pb-20 text-center min-h-screen bg-[#E8F5F3]">
                <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm">
                    <h2 className="text-2xl font-bold mb-4 text-slate-800">You are not logged in</h2>
                    <p className="text-slate-500 mb-6">Please login to view your profile and bookings.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-3 bg-[#4DB8AC] text-white rounded-xl font-medium hover:bg-[#45a89d] transition-colors"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    const renderSettings = () => {
        switch (settingsTab) {
            case 'Personal Information':
                return (
                    <div className="space-y-6 font-[jost]">
                        <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-gray-200">
                            <div className="flex-shrink-0">
                                <img
                                    src={user.profilePic}
                                    alt="Profile"
                                    className="w-40 h-40 rounded-lg object-cover bg-slate-100"
                                />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-gray-900 font-medium text-[15px] mb-2">Profile Picture</h3>
                                <p className="text-gray-500 text-[13px] mb-4">PNG or JPG no bigger than 800px wide and tall.</p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="flex items-center gap-2 bg-[#4DB8AC] text-white px-5 py-2.5 rounded-lg text-[14px] font-medium hover:bg-[#45a89d] transition-colors disabled:opacity-50"
                                >
                                    <Upload className="w-4 h-4" />
                                    {uploading ? 'Uploading...' : 'Browse'}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-500 text-[13px] mb-2">Email</label>
                                <input
                                    type="email"
                                    value={user.email}
                                    readOnly
                                    className="w-full px-4 py-3 bg-[#E8F5F3] rounded-lg text-gray-900 text-[14px] cursor-not-allowed border-none"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-500 text-[13px] mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-[14px] focus:outline-none focus:border-[#4DB8AC] focus:ring-1 focus:ring-[#4DB8AC]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-500 text-[13px] mb-2">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-[14px] focus:outline-none focus:border-[#4DB8AC] focus:ring-1 focus:ring-[#4DB8AC]"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-500 text-[13px] mb-2">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-[14px] focus:outline-none focus:border-[#4DB8AC] focus:ring-1 focus:ring-[#4DB8AC]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-500 text-[13px] mb-2">About Yourself</label>
                            <textarea
                                rows={5}
                                name="about"
                                value={formData.about}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-[14px] resize-none focus:outline-none focus:border-[#4DB8AC] focus:ring-1 focus:ring-[#4DB8AC]"
                                placeholder=""
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex items-center gap-2 bg-[#4DB8AC] text-white px-6 py-3 rounded-lg text-[14px] font-medium hover:bg-[#45a89d] transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>
                );
            case 'Location Information':
                return (
                    <div className="space-y-6 font-[jost]">
                        {/* Address Line 1 - Full Width */}
                        <div>
                            <label className="block text-gray-500 text-[13px] mb-2">Address Line 1</label>
                            <input
                                type="text"
                                name="addressLine1"
                                value={formData.addressLine1}
                                onChange={handleInputChange}
                                placeholder="Address Line 1"
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-[14px] focus:outline-none focus:border-[#4DB8AC] focus:ring-1 focus:ring-[#4DB8AC]"
                            />
                        </div>

                        {/* Address Line 2 - Full Width */}
                        <div>
                            <label className="block text-gray-500 text-[13px] mb-2">Address Line 2</label>
                            <input
                                type="text"
                                name="addressLine2"
                                value={formData.addressLine2}
                                onChange={handleInputChange}
                                placeholder="Address Line 2"
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-[14px] focus:outline-none focus:border-[#4DB8AC] focus:ring-1 focus:ring-[#4DB8AC]"
                            />
                        </div>

                        {/* City and State - Side by Side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-500 text-[13px] mb-2">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="City"
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-[14px] focus:outline-none focus:border-[#4DB8AC] focus:ring-1 focus:ring-[#4DB8AC]"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-500 text-[13px] mb-2">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    placeholder="State"
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-[14px] focus:outline-none focus:border-[#4DB8AC] focus:ring-1 focus:ring-[#4DB8AC]"
                                />
                            </div>
                        </div>

                        {/* Country and ZIP Code - Side by Side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-500 text-[13px] mb-2">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    placeholder="Country"
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-[14px] focus:outline-none focus:border-[#4DB8AC] focus:ring-1 focus:ring-[#4DB8AC]"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-500 text-[13px] mb-2">ZIP Code</label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleInputChange}
                                    placeholder="ZIP Code"
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-[14px] focus:outline-none focus:border-[#4DB8AC] focus:ring-1 focus:ring-[#4DB8AC]"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex items-center gap-2 bg-[#4DB8AC] text-white px-6 py-3 rounded-lg text-[14px] font-medium hover:bg-[#45a89d] transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>
                );
            case 'Change Password':
                return (
                    <div className="space-y-6 max-w-xl font-[jost]">
                        <div>
                            <label className="block text-gray-500 text-[13px] mb-2">Current Password *</label>
                            <input type="password" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-[14px] focus:outline-none focus:border-[#4DB8AC] focus:ring-1 focus:ring-[#4DB8AC]" />
                        </div>
                        <div>
                            <label className="block text-gray-500 text-[13px] mb-2">New Password *</label>
                            <input type="password" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-[14px] focus:outline-none focus:border-[#4DB8AC] focus:ring-1 focus:ring-[#4DB8AC]" />
                        </div>
                        <div>
                            <label className="block text-gray-500 text-[13px] mb-2">Confirm Password *</label>
                            <input type="password" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-[14px] focus:outline-none focus:border-[#4DB8AC] focus:ring-1 focus:ring-[#4DB8AC]" />
                        </div>
                        <button className="flex items-center gap-2 bg-[#4DB8AC] text-white px-6 py-3 rounded-lg text-[14px] font-medium hover:bg-[#45a89d] transition-colors">
                            Save Changes
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };


    const renderBookingHistory = () => (
        <div className="bg-white rounded-lg shadow-sm font-[jost]">
            <div className="border-b border-gray-200 px-8 pt-8 pb-0">
                <button className="pb-4 border-b-2 border-[#4DB8AC] text-[#4DB8AC] font-medium text-[15px]">
                    All Booking
                </button>
            </div>

            <div className="p-8">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#E8F5F3] text-slate-800 text-[13px] font-semibold">
                                <th className="p-4 rounded-l-lg">Type</th>
                                <th className="p-4">Title</th>
                                <th className="p-4">Scheduled On</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Paid</th>
                                <th className="p-4">Payment Method</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 rounded-r-lg">Order Date</th>
                            </tr>
                        </thead>
                        <tbody className="text-[14px] text-slate-700">
                            {user.bookings && user.bookings.length > 0 ? (
                                user.bookings.map((booking) => (
                                    <tr key={booking.id} className="border-b border-gray-50 hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-medium">Treks</td>
                                        <td className="p-4 font-medium max-w-[200px]">{booking.name}</td>
                                        <td className="p-4 text-slate-500">
                                            {booking.startDate}<br />
                                            <span className="text-xs text-slate-400">, 2024</span>
                                        </td>
                                        <td className="p-4 font-semibold">{booking.totalPrice}</td>
                                        <td className="p-4 text-slate-500">₹{parseInt(booking.totalPrice.replace(/\D/g, '')) * 0.2}</td>
                                        <td className="p-4 text-slate-500 w-[150px]">
                                            Online<br />partial payment
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-[#dcfce7] text-[#166534] px-3 py-1 rounded-full text-xs font-medium">
                                                Confirmed
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-500">
                                            {booking.orderDate}<br />
                                            <span className="text-xs text-slate-400">, 2024</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="p-12 text-center text-slate-500">
                                        No bookings found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Mock */}
                <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
                    <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50">
                        &lt;
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0f3d3a] text-white font-medium">
                        1
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50">
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    );

    const renderWishlist = () => (
        <div className="bg-white rounded-lg shadow-sm font-[jost]">
            <div className="border-b border-gray-200 px-8 pt-8 pb-0">
                <div className="flex gap-8">
                    {['Products'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setWishlistTab(tab)}
                            className={`pb-4 border-b-2 font-medium text-[15px] transition-colors ${wishlistTab === tab
                                ? 'border-[#4DB8AC] text-[#4DB8AC]'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-8">
                {favLoading ? (
                    <div className="py-20 text-center text-slate-500">Loading wishlist...</div>
                ) : wishlistTab === 'Products' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites && favorites.length > 0 ? (
                            favorites.map((item) => (
                                <div key={item.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <button
                                            onClick={() => toggleFavorite(item)}
                                            className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-sm text-red-500 cursor-pointer hover:bg-red-50"
                                        >
                                            <Heart className="w-4 h-4 fill-current" />
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <div className="text-xs font-medium text-[#4ec5c1] mb-1">{item.category}</div>
                                        <h3 className="font-semibold text-slate-800 mb-2 line-clamp-1">{item.name}</h3>
                                        <div className="flex items-center justify-between mt-4">
                                            <span className="text-lg font-bold text-slate-900">{item.price}</span>
                                            <button
                                                onClick={() => navigate(`/product/${item.id}`)}
                                                className="px-3 py-1.5 bg-[#4ec5c1] hover:bg-[#3db0ad] text-white text-xs font-medium rounded-lg transition-colors"
                                            >
                                                View Product
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-slate-500 mb-2">Haven't added anything to wishlist yet, browse our <span className="font-bold text-slate-700">Products</span>.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <p className="text-slate-500 mb-2">Haven't added anything to wishlist yet, browse our <span className="font-bold text-slate-700">experiences</span>.</p>
                    </div>
                )}
            </div>
        </div >
    );

    return (
        <div className="min-h-screen bg-[#E8F5F3] flex flex-col lg:flex-row pt-20">
            {/* Mobile Tab Navigation */}
            <div className="lg:hidden bg-white border-b border-gray-200 sticky top-20 z-10 overflow-x-auto no-scrollbar">
                <div className="flex px-4 py-2 min-w-max">
                    <button
                        onClick={() => handleTabChange('Booking History')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'Booking History' ? 'bg-[#4DB8AC] text-white' : 'text-gray-600'}`}
                    >
                        <ClipboardList className="w-4 h-4" />
                        Histroy
                    </button>
                    <button
                        onClick={() => handleTabChange('Wishlist')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'Wishlist' ? 'bg-[#4DB8AC] text-white' : 'text-gray-600'}`}
                    >
                        <Heart className="w-4 h-4" />
                        Wishlist
                    </button>
                    <button
                        onClick={() => handleTabChange('Settings')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'Settings' ? 'bg-[#4DB8AC] text-white' : 'text-gray-600'}`}
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </button>
                </div>
            </div>

            <aside className="w-80 bg-white min-h-[calc(100vh-80px)] p-6 hidden lg:block">
                <nav className="space-y-1">
                    <button
                        onClick={() => handleTabChange('Booking History')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-[15px] ${activeTab === 'Booking History'
                            ? 'text-[#4DB8AC] bg-[#E8F5F3]'
                            : 'text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <ClipboardList className="w-5 h-5" />
                        <span className="font-[jost]">Booking History</span>
                    </button>

                    <button
                        onClick={() => handleTabChange('Wishlist')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-[15px] ${activeTab === 'Wishlist'
                            ? 'text-[#4DB8AC] bg-[#E8F5F3]'
                            : 'text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Heart className="w-5 h-5" />
                        <span className="font-[jost]">Wishlist</span>
                    </button>

                    <button
                        onClick={() => handleTabChange('Settings')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-[15px] font-medium ${activeTab === 'Settings'
                            ? 'text-[#4DB8AC] bg-[#E8F5F3]'
                            : 'text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Settings className="w-5 h-5" />
                        <span className="font-[jost]">Settings</span>
                    </button>

                    <button
                        onClick={async () => {
                            try {
                                await logout();
                                navigate('/');
                            } catch (error) {
                                console.error('Logout failed:', error);
                            }
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-[15px] mt-4"
                    >
                        <LogOut className="w-5 h-5 text-blue-600" />
                        <span className="font-[jost]">Logout</span>
                    </button>
                </nav>
            </aside>

            <main className="flex-1 p-4 sm:p-8 lg:p-12">
                <div className="mb-6 lg:mb-8">
                    <h1 className="text-2xl lg:text-[32px] font-semibold text-gray-900 mb-2">{activeTab}</h1>
                </div>
                {activeTab === 'Settings' && (
                    <div className="bg-white rounded-lg shadow-sm font-[jost]">
                        <div className="border-b border-gray-200">
                            <div className="flex gap-8 px-6 lg:px-8 pt-6 overflow-x-auto ">
                                {['Personal Information', 'Location Information', 'Change Password'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setSettingsTab(tab)}
                                        className={`pb-4 border-b-2 font-medium text-[15px] transition-colors whitespace-nowrap ${settingsTab === tab
                                            ? 'border-[#4DB8AC] text-[#4DB8AC]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 lg:p-8">
                            {renderSettings()}
                        </div>
                    </div>
                )}

                {activeTab === 'Booking History' && renderBookingHistory()}
                {activeTab === 'Wishlist' && renderWishlist()}
            </main>
        </div>
    );
};

export default UserProfile;
