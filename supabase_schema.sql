-- Clean up existing tables (DANGEROUS: deletes all data)
drop table if exists public.order_items cascade;
drop table if exists public.orders cascade;
drop table if exists public.wishlist cascade;
drop table if exists public.products cascade;
drop table if exists public.profiles cascade;
drop function if exists public.handle_new_user cascade;
drop function if exists public.is_admin cascade;

-- Create a function to check if the user is an admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Create a table for public profiles link to auth.users
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  first_name text,
  last_name text,
  role text default 'user', -- 'user' or 'admin'
  phone text,
  avatar_url text, -- mapped to profilePic in frontend
  about_yourself text,
  address_json jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Access policies for Profiles
alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Admins can view all profiles" on public.profiles
  for select using (public.is_admin());

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, role)
  values (new.id, new.email, '', 'user');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- PRODUCTS TABLE
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  category text,
  rent_price numeric default 0,
  buy_price numeric default 0,
  original_price numeric,
  rating numeric default 0,
  review_count int default 0,
  images text[] default '{}',
  highlights text[] default '{}',
  sizes text[] default '{}',
  colors text[] default '{}',
  specifications jsonb default '{}'::jsonb,
  in_stock boolean default true,
  stock_quantity int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;

create policy "Public can view products" on public.products
  for select using (true);

create policy "Admins can manage products" on public.products
  for all using (public.is_admin());


-- WISHLIST TABLE
create table public.wishlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id)
);

alter table public.wishlist enable row level security;

create policy "Users can manage own wishlist" on public.wishlist
  for all using (auth.uid() = user_id);


-- ORDERS TABLE
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  total_amount numeric not null,
  status text default 'pending', -- pending, processing, shipped, delivered, cancelled
  payment_status text default 'unpaid',
  payment_method text,
  shipping_address jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.orders enable row level security;

create policy "Users can view own orders" on public.orders
  for select using (auth.uid() = user_id);

create policy "Admins can manage orders" on public.orders
  for all using (public.is_admin());


-- ORDER ITEMS TABLE
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id),
  item_type text default 'purchase', -- 'purchase' or 'rental'
  quantity int default 1,
  price_at_purchase numeric not null,
  rental_start_date date,
  rental_end_date date
);

alter table public.order_items enable row level security;

create policy "Users can view own order items" on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Admins can manage order items" on public.order_items
  for all using (public.is_admin());
