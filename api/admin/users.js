/**
 * Serverless function for admin user operations
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

    // GET: Fetch all users
    if (req.method === "GET") {
      const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("id, email, first_name, last_name, role, created_at");

      if (error) throw error;

      return res.status(200).json({ users: data || [] });
    }

    // DELETE: Delete a user (requires user ID in body)
    if (req.method === "DELETE") {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "userId required" });
      }

      // Delete from auth
      const { error: authErr } =
        await supabaseAdmin.auth.admin.deleteUser(userId);
      if (authErr) throw authErr;

      // Cascade will delete profile due to foreign key
      return res.status(200).json({ message: "User deleted successfully" });
    }

    // PATCH: Update user role
    if (req.method === "PATCH") {
      const { userId, role } = req.body;

      if (!userId || !role) {
        return res.status(400).json({ error: "userId and role required" });
      }

      const { data, error } = await supabaseAdmin
        .from("profiles")
        .update({ role })
        .eq("id", userId)
        .select();

      if (error) throw error;

      return res.status(200).json({ user: data?.[0] });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Users API error:", error);
    res.status(500).json({ error: error.message });
  }
}
