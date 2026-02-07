# Scoutripper Security-First Deployment Guide

This guide covers secure deployment of the Supabase backend and Vercel frontend with proper RLS policies and serverless admin functions.

## Architecture Overview

```
Frontend (Vercel)
  ├─ Client: Uses VITE_SUPABASE_ANON_KEY (public, safe)
  ├─ AuthContext: Handles login, session persistence
  └─ Admin Pages: Call /api/admin/* endpoints (not Supabase directly)

Vercel Serverless Functions (/api)
  ├─ /api/admin/dashboard.js: Gets dashboard stats
  ├─ /api/admin/users.js: Manages users
  └─ /api/admin/orders.js: Manages orders
  └─ Server-side only: Uses SUPABASE_SERVICE_ROLE_KEY securely

Supabase Backend
  ├─ Database: PostgreSQL with RLS policies
  ├─ Auth: Supabase Auth (JWT tokens)
  ├─ Storage: product-images bucket
  └─ RLS: Enforces data access rules
```

## Step 1: Supabase Setup

### 1.1 Create Tables (if not already done)

Run the SQL from `supabase_schema.sql` in your Supabase dashboard SQL Editor:

- Settings → SQL Editor → New Query → Paste entire `supabase_schema.sql` → Run

Or use CLI:

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

### 1.2 Apply RLS Policies

Run these SQL commands in Supabase → SQL Editor:

#### Policy 1: Users can view only their own profile

```sql
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);
```

#### Policy 2: Users can update only their own profile

```sql
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

#### Policy 3: Admins can view all profiles (and manage via API)

```sql
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

#### Policy 4: Admins can update any profile role (via admin API only)

```sql
CREATE POLICY "Admins can update profiles"
  ON public.profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

**Notes:**

- RLS is row-level, so `public.is_admin()` function in your schema enforces admin checks automatically.
- Service Role Key (used only in Vercel functions) bypasses RLS — that's why functions must validate admin status first.

### 1.3 Create Storage Bucket & Policies

**Create bucket:**

- Supabase Dashboard → Storage → New Bucket → Name: `product-images` → Make public for reads

**Add storage policies:**

#### Storage Policy: Public can view product images

```sql
CREATE POLICY "Allow public to view product images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product-images');
```

#### Storage Policy: Only admins can upload/manage images

```sql
CREATE POLICY "Allow admins to manage images"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 1.4 Get Your API Keys

In Supabase Dashboard → Project Settings → API:

- Copy **Project URL** → `SUPABASE_URL`
- Copy **Anon Key** → `VITE_SUPABASE_ANON_KEY` (public, safe for client)
- Copy **Service Role** → `SUPABASE_SERVICE_ROLE_KEY` (server-only, secret!)

**⚠️ CRITICAL: Never put Service Role Key in client code or `.env.local`**

## Step 2: Vercel Deployment

### 2.1 Set Environment Variables in Vercel Dashboard

Go to your Vercel project → Settings → Environment Variables

**Public/Client Variables:**

- `VITE_SUPABASE_URL` = `https://xxxxx.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `ey...anon...` (visible in browser, safe)

**Server-Only Variables (set scope to "Function" or "Production"):**

- `SUPABASE_URL` = `https://xxxxx.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = `ey...service_role...` (secret, server only)

### 2.2 Push to GitHub & Deploy

```bash
git add .
git commit -m "feat: secure admin backend with serverless functions"
git push origin main
```

Vercel will auto-deploy. Check:

- Deployments tab → see build logs
- Domains tab → open preview URL

### 2.3 Verify APIs Work

```bash
# Get session token from frontend login
TOKEN=$(curl -X POST https://xxxxx.supabase.co/auth/v1/token?grant_type=password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}' | jq -r '.access_token')

# Test dashboard endpoint
curl -H "Authorization: Bearer $TOKEN" \
  https://<your-vercel-domain>.vercel.app/api/admin/dashboard

# Should return: { "stats": {...}, "recentOrders": [...] }
```

## Step 3: Frontend Setup (Local)

### 3.1 Create `.env.local` (DO NOT COMMIT)

```
# .env.local - only for local development
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=ey...anon...
```

**⚠️ ADD TO `.gitignore` (already done):**

```
.env.local
.env.*
```

### 3.2 Test Locally

```bash
npm install
npm run dev
# Open http://localhost:5173
```

**Test flow:**

1. Sign up / Login as a non-admin user → verify you see your own profile only
2. Create an admin account manually in Supabase (set `role = 'admin'` in profiles table)
3. Login as admin → verify Admin Dashboard loads and calls `/api/admin/dashboard`
4. Check browser Network tab → should see calls to `/api/admin/...` endpoints

## Step 4: Testing Checklist

- [ ] Frontend loads with ANON_KEY only (no SERVICE_ROLE in browser)
- [ ] User login/signup works
- [ ] Session persists on page refresh
- [ ] Non-admin user cannot access `/admin` routes
- [ ] Admin user can access `/admin` and see dashboard stats
- [ ] Admin user can create/update/delete users via admin panel
- [ ] Admin user can upload product images
- [ ] Public users can view product images (no login needed)
- [ ] Admin cannot create admin users (only via Supabase dashboard manual update)
- [ ] API calls include Authorization header with token
- [ ] Vercel function logs show successful auth checks

## Step 5: Security Checklist (Critical)

- [ ] Service Role Key is ONLY in Vercel (not in repo, not in `.env.local`)
- [ ] All admin operations go through `/api/admin/*` (not direct Supabase client calls)
- [ ] RLS policies are enabled on all tables
- [ ] Storage policies are set for `product-images` bucket
- [ ] `.gitignore` includes `*.env*`, `dist`, `.vercel`
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Run `git log -p | grep -i 'service_role\|secret\|key'` to check history (no exposed keys)
- [ ] Rotate keys if they were ever exposed

## Troubleshooting

### "Forbidden: Admin access required" error

- Verify user role is set to `'admin'` in `profiles` table (Supabase Dashboard → profiles → find row → set role to `admin`)
- Verify token is sent in Authorization header
- Check Vercel function logs: Settings → Function → Logs

### "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"

- Verify environment variables are set in Vercel (check Settings → Environment Variables)
- Verify they are scoped correctly (Server scope for Service Role, Public for ANON)
- Redeploy: `vercel --prod`

### RLS policy denying access

- Run test query in Supabase SQL Editor with `SELECT * FROM profiles;` (as authenticated user) to see what rows are visible
- Verify policies are correctly scoped to `auth.uid()`

### Image uploads failing

- Verify `product-images` bucket exists in Storage
- Verify storage RLS policies are applied (see Step 1.3)
- Check browser DevTools → Network → see exact error response from `/api/admin/products`

## Next Steps

1. **Expand Vercel Functions:** Add more endpoints as needed (payments, emails, webhooks)
2. **Monitoring:** Set up Sentry or similar for error tracking
3. **Audit Logging:** Add audit table to track admin actions
4. **Rate Limiting:** Implement rate limiting on API endpoints
5. **Two-Factor Auth:** Add optional 2FA for admin accounts

---

**Questions?** Refer to:

- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
- [Vercel Functions Docs](https://vercel.com/docs/functions/serverless-functions)
- [Supabase CLI Docs](https://supabase.com/docs/guides/cli)
