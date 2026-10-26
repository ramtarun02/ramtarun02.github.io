'use client';

import { useId, useState } from 'react';
import { motion } from 'motion/react';

/*
 * The hero caption, made literal: a small widget that actually runs the lift
 * numbers for an A380 at maximum take-off weight. L = ½ρV²SC_L, solved for the
 * lift coefficient the wing has to produce at the chosen speed.
 */
const MASS_KG = 575_000; // A380 maximum take-off weight
const WING_AREA = 845; // m²
const RHO = 1.225; // kg/m³, ISA sea level
const G = 9.81;
const KT = 0.514444;

function verdict(cl: number): { text: string; tone: string } {
  if (cl > 2.4)
    return { text: 'Still on the runway — no wing makes that much lift.', tone: '#fda4af' };
  if (cl > 1.6)
    return { text: 'Flaps and slats out. This is rotation territory.', tone: '#fcd34d' };
  return { text: 'Comfortably flying. The flaps can start coming in.', tone: '#6ee7b7' };
}

export function LiftConfession() {
  const [knots, setKnots] = useState(150);
  const id = useId();
  const v = knots * KT;
  const q = 0.5 * RHO * v * v;
  const weight = MASS_KG * G;
  const cl = weight / (q * WING_AREA);
  const { text, tone } = verdict(cl);

  return (
    <div
      className="glass lc"
      style={{
        borderRadius: 28,
        padding: 'clamp(20px, 3vw, 26px)',
        background:
          'radial-gradient(120% 90% at 100% 0%, rgba(246,165,96,0.16), transparent 55%), linear-gradient(160deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))',
      }}
    >
      <div className="lc-text">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <span className="u-label" style={{ color: 'var(--dusk)' }}>
            Confession
          </span>
          <span aria-hidden="true" style={{ fontSize: 20 }}>
            ✈️
          </span>
        </div>
        <p
          style={{
            margin: '10px 0 0',
            fontSize: 'var(--text-lg)',
            fontWeight: 800,
            lineHeight: 1.4,
          }}
        >
          I can&rsquo;t watch an A380 take off without running the lift numbers in my head — old
          habit, still haven&rsquo;t found the off switch.
        </p>
        <p style={{ margin: '8px 0 0', color: 'var(--ink-muted)', fontSize: 15 }}>
          So go on, run them with me.
        </p>
      </div>

      <div className="lc-calc">
        <label
          htmlFor={id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 18,
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          <span>Speed down the runway</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ice-200)' }}>
            {knots} kt
          </span>
        </label>
        <input
          id={id}
          type="range"
          min={110}
          max={190}
          step={1}
          value={knots}
          onChange={(e) => setKnots(Number(e.target.value))}
          className="lift-range"
          style={{ ['--p' as string]: `${((knots - 110) / 80) * 100}%` }}
        />

        <dl
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
            gap: 10,
            margin: '16px 0 0',
          }}
        >
          {[
            ['Lift needed', `${(weight / 1e6).toFixed(2)} MN`],
            ['Dynamic pressure', `${(q / 1000).toFixed(2)} kPa`],
            ['C_L needed', cl.toFixed(2)],
          ].map(([k, val]) => (
            <div
              key={k}
              style={{
                padding: '10px 12px',
                borderRadius: 14,
                background: 'rgba(3,7,16,0.45)',
                border: '1px solid var(--edge)',
              }}
            >
              <dt
                style={{
                  fontSize: 11.5,
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-faint)',
                }}
              >
                {k === 'C_L needed' ? (
                  <>
                    C<sub>L</sub> needed
                  </>
                ) : (
                  k
                )}
              </dt>
              <dd
                style={{
                  margin: '4px 0 0',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 16,
                  color: 'var(--ink)',
                }}
              >
                {val}
              </dd>
            </div>
          ))}
        </dl>

        <motion.p
          key={text}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          aria-live="polite"
          style={{ margin: '14px 0 0', fontWeight: 800, color: tone, fontSize: 15 }}
        >
          {text}
        </motion.p>
        <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--ink-faint)' }}>
          L = ½ρV²SC<sub>L</sub> · 575 t max take-off weight · 845 m² wing · sea-level air
        </p>
      </div>

      <style>{`
        .lc { display: grid; gap: 4px; }
        @media (min-width: 900px) {
          .lc { grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); gap: 40px; align-items: center; }
          .lc .lc-text p:first-of-type { font-size: var(--text-xl); }
          .lc .lc-calc label { margin-top: 0 !important; }
        }
        .lift-range { width: 100%; margin: 10px 0 0; height: 30px; background: transparent; -webkit-appearance: none; appearance: none; touch-action: pan-y; }
        .lift-range::-webkit-slider-runnable-track { height: 6px; border-radius: 3px;
          background: linear-gradient(90deg, #7dd3fc var(--p), rgba(255,255,255,0.12) var(--p)); }
        .lift-range::-moz-range-track { height: 6px; border-radius: 3px; background: rgba(255,255,255,0.12); }
        .lift-range::-moz-range-progress { height: 6px; border-radius: 3px; background: #7dd3fc; }
        .lift-range::-webkit-slider-thumb { -webkit-appearance: none; width: 26px; height: 26px; margin-top: -10px; border-radius: 50%;
          background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.45), 0 0 0 4px rgba(125,211,252,0.25); }
        .lift-range::-moz-range-thumb { width: 26px; height: 26px; border: 0; border-radius: 50%; background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.45); }
      `}</style>
    </div>
  );
}
