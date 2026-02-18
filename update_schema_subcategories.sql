-- Create subcategories table
create table if not exists public.subcategories (
  id uuid default gen_random_uuid() primary key,
  category_id uuid references public.categories(id) on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(category_id, name)
);

-- Add subcategory column to products table
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'products' and column_name = 'subcategory') then
        alter table public.products add column subcategory text;
    end if;
end $$;

-- Enable Row Level Security (RLS) for subcategories
alter table public.subcategories enable row level security;

-- Create policies for subcategories
create policy "Public can view subcategories" on public.subcategories
  for select using (true);

create policy "Authenticated users can insert subcategories" on public.subcategories
  for insert with check (auth.role() = 'authenticated');

create policy "Authenticated users can update subcategories" on public.subcategories
  for update using (auth.role() = 'authenticated');

create policy "Authenticated users can delete subcategories" on public.subcategories
  for delete using (auth.role() = 'authenticated');

-- Update categories policies to allow update/delete (if not already set)
drop policy if exists "Authenticated users can insert categories" on public.categories;
create policy "Authenticated users can manage categories" on public.categories
  for all using (auth.role() = 'authenticated');
