import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

const siteUrl = 'https://lunara-pilates.vercel.app';
const socialImage = `${siteUrl}/og-lunara.jpg`;

/* Tekst koji se vidi kad se link podijeli (WhatsApp, Instagram, Messenger...) */
const shareTitle = 'Postani promjena.';
const shareDescription = 'Lunara Reformer Pilates — Banja Luka';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Lunara Reformer Pilates — Banja Luka',
  description:
    'Reformer pilates studio u Banjoj Luci. Grupni, poluindividualni i individualni treninzi u malim grupama. Zatraži probni trening.',
  openGraph: {
    title: shareTitle,
    description: shareDescription,
    url: siteUrl,
    siteName: 'Lunara Reformer Pilates',
    locale: 'bs_BA',
    type: 'website',
    images: [{ url: socialImage, width: 1200, height: 630, alt: 'Lunara Reformer Pilates logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: shareTitle,
    description: shareDescription,
    images: [socialImage],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#b69cb6',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bs">
      <body>{children}</body>
    </html>
  );
}
