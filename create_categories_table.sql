-- Create a new table for categories
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.categories enable row level security;

-- Create policies
-- Allow everyone to view categories
create policy "Public can view categories" on public.categories
  for select using (true);

-- Allow authenticated users (or just admins) to insert new categories
-- Assuming vendors are authenticated. Adjust 'authenticated' to 'public.is_admin()' if strict control is needed.
create policy "Authenticated users can insert categories" on public.categories
  for insert with check (auth.role() = 'authenticated');

-- Insert default categories (optional, based on your current static list)
insert into public.categories (name) values
  ('Footwear'),
  ('Apparel'),
  ('Equipment'),
  ('Tents'),
  ('Accessories'),
  ('Gadgets')
on conflict (name) do nothing;
