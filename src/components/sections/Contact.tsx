import { GlassPanel } from '@/components/glass/GlassPanel';
import { Section } from './Section';
import { ContactForm } from './ContactForm';
import type { Profile } from '@/content/schema';

export function Contact({ profile }: { profile: Profile }) {
  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Working on something transonic?"
      lede="I am open to collaboration on academic or industrial work in CFD and solver development — particularly anything involving conceptual design tooling, or the limits of low-fidelity methods."
    >
      <GlassPanel variant="strong" radius="xl" flowBody className="p-8 sm:p-10">
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
