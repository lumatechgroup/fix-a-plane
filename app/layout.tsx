import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fix-a-plane',
  description: 'Aircraft Maintenance Marketplace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
