import React, { useState } from 'react';
import { MapPin, Plane, Navigation, Search, Layers } from 'lucide-react';

const InteractiveMap = () => {
  const [radius, setRadius] = useState(50);
  const [viewMode, setViewMode] = useState('vfr'); // vfr, satellite, light

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Search Header */}
      <div className="bg-white border-b border-slate-100 p-4 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex gap-2 w-full">
            <div className="flex-1 bg-slate-50 rounded-xl px-4 py-3 flex items-center gap-3 border border-slate-100 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <MapPin className="w-5 h-5 text-blue-600" />
              <input 
                type="text" 
                placeholder="Search Airport (e.g. KTEB)" 
                className="bg-transparent border-none focus:ring-0 font-bold text-slate-900 placeholder:text-slate-400 w-full"
              />
            </div>
            <select 
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700"
            >
              <option value={25}>25 nm</option>
              <option value={50}>50 nm</option>
              <option value={100}>100 nm</option>
              <option value={250}>250 nm</option>
            </select>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none bg-blue-600 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-200">
              Search
            </button>
            <button className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600">
              <Navigation className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex relative overflow-hidden">
        {/* Sidebar Results */}
        <div className="w-96 bg-white border-r border-slate-100 overflow-y-auto hidden lg:block z-10">
          <div className="p-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Results near KTEB</h3>
            <div className="space-y-6">
              {/* Syrek-Mee Featured Sidebar Card */}
              <div className="group cursor-pointer p-4 rounded-2xl border border-blue-100 bg-blue-50/30 hover:bg-blue-50 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-black text-slate-900">Syrek-Mee Aviation</h4>
                  <span className="bg-blue-600 text-[8px] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Featured</span>
                </div>
                <p className="text-xs text-slate-500 font-bold mb-3">3N6 • 18.2 nm away</p>
                <div className="flex gap-1 mb-4">
                  <span className="text-[9px] bg-white border border-slate-200 px-2 py-0.5 rounded-full font-bold text-slate-600">Cessna</span>
                  <span className="text-[9px] bg-white border border-slate-200 px-2 py-0.5 rounded-full font-bold text-slate-600">Annuals</span>
                </div>
                <button className="w-full py-2 bg-white border border-blue-200 rounded-lg text-[10px] font-black uppercase text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                  View Detail
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Map Canvas (Placeholder for Mapbox) */}
        <div className="flex-1 bg-slate-100 relative">
          <img 
            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2000" 
            alt="Map Preview" 
            className="w-full h-full object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-96 h-96 border-4 border-blue-500/20 bg-blue-500/5 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)]"></div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-8 right-8 flex flex-col gap-2">
            <button 
              onClick={() => setViewMode('vfr')}
              className={`p-4 rounded-2xl shadow-2xl font-bold text-[10px] uppercase tracking-widest transition-all ${viewMode === 'vfr' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}
            >
              VFR Chart
            </button>
            <button 
              onClick={() => setViewMode('satellite')}
              className={`p-4 rounded-2xl shadow-2xl font-bold text-[10px] uppercase tracking-widest transition-all ${viewMode === 'satellite' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}
            >
              Satellite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
