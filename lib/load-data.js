const { supabase } = require('./supabase');
const shops = require('../FeaturedShops.json');

async function loadData() {
  const { error } = await supabase.from('shops').insert(shops);
  if (error) console.error(error);
  else console.log('Data loaded!');
}

loadData();