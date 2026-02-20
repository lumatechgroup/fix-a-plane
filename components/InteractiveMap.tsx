'use client';

import React, { useRef, useEffect, useContext } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useShopContext } from './ShopContext';

// Fix Leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const InteractiveMap = () => {
  const { shops } = useShopContext();
  const mapRef = useRef(null);

  useEffect(() => {
    const map = L.map(mapRef.current).setView([40.730610, -73.935242], 10); // Default NYC
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    if (shops.length > 0) {
      let totalLat = 0;
      let totalLng = 0;
      shops.forEach(shop => {
        const lat = shop.location.coordinates[1];
        const lng = shop.location.coordinates[0];
        L.marker([lat, lng]).addTo(map);
        totalLat += lat;
        totalLng += lng;
      });
      const avgLat = totalLat / shops.length;
      const avgLng = totalLng / shops.length;
      map.setView([avgLat, avgLng], 10);
    }

    return () => {
      map.remove();
    };
  }, [shops]);

  return <div ref={mapRef} className="h-[600px]" />;
};

export default InteractiveMap;
