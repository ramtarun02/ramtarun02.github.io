import type { NextConfig } from 'next';

/**
 * Hosting is deliberately undecided (see build spec §2).
 * Setting STATIC_EXPORT=1 produces a fully static build for GitHub Pages;
 * leaving it unset keeps server routes available for a Vercel/Cloudflare target.
 * Nothing else in the codebase should branch on the hosting choice.
 */
const isStaticExport = process.env['STATIC_EXPORT'] === '1';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(isStaticExport ? { output: 'export' as const, images: { unoptimized: true } } : {}),
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
};

export default nextConfig;
