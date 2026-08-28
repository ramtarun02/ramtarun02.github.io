import type { Metadata, Viewport } from 'next';
import { site, siteUrl } from '@/lib/site';
import { SpaceField } from '@/components/space/SpaceField';

// Self-hosted fonts. Latin subsets only, weights imported explicitly: nothing
// unused ships, and the build needs no network.
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
  themeColor: '#05070f',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className="antialiased">
        {/* One background for the whole site: the scene persists across
            navigation instead of being torn down and rebuilt per page. */}
        <SpaceField />
        {children}
      </body>
    </html>
  );
}
