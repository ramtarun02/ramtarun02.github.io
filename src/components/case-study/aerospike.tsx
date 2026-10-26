'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import data from './data/aerospike.json';
import { LineChart, SeriesToggles, type Series } from './LineChart';

/* ============================================================
   Data plumbing
   Profiles come from the Fluent wall exports (one row per dome
   node, decimated); benchmark curves were digitised from
   Roveda (2009), Figs. 12–13. Nothing here is hand-typed except
   the two paper error figures, which the paper itself reports.
   ============================================================ */

type Mesh = 'noamr' | 'amr';
const profiles = data.profiles as unknown as Record<string, [number, number, number][]>;
const pBench = data.pressureBenchmark as unknown as Record<string, [number, number][]>;
const tBench = data.temperatureBenchmark as unknown as Record<string, [number, number][]>;

const COLORS = {
  sst: '#7dd3fc',
  sa: '#6ee7b7',
  ke: '#fda4af',
  rke: '#fdba74',
  exp: '#ffffff',
  cfdpp22: '#c4b5fd',
  cfdpp21: '#a5b4fc',
  fluentPaper: '#fcd34d',
};

const MODELS = [
  { id: 'sst', label: 'SST k-ω (S20)', key: 'prod_sstkw_s20', color: COLORS.sst },
  { id: 'sa', label: 'Spalart–Allmaras (S20)', key: 'prod_sa_s20', color: COLORS.sa },
  { id: 'ke', label: 'Standard k-ε (S21)', key: 'prod_kestd_s21', color: COLORS.ke },
  { id: 'rke', label: 'Realizable k-ε (S20)', key: 's20_bsl_rzke', color: COLORS.rke },
] as const;

function profileKey(base: string, mesh: Mesh): string {
  return base.startsWith('s20_bsl') ? `${base}_${mesh}` : `${base}_${mesh}_solved`;
}

function presentSeries(column: 1 | 2, mesh: Mesh): Series[] {
  return MODELS.flatMap((m) => {
    const rows = profiles[profileKey(m.key, mesh)];
    if (!rows) return [];
    return [
      {
        id: m.id,
        label: m.label,
        color: m.color,
        group: 'This study',
        points: rows.map((r) => [r[0], r[column]] as [number, number]),
      },
    ];
  });
}

function useToggleSet(initial: string[]) {
  const [visible, setVisible] = useState(() => new Set(initial));
  const toggle = (id: string) =>
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  return [visible, toggle] as const;
}

function MeshSwitch({ mesh, onChange }: { mesh: Mesh; onChange: (m: Mesh) => void }) {
  return (
    <div className="segmented" role="group" aria-label="Mesh">
      <button type="button" aria-pressed={mesh === 'noamr'} onClick={() => onChange('noamr')}>
        Mesh 3 · 103k
      </button>
      <button type="button" aria-pressed={mesh === 'amr'} onClick={() => onChange('amr')}>
        AMR · ~330k
      </button>
    </div>
  );
}

function ChartFrame({
  title,
  controls,
  children,
  footer,
}: {
  title: string;
  controls?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <p className="u-label" style={{ color: 'var(--ice-200)', margin: 0 }}>
          {title}
        </p>
        {controls}
      </div>
      <div className="u-scroll-x">
        <div style={{ minWidth: 520 }}>{children}</div>
      </div>
      {footer}
    </div>
  );
}

/* ============================================================
   Dome surface pressure
   ============================================================ */

