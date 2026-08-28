import { GlassPanel } from '@/components/glass/GlassPanel';
import { Section } from './Section';
import { ContactForm } from './ContactForm';
import type { Profile, SectionCopy } from '@/content/schema';

export function Contact({ profile, copy }: { profile: Profile; copy: SectionCopy }) {
  return (
    <Section id="contact" copy={copy} wide>
      <GlassPanel variant="strong" radius="xl" interactive className="p-8 sm:p-10">
        <div className="flex flex-wrap gap-3">
          {profile.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className="glass inline-flex items-center px-6 py-3 text-sm font-medium"
              style={{ borderRadius: 'var(--radius-pill)' }}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="mt-8 border-t pt-8" style={{ borderColor: 'var(--edge)' }}>
          <ContactForm />
        </div>
      </GlassPanel>
    </Section>
  );
}
