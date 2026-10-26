'use client';

import { useMemo, useRef, useState } from 'react';
import { Section } from './Section';
import type { SectionCopy } from '@/content/schema';

interface RawJob {
  role: string;
  organisation: string;
  location: string;
  dates: string;
  yearLabel: string;
  t: number;
  story: string;
  tags: string[];
}

const RAW_EXPERIENCE: RawJob[] = [
  {
    role: 'CFD Intern',
    organisation: 'FlowThermo Lab',
    location: 'Nottingham, UK',
    dates: 'Jan 2026 — present',
    yearLabel: '2026',
    t: 2026 + 0 / 12,
    story:
      'Comparing gradient reconstruction schemes head to head — MUSCL, Green-Gauss, least squares — and building a 2D Euler solver in C++/MPI from scratch to see the shock tube benchmark come together cell by cell.',
    tags: ['C++', 'MPI', 'OpenFOAM'],
  },
  {
    role: 'MSc by Research, Aerospace Engineering',
    organisation: 'Cranfield University',
    location: 'Cranfield, UK',
    dates: 'Sep 2024 — Apr 2026',
    yearLabel: '2024—26',
    t: 2024 + 8 / 12,
    story:
      'Rebuilt a legacy transonic solver into FlowVFP, then spent most of the thesis hunting the exact Mach number where it stops telling the truth — presented at the AIRBUS OneHeart Design Sprint 2026.',
    tags: ['Full potential', 'Transonic'],
  },
  {
    role: 'R&D Engineer',
    organisation: 'BONV Technologies',
    location: 'India',
    dates: 'Dec 2023 — Sep 2024',
    yearLabel: '2023—24',
    t: 2023 + 11 / 12,
    story:
      'Designed 25+ airframe and chassis concepts for high-payload UAVs — one carried 30kg to 19,024 ft, a record I still bring up more than I should.',
    tags: ['SolidWorks', 'GD&T'],
  },
  {
    role: 'Research Intern',
    organisation: 'University of Cambridge',
    location: 'Remote',
    dates: 'Nov 2023 — Jan 2024',
    yearLabel: '2023',
    t: 2023 + 10 / 12,
    story:
      'Taught a neural network to hear indirect combustion noise it had never been told the physics of, and built a physics-informed operator that got Navier-Stokes past a cylinder to 95% accuracy.',
    tags: ['PyTorch', 'PINO'],
  },
  {
    role: 'Research Intern',
    organisation: 'Cranfield University',
    location: 'Cranfield, UK',
    dates: 'May 2023 — Aug 2023',
    yearLabel: '2023',
    t: 2023 + 4 / 12,
    story:
      'Ran wind tunnel campaigns on tubercled wings at the National Wind Tunnel Facility, then checked whether RANS agreed with what the tunnel just showed me — co-authored an ICAS 2024 paper on the result.',
    tags: ['Wind tunnel', 'RANS'],
  },
  {
    role: 'B.Tech, Materials Engineering',
    organisation: 'IIT (BHU), Varanasi',
    location: 'Varanasi, India',
    dates: 'Nov 2020 — May 2024',
    yearLabel: '2020—24',
    t: 2020 + 10 / 12,
    story:
      'Where the numerical-methods habit started — PDEs, fracture mechanics, and a stint as Secretary of the Aeromodelling Society that probably explains everything since.',
    tags: ['C++17', 'PDEs'],
  },
];

const MIN_T = 2020 + 10 / 12;
const MAX_T = 2026 + 8 / 12;
const posPct = (t: number) => (((MAX_T - t) / (MAX_T - MIN_T)) * 100).toFixed(2) + '%';

