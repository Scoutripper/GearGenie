import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  Clock,
  UserPlus,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import StatCard from "../../components/admin/StatCard";
import { LineChart, DonutChart } from "../../components/admin/MiniChart";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRevenue: { value: "₹0", change: "+0%", trend: "up" },
    totalOrders: { value: 0, change: "+0%", trend: "up" },
    totalUsers: { value: 0, change: "+0%", trend: "up" },
    totalProducts: { value: 0, change: "+0%", trend: "up" },
  });
  const [orders, setOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

      let dashStats = {};
      let recentOrders = [];

      if (isLocal) {
        // --- LOCAL DEVELOPMENT: Direct Supabase Queries ---
        const [usersRes, ordersRes, productsRes] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('id, total_amount, status, created_at, customer:profiles(first_name, last_name, avatar_url, email)'),
          supabase.from('products').select('*', { count: 'exact', head: true })
        ]);

        const allOrders = ordersRes.data || [];
        const totalRevenue = allOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

        dashStats = {
          totalUsers: usersRes.count || 0,
          totalProducts: productsRes.count || 0,
          totalOrders: allOrders.length,
          totalRevenue: totalRevenue
        };

        recentOrders = allOrders
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 4)
          .map(o => ({
            id: o.id,
            customer: {
              name: `${o.customer?.first_name || ""} ${o.customer?.last_name || ""}`.trim() || o.customer?.email || "User",
              profilePic: o.customer?.avatar_url || `https://ui-avatars.com/api/?name=${o.customer?.email || 'User'}`
            },
            total: o.total_amount,
            status: o.status,
            date: new Date(o.created_at).toLocaleDateString()
          }));

        // Process Revenue Trend for local
        const days = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toISOString().split('T')[0];
        }).reverse();

        const dailyRevenue = days.map(date => ({
          label: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
          value: allOrders
            .filter(o => o.created_at.startsWith(date))
            .reduce((sum, o) => sum + Number(o.total_amount || 0), 0)
        }));
        setRevenueData(dailyRevenue);

        // Process Status for local
        const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        const colors = ['#94a3b8', '#f59e0b', '#3b82f6', '#10b981', '#ef4444'];
        const distribution = statuses.map((status, i) => ({
          name: status,
          count: allOrders.filter(o => o.status === status).length,
          color: colors[i]
        })).filter(d => d.count > 0);
        setStatusData(distribution);

      } else {
        // --- PRODUCTION: Secure API Calls ---
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) throw new Error("No session");

        const response = await fetch("/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (!response.ok) throw new Error("API failure");
        const result = await response.json();
        dashStats = result.stats;
        recentOrders = result.recentOrders;
        // API handles chart data server-side or provides it in result
        if (result.revenueTrend) setRevenueData(result.revenueTrend);
        if (result.statusDistribution) setStatusData(result.statusDistribution);
      }

      setStats({
        totalUsers: { value: dashStats.totalUsers || 0, change: "+0%", trend: "up" },
        totalProducts: { value: dashStats.totalProducts || 0, change: "+0%", trend: "up" },
        totalOrders: { value: dashStats.totalOrders || 0, change: "+0%", trend: "up" },
        totalRevenue: {
          value: `₹${(dashStats.totalRevenue || 0).toLocaleString()}`,
          change: "Live",
          trend: "up"
        },
      });

      setOrders(recentOrders);

      // Fetch top selling products based on real order_items data
      const { data: orderItems } = await supabase.from("order_items").select("product_id, quantity");
      const { data: allProducts } = await supabase.from("products").select("id, name");
      if (allProducts) {
        // Count total quantity sold per product from order_items
        const salesMap = {};
        (orderItems || []).forEach(item => {
          salesMap[item.product_id] = (salesMap[item.product_id] || 0) + (item.quantity || 1);
        });
        const productsWithSales = allProducts.map(p => ({
          id: p.id,
          name: p.name,
          sales: salesMap[p.id] || 0,
        }));
        // Sort by sales descending and take top 5
        productsWithSales.sort((a, b) => b.sales - a.sales);
        setTopProducts(productsWithSales.filter(p => p.sales > 0).slice(0, 5));
      }
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      delivered: "bg-emerald-100 text-emerald-700",
      shipped: "bg-blue-100 text-blue-700",
      processing: "bg-amber-100 text-amber-700",
      pending: "bg-slate-100 text-slate-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return styles[status] || styles.pending;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time business data from Supabase.
          </p>
        </div>
        <button
          onClick={() =>
            navigate("/admin/products/addproducts")
          }
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4ec5c1] text-white rounded-xl font-medium hover:bg-[#3ea09d] transition-colors shadow-lg shadow-[#4ec5c1]/20"
        >
          <Package className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue.value}
          change={stats.totalRevenue.change}
          trend={stats.totalRevenue.trend}
          icon={DollarSign}
          gradient="teal"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.value}
          change={stats.totalOrders.change}
          trend={stats.totalOrders.trend}
          icon={ShoppingCart}
          gradient="blue"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers.value}
          change={stats.totalUsers.change}
          trend={stats.totalUsers.trend}
          icon={Users}
          gradient="purple"
        />
        <StatCard
          title="Products"
          value={stats.totalProducts.value}
          change={stats.totalProducts.change}
          trend={stats.totalProducts.trend}
          icon={Package}
          gradient="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-800">
              Revenue Overview
            </h2>
            <span className="text-xs text-slate-400">Past 7 days</span>
          </div>
          <div className="h-[250px] w-full">
            {revenueData.length > 0 ? (
              <LineChart data={revenueData} color="#4ec5c1" />
            ) : (
              <div className="h-full flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200 w-full">
                <p className="text-slate-400 text-sm">
                  {loading ? "Loading chart..." : "Insufficient data to display chart"}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-6">
            Top Selling
          </h2>
          <div className="space-y-4">
            {topProducts.length > 0 ? (
              topProducts.map((p, i) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50"
                >
                  <span className="w-6 h-6 flex items-center justify-center bg-[#4ec5c1] text-white text-[10px] font-bold rounded-full">
                    #{i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {p.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {p.sales} sales
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-12 text-slate-400 text-sm">
                No products found.
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800">
            Recent Orders
          </h2>
          <button
            onClick={() => navigate("/admin/orders")}
            className="text-sm text-[#4ec5c1] font-medium flex items-center gap-1 hover:underline"
          >
            View All <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 text-sm font-medium text-slate-800">
                      #{order.id}
                    </td>
                    <td className="py-3 items-center flex gap-2">
                      <img
                        src={order.customer.profilePic}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="text-sm text-slate-700">
                        {order.customer.name}
                      </span>
                    </td>
                    <td className="py-3 text-sm font-medium text-slate-800">
                      ₹{order.total.toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-slate-500">
                      {order.date}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-8 text-center text-slate-500 text-sm"
                  >
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
