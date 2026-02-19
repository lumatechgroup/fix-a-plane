const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const featuredShops = JSON.parse(fs.readFileSync('../FeaturedShops.json', 'utf8'));
const airports = JSON.parse(fs.readFileSync('../EastCoastAirports.json', 'utf8'));

async function loadData() {
  for (const shop of featuredShops) {
    const airport = airports.find(a => a.code === shop.airport_code);
    if (!airport) {
      console.warn(`Airport not found for ${shop.airport_code}`);
      continue;
    }
    const shopData = {
      name: shop.name,
      airport_code: shop.airport_code,
      address: shop.address,
      location: `POINT(${airport.lng} ${airport.lat})`,
      contact_person: shop.contact_person,
      phone: shop.phone,
      email: shop.email,
      description: shop.description,
      specializations_aircraft: shop.specializations_aircraft,
      specializations_services: shop.specializations_services,
      faa_certifications: shop.faa_certifications,
      tier: shop.tier,
      is_verified: true
    };
    const { error } = await supabase.from('shops').insert(shopData);
    if (error) {
      console.error('Error inserting shop:', error);
    } else {
      console.log('Inserted:', shop.name);
    }
  }
}

loadData();