'use client';

import React from \'react\';
import CustomerSearch from \'../components/CustomerSearch\';
import InteractiveMap from \'../components/InteractiveMap\';
import ReviewValidation from \'../components/ReviewValidation\';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="bg-blue-600 text-white p-8 text-center shadow-lg">
        <h1 className="text-5xl font-bold mb-4">Fix-a-Plane</h1>
        <p className="text-xl">Your marketplace for aircraft maintenance shops</p>
      </header>

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
          <InteractiveMap />
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
  );
}
