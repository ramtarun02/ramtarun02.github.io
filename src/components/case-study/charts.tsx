/**
 * Charts are hand-built inline SVG rather than a charting library: the data
 * sets here are a handful of points, and a library would cost more bytes than
 * the entire page. Colour comes from the velocity ramp so it carries the same
 * meaning as everywhere else on the site.
 */

interface FailurePoint {
  label: string;
  alpha: number;
  mpre: number;
}

/** From results/failure_boundary.csv — the four archived operating conditions. */
const FAILURE_POINTS: FailurePoint[] = [
  { label: 'M0.80, Re 5M', alpha: 3.8, mpre: 1.31 },
  { label: 'M0.85, Re 5M', alpha: 3.8, mpre: 1.371 },
  { label: 'M0.85, Re 19.8M', alpha: 3.4, mpre: 1.366 },
  { label: 'M0.85, Re 30M', alpha: 3.4, mpre: 1.36 },
];

export function FailureBoundaryChart() {
  const w = 720;
  const h = 300;
  const pad = { top: 28, right: 24, bottom: 44, left: 62 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;
  const half = plotW / 2 - 18;

  const alphaScale = (a: number) => plotH - ((a - 3.0) / 1.2) * plotH;
  const mScale = (m: number) => plotH - ((m - 1.2) / 0.3) * plotH;

  return (
    <figure className="u-scroll-x">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        role="img"
        aria-label="Two panels comparing the failure boundary expressed as incidence, which scatters across 0.4 degrees, and as peak pre-shock Mach number, which collapses to within 0.061."
        style={{ minWidth: 560 }}
      >
        <g transform={`translate(${pad.left},${pad.top})`}>
          <Panel
            x={0}
            width={half}
            height={plotH}
            title="as an incidence"
            subtitle="scatters"
            ticks={[3.0, 3.4, 3.8, 4.2]}
            tickLabel={(v) => `${v.toFixed(1)}°`}
            scale={alphaScale}
            points={FAILURE_POINTS.map((p) => ({ ...p, value: p.alpha }))}
          />
          <g transform={`translate(${half + 36},0)`}>
            <Panel
              x={0}
              width={half}
              height={plotH}
              title="as peak pre-shock Mach"
              subtitle="collapses"
              ticks={[1.2, 1.3, 1.4, 1.5]}
              tickLabel={(v) => v.toFixed(1)}
              scale={mScale}
              points={FAILURE_POINTS.map((p) => ({ ...p, value: p.mpre }))}
              threshold={{ at: 1.3, label: 'separation threshold M₁ ≈ 1.3' }}
            />
          </g>
        </g>
      </svg>
    </figure>
  );
}

interface PanelProps {
  x: number;
  width: number;
  height: number;
  title: string;
  subtitle: string;
  ticks: number[];
  tickLabel: (v: number) => string;
  scale: (v: number) => number;
  points: (FailurePoint & { value: number })[];
  threshold?: { at: number; label: string };
}

function Panel({
  width,
  height,
  title,
  subtitle,
  ticks,
  tickLabel,
  scale,
  points,
  threshold,
}: PanelProps) {
  const step = width / (points.length + 1);
  return (
    <g>
      {ticks.map((t) => (
        <g key={t}>
          <line
            x1={0}
            x2={width}
            y1={scale(t)}
            y2={scale(t)}
            stroke="var(--edge)"
            strokeWidth={1}
          />
          <text
            x={-10}
            y={scale(t) + 4}
            textAnchor="end"
            fontSize={11}
            fill="var(--ink-faint)"
            fontFamily="var(--font-mono)"
          >
            {tickLabel(t)}
          </text>
        </g>
      ))}

      {threshold ? (
        <>
          <line
            x1={0}
            x2={width}
            y1={scale(threshold.at)}
            y2={scale(threshold.at)}
            stroke="var(--warn)"
            strokeWidth={1.5}
            strokeDasharray="5 4"
          />
          <text
            x={width}
            y={scale(threshold.at) - 8}
            textAnchor="end"
            fontSize={10.5}
            fill="var(--warn)"
            fontFamily="var(--font-mono)"
          >
            {threshold.label}
          </text>
        </>
      ) : null}

      {points.map((p, i) => (
        <circle
          key={p.label}
          cx={step * (i + 1)}
          cy={scale(p.value)}
          r={6}
          fill="var(--color-vel-3)"
          stroke="var(--ground)"
          strokeWidth={2}
        >
          <title>{`${p.label}: ${p.value}`}</title>
        </circle>
      ))}

      <text x={0} y={height + 26} fontSize={12} fill="var(--ink-muted)">
        {title}
      </text>
      <text
        x={width}
        y={height + 26}
        textAnchor="end"
        fontSize={11}
        fill="var(--accent)"
        fontFamily="var(--font-mono)"
      >
        {subtitle}
      </text>
    </g>
  );
}

/** From studies/postprocessing/grid_series.csv. */
const GRID_SERIES = [
  { level: 'L1', cells: 24103, h: 0.1267, cl: 0.5331 },
  { level: 'L2', cells: 83113, h: 0.0839, cl: 0.7787 },
  { level: 'L3', cells: 493194, h: 0.0463, cl: 0.6997 },
  { level: 'L4', cells: 2218368, h: 0.0281, cl: 0.5496 },
];

export function GridConvergenceChart() {
  const w = 720;
  const h = 320;
  const pad = { top: 26, right: 28, bottom: 52, left: 62 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  const xs = (hv: number) => ((hv - 0.02) / (0.14 - 0.02)) * plotW;
  const ys = (cl: number) => plotH - ((cl - 0.45) / 0.4) * plotH;
  const path = GRID_SERIES.map((d, i) => `${i === 0 ? 'M' : 'L'}${xs(d.h)},${ys(d.cl)}`).join(' ');

  return (
    <figure className="u-scroll-x">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        role="img"
        aria-label="Lift coefficient against representative cell size for four mesh levels. The series overshoots at the second level and comes back down rather than approaching a limit."
        style={{ minWidth: 560 }}
      >
        <g transform={`translate(${pad.left},${pad.top})`}>
          {[0.5, 0.6, 0.7, 0.8].map((t) => (
            <g key={t}>
              <line x1={0} x2={plotW} y1={ys(t)} y2={ys(t)} stroke="var(--edge)" strokeWidth={1} />
              <text
                x={-10}
                y={ys(t) + 4}
                textAnchor="end"
                fontSize={11}
                fill="var(--ink-faint)"
                fontFamily="var(--font-mono)"
              >
                {t.toFixed(1)}
              </text>
            </g>
          ))}

          <path d={path} fill="none" stroke="var(--color-vel-2)" strokeWidth={2} />

          {GRID_SERIES.map((d) => (
            <g key={d.level}>
              <circle
                cx={xs(d.h)}
                cy={ys(d.cl)}
                r={6}
                fill="var(--color-vel-3)"
                stroke="var(--ground)"
                strokeWidth={2}
              >
                <title>{`${d.level}: ${d.cells.toLocaleString()} cells, C_L ${d.cl}`}</title>
              </circle>
              <text
                x={xs(d.h)}
                y={ys(d.cl) - 14}
                textAnchor="middle"
                fontSize={11}
                fill="var(--ink-muted)"
                fontFamily="var(--font-mono)"
              >
                {d.level}
              </text>
            </g>
          ))}

          <text x={0} y={plotH + 30} fontSize={12} fill="var(--ink-muted)">
            finer mesh ←
          </text>
          <text x={plotW} y={plotH + 30} textAnchor="end" fontSize={12} fill="var(--ink-muted)">
            → coarser mesh
          </text>
          <text x={-46} y={-10} fontSize={11} fill="var(--ink-faint)" fontFamily="var(--font-mono)">
            C_L
          </text>
        </g>
      </svg>
    </figure>
  );
}
