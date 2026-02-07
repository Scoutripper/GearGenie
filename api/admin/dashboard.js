/**
 * Serverless function for admin dashboard statistics
 * Requires: Authentication token in Authorization header
 * Server-side only: Uses SERVICE_ROLE_KEY securely
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars');
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function verifyAdminToken(token) {
  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return null;

  // Check if user is admin
  const { data: profile, error: profileErr } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  if (profileErr || profile?.role !== 'admin') return null;
  return data.user;
}

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await verifyAdminToken(token);

    if (!user) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    // Fetch all stats in parallel
    const [
      { count: usersCount, error: usersErr },
      { count: productsCount, error: productsErr },
      { count: ordersCount, error: ordersErr },
      { data: recentOrders, error: ordersDataErr }
    ] = await Promise.all([
      supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact', head: true }),
      supabaseAdmin
        .from('products')
        .select('*', { count: 'exact', head: true }),
      supabaseAdmin
        .from('orders')
        .select('*', { count: 'exact', head: true }),
      supabaseAdmin
        .from('orders')
        .select('*, customer:profiles(first_name, last_name, avatar_url, email)')
        .order('created_at', { ascending: false })
        .limit(5)
    ]);

    if (usersErr || productsErr || ordersErr) {
      throw new Error('Failed to fetch dashboard stats');
    }

    // Format recent orders
    const formattedOrders = (recentOrders || []).map(o => ({
      id: o.id.slice(0, 8),
      customer: {
        name: `${o.customer?.first_name || ''} ${o.customer?.last_name || ''}`.trim() || 'User',
        profilePic: o.customer?.avatar_url || `https://ui-avatars.com/api/?name=${o.customer?.email}`
      },
      total: o.total_amount || 0,
      status: o.status,
      date: new Date(o.created_at).toLocaleDateString()
    }));

    res.status(200).json({
      stats: {
        totalUsers: usersCount || 0,
        totalProducts: productsCount || 0,
        totalOrders: ordersCount || 0,
        totalRevenue: 0 // Calculate if needed
      },
      recentOrders: formattedOrders
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    res.status(500).json({ error: error.message });
  }
}
