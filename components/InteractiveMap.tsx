'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Plane, Navigation, Search, Layers } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../lib/supabase';
import { LatLngExpression } from 'leaflet';

// Fix Leaflet default icon (with type assertion for TS)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const InteractiveMap = () => {
  const [airportCode, setAirportCode] = useState('');
  const [radius, setRadius] = useState(50);
  const [specializations, setSpecializations] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [viewMode, setViewMode] = useState('vfr'); // vfr, satellite, light
  const [shops, setShops] = useState([]);
  const [center, setCenter] = useState<LatLngExpression>([40.730610, -73.935242]); // Default NYC area
  const mapRef = useRef(null);

  useEffect(() => {
    const map = L.map(mapRef.current).setView(center, 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add markers for shops
    shops.forEach(shop => {
      L.marker([shop.lat, shop.lng]).addTo(map)
        .bindPopup(`<b>${shop.name}</b><br>${shop.location}`);
    });

    return () => {
      map.remove(); // Cleanup on unmount
    };
  }, [shops, center]);

  const handleSearch = async () => {
    const { data } = await supabase
      .from('shops')
      .select('*')
      .ilike('airport_code', `%${airportCode}%`)
      .gte('rating', minRating);
    setShops(data || []);
    if (data[0]) setCenter([data[0].lat, data[0].lng]);
  };
return (
    <div className="flex flex-col h-[600px] bg-white">
      {/* Search Header */}
      <div className="bg-white border-b p-4 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex gap-2 w-full">
            <div className="flex-1 bg-slate-50 rounded-xl px-4 py-3 flex items-center gap-3 border focus-within:ring-2 focus-within:ring-blue-500">
              <MapPin className="w-5 h-5 text-blue-600" />
              <input 
                type="text" 
                value={airportCode}
                onChange={(e) => setAirportCode(e.target.value)}
                placeholder="Search Airport (e.g. KTEB)" 
                className="bg-transparent border-none focus:ring-0 font-bold text-slate-900 placeholder:text-slate-400 w-full"
              />
            </div>
            <select 
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="bg-slate-50 border rounded-xl px-4 py-3 text-sm font-bold text-slate-700"
            >
              <option value={25}>25 nm</option>
              <option value={50}>50 nm</option>
              <option value={100}>100 nm</option>
              <option value={250}>250 nm</option>
            </select>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button onClick={handleSearch} className="flex-1 md:flex-none bg-blue-600 text-white px-8 py-3 rounded-xl font-black uppercase text-xs shadow-lg">
              Search
            </button>
            <button className="p-3 bg-slate-50 border rounded-xl text-slate-400 hover:text-blue-600">
              <Navigation className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Sidebar */}
        <div className="w-96 bg-white border-r overflow-y-auto hidden lg:block z-10">
          <div className="p-6">
            <h3 className="text-xs font-black text-slate-400 uppercase mb-6">Results near {airportCode}</h3>
            <div className="space-y-6">
              {shops.map(shop => (
                <div key={shop.id} className="p-4 rounded-2xl border bg-blue-50/30 hover:bg-blue-50">
                  <h4 className="font-black text-slate-900">{shop.name}</h4>
                  <p className="text-xs text-slate-500 font-bold mb-3">{shop.airport_code} • {shop.distance} nm away</p>
                  <button className="w-full py-2 bg-white border rounded-lg text-[10px] font-black uppercase text-blue-600 hover:bg-blue-600 hover:text-white">
                    View Detail
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div ref={mapRef} className="flex-1" />
      </div>
    </div>
  );
};

export default InteractiveMap;