export function DomePressureChart() {
  const [mesh, setMesh] = useState<Mesh>('noamr');
  const [visible, toggle] = useToggleSet(['exp', 'cfdpp22', 'fluentPaper', 'sst', 'sa', 'ke']);

  const series = useMemo<Series[]>(
    () => [
      {
        id: 'exp',
        label: 'Huebner experiment',
        color: COLORS.exp,
        kind: 'dots',
        group: 'Benchmark',
        points: pBench['Huebner Experiment'] ?? [],
      },
      {
        id: 'cfdpp22',
        label: 'CFD++ (S22)',
        color: COLORS.cfdpp22,
        dashed: true,
        group: 'Benchmark',
        points: pBench['CFD++ RMS-S22'] ?? [],
      },
      {
        id: 'cfdpp21',
        label: 'CFD++ (S21)',
        color: COLORS.cfdpp21,
        dashed: true,
        group: 'Benchmark',
        points: pBench['CFD++ - RMS S21'] ?? [],
      },
      {
        id: 'fluentPaper',
        label: 'Fluent in the paper',
        color: COLORS.fluentPaper,
        dashed: true,
        group: 'Benchmark',
        points: pBench['Roveda-Fluent-CFD'] ?? [],
      },
      ...presentSeries(1, mesh),
    ],
    [mesh],
  );

  return (
    <ChartFrame
      title="Dome surface pressure, P/P∞"
      controls={<MeshSwitch mesh={mesh} onChange={setMesh} />}
      footer={
        <>
          <SeriesToggles series={series} visible={visible} onToggle={toggle} />
          {mesh === 'amr' && visible.has('rke') ? (
            <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-faint)' }}>
              Realizable k-ε was only run on Mesh 3.
            </p>
          ) : null}
        </>
      }
    >
      <LineChart
        series={series}
        visible={visible}
        xDomain={[0, 2.6]}
        xLabel="Arc length from dome apex, s (in)"
        yLabel="P / P∞"
        ariaLabel="Dome surface pressure ratio against arc length from the dome apex. SST k-omega and Spalart-Allmaras follow the experimental points and the CFD++ curves; standard k-epsilon over-predicts with a mid-dome hump and a large shoulder peak; the paper's Fluent result sits well below the experiment."
      />
    </ChartFrame>
  );
}

/* ============================================================
   Dome surface temperature
   ============================================================ */

export function DomeTemperatureChart() {
  const [visible, toggle] = useToggleSet(['cfdpp22', 'fluentPaper', 'sst', 'sa', 'ke']);
  const series = useMemo<Series[]>(
    () => [
      {
        id: 'cfdpp22',
        label: 'CFD++ (S22)',
        color: COLORS.cfdpp22,
        dashed: true,
        group: 'Benchmark',
        points: tBench['CFDpp_S22'] ?? [],
      },
      {
        id: 'fluentPaper',
        label: 'Fluent in the paper',
        color: COLORS.fluentPaper,
        dashed: true,
        group: 'Benchmark',
        points: tBench['Fluent_Ref16'] ?? [],
      },
      ...presentSeries(2, 'noamr').filter((s) => s.id !== 'rke'),
    ],
    [],
  );
  return (
    <ChartFrame
      title="Dome surface temperature, T/T∞"
      footer={<SeriesToggles series={series} visible={visible} onToggle={toggle} />}
    >
      <LineChart
        series={series}
        visible={visible}
        xDomain={[0, 2.6]}
        yDomain={[4.5, 9]}
        xLabel="Arc length from dome apex, s (in)"
        yLabel="T / T∞"
        yFormat={(v) => v.toFixed(1)}
        reference={{ y: 8.34, label: 'adiabatic recovery limit T₀/T∞ = 8.34' }}
        ariaLabel="Dome surface temperature ratio. All three turbulence models sit between 8.0 and 8.2, within about two percent of CFD++, just below the adiabatic recovery limit of 8.34. The paper's Fluent result sits around 5 to 6."
      />
    </ChartFrame>
  );
}

/* ============================================================
   Error against the experiment
   ============================================================ */

const caseRow = (id: string) => data.cases.find((c) => c.case_id === id);

interface ErrRow {
  label: string;
  color: string;
  mean: number;
  max: number;
  note?: string;
}

function errorRows(mesh: Mesh): ErrRow[] {
  const pick = (id: string, label: string, color: string): ErrRow | null => {
    const row = caseRow(id);
    return row
      ? { label, color, mean: row.mean_abs_rel_err_pct, max: row.max_abs_rel_err_pct }
      : null;
  };
  const rows: (ErrRow | null)[] = [
    pick(`prod_sa_s20_${mesh}_solved`, 'Spalart–Allmaras', COLORS.sa),
    pick(`prod_sstkw_s20_${mesh}_solved`, 'SST k-ω', COLORS.sst),
    { label: 'CFD++ (paper)', color: COLORS.cfdpp22, mean: 3.8, max: 11.7, note: 'benchmark' },
    {
      label: 'Fluent (paper)',
      color: COLORS.fluentPaper,
      mean: 34.8,
      max: 42.5,
      note: 'benchmark',
    },
    pick(`prod_kestd_s21_${mesh}_solved`, 'Standard k-ε', COLORS.ke),
    mesh === 'noamr'
      ? { label: 'Realizable k-ε', color: COLORS.rke, mean: 109.7, max: 253.4 }
      : null,
  ];
  return rows.filter((r): r is ErrRow => r !== null);
}

