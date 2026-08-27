'use client';

import { useEffect, useRef, useState } from 'react';
import { FRAGMENT_SHADER, VERTEX_SHADER } from './shaders';
import {
  batteryAdjustedTier,
  detectTier,
  TIER_SETTINGS,
  type PerformanceTier,
} from '@/lib/performanceTier';

/** Frames below this for FPS_WINDOW consecutive samples trigger a downgrade. */
const FPS_FLOOR = 50;
const FPS_WINDOW = 90;

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // Logged in production too. A silent shader failure looks identical to a
    // deliberate fallback, which makes it invisible in exactly the situation
    // where you most need to know.
    console.error('Flow field shader failed to compile:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Potential flow past a Joukowski aerofoil, rendered on the GPU.
 *
 * Three tiers, chosen from device capability and then adjusted at runtime if
 * frames drop. It pauses when the tab is hidden or the canvas scrolls out of
 * view, and never animates under prefers-reduced-motion — an immersive hero
 * that flattens a laptop battery is a failed hero.
 */
export function FlowField({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: false,
      powerPreference: 'default',
      preserveDrawingBuffer: false,
    });
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
      console.error('Flow field program failed to link:', gl.getProgramInfoLog(program));
      setFailed(true);
      return undefined;
    }
    gl.useProgram(program);

    // Fullscreen triangle pair.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = {
      resolution: gl.getUniformLocation(program, 'uResolution'),
      time: gl.getUniformLocation(program, 'uTime'),
      pointer: gl.getUniformLocation(program, 'uPointer'),
      pointerAmount: gl.getUniformLocation(program, 'uPointerAmount'),
      alpha: gl.getUniformLocation(program, 'uAlpha'),
      theme: gl.getUniformLocation(program, 'uTheme'),
      quality: gl.getUniformLocation(program, 'uQuality'),
    };

    let tier: PerformanceTier = detectTier();
    let settings = TIER_SETTINGS[tier];
    let disposed = false;

    void batteryAdjustedTier(tier).then((adjusted) => {
      if (disposed) return;
      tier = adjusted;
      settings = TIER_SETTINGS[tier];
      resize();
    });

    const pointer = { x: 0.9, y: 0.35, amount: 0 };
    let visible = true;
    let hidden = document.hidden;
    let raf = 0;
    let slowFrames = 0;
    let start = performance.now();
    let last = start;

    function resize() {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, settings.maxDpr);
      const scale = dpr * settings.resolutionScale;
      const width = Math.max(1, Math.floor(canvas.clientWidth * scale));
      const height = Math.max(1, Math.floor(canvas.clientHeight * scale));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
    }

    function isDarkTheme(): number {
      const attr = document.documentElement.getAttribute('data-theme');
      if (attr === 'dark') return 1;
      if (attr === 'light') return 0;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 1 : 0;
    }

    function draw(now: number) {
      if (!gl || !canvas) return;
      const elapsed = (now - start) / 1000;

      pointer.amount *= 0.94;

      gl.uniform2f(u.resolution, canvas.width, canvas.height);
      gl.uniform1f(u.time, elapsed);
      gl.uniform2f(u.pointer, pointer.x, pointer.y);
      gl.uniform1f(u.pointerAmount, pointer.amount);
      // Gentle incidence oscillation — the wing breathes rather than sits still.
      gl.uniform1f(u.alpha, 0.14 + Math.sin(elapsed * 0.16) * 0.05);
      gl.uniform1f(u.theme, isDarkTheme());
      gl.uniform1f(u.quality, settings.quality);
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
      if (disposed || raf !== 0) return;
      if (!settings.animate || hidden || !visible) return;
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
      if (!canvas || tier !== 'full') return;
      const rect = canvas.getBoundingClientRect();
      const aspect = rect.width / Math.max(rect.height, 1);
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = 1 - ((event.clientY - rect.top) / rect.height) * 2;
      pointer.x = nx * aspect * 3.4 - 3.0;
      pointer.y = ny * 3.4;
      pointer.amount = Math.min(1, pointer.amount + 0.35);
    }

    function onVisibility() {
      hidden = document.hidden;
      if (hidden) pause();
      else play();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? true;
        if (visible) play();
        else pause();
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (!settings.animate) draw(performance.now());
    });
    resizeObserver.observe(canvas);

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    resize();
    start = performance.now();
    draw(start);
    play();

    return () => {
      disposed = true;
      pause();
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointerMove);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  if (failed) {
    return <div aria-hidden="true" className={`flow-fallback ${className}`} />;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
