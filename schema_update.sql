-- Fix-a-plane: Review Validation Update

-- 1. Add aircraft details to profiles
alter table profiles 
add column aircraft_tail_number text,
add column aircraft_type text,
add column is_aircraft_verified boolean default false;

-- 2. Create FAA Registry Cache table (for high-speed validation)
-- We can sync this from the FAA's master dataset
create table faa_aircraft_registry (
  n_number text primary key,
  mfr_mdl_code text,
  model text,
  mfr text,
  year_mfr text,
  registered_owner_name text
);

-- 3. Update reviews to link to the specific aircraft used
alter table reviews
add column validated_tail_number text;
