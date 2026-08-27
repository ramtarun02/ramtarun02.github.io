/**
 * Flow field shaders.
 *
 * The field is an exact solution, not noise: potential flow past a Joukowski
 * aerofoil, obtained by mapping the flow past a circle through z = ζ + b²/ζ,
 * with circulation set by the Kutta condition so the rear stagnation point sits
 * at the trailing edge.
 *
 * Streamlines are contours of the stream function ψ = Im(w). They animate by
 * advancing a dash phase along the velocity potential φ = Re(w), which is how
 * streakline visualisation actually works — the lines stay put, the fluid moves
 * along them. Colour is velocity magnitude on the site's velocity ramp.
 */

export const VERTEX_SHADER = /* glsl */ `#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

export const FRAGMENT_SHADER = /* glsl */ `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform vec2  uResolution;
uniform float uTime;
uniform vec2  uPointer;        // physical-plane position of the cursor
uniform float uPointerAmount;  // 0 when idle, rises on movement
uniform float uAlpha;          // incidence, radians
uniform float uTheme;          // 1.0 dark, 0.0 light
uniform float uQuality;        // 1.0 full, 0.0 reduced

const float B      = 1.0;              // Joukowski parameter
const vec2  MU     = vec2(-0.10, 0.09); // circle centre: thickness and camber
const float U_INF  = 1.0;
const float PI     = 3.141592653589793;

// ---- complex arithmetic -------------------------------------------------
vec2 cmul(vec2 a, vec2 b) { return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x); }
vec2 cdiv(vec2 a, vec2 b) { return cmul(a, vec2(b.x, -b.y)) / max(dot(b, b), 1e-9); }
vec2 csqrt(vec2 z) {
  float r = length(z);
  return vec2(sqrt(max(0.5 * (r + z.x), 0.0)),
              sign(z.y + 1e-12) * sqrt(max(0.5 * (r - z.x), 0.0)));
}

// ---- flow ---------------------------------------------------------------
// Radius that places the trailing edge exactly at zeta = B, so the mapped
// aerofoil closes to a sharp trailing edge.
float circleRadius() { return length(vec2(B, 0.0) - MU); }

// Kutta condition: circulation that moves the rear stagnation point to the
// trailing edge. beta is the camber angle of the circle centre.
float circulation(float a, float alpha) {
  float beta = asin(clamp(MU.y / a, -1.0, 1.0));
  return 4.0 * PI * U_INF * a * sin(alpha + beta);
}

// Complex potential w(zeta) for flow past the circle: freestream, its image
// doublet, and a point vortex of strength gamma.
vec2 potential(vec2 zp, float a, float alpha, float gamma) {
  vec2 rot  = vec2(cos(alpha), -sin(alpha));
  vec2 rotC = vec2(cos(alpha),  sin(alpha));
  vec2 free = cmul(zp, rot) * U_INF;
  vec2 dblt = cdiv(rotC * (U_INF * a * a), zp);
  // Branch cut placed downstream, where the seam reads as a wake line rather
  // than an artefact cutting across the oncoming flow.
  float theta = atan(-zp.y, -zp.x);
  vec2  clog  = vec2(log(max(length(zp), 1e-6)), theta);
  vec2  vort  = cmul(vec2(0.0, gamma / (2.0 * PI)), clog);
  return free + dblt + vort;
}

// dw/dzeta — the circle-plane velocity, conjugated.
vec2 dPotential(vec2 zp, float a, float alpha, float gamma) {
  vec2 rot  = vec2(cos(alpha), -sin(alpha));
  vec2 rotC = vec2(cos(alpha),  sin(alpha));
  vec2 zp2  = cmul(zp, zp);
  vec2 term = rot * U_INF - cdiv(rotC * (U_INF * a * a), zp2);
  vec2 vort = cdiv(vec2(0.0, gamma / (2.0 * PI)), zp);
  return term + vort;
}

