import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Pilates studio',
  description:
    'Online studio koji stvara trajne, transformativne rezultate za vaše tijelo i um. Započnite besplatni probni period danas.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f6f5f4',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bs">
      <body>{children}</body>
    </html>
  );
}
