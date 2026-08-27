import { describe, expect, it } from 'vitest';
import { pointerToPhysical, rectToBody, VIEW_OFFSET_X, VIEW_SCALE } from '@/components/flow/view';

const W = 1600;
const H = 900;

describe('rectToBody', () => {
  it('maps a centred rect to the centre of the view', () => {
    const body = rectToBody({ left: 700, top: 400, width: 200, height: 100 }, W, H);
    const aspect = W / H;
    expect(body.cx).toBeCloseTo(0 * aspect * VIEW_SCALE + VIEW_OFFSET_X, 5);
    expect(body.cy).toBeCloseTo(0, 5);
  });

  it('scales half-extents with the view, so a wider panel is a wider body', () => {
    const narrow = rectToBody({ left: 0, top: 0, width: 200, height: 100 }, W, H);
    const wide = rectToBody({ left: 0, top: 0, width: 400, height: 100 }, W, H);
    expect(wide.rx).toBeCloseTo(narrow.rx * 2, 6);
    expect(wide.ry).toBeCloseTo(narrow.ry, 6);
  });

  it('puts a rect above centre at positive y — screen y is inverted', () => {
    const body = rectToBody({ left: 700, top: 100, width: 200, height: 100 }, W, H);
    expect(body.cy).toBeGreaterThan(0);
  });
});

describe('pointerToPhysical', () => {
  it('agrees with rectToBody for the same point, so the cursor and panels share one frame', () => {
    const point = pointerToPhysical(1200, 300, W, H);
    const body = rectToBody({ left: 1100, top: 200, width: 200, height: 200 }, W, H);
    expect(point.x).toBeCloseTo(body.cx, 6);
    expect(point.y).toBeCloseTo(body.cy, 6);
  });
});