export function Experience({ copy }: { copy: SectionCopy }) {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; fired: boolean } | null>(null);
  const lastWheelRef = useRef(0);

  const step = (dir: number) =>
    setActive((a) => Math.min(RAW_EXPERIENCE.length - 1, Math.max(0, a + dir)));

  const ticks = useMemo(
    () =>
      RAW_EXPERIENCE.map((job, i) => ({
        leftPct: posPct(job.t),
        aria: `Jump to ${job.role}`,
        index: i,
      })),
    [],
  );

  const yearMarks = useMemo(() => {
    const seen = new Set<string>();
    const marks: { label: string; leftPct: string }[] = [];
    RAW_EXPERIENCE.forEach((j) => {
      const y = String(Math.floor(j.t));
      if (!seen.has(y)) {
        seen.add(y);
        marks.push({ label: y, leftPct: posPct(j.t) });
      }
    });
    return marks;
  }, []);

  const cards = useMemo(
    () =>
      RAW_EXPERIENCE.map((job, i) => {
        const off = i - active;
        const d = Math.abs(off);
        const isActive = off === 0;
        const z = isActive ? 0 : -240;
        const rotY = isActive ? 0 : off < 0 ? 16 : -16;
        const shift = isActive ? '0px' : `calc(${off} * min(32.5vw, 540px))`;
        const scale = isActive ? 1.04 : 1;
        return {
          job,
          isActive,
          cardTransform: `translateX(${shift}) translateZ(${z}px) rotateY(${rotY}deg) scale(${scale})`,
          cardOpacity: d > 1 ? 0 : d === 1 ? 0.68 : 1,
          cardZ: 20 - d,
          cardHeight: isActive ? 'auto' : '270px',
          cardBorder: isActive
            ? '2px solid var(--color-accent)'
            : '1px solid color-mix(in srgb, #fff 55%, transparent)',
          cardShadow: isActive ? '0 26px 64px rgba(60,40,25,0.3)' : 'var(--shadow-sm)',
          cardEvents: isActive ? ('auto' as const) : ('none' as const),
          mask: isActive ? 'none' : 'linear-gradient(180deg, #000 68%, transparent 100%)',
        };
      }),
    [active],
  );

  return (
    <Section
      id="experience"
      copy={copy}
      headerExtra={
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-secondary btn-icon"
            onClick={() => step(-1)}
            aria-label="Previous"
            style={{ borderRadius: '50%' }}
          >
            ←
          </button>
          <button
            className="btn btn-secondary btn-icon"
            onClick={() => step(1)}
            aria-label="Next"
            style={{ borderRadius: '50%' }}
          >
            →
          </button>
        </div>
      }
    >
      <div
        ref={trackRef}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            step(1);
          }
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            step(-1);
          }
        }}
        onWheel={(e) => {
          if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
          const now = Date.now();
          if (now - lastWheelRef.current < 420) return;
          lastWheelRef.current = now;
          step(e.deltaX > 0 ? 1 : -1);
        }}
        onPointerDown={(e) => {
          dragRef.current = { x: e.clientX, fired: false };
          if (trackRef.current) trackRef.current.style.cursor = 'grabbing';
        }}
        onPointerMove={(e) => {
          const drag = dragRef.current;
          if (!drag || drag.fired) return;
          const dx = e.clientX - drag.x;
          if (Math.abs(dx) > 70) {
            drag.fired = true;
            step(dx < 0 ? 1 : -1);
          }
        }}
        onPointerUp={() => {
          dragRef.current = null;
          if (trackRef.current) trackRef.current.style.cursor = 'grab';
        }}
        onPointerLeave={() => {
          dragRef.current = null;
          if (trackRef.current) trackRef.current.style.cursor = 'grab';
        }}
        style={{
          position: 'relative',
          width: '100vw',
          marginLeft: 'calc(50% - 50vw)',
          height: 470,
          perspective: 1300,
          perspectiveOrigin: '50% 45%',
          transformStyle: 'preserve-3d',
          overflow: 'hidden',
          cursor: 'grab',
          outline: 'none',
          touchAction: 'pan-y',
        }}
      >
        {cards.map(({ job, ...c }) => (
          <div
            key={job.role + job.dates}
            className="card exp-card"
            style={{
              position: 'absolute',
              left: '50%',
              top: 30,
              width: 'min(480px, 30vw)',
              marginLeft: 'calc(min(480px, 30vw) / -2)',
              height: c.cardHeight,
              padding: '26px 28px',
              borderRadius: 'var(--radius-lg)',
              border: c.cardBorder,
              boxShadow: c.cardShadow,
              transform: c.cardTransform,
              opacity: c.cardOpacity,
              zIndex: c.cardZ,
              pointerEvents: c.cardEvents,
              display: 'flex',
              flexDirection: 'column',
              transition:
                'transform 620ms cubic-bezier(.22,.61,.36,1), opacity 500ms ease, box-shadow 420ms ease, height 520ms ease, border-color 420ms ease',
            }}
          >
            <div
              style={{
                overflow: 'hidden',
                flex: 1,
                WebkitMaskImage: c.mask,
                maskImage: c.mask,
              }}
            >
              <div
                className="u-display"
                style={{ fontSize: 21, color: 'var(--color-accent-600)', marginBottom: 10 }}
              >
                {job.yearLabel}
              </div>
              <h3 style={{ margin: '0 0 4px', fontSize: 17 }}>{job.role}</h3>
              <div style={{ fontSize: 13, color: 'var(--color-accent-700)' }}>
                {job.organisation} · {job.location}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-faint)', marginTop: 6 }}>
                {job.dates}
              </div>
              <p
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.65,
                  color: 'var(--ink-muted)',
                  margin: '14px 0 12px',
                }}
              >
                {job.story}
              </p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {job.tags.map((t) => (
                  <span key={t} className="tag tag-neutral" style={{ fontSize: 10 }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                left: '12%',
                right: '12%',
                bottom: -22,
                height: 18,
                borderRadius: '50%',
                background:
                  'radial-gradient(ellipse at center, rgba(60,40,25,0.22), rgba(60,40,25,0) 70%)',
                filter: 'blur(7px)',
              }}
            />
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', height: 64, margin: '10px 0 0' }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 10,
            height: 2,
            background: 'var(--color-neutral-300)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 10,
            height: 2,
            background: 'var(--color-accent)',
            width: `${((active / (RAW_EXPERIENCE.length - 1)) * 100).toFixed(1)}%`,
          }}
        />
        {ticks.map((tick) => (
          <button
            key={tick.leftPct + tick.aria}
            className="tick"
            onClick={() => setActive(tick.index)}
            aria-label={tick.aria}
            style={{
              position: 'absolute',
              left: tick.leftPct,
              top: 0,
              transform: 'translateX(-50%)',
              background: 'none',
              border: 'none',
              padding: '8px 6px',
              cursor: 'pointer',
            }}
          >
            <span
              className="tick-dot"
              style={{
                display: 'block',
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: 'var(--color-accent-400)',
              }}
            />
          </button>
        ))}
        {yearMarks.map((mark) => (
          <span
            key={mark.label}
            style={{
              position: 'absolute',
              left: mark.leftPct,
              top: 30,
              transform: 'translateX(-50%)',
              fontSize: 12,
              color: 'var(--ink-muted)',
            }}
          >
            {mark.label}
          </span>
        ))}
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--ink-muted)', margin: '6px 0 0' }}>
        Drag, use the arrows or arrow keys — newest first. Hover a card for the detail.
      </p>
    </Section>
  );
}