export function ErrorChart() {
  const [mesh, setMesh] = useState<Mesh>('noamr');
  const rows = errorRows(mesh);
  const scaleMax = 120;
  return (
    <ChartFrame
      title="Error at the 8 experimental points"
      controls={<MeshSwitch mesh={mesh} onChange={setMesh} />}
    >
      <div
        role="table"
        aria-label="Mean and maximum absolute error against the Huebner experiment"
        style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        {rows.map((r) => (
          <div
            role="row"
            key={r.label}
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(110px,150px) minmax(0,1fr) 150px',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <span role="rowheader" style={{ fontSize: 14, color: 'var(--ink)' }}>
              {r.label}
              {r.note ? (
                <span style={{ display: 'block', fontSize: 11.5, color: 'var(--ink-faint)' }}>
                  {r.note}
                </span>
              ) : null}
            </span>
            <span role="cell" style={{ position: 'relative', height: 26 }}>
              <span
                style={{
                  position: 'absolute',
                  inset: '11px 0',
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.04)',
                }}
              />
              <motion.span
                initial={false}
                animate={{ width: `${Math.min(100, (r.max / scaleMax) * 100)}%` }}
                transition={{ type: 'spring', stiffness: 160, damping: 26 }}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 11,
                  height: 4,
                  borderRadius: 4,
                  background: r.color,
                  opacity: 0.35,
                }}
              />
              <motion.span
                initial={false}
                animate={{ width: `${Math.max(1.2, Math.min(100, (r.mean / scaleMax) * 100))}%` }}
                transition={{ type: 'spring', stiffness: 160, damping: 26 }}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 3,
                  height: 20,
                  borderRadius: 7,
                  background: r.color,
                  boxShadow: `0 0 16px ${r.color}55`,
                }}
              />
              {r.max > scaleMax ? (
                <span
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 4,
                    fontSize: 11,
                    color: 'var(--ink-faint)',
                  }}
                >
                  →
                </span>
              ) : null}
            </span>
            <span
              role="cell"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                color: 'var(--ink-muted)',
                textAlign: 'right',
              }}
            >
              <span style={{ color: 'var(--ink)' }}>{r.mean.toFixed(1)}%</span> · max{' '}
              {r.max.toFixed(0)}%
            </span>
          </div>
        ))}
        <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--ink-faint)' }}>
          Thick bar: mean |error|. Thin bar: worst single point. Axis capped at 120%.
        </p>
      </div>
    </ChartFrame>
  );
}

/* ============================================================
   What actually moves the answer
   ============================================================ */

