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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get current session token
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        console.error("No session token available");
        setLoading(false);
        return;
      }

      // Call secure serverless endpoint
      const response = await fetch("/api/admin/dashboard", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const result = await response.json();
      const { stats: dashStats, recentOrders } = result;

      // Fetch top products from public table (doesn't require admin access)
      const { data: popularProducts } = await supabase
        .from("products")
        .select("*")
        .limit(5);

      setStats({
        totalUsers: {
          value: dashStats.totalUsers || 0,
          change: "+0%",
          trend: "up",
        },
        totalProducts: {
          value: dashStats.totalProducts || 0,
          change: "+0%",
          trend: "up",
        },
        totalOrders: {
          value: dashStats.totalOrders || 0,
          change: "+0%",
          trend: "up",
        },
        totalRevenue: { value: "₹0", change: "+0%", trend: "up" },
      });

      if (recentOrders && Array.isArray(recentOrders)) {
        setOrders(
          recentOrders.map((o) => ({
            id: o.id.slice(0, 8),
            customer: o.customer,
            total: o.total,
            status: o.status,
            date: o.date,
          })),
        );
      }

      if (popularProducts) {
        setTopProducts(
          popularProducts.map((p, i) => ({
            id: p.id,
            name: p.name,
            sales: Math.floor(Math.random() * 20) + 1, // Mock sales for demo if real stats aren't available
          })),
        );
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
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
            navigate("/admin/products", { state: { openAddModal: true } })
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
          <div className="h-[250px] flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-400 text-sm">
              Insufficent data to display chart
            </p>
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
