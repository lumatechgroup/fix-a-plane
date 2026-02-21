'use client';

import React, { useState, useEffect, useContext } from 'react';
import { Search, MapPin, Star } from 'lucide-react';
import { createClient } from '@supabase/supabase-js'; // If not using lib/supabase
// import { supabase } from '../lib/supabase'; // Uncomment if available
import { useShopContext } from './ShopContext';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY); // Adjust if needed

// Define Shop type based on Supabase table
interface Shop {
  id: string;
  name: string;
  airport_code: string;
  address: string;
  location: { type: string; coordinates: [number, number] }; // [lng, lat]
  contact_person?: string;
  phone?: string;
  email?: string;
  description?: string;
  specializations_aircraft: string[];
  specializations_services: string[];
  tier: string;
  // Added fields
  avg_rating?: number;
  distance?: number;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const CustomerSearch = () => {
  const { shops, setShops } = useShopContext();
  const [airportCode, setAirportCode] = useState('');
  const [distance, setDistance] = useState(50);
  const [aircraft, setAircraft] = useState('');
  const [services, setServices] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [airports, setAirports] = useState<any[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/jbrooksuk/JSON-Airports/master/airports.json')
      .then(res => res.json())
      .then(data => setAirports(Object.values(data)));
  }, []);

  useEffect(() => {
    handleSearch(); // Initial load with no filters
  }, [airports]);

  const handleSearch = async () => {
    setLoading(true);
    let userLat: number | undefined;
    let userLng: number | undefined;
    let distMeters = distance * 1609.34;

    if (airportCode) {
      const airport = airports.find((a: any) => a.iata === airportCode.toUpperCase());
      if (!airport) {
        alert('Airport not found');
        setLoading(false);
        return;
      }
      userLat = airport.latitude;
      userLng = airport.longitude;
    } else {
      distMeters = 0; // No filter
    }

    let query = supabase.from('shops').select('*');

    if (distMeters > 0 && userLat && userLng) {
      const point = `SRID=4326;POINT(${userLng} ${userLat})`;
      query = query.filter('location', 'st_dwithin', `(${point}, ${distMeters})`);
    }

    const aircraftArr = aircraft.trim().split(',').map(s => s.trim()).filter(Boolean);
    if (aircraftArr.length > 0) {
      query = query.overlaps('specializations_aircraft', aircraftArr);
    }

    const servicesArr = services.trim().split(',').map(s => s.trim()).filter(Boolean);
    if (servicesArr.length > 0) {
      query = query.overlaps('specializations_services', servicesArr);
    }

    const { data: shopsData, error } = await query;

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    let filteredShops = shopsData as Shop[];

    // Fetch reviews
    const shopIds = filteredShops.map(s => s.id);
    const { data: reviewsData } = await supabase.from('reviews').select('shop_id, rating').in('shop_id', shopIds);

    const ratingsMap: { [key: string]: { sum: number; count: number } } = {};
    reviewsData?.forEach((r: any) => {
      if (!ratingsMap[r.shop_id]) ratingsMap[r.shop_id] = { sum: 0, count: 0 };
      ratingsMap[r.shop_id].sum += r.rating;
      ratingsMap[r.shop_id].count += 1;
    });

    // Add avg_rating and distance
    filteredShops = filteredShops.map(s => ({
      ...s,
      avg_rating: ratingsMap[s.id] ? ratingsMap[s.id].sum / ratingsMap[s.id].count : 0,
      distance: userLat && userLng && s.location && s.location.coordinates ? calculateDistance(userLat, userLng, s.location.coordinates[1], s.location.coordinates[0]) : 0,
    }));

    // Filter by minRating
    filteredShops = filteredShops.filter(s => s.avg_rating! >= minRating);

    // Dedupe by id
    const shopMap = new Map<string, Shop>();
    filteredShops.forEach(s => shopMap.set(s.id, s));
    filteredShops = Array.from(shopMap.values());

    // Sort: premium first, then by distance
    filteredShops.sort((a, b) => {
      const tierA = a.tier === 'premium' ? 1 : 0;
      const tierB = b.tier === 'premium' ? 1 : 0;
      return tierB - tierA || a.distance! - b.distance!;
    });

    setShops(filteredShops);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <input
            type="text"
            placeholder="Airport code (e.g., KTEB)"
            value={airportCode}
            onChange={(e) => setAirportCode(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none"
          />
          <input
            type="number"
            placeholder="Distance (miles)"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Aircraft types (comma separated)"
            value={aircraft}
            onChange={(e) => setAircraft(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Service types (comma separated)"
            value={services}
            onChange={(e) => setServices(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none"
          />
          <input
            type="number"
            placeholder="Min rating (1-5)"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            min={1}
            max={5}
            className="px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 outline-none"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="col-span-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
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
              <div key={shop.id} className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer" onClick={() => setSelectedShop(shop)}>
                <img
                  src={`https://source.unsplash.com/random/400x200/?airplane&sig=${shop.id}`}
                  alt={shop.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{shop.name}</h3>
                  <div className="flex items-center text-slate-500 mb-4">
                    <MapPin className="w-5 h-5 mr-2" />
                    {shop.address || shop.airport_code}
                  </div>
                  <div className="flex items-center text-slate-500 mb-4">
                    <MapPin className="w-5 h-5 mr-2" />
                    {shop.distance?.toFixed(1)} miles away
                  </div>
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.round(shop.avg_rating || 0) ? 'text-yellow-400' : 'text-slate-300'}`}
                        fill="currentColor"
                      />
                    ))}
                    <span className="ml-2 text-sm text-slate-500">({shop.avg_rating?.toFixed(1) || 0} / 5)</span>
                  </div>
                  <p className="text-slate-600 mb-2"><strong>Aircraft:</strong> {shop.specializations_aircraft.join(', ')}</p>
                  <p className="text-slate-600 mb-6"><strong>Services:</strong> {shop.specializations_services.join(', ')}</p>
                  <div className="flex gap-4">
                    {shop.phone && (
                      <a
                        href={`tel:${shop.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl text-center font-bold transition-all"
                      >
                        📞 Call
                      </a>
                    )}
                    {shop.email && (
                      <a
                        href={`mailto:${shop.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl text-center font-bold transition-all"
                      >
                        ✉️ Email
                      </a>
                    )}
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
            <p className="text-slate-400 max-w-md mx-auto">Try searching with different criteria.</p>
          </div>
        )}

        {selectedShop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setSelectedShop(null)}>
            <div className="bg-white rounded-lg p-6 max-w-lg w-full m-4" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold mb-4">{selectedShop.name}</h2>
              <p><strong>Address:</strong> {selectedShop.address}</p>
              <p><strong>Contact:</strong> {selectedShop.contact_person}</p>
              <p><strong>Phone:</strong> {selectedShop.phone}</p>
              <p><strong>Email:</strong> {selectedShop.email}</p>
              <p><strong>Description:</strong> {selectedShop.description}</p>
              <p><strong>Aircraft:</strong> {selectedShop.specializations_aircraft.join(', ')}</p>
              <p><strong>Services:</strong> {selectedShop.specializations_services.join(', ')}</p>
              <p><strong>Tier:</strong> {selectedShop.tier}</p>
              <p><strong>Average Rating:</strong> {selectedShop.avg_rating?.toFixed(1)}</p>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setSelectedShop(null)}>Close</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default CustomerSearch;
