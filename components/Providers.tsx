'use client';

import { ShopProvider } from './ShopContext';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <ShopProvider>{children}</ShopProvider>;
}
