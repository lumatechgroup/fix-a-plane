'use client';

import { createContext, useContext, useState } from 'react';

interface Shop {
  id: string;
  name: string;
  airport_code: string;
  address: string;
  location: { type: string; coordinates: [number, number] };
  contact_person?: string;
  phone?: string;
  email?: string;
  description?: string;
  specializations_aircraft: string[];
  specializations_services: string[];
  tier: string;
  avg_rating?: number;
  distance?: number;
}

export const ShopContext = createContext<{shops: Shop[], setShops: (shops: Shop[]) => void}>({ shops: [], setShops: () => {} });

export const ShopProvider = ({children}: {children: React.ReactNode}) => {
  const [shops, setShops] = useState<Shop[]>([]);
  return <ShopContext.Provider value={{shops, setShops}}>{children}</ShopContext.Provider>;
};

export const useShopContext = () => useContext(ShopContext);
