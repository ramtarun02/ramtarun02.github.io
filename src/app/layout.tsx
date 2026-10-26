import type { Metadata, Viewport } from 'next';
import { Caprasimo, Figtree, Inter } from 'next/font/google';
import { site, siteUrl } from '@/lib/site';

// Self-hosted mono for numeric/label bits shared by both themes.
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';

import './globals.css';

const caprasimo = Caprasimo({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-caprasimo',
  display: 'swap',
});

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-figtree',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: `${site.name} — ${site.role}`, template: `%s — ${site.name}` },
  description: site.description,
  authors: [{ name: site.canonicalName }],
  openGraph: {
    type: 'profile',
    locale: site.locale,
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#f5ead8',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${caprasimo.variable} ${figtree.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
