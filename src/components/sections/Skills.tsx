import { GlassPanel } from '@/components/glass/GlassPanel';
import { Section } from './Section';
import type { SkillGroup } from '@/content/schema';

/** Proficiency maps onto the velocity ramp, so colour carries the same meaning
 *  everywhere on the site rather than being decoration. */
const RAMP = [
  'var(--color-vel-1)',
  'var(--color-vel-2)',
  'var(--color-vel-3)',
  'var(--color-vel-4)',
  'var(--color-vel-5)',
] as const;

export function rampColor(level: number): string {
  const index = Math.min(RAMP.length - 1, Math.max(0, Math.round(level * (RAMP.length - 1))));
  return RAMP[index] ?? RAMP[0];
}

export function Skills({ groups }: { groups: SkillGroup[] }) {
  return (
    <Section
      id="skills"
      eyebrow="Capabilities"
      title="What I actually use"
      lede="Weighted by how much of it I have written rather than read about. Colour follows the velocity ramp used throughout the site."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {groups.map((group) => (
          <GlassPanel key={group.id} as="article" flowBody className="p-6 sm:p-8">
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>{group.title}</h3>
            <ul className="mt-5 flex flex-col gap-3.5">
              {group.items.map((item) => (
                <li key={item.name} className="flex items-center gap-4">
                  <span className="flex-1 text-sm">{item.name}</span>
                  <span
                    aria-hidden="true"
                    className="h-1 w-24 flex-none overflow-hidden rounded-full"
                    style={{ background: 'var(--edge)' }}
                  >
                    <span
                      className="block h-full rounded-full"
                      style={{ width: `${item.level * 100}%`, background: rampColor(item.level) }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </GlassPanel>
        ))}
      </div>
    </Section>
  );
}
