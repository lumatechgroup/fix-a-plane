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
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current!).setView([40.730610, -73.935242], 10); // Default NYC
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstance.current) {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      if (shops.length > 0) {
        let totalLat = 0;
        let totalLng = 0;
        let count = 0;
        shops.forEach(shop => {
          if (shop.location && shop.location.coordinates && shop.location.coordinates.length >= 2) {
            const lat = shop.location.coordinates[1];
            const lng = shop.location.coordinates[0];
            const marker = L.marker([lat, lng]).addTo(mapInstance.current!);
            markersRef.current.push(marker);
            totalLat += lat;
            totalLng += lng;
            count++;
          }
        });
        if (count > 0) {
          const avgLat = totalLat / count;
          const avgLng = totalLng / count;
          mapInstance.current.setView([avgLat, avgLng], 10);
        }
      }
    }
  }, [shops]);

  return <div ref={mapRef} className="h-[600px]" />;
};

export default InteractiveMap;