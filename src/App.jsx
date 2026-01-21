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

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <CompareProvider>
            <Router>
              <ScrollToTop />
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
            </Router>
          </CompareProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
