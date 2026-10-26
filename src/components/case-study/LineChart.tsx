'use client';

import { useId, useMemo, useRef, useState } from 'react';

export interface Series {
  id: string;
  label: string;
  color: string;
  points: [number, number][];
  /** 'line' draws a path; 'dots' draws markers (experiments). */
  kind?: 'line' | 'dots';
  dashed?: boolean;
  /** Group label shown above the toggles. */
  group?: string;
}

interface LineChartProps {
  series: Series[];
  visible: Set<string>;
  xLabel: string;
  yLabel: string;
  xDomain: [number, number];
  /** Fixed y domain; otherwise fitted to the visible series. */
  yDomain?: [number, number];
  height?: number;
  ariaLabel: string;
  xFormat?: (v: number) => string;
  yFormat?: (v: number) => string;
  /** Horizontal reference line. */
  reference?: { y: number; label: string };
}

function niceStep(range: number, target = 5): number {
  const raw = range / target;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step = norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10;
  return step * mag;
}

function interpolate(points: [number, number][], x: number): number | null {
  const first = points[0];
  const last = points[points.length - 1];
  if (!first || !last || x < first[0] || x > last[0]) return null;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    if (!a || !b) continue;
    if (x <= b[0]) {
      const t = b[0] === a[0] ? 0 : (x - a[0]) / (b[0] - a[0]);
      return a[1] + t * (b[1] - a[1]);
    }
  }
  return null;
}

/**
 * A small, dependency-free line chart: SVG paths, nice ticks, and a crosshair
 * that reads every visible series at the pointer. Built for a handful of
 * series of ~100 points each, which is all a validation plot needs.
 */
