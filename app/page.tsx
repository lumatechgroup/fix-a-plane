'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [airportCode, setAirportCode] = useState('');
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('shops')
      .select('*')
      .ilike('airport_code', `%${airportCode}%`);
    setShops(data || []);
    setLoading(false);
  };

  useEffect(() => {
    handleSearch();  // Load all on start
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-slate-900 bg-clip-text text-transparent">
          Fix-a-plane
        </h1>
        <div className="flex gap-4 mb-8">
          <input 
            value={airportCode}
            onChange={(e) => setAirportCode(e.target.value.toUpperCase())}
            placeholder="3N6 or KTEB"
            className="flex-1 px-6 py-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
          />
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <div key={shop.id} className="border border-slate-200 rounded-2xl p-6 hover:shadow-2xl hover:border-blue-500 transition-all">
              <h2 className="text-2xl font-bold mb-2">{shop.name}</h2>
              <p className="text-slate-600 mb-4">Airport: {shop.airport_code}</p>
              <p className="text-slate-500 mb-4">{shop.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {(shop.specializations_aircraft || []).map((spec) => (
                  <span key={spec} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                    {spec}
                  </span>
                ))}
              </div>
              <div className="text-sm text-slate-500 mb-4">
                Phone: {shop.phone} | {shop.email}
              </div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
                View Details
              </button>
            </div>
          ))}
        </div>
        {shops.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-2xl text-slate-500 mb-4">No shops found</p>
            <p className="text-slate-400">Try "3N6" for Syrek-Mee Aviation</p>
          </div>
        )}
      </div>
    </div>
  );
}
