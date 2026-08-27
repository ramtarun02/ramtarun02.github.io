import { Hero } from '@/components/hero/Hero';
import { profile } from '@/content';

export default function HomePage() {
  return (
    <>
      <Hero profile={profile} />
      <div id="work" className="mx-auto max-w-6xl px-6 py-32">
        <p className="u-label" style={{ color: 'var(--ink-faint)' }}>
          Sections land next
        </p>
      </div>
    </>
  );
}
