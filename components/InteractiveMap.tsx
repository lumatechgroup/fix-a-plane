'use client';

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

import { MapPin, Navigation, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import airports from '../EastCoastAirports.json';

const specializations = ['Avionics', 'Annual Inspection', 'Engine Repair', 'Propeller', 'Paint', 'Interior'];

const InteractiveMap = () => {
  const [airportCode, setAirportCode] = useState('');
  const [radius, setRadius] = useState(50);
  const [minRating, setMinRating] = useState(0);
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [center, setCenter] = useState([40.7128, -74.0060]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('light');

  const tileUrls = {
    light: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    vfr: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' // Placeholder for VFR
  };

  const handleSearch = async () => {
    setLoading(true);
    const airport = airports.find(a => a.code.toUpperCase() === airportCode.toUpperCase());
    if (!airport) {
      alert('Airport not found');
      setLoading(false);
      return;
    }
    setCenter([airport.lat, airport.lng]);
    const distMeters = radius * 1852;
    const { data, error } = await supabase.rpc('search_shops_by_distance', {
      user_lat: airport.lat,
      user_lng: airport.lng,
      dist_meters: distMeters
    });
    if (error) {
      console.error(error);
      setShops([]);
    } else {
      const filtered = data.filter(shop => {
        const ratingMatch = shop.rating >= minRating;
        const specMatch = selectedSpecializations.length === 0 || selectedSpecializations.some(s => shop.specializations_services.includes(s));
        return ratingMatch && specMatch;
      });
      setShops(filtered);
    }
    setLoading(false);
  };

  const toggleSpecialization = (spec) => {
    setSelectedSpecializations(prev => prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]);
  };

  return (
    <div className="flex flex-col h-[800px]">
      <div className="bg-white border-b p-4 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center">
          <div className="flex-1 flex gap-2">
            <div className="flex-1 flex items-center gap-3 border rounded-xl px-4 py-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <input 
                type="text" 
                placeholder="Search Airport (e.g. KTEB)" 
                value={airportCode}
                onChange={(e) => setAirportCode(e.target.value)}
                className="w-full outline-none"
              />
            </div>
            <select 
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="border rounded-xl px-4 py-3"
            >
              <option value={25}>25 nm</option>
              <option value={50}>50 nm</option>
              <option value={100}>100 nm</option>
              <option value={250}>250 nm</option>
            </select>
            <select 
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="border rounded-xl px-4 py-3"
            >
              <option value={0}>Any Rating</option>
              <option value={3}>3+</option>
              <option value={4}>4+</option>
              <option value={5}>5</option>
            </select>
          </div>
          <div className="flex gap-2 flex-wrap">
            {specializations.map(spec => (
              <button 
                key={spec} 
                onClick={() => toggleSpecialization(spec)}
                className={`px-3 py-2 rounded-lg ${selectedSpecializations.includes(spec) ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}
              >
                {spec}
              </button>
            ))}
          </div>
          <button 
            onClick={handleSearch} 
            disabled={loading} 
            className="bg-blue-600 text-white px-8 py-3 rounded-xl"
          >
            Search
          </button>
        </div>
      </div>
      <div className="flex-1 relative">
        <MapContainer center={center} zoom={8} style={{height: '100%', width: '100%'}}>
          <TileLayer url={tileUrls[viewMode]} attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>' />
          <Circle center={center} pathOptions={{ color: 'blue' }} radius={radius * 1852} />
          {shops.map(shop => (
            <Marker key={shop.id} position={[shop.location.coordinates[1], shop.location.coordinates[0]]}>
              <Popup>
                <h3>{shop.name}</h3>
                <p>Rating: {shop.rating}</p>
                <p>Services: {shop.specializations_services.join(', ')}</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        <div className="absolute top-0 left-0 w-96 h-full overflow-y-auto bg-white border-r hidden lg:block p-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase mb-6">Results near {airportCode}</h3>
          <div className="space-y-6">
            {shops.map(shop => (
              <div key={shop.id} className="p-4 rounded-2xl border hover:bg-blue-50">
                <div className="flex justify-between">
                  <h4 className="font-bold">{shop.name}</h4>
                  <span className="bg-blue-600 text-[8px] text-white px-2 py-0.5 rounded-full">Featured</span>
                </div>
                <p className="text-xs text-slate-500">{shop.airport_code} • { (shop.distance / 1852).toFixed(1) } nm away</p>
                <div className="flex gap-1 mt-2">
                  {shop.specializations_services.map(s => (
                    <span key={s} className="text-[9px] bg-white border px-2 py-0.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
                <button className="w-full py-2 bg-white border rounded-lg text-[10px] font-bold text-blue-600 mt-2">
                  View Detail
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 right-8 flex flex-col gap-2">
          <button onClick={() => setViewMode('vfr')} className={`p-4 rounded-2xl shadow-2xl font-bold text-[10px] uppercase ${viewMode === 'vfr' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}>
            VFR Chart
          </button>
          <button onClick={() => setViewMode('satellite')} className={`p-4 rounded-2xl shadow-2xl font-bold text-[10px] uppercase ${viewMode === 'satellite' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}>
            Satellite
          </button>
          <button onClick={() => setViewMode('light')} className={`p-4 rounded-2xl shadow-2xl font-bold text-[10px] uppercase ${viewMode === 'light' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}>
            Light
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;