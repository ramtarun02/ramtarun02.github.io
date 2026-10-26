import type { Metadata, Viewport } from 'next';
import { site, siteUrl } from '@/lib/site';

// Self-hosted, so a build never depends on reaching Google Fonts.
// Inter is the closest freely licensed match to Apple's SF Pro, which is what
// makes the glass read as "native" rather than "web".
import '@fontsource-variable/inter/index.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-500.css';

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
    images: ['/assets/hero-a380-sunset.jpg'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#070c1a',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
