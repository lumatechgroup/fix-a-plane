-- Fix-a-plane: Database Schema

-- 1. Extensions
create extension if not exists postgis;

-- 2. Types
create type user_role as enum ('customer', 'owner', 'admin');
create type subscription_tier as enum ('free', 'premium');

-- 3. Profiles (Extends Supabase Auth)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role user_role default 'customer'::user_role,
  created_at timestamptz default now()
);

-- 4. Shops (The core directory)
create table shops (
  id uuid primary key default gen_random_uuid(),
  faa_certificate_number text unique, -- For pre-loaded FAA data
  name text not null,
  airport_code varchar(10), -- e.g., KTEB, KJFK
  address text,
  location geography(point), -- For radius search
  contact_person text,
  phone text,
  email text,
  description text,
  specializations_aircraft text[], -- Array of types: ['Cessna', 'Piper']
  specializations_services text[], -- Array: ['Avionics', 'Annual Inspection']
  faa_certifications text[], -- Array: ['Airframe Class 1', 'Radio Class 1']
  tier subscription_tier default 'free'::subscription_tier,
  is_verified boolean default false,
  owner_id uuid references profiles(id),
  created_at timestamptz default now()
);

-- 5. Media (Shop Photos)
create table shop_media (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id) on delete cascade,
  url text not null,
  is_primary boolean default false,
  created_at timestamptz default now()
);

-- 6. Reviews
create table reviews (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid references shops(id) on delete cascade,
  customer_id uuid references profiles(id),
  rating int check (rating >= 1 and rating <= 5),
  comment text,
  owner_response text,
  created_at timestamptz default now(),
  unique(shop_id, customer_id) -- One review per customer per shop
);

-- 7. Search Function (Airport + Distance)
create or replace function search_shops_by_distance(
  user_lat float,
  user_lng float,
  dist_meters float
)
returns setof shops as $$
begin
  return query
  select *
  from shops
  where st_dwithin(location, st_setreid(st_point(user_lng, user_lat), 4326)::geography, dist_meters)
  order by 
    tier desc, -- Premium shops show first
    location <-> st_setreid(st_point(user_lng, user_lat), 4326)::geography; -- Then by distance
end;
$$ language plpgsql;
