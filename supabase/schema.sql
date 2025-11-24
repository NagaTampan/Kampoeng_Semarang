-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Storage Buckets
insert into storage.buckets (id, name, public) values ('products', 'products', true);
insert into storage.buckets (id, name, public) values ('outlets', 'outlets', true);
insert into storage.buckets (id, name, public) values ('events', 'events', true);

-- Create Storage Policies (Public Read, Authenticated Insert/Update/Delete)
create policy "Public Access" on storage.objects for select using ( bucket_id in ('products', 'outlets', 'events') );
create policy "Authenticated Insert" on storage.objects for insert with check ( auth.role() = 'authenticated' );
create policy "Authenticated Update" on storage.objects for update using ( auth.role() = 'authenticated' );
create policy "Authenticated Delete" on storage.objects for delete using ( auth.role() = 'authenticated' );

-- OUTLETS TABLE
create table public.outlets (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  address text not null,
  phone text,
  operating_hours text,
  map_url text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PRODUCTS TABLE
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price numeric not null,
  category text,
  image_url text,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- EVENTS TABLE
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  start_time text,
  location text,
  category text,
  image_url text,
  status text check (status in ('active', 'inactive')) default 'active',
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.outlets enable row level security;
alter table public.products enable row level security;
alter table public.events enable row level security;

-- RLS Policies
-- Outlets: Public Read, Admin Write
create policy "Public Read Outlets" on public.outlets for select using (true);
create policy "Admin Insert Outlets" on public.outlets for insert with check (auth.role() = 'authenticated');
create policy "Admin Update Outlets" on public.outlets for update using (auth.role() = 'authenticated');
create policy "Admin Delete Outlets" on public.outlets for delete using (auth.role() = 'authenticated');

-- Products: Public Read, Admin Write
create policy "Public Read Products" on public.products for select using (true);
create policy "Admin Insert Products" on public.products for insert with check (auth.role() = 'authenticated');
create policy "Admin Update Products" on public.products for update using (auth.role() = 'authenticated');
create policy "Admin Delete Products" on public.products for delete using (auth.role() = 'authenticated');

-- Events: Public Read, Admin Write
create policy "Public Read Events" on public.events for select using (true);
create policy "Admin Insert Events" on public.events for insert with check (auth.role() = 'authenticated');
create policy "Admin Update Events" on public.events for update using (auth.role() = 'authenticated');
create policy "Admin Delete Events" on public.events for delete using (auth.role() = 'authenticated');
