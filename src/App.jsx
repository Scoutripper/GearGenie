import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
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
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserProfile from "./pages/UserProfile";

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
    // Scroll to top immediately with no animation
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    // Fallback for older browsers
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}

// Main site layout with Navbar and Footer
function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/rent" element={<ProductListing />} />
          <Route path="/buy" element={<ProductListing />} />
          <Route path="/trek-kits" element={<ComingSoon />} />
          <Route path="/eco-friendly" element={<ComingSoon />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout-flow" element={<CheckoutFlow />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </main>
      <Footer />
      <CompareBar />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <CompareProvider>
            <Router>
              <ScrollToTop />
              <Routes>
                {/* Admin Routes - Separate layout without main Navbar/Footer */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* Main Site Routes */}
                <Route path="/*" element={<MainLayout />} />
              </Routes>
            </Router>
          </CompareProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

