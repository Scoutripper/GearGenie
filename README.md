# Scoutripper

Scoutripper is a trekking gear rental and purchase platform built with React, Vite, and Supabase.

## What is included

- Product catalog with category/subcategory filters
- Product details with variants and image gallery
- Cart, checkout, and order creation flow
- User authentication (login, signup, profile)
- Favorites and comparison experience
- Protected admin panel (`/admin`) with:
  - Dashboard
  - Products management
  - Orders management
  - Users management
  - Analytics view

## Tech stack

- React 19
- React Router DOM 7
- Vite 7
- Tailwind CSS 3
- Supabase (Auth, Postgres, Storage)
- Vercel Serverless Functions (`api/admin/*`)

## Project structure

```text
api/
  admin/
    analytics.js
    dashboard.js
    orders.js
    users.js
src/
  components/
  context/
  pages/
  utils/
  supabaseClient.js
public/
```

## Environment variables

Create `.env.local` for local frontend development:

```bash
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

For deployed serverless admin APIs, configure these in Vercel:

```bash
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

Do not commit secret keys.

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Build production bundle:

```bash
npm run build
```

4. Preview production build:

```bash
npm run preview
```

## Database setup

Use the SQL files in the repo to bootstrap/update schema:

- `supabase_schema.sql`
- `create_categories_table.sql`
- `update_schema_subcategories.sql`
- `public/variant-schema.sql`

## Admin API endpoints

These endpoints require a valid Bearer token and admin role:

- `GET /api/admin/dashboard`
- `GET /api/admin/analytics`
- `GET|PATCH|DELETE /api/admin/users`
- `GET|PATCH /api/admin/orders`

## Deployment

The project is configured for Vercel (`vercel.json`) with SPA rewrites to `index.html`.

Detailed secure deployment and RLS guidance is available in `DEPLOYMENT.md`.
