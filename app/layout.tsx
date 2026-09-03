import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

/* Bez ovoga Next ne zna kako da napravi apsolutnu putanju do OG slike
   (ona koja se vidi kad se link podijeli na Instagramu ili WhatsAppu).
   Na Vercelu se VERCEL_URL postavlja sam. */
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_URL
    ? 'https://' + process.env.VERCEL_URL
    : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Solis Reformer Pilates — Banja Luka',
  description:
    'Reformer pilates studio u Banjoj Luci. Grupni, poluindividualni i individualni treninzi u malim grupama. Zatraži probni trening.',
  openGraph: {
    title: 'Više od vježbe — to je transformacija',
    description:
      'Reformer pilates studio u Banjoj Luci. Grupni, poluindividualni i individualni treninzi u malim grupama.',
    locale: 'bs_BA',
    type: 'website',
    images: [{ url: '/og-solis.jpg', width: 1200, height: 630, alt: 'Solis Reformer Pilates' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Više od vježbe — to je transformacija',
    description: 'Solis Reformer Pilates — Banja Luka',
    images: ['/og-solis.jpg'],
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
