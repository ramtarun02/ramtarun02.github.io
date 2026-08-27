'use client';

import { useEffect, useRef, useState } from 'react';
import { FRAGMENT_SHADER, VERTEX_SHADER } from './shaders';
import { MAX_BODIES, pointerToPhysical, rectToBody, type Body } from './view';
import {
  batteryAdjustedTier,
  detectTier,
  tierFromQuery,
  TIER_SETTINGS,
  type PerformanceTier,
} from '@/lib/performanceTier';

const FPS_FLOOR = 50;
const FPS_WINDOW = 90;

/** Incidence sweep across the page, radians. The shock forms as you descend. */
const ALPHA_TOP = 0.1;
const ALPHA_BOTTOM = 0.3;
/** How far the wing lifts out of frame over the first two viewports. */
const WING_RISE = 3.4;

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Flow layer shader failed to compile:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * The flow field, for the whole page rather than the hero alone.
 *
 * Fixed to the viewport, so its cost does not grow with page length. Elements
 * marked `data-flow-body` are measured each frame and fed to the shader as
 * bluff bodies, which is what makes the streamlines part around the content.
 */
export function FlowLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false });
    if (!gl) {
      setFailed(true);
      return undefined;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = vs && fs ? gl.createProgram() : null;
    if (!vs || !fs || !program) {
      setFailed(true);
      return undefined;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Flow layer program failed to link:', gl.getProgramInfoLog(program));
      setFailed(true);
      return undefined;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const attr = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(attr);
    gl.vertexAttribPointer(attr, 2, gl.FLOAT, false, 0, 0);

    const u = {
      resolution: gl.getUniformLocation(program, 'uResolution'),
      time: gl.getUniformLocation(program, 'uTime'),
      pointer: gl.getUniformLocation(program, 'uPointer'),
      pointerStrength: gl.getUniformLocation(program, 'uPointerStrength'),
      pointerSpin: gl.getUniformLocation(program, 'uPointerSpin'),
      alpha: gl.getUniformLocation(program, 'uAlpha'),
      theme: gl.getUniformLocation(program, 'uTheme'),
      quality: gl.getUniformLocation(program, 'uQuality'),
      wingRise: gl.getUniformLocation(program, 'uWingRise'),
      bodyCount: gl.getUniformLocation(program, 'uBodyCount'),
      bodies: gl.getUniformLocation(program, 'uBodies'),
    };

    let tier: PerformanceTier = detectTier();
    let settings = TIER_SETTINGS[tier];
    let disposed = false;

    void batteryAdjustedTier(tier).then((adjusted) => {
      if (disposed || tierFromQuery()) return;
      tier = adjusted;
      settings = TIER_SETTINGS[tier];
      resize();
    });

    // Pointer state. `target` is where the cursor is; `current` eases toward it
    // so the disturbance has inertia. `strength` rises on movement and settles
    // to a resting value rather than to zero — the flow stays disturbed.
    const pointer = {
      currentX: -1.2,
      currentY: 0.4,
      targetX: -1.2,
      targetY: 0.4,
      strength: 0.28,
      target: 0.28,
      spin: 0,
      spinTarget: 0,
      lastX: 0,
      lastY: 0,
    };
    const RESTING_STRENGTH = 0.28;
    const ACTIVE_STRENGTH = 1.0;

    const bodyData = new Float32Array(MAX_BODIES * 4);
    let bodyCount = 0;

    function measureBodies() {
      const elements = document.querySelectorAll<HTMLElement>('[data-flow-body]');
      const width = window.innerWidth;
      const height = window.innerHeight;
      const found: Body[] = [];

      for (const element of elements) {
        const rect = element.getBoundingClientRect();
        // Only what is on screen matters; the doublet decays with distance.
        if (rect.bottom < -80 || rect.top > height + 80) continue;
        if (rect.width < 40 || rect.height < 40) continue;
        found.push(rectToBody(rect, width, height));
        if (found.length >= MAX_BODIES) break;
      }

      bodyCount = found.length;
      for (let i = 0; i < found.length; i += 1) {
        const b = found[i];
        if (!b) continue;
        bodyData[i * 4] = b.cx;
        bodyData[i * 4 + 1] = b.cy;
        bodyData[i * 4 + 2] = b.rx;
        bodyData[i * 4 + 3] = b.ry;
      }
    }

    function scrollProgress(): number {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return 0;
      return Math.min(1, Math.max(0, window.scrollY / max));
    }

    function resize() {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, settings.maxDpr);
      const scale = dpr * settings.resolutionScale;
      const width = Math.max(1, Math.floor(window.innerWidth * scale));
      const height = Math.max(1, Math.floor(window.innerHeight * scale));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
    }

    function isDark(): number {
      const attr = document.documentElement.getAttribute('data-theme');
      if (attr === 'dark') return 1;
      if (attr === 'light') return 0;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 1 : 0;
    }

    let raf = 0;
    let slowFrames = 0;
    let visible = !document.hidden;
    const start = performance.now();
    let last = start;

    function draw(now: number) {
      if (!gl || !canvas) return;
      const elapsed = (now - start) / 1000;

      pointer.currentX += (pointer.targetX - pointer.currentX) * 0.12;
      pointer.currentY += (pointer.targetY - pointer.currentY) * 0.12;
      pointer.strength += (pointer.target - pointer.strength) * 0.06;
      pointer.target += (RESTING_STRENGTH - pointer.target) * 0.012;
      pointer.spin += (pointer.spinTarget - pointer.spin) * 0.08;
      pointer.spinTarget *= 0.92;

      measureBodies();
      const progress = scrollProgress();
      // Incidence follows progress through the whole document; the wing leaves
      // frame over the first two viewports, so it is a hero element rather than
      // a passenger on every section.
      const viewportsScrolled = window.scrollY / Math.max(window.innerHeight, 1);

      gl.uniform2f(u.resolution, canvas.width, canvas.height);
      gl.uniform1f(u.time, elapsed);
      gl.uniform2f(u.pointer, pointer.currentX, pointer.currentY);
      gl.uniform1f(u.pointerStrength, pointer.strength);
      gl.uniform1f(u.pointerSpin, pointer.spin);
      gl.uniform1f(u.alpha, ALPHA_TOP + (ALPHA_BOTTOM - ALPHA_TOP) * progress);
      gl.uniform1f(u.wingRise, Math.min(viewportsScrolled, 2.2) * WING_RISE);
      gl.uniform1f(u.theme, isDark());
      gl.uniform1f(u.quality, settings.quality);
      gl.uniform1i(u.bodyCount, bodyCount);
      gl.uniform4fv(u.bodies, bodyData);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function frame(now: number) {
      if (disposed) return;
      const delta = now - last;
      last = now;
      if (delta > 1000 / FPS_FLOOR + 2) slowFrames += 1;
      else slowFrames = Math.max(0, slowFrames - 1);
      if (slowFrames > FPS_WINDOW && tier === 'full') {
        tier = 'reduced';
        settings = TIER_SETTINGS[tier];
        slowFrames = 0;
        resize();
      }
      draw(now);
      raf = requestAnimationFrame(frame);
    }

    function play() {
      if (disposed || raf !== 0 || !settings.animate || !visible) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    function pause() {
      if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    function onPointerMove(event: PointerEvent) {
      const p = pointerToPhysical(
        event.clientX,
        event.clientY,
        window.innerWidth,
        window.innerHeight,
      );
      pointer.targetX = p.x;
      pointer.targetY = p.y;
      pointer.target = ACTIVE_STRENGTH;
    }

    function onVisibility() {
      visible = !document.hidden;
      if (visible) play();
      else pause();
    }

    function onResize() {
      resize();
      if (!settings.animate) draw(performance.now());
    }

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', onResize);

    resize();
    draw(start);
    play();

    return () => {
      disposed = true;
      pause();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  if (failed) return <div aria-hidden="true" className="flow-fallback flow-layer" />;

  return <canvas ref={canvasRef} aria-hidden="true" className="flow-layer" />;
}
