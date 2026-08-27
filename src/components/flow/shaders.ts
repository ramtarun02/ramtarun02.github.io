import { MAX_BODIES, VIEW_OFFSET_X, VIEW_SCALE } from './view';

/**
 * Page-wide flow field.
 *
 * Base flow is the same exact solution as before — potential flow past a
 * Joukowski aerofoil, circulation set by the Kutta condition. Three things are
 * added, and each is a real flow feature rather than an effect:
 *
 *   1. The cursor is a standing disturbance — a doublet paired with a weak
 *      vortex — that follows the pointer continuously instead of a pulse that
 *      decays. Move away and the flow relaxes; it never simply switches off.
 *   2. The panels on the page are bluff bodies. Each contributes an elliptical
 *      doublet, so streamlines genuinely part around the content and close
 *      behind it. The UI sits *in* the flow rather than on top of it.
 *   3. Scrolling raises the incidence and lifts the wing out of frame, so the
 *      shock forms and marches forward as the reader descends.
 */

export const VERTEX_SHADER = /* glsl */ `#version 300 es
in vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }`;

export const FRAGMENT_SHADER = /* glsl */ `#version 300 es
precision highp float;

out vec4 fragColor;

uniform vec2  uResolution;
uniform float uTime;
uniform vec2  uPointer;
uniform float uPointerStrength;
uniform float uPointerSpin;   // swirl shed in proportion to pointer speed
uniform float uAlpha;
uniform float uTheme;
uniform float uQuality;
uniform float uWingRise;      // physical-plane lift of the aerofoil with scroll
uniform int   uBodyCount;
uniform vec4  uBodies[${MAX_BODIES}];   // cx, cy, rx, ry

const float B     = 1.0;
const vec2  MU    = vec2(-0.10, 0.09);
const float U_INF = 1.0;
const float PI    = 3.141592653589793;
const float SCALE = ${VIEW_SCALE.toFixed(1)};
const float OFF_X = ${VIEW_OFFSET_X.toFixed(1)};

vec2 cmul(vec2 a, vec2 b) { return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x); }
vec2 cdiv(vec2 a, vec2 b) { return cmul(a, vec2(b.x, -b.y)) / max(dot(b, b), 1e-9); }
vec2 csqrt(vec2 z) {
  float r = length(z);
  return vec2(sqrt(max(0.5 * (r + z.x), 0.0)),
              sign(z.y + 1e-12) * sqrt(max(0.5 * (r - z.x), 0.0)));
}

float circleRadius() { return length(vec2(B, 0.0) - MU); }

float circulation(float a, float alpha) {
  float beta = asin(clamp(MU.y / a, -1.0, 1.0));
  return 4.0 * PI * U_INF * a * sin(alpha + beta);
}

vec2 potential(vec2 zp, float a, float alpha, float gamma) {
  vec2 rot  = vec2(cos(alpha), -sin(alpha));
  vec2 rotC = vec2(cos(alpha),  sin(alpha));
  vec2 free = cmul(zp, rot) * U_INF;
  vec2 dblt = cdiv(rotC * (U_INF * a * a), zp);
  float theta = atan(-zp.y, -zp.x);
  vec2  lg    = vec2(log(max(length(zp), 1e-6)), theta);
  vec2  vort  = cmul(vec2(0.0, gamma / (2.0 * PI)), lg);
  return free + dblt + vort;
}

vec2 dPotential(vec2 zp, float a, float alpha, float gamma) {
  vec2 rot  = vec2(cos(alpha), -sin(alpha));
  vec2 rotC = vec2(cos(alpha),  sin(alpha));
  vec2 zp2  = cmul(zp, zp);
  return rot * U_INF - cdiv(rotC * (U_INF * a * a), zp2) + cdiv(vec2(0.0, gamma / (2.0 * PI)), zp);
}

vec3 velocityRamp(float t) {
  const vec3 c0 = vec3(0.043, 0.106, 0.227);
  const vec3 c1 = vec3(0.078, 0.251, 0.494);
  const vec3 c2 = vec3(0.118, 0.435, 0.769);
  const vec3 c3 = vec3(0.247, 0.824, 0.933);
  const vec3 c4 = vec3(0.373, 0.890, 0.753);
  const vec3 c5 = vec3(0.659, 0.878, 0.388);
  const vec3 c6 = vec3(0.949, 0.698, 0.298);
  t = clamp(t, 0.0, 1.0) * 6.0;
  if (t < 1.0) return mix(c0, c1, t);
  if (t < 2.0) return mix(c1, c2, t - 1.0);
  if (t < 3.0) return mix(c2, c3, t - 2.0);
  if (t < 4.0) return mix(c3, c4, t - 3.0);
  if (t < 5.0) return mix(c4, c5, t - 4.0);
  return mix(c5, c6, t - 5.0);
}

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 uv = (gl_FragCoord.xy / uResolution) * 2.0 - 1.0;
  vec2 z  = vec2(uv.x * aspect, uv.y) * SCALE + vec2(OFF_X, 0.0);

  // ---- aerofoil, lifted out of frame as the page scrolls ----
  vec2 zw = z - vec2(0.0, uWingRise);

  float a     = circleRadius();
  float gamma = circulation(a, uAlpha);

  vec2 disc  = csqrt(cmul(zw, zw) - vec2(4.0 * B * B, 0.0));
  vec2 zetaA = (zw + disc) * 0.5;
  vec2 zetaB = (zw - disc) * 0.5;
  vec2 zeta  = (length(zetaA - MU) >= length(zetaB - MU)) ? zetaA : zetaB;

  vec2  zp = zeta - MU;
  float rr = length(zp);
  float inside = 1.0 - smoothstep(a - 0.012, a + 0.012, rr);

  vec2 w  = potential(zp, a, uAlpha, gamma);
  vec2 dw = dPotential(zp, a, uAlpha, gamma);
  vec2 dz = vec2(1.0, 0.0) - cdiv(vec2(B * B, 0.0), cmul(zeta, zeta));
  vec2 vel = cdiv(dw, dz);

  float psi = w.y;
  float phi = w.x;
  float speed = min(length(vel), 4.0);

  // ---- the page's panels as bluff bodies ----
  // Each contributes an elliptical doublet: the flow parts around the content
  // and closes behind it, which is what makes the UI feel submerged in the
  // field rather than floating over it.
  float bodyMask = 0.0;
  for (int i = 0; i < ${MAX_BODIES}; i++) {
    if (i >= uBodyCount) break;
    vec4 body = uBodies[i];
    vec2 d = vec2((z.x - body.x) / max(body.z, 0.001), (z.y - body.y) / max(body.w, 0.001));
    // Same soft core as the cursor: without it a panel's doublet overpowers the
    // freestream near its centre and pinches off a closed eddy — a bullseye
    // behind every card.
    float r2 = dot(d, d) + 0.85;
    float k  = 0.42;
    psi   += -k * d.y / r2;
    phi   +=  k * d.x / r2;
    speed +=  k * 0.34 / r2;
    bodyMask = max(bodyMask, 1.0 - smoothstep(0.80, 1.12, length(d)));
  }

  // ---- the cursor as a body in the flow ----
  // Treated exactly like a panel: a finite body the flow parts around, not a
  // point singularity. A point doublet paired with a vortex produces closed
  // concentric streamlines — correct potential flow, but it reads as a
  // decorative ripple rather than as fluid being displaced.
  {
    // Soft core. Streamlines are contours of psi, so they close into loops
    // wherever the disturbance's gradient exceeds the freestream's. Softening
    // the core to r^2 + CORE bounds d(psi)/dy below U_INF, which means the
    // cursor bends the flow strongly but never pinches off a closed eddy —
    // the difference between fluid being displaced and a decorative ripple.
    const float CORE = 0.9;
    float radius = 1.15;
    vec2  d  = (z - uPointer) / radius;
    float r2 = dot(d, d) + CORE;
    float k  = uPointerStrength * 0.62;
    psi   += -k * d.y / r2;
    phi   +=  k * d.x / r2;
    speed +=  k * 0.5 / r2;

    // Move quickly and it sheds swirl behind it, which then decays.
    psi   += uPointerSpin * 0.12 * log(r2);
    speed += abs(uPointerSpin) * 0.28 / max(sqrt(r2), 0.7);
  }

  // ---- filaments ----
  // Rendered like a smoke-flow photograph rather than a contour plot: far fewer
  // lines, each a sharp core inside a soft halo, over mostly empty ground. The
  // eye needs somewhere to rest, and detail concentrated near the body reads as
  // depth rather than as pattern.
  float density = mix(1.5, 2.1, uQuality);
  float s       = psi * density;
  float band    = abs(fract(s) - 0.5);
  float aa      = max(fwidth(s), 0.0008);

  float coreW = max(aa * 1.3, 0.020);
  float haloW = max(aa * 5.0, 0.115);
  float core  = 1.0 - smoothstep(0.0, coreW, band);
  float halo  = 1.0 - smoothstep(0.0, haloW, band);

  float dash = fract(phi * 1.0 - uTime * 0.34);
  dash = smoothstep(0.04, 0.36, dash) * (1.0 - smoothstep(0.52, 0.94, dash));

  // Presence falls away from the things that matter: the wing, the cursor and
  // the panel edges. Everywhere else settles to near-silence.
  float nearWing   = smoothstep(6.5, 1.2, length(zw));
  float nearCursor = smoothstep(4.2, 0.6, length(z - uPointer));
  float nearBody   = smoothstep(0.0, 0.55, bodyMask) * (1.0 - bodyMask);
  float presence   = clamp(max(max(nearWing, nearCursor), nearBody) + 0.10, 0.0, 1.0);

  float streak = (core * 0.95 + halo * 0.22) * mix(0.30, 1.0, dash) * presence;

  // ---- colour ----
  float t   = clamp((speed - 0.25) / 2.1, 0.0, 1.0);
  vec3 ramp = velocityRamp(t);

  vec3 ground = mix(vec3(0.957, 0.969, 0.988), vec3(0.024, 0.039, 0.071), uTheme);

  // The ground stays the ground. A wash of ramp colour across the whole
  // viewport is what made this muddy — colour is now carried almost entirely by
  // the filaments, and the ramp only asserts itself where the flow is fast.
  float hot = smoothstep(0.45, 0.95, t);
  vec3 filament = mix(
    mix(vec3(0.42, 0.62, 0.80), vec3(0.60, 0.82, 0.98), uTheme),
    ramp * mix(1.0, 1.3, uTheme),
    hot
  );

  vec3 col = mix(ground, ground * mix(1.06, 1.18, uTheme), 0.35 * presence);
  col = mix(col, filament, clamp(streak, 0.0, 1.0) * mix(0.80, 0.95, uTheme));

  vec3 body = mix(vec3(0.988, 0.992, 1.0), vec3(0.008, 0.016, 0.035), uTheme);
  col = mix(col, body, inside);
  float rim = 1.0 - smoothstep(0.0, 0.045, abs(rr - a));
  col = mix(col, ramp * mix(1.0, 1.5, uTheme), rim * 0.9);

  // Nothing is drawn under a panel. The whole effect lives at the edges, where
  // the flow parts — which is also the only place a viewer can see it.
  col = mix(col, ground, smoothstep(0.55, 0.95, bodyMask));

  float vig = smoothstep(2.1, 0.35, length(uv * vec2(0.78, 1.0)));
  col = mix(ground, col, 0.30 + 0.70 * vig);

  fragColor = vec4(col, 1.0);
}`;
