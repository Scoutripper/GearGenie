/**
 * Serverless function for admin dashboard statistics
 * Requires: Authentication token in Authorization header
 * Server-side only: Uses SERVICE_ROLE_KEY securely
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars");
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function verifyAdminToken(token) {
  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;

  // Check if user is admin
  const { data: profile, error: profileErr } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (profileErr || profile?.role !== "admin") return null;
  return data.user;
}

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];
    const user = await verifyAdminToken(token);

    if (!user) {
      return res
        .status(403)
        .json({ error: "Forbidden: Admin access required" });
    }

    // Fetch data for stats and charts
    const usersRes = await supabaseAdmin.from("profiles").select("id", { count: "exact" });
    const productsRes = await supabaseAdmin.from("products").select("id", { count: "exact" });
    const ordersRes = await supabaseAdmin.from("orders").select("id, total_amount, status, created_at, customer:profiles(first_name, last_name, avatar_url, email)");

    if (usersRes.error) throw usersRes.error;
    if (productsRes.error) throw productsRes.error;
    if (ordersRes.error) throw ordersRes.error;

    const allOrders = ordersRes.data || [];
    const totalRevenue = allOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
    const usersCount = usersRes.count || 0;
    const productsCount = productsRes.count || 0;
    const ordersCount = allOrders.length;

    // Format recent orders
    const formattedOrders = allOrders
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)
      .map((o) => ({
        id: o.id.slice(0, 8),
        customer: {
          name: `${o.customer?.first_name || ""} ${o.customer?.last_name || ""}`.trim() || o.customer?.email || "User",
          profilePic: o.customer?.avatar_url || `https://ui-avatars.com/api/?name=${o.customer?.email || 'User'}`,
        },
        total: o.total_amount || 0,
        status: o.status,
        date: new Date(o.created_at).toLocaleDateString(),
      }));

    // Process Trend for API (Last 7 days)
    const days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const revenueTrend = days.map(date => ({
      label: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }),
      value: allOrders
        .filter(o => o.created_at.startsWith(date))
        .reduce((sum, o) => sum + Number(o.total_amount || 0), 0)
    }));

    // Process Status Distribution for API
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const colors = ['#94a3b8', '#f59e0b', '#3b82f6', '#10b981', '#ef4444'];
    const statusDistribution = statuses.map((status, i) => ({
      name: status,
      count: allOrders.filter(o => o.status === status).length,
      color: colors[i]
    })).filter(d => d.count > 0);

    res.status(200).json({
      stats: {
        totalUsers: usersCount,
        totalProducts: productsCount,
        totalOrders: ordersCount,
        totalRevenue: totalRevenue,
      },
      recentOrders: formattedOrders,
      revenueTrend,
      statusDistribution
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    res.status(500).json({ error: error.message });
  }
}