export function LineChart({
  series,
  visible,
  xLabel,
  yLabel,
  xDomain,
  yDomain,
  height = 420,
  ariaLabel,
  xFormat = (v) => v.toFixed(1),
  yFormat = (v) => v.toFixed(1),
  reference,
}: LineChartProps) {
  const W = 760;
  const H = height;
  const pad = { top: 18, right: 18, bottom: 52, left: 58 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const clipId = `clip${useId().replace(/:/g, '')}`;

  const shown = series.filter((s) => visible.has(s.id));

  const [y0, y1] = useMemo<[number, number]>(() => {
    if (yDomain) return yDomain;
    let lo = Infinity;
    let hi = -Infinity;
    for (const s of shown)
      for (const [x, y] of s.points) {
        if (x < xDomain[0] || x > xDomain[1]) continue;
        lo = Math.min(lo, y);
        hi = Math.max(hi, y);
      }
    if (!Number.isFinite(lo)) return [0, 1];
    const step = niceStep(hi - lo || 1);
    return [Math.floor(lo / step) * step, Math.ceil(hi / step) * step];
  }, [shown, yDomain, xDomain]);

  const sx = (x: number) => ((x - xDomain[0]) / (xDomain[1] - xDomain[0])) * plotW;
  const sy = (y: number) => plotH - ((y - y0) / (y1 - y0 || 1)) * plotH;

  const xStep = niceStep(xDomain[1] - xDomain[0], 6);
  const yStep = niceStep(y1 - y0, 5);
  const xTicks: number[] = [];
  for (let v = Math.ceil(xDomain[0] / xStep) * xStep; v <= xDomain[1] + 1e-9; v += xStep)
    xTicks.push(+v.toFixed(6));
  const yTicks: number[] = [];
  for (let v = y0; v <= y1 + 1e-9; v += yStep) yTicks.push(+v.toFixed(6));

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W - pad.left;
    const x = xDomain[0] + (px / plotW) * (xDomain[1] - xDomain[0]);
    setHoverX(x >= xDomain[0] && x <= xDomain[1] ? x : null);
  };

  const readings =
    hoverX === null
      ? []
      : shown
          .map((s) => {
            if (s.kind === 'dots') {
              const tol = (xDomain[1] - xDomain[0]) * 0.03;
              const near = s.points.find(([x]) => Math.abs(x - hoverX) < tol);
              return near ? { s, y: near[1] } : null;
            }
            const y = interpolate(s.points, hoverX);
            return y === null ? null : { s, y };
          })
          .filter((r): r is { s: Series; y: number } => r !== null)
          .sort((a, b) => b.y - a.y);

  const tooltipLeft = hoverX === null ? 0 : ((pad.left + sx(hoverX)) / W) * 100;

  return (
    <div style={{ position: 'relative' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        role="img"
        aria-label={ariaLabel}
        onPointerMove={onMove}
        onPointerLeave={() => setHoverX(null)}
        style={{ display: 'block', touchAction: 'pan-y', overflow: 'visible' }}
      >
        <g transform={`translate(${pad.left},${pad.top})`}>
          {yTicks.map((t) => (
            <g key={`y${t}`}>
              <line x1={0} x2={plotW} y1={sy(t)} y2={sy(t)} stroke="rgba(180,205,255,0.09)" />
              <text
                x={-12}
                y={sy(t)}
                dy="0.32em"
                textAnchor="end"
                fontSize={12}
                fill="var(--ink-faint)"
                fontFamily="var(--font-mono)"
              >
                {yFormat(t)}
              </text>
            </g>
          ))}
          {xTicks.map((t) => (
            <text
              key={`x${t}`}
              x={sx(t)}
              y={plotH + 22}
              textAnchor="middle"
              fontSize={12}
              fill="var(--ink-faint)"
              fontFamily="var(--font-mono)"
            >
              {xFormat(t)}
            </text>
          ))}
          <line x1={0} x2={plotW} y1={plotH} y2={plotH} stroke="rgba(180,205,255,0.25)" />
          <text
            x={plotW / 2}
            y={plotH + 46}
            textAnchor="middle"
            fontSize={13}
            fill="var(--ink-muted)"
          >
            {xLabel}
          </text>
          <text
            transform={`translate(${-44},${plotH / 2}) rotate(-90)`}
            textAnchor="middle"
            fontSize={13}
            fill="var(--ink-muted)"
          >
            {yLabel}
          </text>

          {reference && reference.y >= y0 && reference.y <= y1 ? (
            <g>
              <line
                x1={0}
                x2={plotW}
                y1={sy(reference.y)}
                y2={sy(reference.y)}
                stroke="rgba(252,211,77,0.55)"
                strokeDasharray="2 5"
              />
              <text
                x={plotW - 4}
                y={sy(reference.y) - 7}
                textAnchor="end"
                fontSize={11.5}
                fill="rgba(252,211,77,0.85)"
              >
                {reference.label}
              </text>
            </g>
          ) : null}

          <defs>
            <clipPath id={clipId}>
              <rect x={0} y={-4} width={plotW} height={plotH + 8} />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clipId})`}>
            {shown.map((s) =>
              s.kind === 'dots' ? (
                <g key={s.id}>
                  {s.points.map(([x, y], i) => (
                    <rect
                      key={i}
                      x={sx(x) - 5}
                      y={sy(y) - 5}
                      width={10}
                      height={10}
                      rx={2}
                      fill="var(--night-900)"
                      stroke={s.color}
                      strokeWidth={2}
                    />
                  ))}
                </g>
              ) : (
                <path
                  key={s.id}
                  d={s.points
                    .map(([x, y], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`)
                    .join('')}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={s.dashed ? 1.8 : 2.6}
                  strokeDasharray={s.dashed ? '7 6' : undefined}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  style={{ filter: s.dashed ? undefined : `drop-shadow(0 0 6px ${s.color}55)` }}
                />
              ),
            )}
          </g>

          {hoverX !== null ? (
            <g pointerEvents="none">
              <line
                x1={sx(hoverX)}
                x2={sx(hoverX)}
                y1={0}
                y2={plotH}
                stroke="rgba(224,242,254,0.35)"
              />
              {readings.map(({ s, y }) => (
                <circle
                  key={s.id}
                  cx={sx(hoverX)}
                  cy={sy(y)}
                  r={4}
                  fill={s.color}
                  stroke="var(--night-900)"
                  strokeWidth={1.5}
                />
              ))}
            </g>
          ) : null}
        </g>
      </svg>

      {hoverX !== null && readings.length > 0 ? (
        <div
          className="glass glass--strong"
          style={{
            position: 'absolute',
            top: 8,
            left: `${tooltipLeft}%`,
            transform: tooltipLeft > 60 ? 'translateX(calc(-100% - 14px))' : 'translateX(14px)',
            padding: '10px 12px',
            borderRadius: 14,
            fontSize: 12.5,
            pointerEvents: 'none',
            minWidth: 170,
            zIndex: 3,
          }}
        >
          <div className="u-label" style={{ color: 'var(--ink-faint)', marginBottom: 6 }}>
            {xLabel.split('(')[0]?.trim()} = {xFormat(hoverX)}
          </div>
          {readings.map(({ s, y }) => (
            <div
              key={s.id}
              style={{ display: 'flex', alignItems: 'center', gap: 8, lineHeight: 1.7 }}
            >
              <span
                style={{ width: 9, height: 9, borderRadius: 3, background: s.color, flex: 'none' }}
              />
              <span style={{ color: 'var(--ink-muted)', flex: 1 }}>{s.label}</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>
                {yFormat(y)}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** Toggle chips for a chart's series, grouped. */
export function SeriesToggles({
  series,
  visible,
  onToggle,
}: {
  series: Series[];
  visible: Set<string>;
  onToggle: (id: string) => void;
}) {
  const groups = [...new Set(series.map((s) => s.group ?? ''))];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {groups.map((g) => (
        <div key={g} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
          {g ? (
            <span className="u-label" style={{ color: 'var(--ink-faint)', minWidth: 92 }}>
              {g}
            </span>
          ) : null}
          {series
            .filter((s) => (s.group ?? '') === g)
            .map((s) => (
              <button
                key={s.id}
                type="button"
                className="toggle"
                aria-pressed={visible.has(s.id)}
                onClick={() => onToggle(s.id)}
              >
                <span
                  className="toggle-swatch"
                  style={
                    s.kind === 'dots'
                      ? { width: 9, height: 9, border: `2px solid ${s.color}`, borderRadius: 2 }
                      : s.dashed
                        ? {
                            background: `repeating-linear-gradient(90deg, ${s.color} 0 4px, transparent 4px 7px)`,
                          }
                        : { background: s.color }
                  }
                />
                {s.label}
              </button>
            ))}
        </div>
      ))}
    </div>
  );
}