// ---- velocity ramp ------------------------------------------------------
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
  vec2 uv = vUv * 2.0 - 1.0;

  // Physical plane. The aerofoil spans roughly -2..2, so scale to sit it in
  // the left-centre of frame with room for the wake.
  // Aerofoil sits right of centre, clear of the hero panel on the left.
  vec2 z = vec2(uv.x * aspect, uv.y) * 3.4 + vec2(-3.0, 0.0);

  float a     = circleRadius();
  float gamma = circulation(a, uAlpha);

  // Inverse Joukowski. Two roots; keep the one outside the circle so we stay
  // on the physical sheet.
  vec2 disc = csqrt(cmul(z, z) - vec2(4.0 * B * B, 0.0));
  vec2 zetaA = (z + disc) * 0.5;
  vec2 zetaB = (z - disc) * 0.5;
  vec2 zeta  = (length(zetaA - MU) >= length(zetaB - MU)) ? zetaA : zetaB;

  vec2  zp  = zeta - MU;
  float rr  = length(zp);
  float inside = 1.0 - smoothstep(a - 0.012, a + 0.012, rr);

  vec2 w  = potential(zp, a, uAlpha, gamma);
  vec2 dw = dPotential(zp, a, uAlpha, gamma);
  vec2 dz = vec2(1.0, 0.0) - cdiv(vec2(B * B, 0.0), cmul(zeta, zeta));

  // Physical velocity. Near the trailing edge dz/dzeta -> 0, so clamp to keep
  // the singularity from blowing the colour scale.
  vec2 vel = cdiv(dw, dz);
  float speed = min(length(vel), 4.0);

  float psi = w.y;  // stream function
  float phi = w.x;  // velocity potential

  // Cursor perturbation: a decaying vortex added to both, so the streamlines
  // genuinely bend and then recover rather than merely brightening.
  if (uPointerAmount > 0.001) {
    vec2  d  = z - uPointer;
    float r2 = dot(d, d) + 0.05;
    float k  = uPointerAmount * 0.55;
    psi   += k * 0.5 * log(r2);
    phi   += k * atan(d.y, d.x);
    speed += k / sqrt(r2) * 0.35;
  }

  // Streamlines: thin contours of psi, dashed along phi so the fluid appears
  // to move along stationary lines. Width is derivative-based, so lines stay
  // one pixel wide wherever the field bunches up.
  float density = mix(3.0, 4.4, uQuality);
  float s       = psi * density;
  float band    = abs(fract(s) - 0.5);
  // Width is a fixed fraction of the contour spacing, widened by the local
  // derivative only for antialiasing. fwidth alone is unreliable — it returns
  // zero on some software rasterisers, which makes the lines sub-pixel.
  float aa      = max(fwidth(s), 0.0008);
  float lineW   = max(aa * 1.6, 0.045);
  float line    = 1.0 - smoothstep(0.0, lineW, band);

  float dash = fract(phi * 1.1 - uTime * 0.40);
  dash = smoothstep(0.02, 0.40, dash) * (1.0 - smoothstep(0.55, 0.95, dash));
  // Attention falls off away from the aerofoil, so the eye goes to the wing
  // and its wake rather than to a uniform field of lines.
  float focus  = smoothstep(7.0, 1.0, length(z));
  float streak = line * mix(0.28, 1.0, dash) * mix(0.30, 1.0, focus);

  // Colour
  float t   = clamp((speed - 0.25) / 2.1, 0.0, 1.0);
  vec3 ramp = velocityRamp(t);

  vec3 ground = mix(vec3(0.957, 0.969, 0.988), vec3(0.024, 0.039, 0.071), uTheme);
  // The field itself stays a quiet wash; the streamlines carry the colour.
  float wash  = mix(0.06, 0.10, uTheme);
  vec3 col    = mix(ground, ramp, wash + 0.09 * t);
  col = mix(col, ramp * mix(0.9, 1.25, uTheme), streak * mix(0.75, 0.95, uTheme));

  // The aerofoil: a silhouette that reads against either ground, with a bright
  // rim where the flow accelerates over the surface.
  vec3 body = mix(vec3(0.988, 0.992, 1.0), vec3(0.008, 0.016, 0.035), uTheme);
  col = mix(col, body, inside);
  float rim = 1.0 - smoothstep(0.0, 0.045, abs(rr - a));
  col = mix(col, ramp * mix(1.0, 1.5, uTheme), rim * 0.9);

  // Vignette so the panels above always sit on a calmer ground.
  float vig = smoothstep(1.65, 0.15, length(uv * vec2(0.8, 1.0)));
  col = mix(ground, col, 0.3 + 0.7 * vig);

  fragColor = vec4(col, 1.0);
}`;
