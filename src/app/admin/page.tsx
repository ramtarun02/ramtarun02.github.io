import type { Metadata } from 'next';
import { AdminApp } from '@/components/admin/AdminApp';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

/**
 * Client-only by design. Nothing here is prerendered with content, so the admin
 * always reflects the repository rather than the build it happens to be served
 * from — and no token ever reaches a server.
 */
export default function AdminPage() {
  return <AdminApp />;
}