export function SensitivityChart() {
  const rows = [
    {
      label: 'Turbulence model',
      detail: 'SST k-ω → standard k-ε, peak dome P/P∞',
      value: 60,
      text: '≈ 60%',
      color: COLORS.ke,
    },
    {
      label: 'Mesh / AMR',
      detail: 'Mesh 3 → AMR, aft-dome P/P∞',
      value: 8,
      text: '3–8%',
      color: COLORS.cfdpp22,
    },
    {
      label: 'Mesh density',
      detail: '103k → 188k cells, drag',
      value: 1.4,
      text: '1.4%',
      color: COLORS.cfdpp21,
    },
    {
      label: 'Inlet turbulence',
      detail: 'S20 → S21 → S22 (SST), peak dome P/P∞',
      value: 0.3,
      text: '< 1%',
      color: COLORS.sst,
    },
  ];
  return (
    <ChartFrame title="How much each choice moved the result">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {rows.map((r, i) => (
          <div key={r.label}>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 7 }}
            >
              <span style={{ fontSize: 15, fontWeight: 700 }}>
                {r.label}
                <span
                  style={{
                    display: 'block',
                    fontSize: 12.5,
                    fontWeight: 400,
                    color: 'var(--ink-faint)',
                  }}
                >
                  {r.detail}
                </span>
              </span>
              <span
                className="u-gradient-text"
                style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em' }}
              >
                {r.text}
              </span>
            </div>
            <div
              style={{
                height: 12,
                borderRadius: 6,
                background: 'rgba(255,255,255,0.05)',
                overflow: 'hidden',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.max(0.8, (r.value / 60) * 100)}%` }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.1, delay: i * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
                style={{
                  height: '100%',
                  borderRadius: 6,
                  background: r.color,
                  boxShadow: `0 0 14px ${r.color}88`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </ChartFrame>
  );
}

/* ============================================================
   The run matrix: what "converged" meant for each case
   ============================================================ */

type Row = (typeof data.cases)[number];

function statusTone(status: string): { tone: 'good' | 'warn' | 'bad'; short: string } {
  if (status.startsWith('Diverged')) return { tone: 'bad', short: 'Diverged' };
  if (status.includes('anomaly')) return { tone: 'warn', short: 'Hot-cell pocket' };
  if (status.includes('monitor still moving')) return { tone: 'warn', short: 'Monitor drifting' };
  if (status.startsWith('Iteration limit')) return { tone: 'warn', short: 'Hit 30k cap' };
  return { tone: 'good', short: 'Converged' };
}

const TONE = {
  good: { bg: 'rgba(110,231,183,0.12)', border: 'rgba(110,231,183,0.35)', text: '#a7f3d0' },
  warn: { bg: 'rgba(252,211,77,0.1)', border: 'rgba(252,211,77,0.32)', text: '#fde68a' },
  bad: { bg: 'rgba(253,164,175,0.12)', border: 'rgba(253,164,175,0.4)', text: '#fecdd3' },
};

export function RunMatrix() {
  const rows: { model: string; config: string }[] = [
    { model: 'SST k-ω', config: 'S20' },
    { model: 'SST k-ω', config: 'S21' },
    { model: 'SST k-ω', config: 'S22' },
    { model: 'Spalart-Allmaras', config: 'S20' },
    { model: 'Standard k-ε', config: 'S20' },
    { model: 'Standard k-ε', config: 'S21' },
    { model: 'Standard k-ε', config: 'S22' },
  ];
  const find = (model: string, config: string, mesh: string) =>
    data.cases.find((c) => c.model === model && c.config === config && c.mesh === mesh);
  const [selected, setSelected] = useState<Row | undefined>(find('Standard k-ε', 'S20', 'No-AMR'));

  return (
    <ChartFrame title="All 14 production runs — tap one">
      <div className="rm-grid">
        <div
          role="group"
          aria-label="Run matrix"
          style={{ display: 'grid', gridTemplateColumns: 'minmax(130px,1fr) 1fr 1fr', gap: 8 }}
        >
          <span />
          <span className="u-label" style={{ color: 'var(--ink-faint)', textAlign: 'center' }}>
            Mesh 3
          </span>
          <span className="u-label" style={{ color: 'var(--ink-faint)', textAlign: 'center' }}>
            AMR
          </span>
          {rows.map((r) => (
            <RowCells
              key={`${r.model}${r.config}`}
              r={r}
              find={find}
              selected={selected}
              onSelect={setSelected}
            />
          ))}
        </div>
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.case_id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="glass glass--quiet"
              style={{ borderRadius: 18, padding: 18, alignSelf: 'start' }}
            >
              <RunDetail row={selected} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <style>{`
        .rm-grid { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 20px; }
        @media (max-width: 760px) { .rm-grid { grid-template-columns: 1fr; } }
      `}</style>
    </ChartFrame>
  );
}

function RowCells({
  r,
  find,
  selected,
  onSelect,
}: {
  r: { model: string; config: string };
  find: (m: string, c: string, mesh: string) => Row | undefined;
  selected: Row | undefined;
  onSelect: (row: Row) => void;
}) {
  return (
    <>
      <span style={{ fontSize: 13.5, alignSelf: 'center', lineHeight: 1.25 }}>
        {r.model} <span style={{ color: 'var(--ink-faint)' }}>{r.config}</span>
      </span>
      {(['No-AMR', 'AMR'] as const).map((mesh) => {
        const row = find(r.model, r.config, mesh);
        if (!row) return <span key={mesh} />;
        const { tone, short } = statusTone(row.status);
        const t = TONE[tone];
        const isSel = selected?.case_id === row.case_id;
        return (
          <button
            key={mesh}
            type="button"
            onClick={() => onSelect(row)}
            aria-pressed={isSel}
            aria-label={`${r.model} ${r.config} ${mesh}: ${row.status}`}
            style={{
              minHeight: 40,
              borderRadius: 12,
              border: `1px solid ${isSel ? '#e0f2fe' : t.border}`,
              background: t.bg,
              color: t.text,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: isSel ? '0 0 0 3px rgba(224,242,254,0.15)' : undefined,
              transition: 'box-shadow 0.2s, border-color 0.2s',
            }}
          >
            {short}
          </button>
        );
      })}
    </>
  );
}

function RunDetail({ row }: { row: Row }) {
  const { tone } = statusTone(row.status);
  const diverged = tone === 'bad';
  const items: [string, string][] = [
    ['Cells', row.cells.toLocaleString('en-GB')],
    ['Iterations', row.iterations.toLocaleString('en-GB')],
    ['Max scaled residual', row.res_max.toExponential(0)],
    ['Dome monitor drift (last 500 it.)', `${row.dome_p_drift_last500_pct.toFixed(2)}%`],
    ['Peak temperature', `${row.T_max_K.toFixed(0)} K`],
    ['Cells above 1000 K', row.hot_cells_T_gt_1000K.toLocaleString('en-GB')],
    ['Drag', diverged ? '—' : `${row.fluent_drag_N.toFixed(1)} N`],
  ];
  return (
    <div>
      <p style={{ margin: 0, fontWeight: 800 }}>
        {row.model} · {row.config} · {row.mesh === 'No-AMR' ? 'Mesh 3' : 'AMR'}
      </p>
      <p style={{ margin: '4px 0 12px', fontSize: 13.5, color: TONE[tone].text }}>{row.status}</p>
      <dl style={{ margin: 0, display: 'grid', gap: 6 }}>
        {items.map(([k, v]) => (
          <div
            key={k}
            style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 13 }}
          >
            <dt style={{ color: 'var(--ink-faint)' }}>{k}</dt>
            <dd style={{ margin: 0, fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>{v}</dd>
          </div>
        ))}
      </dl>
      <p style={{ margin: '12px 0 0', fontSize: 12, color: 'var(--ink-faint)', lineHeight: 1.5 }}>
        Physical ceiling: T₀ = 486 K. Anything hotter is a numerical artefact, whatever the
        residuals say.
      </p>
    </div>
  );
}

/* ============================================================
   Before / after slider: fixed mesh vs AMR schlieren
   ============================================================ */

export function SchlierenCompare() {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClient = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <ChartFrame title="Numerical schlieren — drag to compare">
      <div
        ref={ref}
        onPointerDown={(e) => {
          dragging.current = true;
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          setFromClient(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && setFromClient(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        style={{
          position: 'relative',
          aspectRatio: '1279 / 521',
          borderRadius: 18,
          overflow: 'hidden',
          cursor: 'ew-resize',
          userSelect: 'none',
          touchAction: 'pan-y',
          background: '#fff',
        }}
      >
        <Image
          src="/case-studies/aerospike/schlieren_amr.webp"
          alt="Numerical schlieren on the AMR mesh: thin, sharp shocks."
          fill
          sizes="(max-width: 900px) 100vw, 800px"
          style={{ objectFit: 'cover' }}
          draggable={false}
        />
        <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image
            src="/case-studies/aerospike/schlieren_fixed.webp"
            alt="Numerical schlieren on the fixed 103k-cell mesh: thick, smeared shocks."
            fill
            sizes="(max-width: 900px) 100vw, 800px"
            style={{ objectFit: 'cover' }}
            draggable={false}
          />
        </div>
        <span
          className="chip"
          style={{ position: 'absolute', left: 12, top: 12, background: 'rgba(7,12,26,0.75)' }}
        >
          Mesh 3 · 103,535 cells
        </span>
        <span
          className="chip"
          style={{ position: 'absolute', right: 12, top: 12, background: 'rgba(7,12,26,0.75)' }}
        >
          AMR · 327,497 cells
        </span>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${pos}%`,
            width: 2,
            background: '#7dd3fc',
            boxShadow: '0 0 12px #7dd3fc',
            transform: 'translateX(-1px)',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 38,
              height: 38,
              transform: 'translate(-50%,-50%)',
              borderRadius: '50%',
              background: 'rgba(7,12,26,0.85)',
              border: '2px solid #7dd3fc',
              display: 'grid',
              placeItems: 'center',
              color: '#e0f2fe',
              fontSize: 14,
            }}
          >
            ⇆
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Compare fixed mesh and AMR schlieren"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'ew-resize',
            margin: 0,
          }}
        />
      </div>
    </ChartFrame>
  );
}
