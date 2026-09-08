import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

const siteUrl = 'https://solis-reformer-pilates.vercel.app';
const socialImage = `${siteUrl}/og-solis.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Solis Reformer Pilates — Banja Luka',
  description:
    'Reformer pilates studio u Banjoj Luci. Grupni, poluindividualni i individualni treninzi u malim grupama. Zatraži probni trening.',
  openGraph: {
    title: 'Zatraži probni trening',
    description:
      'Reformer pilates studio u Banjoj Luci. Grupni, poluindividualni i individualni treninzi u malim grupama.',
    url: siteUrl,
    siteName: 'Solis Reformer Pilates',
    locale: 'bs_BA',
    type: 'website',
    images: [{ url: socialImage, width: 1080, height: 1080, alt: 'Solis Reformer Pilates' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zatraži probni trening',
    description: 'Solis Reformer Pilates — Banja Luka',
    images: [socialImage],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#d4825b',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bs">
      <body>{children}</body>
    </html>
  );
}
