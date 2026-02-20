'use client';

import React from 'react';
import CustomerSearch from '../components/CustomerSearch';
import dynamic from 'next/dynamic';
import ReviewValidation from '../components/ReviewValidation';
import { ShopProvider } from '../components/ShopContext';

const DynamicInteractiveMap = dynamic(() => import('../components/InteractiveMap'), { ssr: false });

export default function Home() {
  return (
    <ShopProvider>
      <div className="min-h-screen bg-white text-slate-900">
        {/* Hero Section */}
        <div className="relative h-96 bg-blue-900 text-white flex items-center justify-center overflow-hidden">
          <img 
            src="https://source.unsplash.com/random/1600x900/?aviation" 
            alt="Aviation Hero" 
            className="absolute inset-0 w-full h-full object-cover opacity-70" 
          />
          <div className="relative z-10 text-center px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">Fix-a-Plane</h1>
            <p className="text-xl md:text-3xl drop-shadow-md">Your trusted marketplace for aircraft maintenance</p>
          </div>
        </div>

        {/* Customer Search Section */}
        <section className="py-12 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Search for Shops</h2>
            <CustomerSearch />
          </div>
        </section>

        {/* Interactive Map Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Explore on the Map</h2>
            <DynamicInteractiveMap />
          </div>
        </section>

        {/* Review Validation Section */}
        <section className="py-12 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Validate Your Review</h2>
            <div className="max-w-md mx-auto">
              <ReviewValidation />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-white p-8 text-center">
          <p>&copy; 2026 Fix-a-Plane. All rights reserved.</p>
        </footer>
      </div>
    </ShopProvider>
  );
}
