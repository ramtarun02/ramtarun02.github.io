/**
 * Deep-space background.
 *
 * Four layers, cheap enough to run the whole page at 60fps:
 *   1. a graded void — not flat black, so the screen has depth
 *   2. nebula, from domain-warped fbm noise, drifting very slowly
 *   3. three parallax star fields, each at its own depth, twinkling
 *   4. a faint galactic band, to give the frame a diagonal composition
 *
 * Parallax is driven by scroll and by the pointer, so the space has volume:
 * near stars move further than far ones, which is the whole illusion.
 */

export const VERTEX_SHADER = /* glsl */ `#version 300 es
in vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }`;

export const FRAGMENT_SHADER = /* glsl */ `#version 300 es
precision highp float;

out vec4 fragColor;

uniform vec2  uResolution;
uniform float uTime;
uniform vec2  uParallax;
uniform float uScroll;
uniform float uQuality;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

vec2 hash22(vec2 p) {
  float n = hash21(p);
  return vec2(n, hash21(p + n));
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 6; i++) {
    if (i >= octaves) break;
    value += amplitude * noise(p);
    p *= 2.02;
    amplitude *= 0.5;
  }
  return value;
}

// One star per grid cell, placed by hash. The falloff is measured in *pixels*,
// not in cell units — otherwise a sparse layer draws huge soft blobs and a
// dense one draws specks, which is how a starfield turns into bokeh.
float starLayer(vec2 uv, float density, float seed, float twinkle, float radiusPx) {
  vec2 grid = uv * density;
  vec2 cell = floor(grid);
  vec2 local = fract(grid) - 0.5;

  float pixelsPerCell = uResolution.y / density;

  float total = 0.0;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 id = cell + offset;
      float brightness = hash21(id + seed + 7.1);

      // Most cells hold nothing; a bright star is rare.
      if (brightness < 0.80) continue;
      brightness = (brightness - 0.80) / 0.20;

      vec2 pos = hash22(id + seed) - 0.5;
      float phase = hash21(id + seed + 3.7) * 6.2831;
      float flicker = mix(1.0, 0.65 + 0.35 * sin(uTime * (0.6 + brightness) + phase), twinkle);

      float dPix = length(local - offset - pos) * pixelsPerCell;

      // A tight core plus a small halo; the rare bright ones are larger.
      float sigma = radiusPx * (0.6 + 0.9 * brightness);
      float core = exp(-(dPix * dPix) / (2.0 * sigma * sigma));
      float halo = exp(-(dPix * dPix) / (2.0 * (sigma * 3.5) * (sigma * 3.5))) * 0.16;

      total += (core + halo) * (0.35 + 0.65 * brightness) * flicker;
    }
  }
  return total;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

  // ---- the void -------------------------------------------------------
  vec3 deep = vec3(0.012, 0.017, 0.035);
  vec3 lift = vec3(0.043, 0.051, 0.104);
  float grade = smoothstep(-0.75, 0.85, p.y - p.x * 0.25);
  vec3 col = mix(deep, lift, grade * 0.85);

  // ---- nebula ---------------------------------------------------------
  vec2 drift = vec2(uTime * 0.006, uTime * -0.004 + uScroll * 0.06);
  vec2 warp = vec2(
    fbm(p * 1.6 + drift, 4),
    fbm(p * 1.6 + drift + vec2(5.2, 1.3), 4)
  );
  float clouds = fbm(p * 2.1 + warp * 1.7 + drift, uQuality > 0.5 ? 5 : 3);
  clouds = smoothstep(0.42, 0.92, clouds);

  vec3 nebulaCool = vec3(0.086, 0.204, 0.408);
  vec3 nebulaWarm = vec3(0.243, 0.141, 0.361);
  float band = smoothstep(0.9, -0.2, p.y + p.x * 0.55);
  col += mix(nebulaCool, nebulaWarm, band) * clouds * 0.46;

  float galaxy = exp(-pow((p.y + p.x * 0.42 + 0.12) * 2.1, 2.0));
  col += vec3(0.11, 0.15, 0.26) * galaxy * (0.30 + 0.5 * clouds);

  // ---- stars ----------------------------------------------------------
  // Parallax is strongest in front, which is what sells the volume.
  vec2 far  = p + uParallax * 0.006 + vec2(0.0, uScroll * 0.020);
  vec2 mid  = p + uParallax * 0.018 + vec2(0.0, uScroll * 0.055);
  vec2 near = p + uParallax * 0.042 + vec2(0.0, uScroll * 0.120);

  float stars = 0.0;
  stars += starLayer(far,  46.0, 0.0,  0.25, 0.75) * 0.70;
  stars += starLayer(mid,  26.0, 11.0, 0.60, 1.05) * 0.95;
  if (uQuality > 0.5) {
    stars += starLayer(near, 14.0, 27.0, 1.00, 1.55) * 1.10;
  }

  vec3 starColour = mix(vec3(0.78, 0.86, 1.0), vec3(1.0, 0.95, 0.86), smoothstep(0.6, 1.6, stars));
  col += starColour * stars * 1.15;

  // ---- finish ---------------------------------------------------------
  float vig = smoothstep(1.35, 0.25, length(p * vec2(0.82, 1.0)));
  col *= 0.55 + 0.45 * vig;

  // Dither: banding is very visible across a near-black gradient.
  col += (hash21(gl_FragCoord.xy) - 0.5) / 255.0;

  fragColor = vec4(col, 1.0);
}`;
