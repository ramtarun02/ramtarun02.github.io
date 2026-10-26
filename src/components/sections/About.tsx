import Image from 'next/image';
import { Section } from './Section';
import type { Profile, SectionCopy } from '@/content/schema';

const ABOUT_PARAGRAPHS = [
  "I spend most of my working hours doing something that looks, from the outside, like staring at numbers until they behave: writing the solvers that predict how air moves over a wing, then hunting for the exact point where they stop telling the truth. My MSc at Cranfield was built around that second half — not getting a transonic solver to converge, but finding precisely where it couldn't, and why.",
  'The honest version of "why aerodynamics" is that I\'ve never been able to watch an A380 take off without doing the lift numbers in my head — a habit that\'s followed me from wind tunnels to CFD clusters to a UAV that once carried 30kg to 19,024 ft, which is a very good way to stop being careless about what a model actually claims.',
  "Off the clock I'm usually chasing a football or a shuttlecock around a court, badly, and I'm told by everyone who knows me that I disappear into work for stretches that don't count as healthy. I'm working on that. The solvers, less so.",
];

export function About({ profile, copy }: { profile: Profile; copy: SectionCopy }) {
  return (
    <Section id="about" copy={{ ...copy, lede: '' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1.4fr) minmax(260px,1fr)',
          gap: 60,
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {ABOUT_PARAGRAPHS.map((para) => (
            <p
              key={para.slice(0, 24)}
              style={{
                fontSize: 16.5,
                lineHeight: 1.85,
                color: 'var(--ink-muted)',
                maxWidth: '64ch',
              }}
            >
              {para}
            </p>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <Image
            src="/assets/profile-pic.png"
            alt={profile.name}
            width={300}
            height={300}
            style={{
              width: '100%',
              maxWidth: 300,
              aspectRatio: '1',
              objectFit: 'cover',
              borderRadius: '50%',
              boxShadow: 'var(--shadow-lg)',
              filter: 'saturate(0.85) contrast(0.96)',
            }}
          />
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 11,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--color-accent-700)',
                marginBottom: 6,
              }}
            >
              Availability
            </div>
            <div style={{ fontSize: 14, color: 'var(--ink-muted)' }}>{profile.availability}</div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {profile.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-secondary"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
