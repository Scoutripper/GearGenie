import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import FloatingInput from "../components/FloatingInput";

function Login() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Redirect based on user role after successful login
  useEffect(() => {
    if (loginSuccess && !loading && user) {
      if (user.role === 'admin') {
        console.log("Login success - Admin user, navigating to admin dashboard");
        navigate("/admin");
      } else {
        console.log("Login success - Regular user, navigating to home");
        navigate("/");
      }
    }
  }, [loginSuccess, loading, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(null); // Clear error on input change
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    setLoginSuccess(false);

    try {
      await login(formData.email, formData.password);
      setLoginSuccess(true);
    } catch (error) {
      console.error("Login failed:", error.message);
      // User-friendly error messages
      if (error.message.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please try again.");
      } else if (error.message.includes("Email not confirmed")) {
        setError("Please verify your email before logging in.");
      } else {
        setError(error.message || "Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Handle Google sign-in logic here
    console.log("Google sign-in clicked");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#d4f7f1" }}>
      {/* Main Login Section */}
      <section className="pt-48 pb-20 min-h-screen flex items-center">
        <div className="mx-auto px-4 sm:px-6 w-full" style={{ maxWidth: "681px" }}>
          {/* Form Card */}
          <div
            className="bg-white rounded-lg shadow-sm p-8 md:p-10"
            style={{ fontFamily: "Jost, sans-serif" }}
          >
            {/* Header */}
            <h1
              className="mb-2"
              style={{
                fontFamily: "Jost, sans-serif",
                fontSize: "22px",
                fontWeight: "500",
                color: "#0f3d3a",
              }}
            >
              Welcome back
            </h1>
            <p className="mb-8" style={{ color: "#6b8c89", fontSize: "15px" }}>
              Don't have an account yet?{" "}
              <Link
                to="/signup"
                style={{ color: "#4ec5c1" }}
                className="hover:opacity-80 underline"
              >
                Sign up for free
              </Link>
            </p>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <FloatingInput
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                label="Email"
                style={{ width: "100%", height: "70px" }}
                required
                disabled={isLoading}
              />

              {/* Password */}
              <FloatingInput
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                label="Password"
                style={{ width: "100%", height: "70px" }}
                required
                disabled={isLoading}
              />

              {/* Forgot Password Link */}
              <div className="text-left">
                <a
                  href="#"
                  style={{ color: "#4ec5c1" }}
                  className="hover:opacity-80 text-sm font-medium underline"
                >
                  Forgot your password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{ backgroundColor: isLoading ? "#8dd9d6" : "#4ec5c1" }}
                className="w-full py-3.5 hover:opacity-90 text-white font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Login
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-grow h-px bg-slate-200"></div>
              <span className="text-slate-400 text-sm">or sign in with</span>
              <div className="flex-grow h-px bg-slate-200"></div>
            </div>

            {/* Google Button */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full py-3 border border-[#d93025] text-[#d93025] font-medium rounded hover:bg-[#d93025] hover:text-white transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>

            {/* Terms */}
            <div className="text-center mt-8">
              <p className="text-[#0f3d3a] text-[15px] leading-relaxed">
                By creating an account, you agree to our{" "}
                <a href="#" className="underline hover:opacity-80" style={{ color: "#0f3d3a" }}>
                  Terms of Service
                </a>{" "}
                and
                <br />
                <a href="#" className="underline hover:opacity-80" style={{ color: "#0f3d3a" }}>
                  Privacy Statement
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section >
    </div >
  );
}

export default Login;
