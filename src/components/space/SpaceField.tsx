'use client';

import { useEffect, useRef, useState } from 'react';
import { FRAGMENT_SHADER, VERTEX_SHADER } from './shaders';
import {
  batteryAdjustedTier,
  detectTier,
  tierFromQuery,
  TIER_SETTINGS,
  type PerformanceTier,
} from '@/lib/performanceTier';

const FPS_FLOOR = 50;
const FPS_WINDOW = 90;

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Space field shader failed to compile:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * The page's background: deep space, fixed to the viewport.
 *
 * Cost is bounded by screen size rather than document length. It pauses when
 * the tab is hidden, drops a tier if frames slip, and renders a single static
 * frame under prefers-reduced-motion — an immersive background that drains a
 * battery is a failed background.
 */
export function SpaceField() {
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
      console.error('Space field program failed to link:', gl.getProgramInfoLog(program));
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
      parallax: gl.getUniformLocation(program, 'uParallax'),
      scroll: gl.getUniformLocation(program, 'uScroll'),
      quality: gl.getUniformLocation(program, 'uQuality'),
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

    // Pointer parallax eases toward the cursor so the sky has weight.
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollViewports = 0;
    let raf = 0;
    let slowFrames = 0;
    let visible = !document.hidden;
    const start = performance.now();
    let last = start;

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

    function draw(now: number) {
      if (!gl || !canvas) return;
      pointer.x += (pointer.targetX - pointer.x) * 0.05;
      pointer.y += (pointer.targetY - pointer.y) * 0.05;
      scrollViewports = window.scrollY / Math.max(window.innerHeight, 1);

      gl.uniform2f(u.resolution, canvas.width, canvas.height);
      gl.uniform1f(u.time, (now - start) / 1000);
      gl.uniform2f(u.parallax, pointer.x, pointer.y);
      gl.uniform1f(u.scroll, scrollViewports);
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
      pointer.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.targetY = 1 - (event.clientY / window.innerHeight) * 2;
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

    // The static tier still needs a redraw on scroll, or the parallax freezes
    // at whatever the first frame happened to be.
    function onScroll() {
      if (!settings.animate) draw(performance.now());
    }

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });

    resize();
    draw(start);
    play();

    return () => {
      disposed = true;
      pause();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  if (failed) return <div aria-hidden="true" className="space-fallback" />;

  return <canvas ref={canvasRef} aria-hidden="true" className="space-field" />;
}
