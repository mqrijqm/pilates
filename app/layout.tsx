import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

/* Društvene mreže traže apsolutnu, stabilnu putanju do OG slike.
   NEXT_PUBLIC_SITE_URL ostavlja mogućnost prelaska na vlastiti domen kasnije. */
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://solis-reformer-pilates.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Solis Reformer Pilates â€” Banja Luka',
  description:
    'Reformer pilates studio u Banjoj Luci. Grupni, poluindividualni i individualni treninzi u malim grupama. ZatraÅ¾i probni trening.',
  openGraph: {
    title: 'ViÅ¡e od vjeÅ¾be â€” to je transformacija',
    description:
      'Reformer pilates studio u Banjoj Luci. Grupni, poluindividualni i individualni treninzi u malim grupama.',
    locale: 'bs_BA',
    type: 'website',
    images: [{ url: '/og-solis.jpg', width: 1200, height: 630, alt: 'Solis Reformer Pilates' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ViÅ¡e od vjeÅ¾be â€” to je transformacija',
    description: 'Solis Reformer Pilates â€” Banja Luka',
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
