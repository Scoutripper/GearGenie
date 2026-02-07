/**
 * Serverless function for admin order operations
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
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const user = await verifyAdminToken(token);

    if (!user) {
      return res
        .status(403)
        .json({ error: "Forbidden: Admin access required" });
    }

    // GET: Fetch all orders with customer details
    if (req.method === "GET") {
      const { data, error } = await supabaseAdmin
        .from("orders")
        .select(
          "*, customer:profiles(first_name, last_name, avatar_url, email), order_items(*)",
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedOrders = (data || []).map((o) => ({
        id: o.id,
        customer: {
          name:
            `${o.customer?.first_name || ""} ${o.customer?.last_name || ""}`.trim() ||
            "User",
          email: o.customer?.email,
          profilePic:
            o.customer?.avatar_url ||
            `https://ui-avatars.com/api/?name=${o.customer?.email}`,
        },
        total_amount: o.total_amount,
        status: o.status,
        items: o.order_items || [],
        created_at: o.created_at,
        updated_at: o.updated_at,
      }));

      return res.status(200).json({ orders: formattedOrders });
    }

    // PATCH: Update order status
    if (req.method === "PATCH") {
      const { orderId, status } = req.body;

      if (!orderId || !status) {
        return res.status(400).json({ error: "orderId and status required" });
      }

      const validStatuses = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const { data, error } = await supabaseAdmin
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", orderId)
        .select();

      if (error) throw error;

      return res.status(200).json({ order: data?.[0] });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Orders API error:", error);
    res.status(500).json({ error: error.message });
  }
}
