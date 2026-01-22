import React, { useState } from 'react';
import {
    ClipboardList,
    Heart,
    Settings,
    LogOut,
    Upload,
    ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('Settings');
    const [settingsTab, setSettingsTab] = useState('Personal Information');

    if (!user) {
        return (
            <div className="pt-32 pb-20 text-center">
                <h2 className="text-2xl font-bold mb-4">You are not logged in</h2>
                <button
                    onClick={() => window.location.href = '/login'}
                    className="px-6 py-2 bg-[#4ec5c1] text-white rounded-lg"
                >
                    Go to Login
                </button>
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
                                    src={user.avatar}
                                    alt="Profile"
                                    className="w-40 h-40 rounded-lg object-cover bg-slate-100"
                                />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-gray-900 font-medium text-[15px] mb-2">Your avatar</h3>
                                <p className="text-gray-500 text-[13px] mb-4">PNG or JPG no bigger than 800px wide and tall.</p>
                                <button className="flex items-center gap-2 bg-[#4DB8AC] text-white px-5 py-2.5 rounded-lg text-[14px] font-medium hover:bg-[#45a89d] transition-colors">
                                    <Upload className="w-4 h-4" />
                                    Browse
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
                                    defaultValue={user.phone}
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
                                    defaultValue={user.firstName}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-[14px] focus:outline-none focus:border-[#4DB8AC] focus:ring-1 focus:ring-[#4DB8AC]"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-500 text-[13px] mb-2">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    defaultValue={user.lastName}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-[14px] focus:outline-none focus:border-[#4DB8AC] focus:ring-1 focus:ring-[#4DB8AC]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-500 text-[13px] mb-2">About Yourself</label>
                            <textarea
                                rows={5}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-[14px] resize-none focus:outline-none focus:border-[#4DB8AC] focus:ring-1 focus:ring-[#4DB8AC]"
                                placeholder=""
                            />
                        </div>

                        <button className="flex items-center gap-2 bg-[#4DB8AC] text-white px-6 py-3 rounded-lg text-[14px] font-medium hover:bg-[#45a89d] transition-colors">
                            Save Changes
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                );
            case 'Location Information':
                return (
                    <div className="space-y-6 font-[jost]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-500 text-[13px] mb-2">Address Line 1</label>
                                <input type="text" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-[14px] focus:outline-none focus:border-[#4DB8AC] focus:ring-1 focus:ring-[#4DB8AC]" />
                            </div>
                            <div>
                                <label className="block text-gray-500 text-[13px] mb-2">Address Line 2</label>
                                <input type="text" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-[14px] focus:outline-none focus:border-[#4DB8AC] focus:ring-1 focus:ring-[#4DB8AC]" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-500 text-[13px] mb-2">City</label>
                            <input type="text" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-[14px] focus:outline-none focus:border-[#4DB8AC] focus:ring-1 focus:ring-[#4DB8AC]" />
                        </div>
                        <button className="flex items-center gap-2 bg-[#4DB8AC] text-white px-6 py-3 rounded-lg text-[14px] font-medium hover:bg-[#45a89d] transition-colors">
                            Save Changes
                            <ArrowRight className="w-4 h-4" />
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

    const [wishlistTab, setWishlistTab] = useState('Treks');

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
                {wishlistTab === 'Products' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {user.wishlist && user.wishlist.length > 0 ? (
                            user.wishlist.map((item) => (
                                <div key={item.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-sm text-red-500 cursor-pointer hover:bg-red-50">
                                            <Heart className="w-4 h-4 fill-current" />
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="text-xs font-medium text-[#4ec5c1] mb-1">{item.category}</div>
                                        <h3 className="font-semibold text-slate-800 mb-2 line-clamp-1">{item.name}</h3>
                                        <div className="flex items-center justify-between mt-4">
                                            <span className="text-lg font-bold text-slate-900">{item.price}</span>
                                            <button className="px-3 py-1.5 bg-[#4ec5c1] hover:bg-[#3db0ad] text-white text-xs font-medium rounded-lg transition-colors">
                                                Add to Cart
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
        </div>
    );

    return (
        <div className="min-h-screen bg-[#E8F5F3] flex pt-20">
            <aside className="w-80 bg-white min-h-[calc(100vh-80px)] p-6 hidden lg:block">
                <nav className="space-y-1">
                    <button
                        onClick={() => setActiveTab('Booking History')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-[15px] ${activeTab === 'Booking History'
                            ? 'text-[#4DB8AC] bg-[#E8F5F3]'
                            : 'text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <ClipboardList className="w-5 h-5" />
                        <span className="font-[jost]">Booking History</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('Wishlist')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-[15px] ${activeTab === 'Wishlist'
                            ? 'text-[#4DB8AC] bg-[#E8F5F3]'
                            : 'text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Heart className="w-5 h-5" />
                        <span className="font-[jost]">Wishlist</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('Settings')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-[15px] font-medium ${activeTab === 'Settings'
                            ? 'text-[#4DB8AC] bg-[#E8F5F3]'
                            : 'text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Settings className="w-5 h-5" />
                        <span className="font-[jost]">Settings</span>
                    </button>

                    <button
                        onClick={() => {
                            logout();
                            window.location.href = '/';
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-[15px] mt-4"
                    >
                        <LogOut className="w-5 h-5 text-blue-600" />
                        <span className="font-[jost]">Logout</span>
                    </button>
                </nav>
            </aside>

            <main className="flex-1 p-8 lg:p-12">
                <div className="mb-8">
                    <h1 className="text-[32px] font-semibold text-gray-900 mb-2">{activeTab}</h1>
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
