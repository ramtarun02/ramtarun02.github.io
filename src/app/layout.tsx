import type { Metadata, Viewport } from 'next';
import { site, siteUrl } from '@/lib/site';
import { themeInitScript } from '@/lib/theme';

// Self-hosted fonts. Deliberately not next/font/google: no third-party request
// at runtime, no build-time dependency on fonts.googleapis.com, and CI builds
// offline. Weights are imported explicitly so nothing unused ships.
import '@fontsource/ibm-plex-sans/latin-400.css';
import '@fontsource/ibm-plex-sans/latin-500.css';
import '@fontsource/ibm-plex-sans/latin-600.css';
import '@fontsource/ibm-plex-sans/latin-700.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import '@fontsource/ibm-plex-mono/latin-500.css';
import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/instrument-serif/latin-400-italic.css';

import './globals.css';

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
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#060a12' },
    { media: '(prefers-color-scheme: light)', color: '#f4f7fc' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
