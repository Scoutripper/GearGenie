import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Outlet
} from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { CompareProvider } from "./context/CompareContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CompareBar from "./components/CompareBar";
import Home from "./pages/Home";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import SizeGuide from "./pages/SizeGuide";
import ComingSoon from "./pages/ComingSoon";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutFlow from "./pages/CheckoutFlow";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserProfile from "./pages/UserProfile";
import AdminRoute from "./components/AdminRoute";

// Admin imports
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Main site layout component
const MainSiteLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
      <CompareBar />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <CompareProvider>
            <Router>
              <ScrollToTop />
              <Routes>
                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* Main Site Routes */}
                <Route path="/" element={<MainSiteLayout />}>
                  <Route index element={<Home />} />
                  <Route path="products" element={<ProductListing />} />
                  <Route path="rent" element={<ProductListing />} />
                  <Route path="buy" element={<ProductListing />} />
                  <Route path="trek-kits" element={<ComingSoon />} />
                  <Route path="eco-friendly" element={<ComingSoon />} />
                  <Route path="product/:id" element={<ProductDetail />} />
                  <Route path="size-guide" element={<SizeGuide />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="checkout-flow" element={<CheckoutFlow />} />
                  <Route path="login" element={<Login />} />
                  <Route path="signup" element={<Signup />} />
                  <Route path="profile" element={<UserProfile />} />
                </Route>

                {/* Fallback for safety */}
                <Route path="*" element={<Home />} />
              </Routes>
            </Router>
          </CompareProvider>
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
