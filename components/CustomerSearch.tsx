'use client';

import React, { useState } from 'react';
import { Search, MapPin, Star } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Correct path

// Define Shop type based on Supabase table (adjust fields if needed)
interface Shop {
  id: string;
  name: string;
  airport_code: string;
  location: string;
  rating: number;
  services: string;
  phone: string; // Adjust if your table uses a different name (e.g., 'contact_phone')
  email: string;
  tier: number; // From your query, but not used in render – optional
}

const CustomerSearch = () => {
  const [airportCode, setAirportCode] = useState('');
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('shops')
      .select('*')
      .ilike('airport_code', `%${airportCode}%`)
      .order('tier', { ascending: false });
    setShops((data as Shop[]) || []);
    setLoading(false);
  };
return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <section className="mb-12">
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Enter airport code (e.g., 3N6)"
            value={airportCode}
            onChange={(e) => setAirportCode(e.target.value)}
            className="flex-1 px-6 py-4 rounded-xl border border-slate-300 focus:border-blue-500 outline-none"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            <Search className="w-5 h-5 inline mr-2" />
            Search
          </button>
        </div>

        {loading ? (
          <div className="text-center py-24">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {shops.map((shop) => (
              <div key={shop.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{shop.name}</h3>
                  <div className="flex items-center text-slate-500 mb-4">
                    <MapPin className="w-5 h-5 mr-2" />
                    {shop.location}
                  </div>
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < shop.rating ? 'text-yellow-400' : 'text-slate-300'}`}
                        fill="currentColor"
                      />
                    ))}
                    <span className="ml-2 text-sm text-slate-500">({shop.rating} / 5)</span>
                  </div>
                  <p className="text-slate-600 mb-6">{shop.services}</p>
                  <div className="flex gap-4">
                    <a
                      href={`tel:${shop.phone}`}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl text-center font-bold transition-all"
                    >
                      📞 Call
                    </a>
                    <a
                      href={`mailto:${shop.email}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl text-center font-bold transition-all"
                    >
                      ✉️ Email
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {shops.length === 0 && !loading && (
          <div className="col-span-full text-center py-24">
            <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-500 mb-2">No shops found</h3>
            <p className="text-slate-400 max-w-md mx-auto">Try "3N6" for Syrek-Mee Aviation or another East Coast airport.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default CustomerSearch;

