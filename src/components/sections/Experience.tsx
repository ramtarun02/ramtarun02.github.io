import { GlassPanel } from '@/components/glass/GlassPanel';
import { Section } from './Section';
import type { Experience as ExperienceItem } from '@/content/schema';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2024-09" -> "Sep 2024". Unparseable input returns unchanged rather than throwing. */
export function formatMonth(value: string): string {
  const [year, month] = value.split('-');
  const index = Number(month) - 1;
  const name = MONTHS[index];
  if (!year || !name) return value;
  return `${name} ${year}`;
}

export function formatRange(start: string, end?: string): string {
  return `${formatMonth(start)} — ${end ? formatMonth(end) : 'Present'}`;
}

export function Experience({
  roles,
  education,
}: {
  roles: ExperienceItem[];
  education: ExperienceItem[];
}) {
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="Solvers, simulations and the aircraft they describe"
      lede="Four years across research groups, a UAV manufacturer and a computational consultancy — consistently on the numerical side."
    >
      <div className="flex flex-col gap-4">
        {roles.map((item) => (
          <ExperienceCard key={item.id} item={item} />
        ))}
      </div>

      <h3 className="u-label mt-16 mb-6" style={{ color: 'var(--ink-faint)' }}>
        Education
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        {education.map((item) => (
          <ExperienceCard key={item.id} item={item} compact />
        ))}
      </div>
    </Section>
  );
}

function ExperienceCard({ item, compact = false }: { item: ExperienceItem; compact?: boolean }) {
  const current = item.end === undefined;
  return (
    <GlassPanel as="article" flowBody className="p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>{item.role}</h3>
        <span
          className="font-[family-name:var(--font-mono)] text-xs whitespace-nowrap"
          style={{ color: current ? 'var(--accent)' : 'var(--ink-faint)' }}
        >
          {formatRange(item.start, item.end)}
        </span>
      </div>
      <p className="mt-1 text-sm" style={{ color: 'var(--ink-muted)' }}>
        {item.organisation} · {item.location}
      </p>
      <p className="u-measure mt-4 text-sm" style={{ color: 'var(--ink-muted)' }}>
        {item.summary}
      </p>

      {!compact && item.highlights.length > 0 ? (
        <ul className="mt-5 flex flex-col gap-2.5">
          {item.highlights.map((highlight) => (
            <li key={highlight.slice(0, 28)} className="relative pl-5 text-sm">
              <span
                aria-hidden="true"
                className="absolute top-[0.55rem] left-0 h-1 w-1 rounded-full"
                style={{ background: 'var(--accent)' }}
              />
              {highlight}
            </li>
          ))}
        </ul>
      ) : null}

      {item.tags.length > 0 ? (
        <ul className="mt-6 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <li
              key={tag}
              className="u-label px-2.5 py-1"
              style={{
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--edge)',
                color: 'var(--ink-muted)',
              }}
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </GlassPanel>
  );
}
