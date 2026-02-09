/**
 * Serverless function for admin analytics
 * Requires: Authentication token in Authorization header
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
      return res.status(403).json({ error: "Forbidden" });
    }

    if (req.method === "GET") {
        const [usersRes, ordersRes] = await Promise.all([
            supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
            supabaseAdmin.from('orders').select('total_amount, created_at, status')
        ]);

        return res.status(200).json({
            orders: ordersRes.data || [],
            userCount: usersRes.count || 0
        });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Analytics API error:", error);
    res.status(500).json({ error: error.message });
  }
}
