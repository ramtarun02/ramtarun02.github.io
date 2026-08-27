/**
 * The mapping between screen space and the physical plane the flow is solved
 * in. Shared by the shader and by the code that measures panel geometry, so
 * the two cannot drift apart.
 */
export const VIEW_SCALE = 3.4;
export const VIEW_OFFSET_X = -3.0;

/** Maximum bodies passed to the shader. Cost is linear; 10 is plenty on screen. */
export const MAX_BODIES = 10;

export interface Body {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

/**
 * Convert a DOM rect (CSS pixels, viewport-relative) into a body in the
 * physical plane. The flow layer is fixed to the viewport, so viewport
 * coordinates are the right frame.
 */
export function rectToBody(
  rect: { left: number; top: number; width: number; height: number },
  viewportWidth: number,
  viewportHeight: number,
): Body {
  const aspect = viewportWidth / Math.max(viewportHeight, 1);
  const centreX = rect.left + rect.width / 2;
  const centreY = rect.top + rect.height / 2;

  const uvx = (centreX / viewportWidth) * 2 - 1;
  const uvy = 1 - (centreY / viewportHeight) * 2;

  return {
    cx: uvx * aspect * VIEW_SCALE + VIEW_OFFSET_X,
    cy: uvy * VIEW_SCALE,
    rx: (rect.width / viewportWidth) * aspect * VIEW_SCALE,
    ry: (rect.height / viewportHeight) * VIEW_SCALE,
  };
}

export function pointerToPhysical(
  clientX: number,
  clientY: number,
  viewportWidth: number,
  viewportHeight: number,
): { x: number; y: number } {
  const aspect = viewportWidth / Math.max(viewportHeight, 1);
  const uvx = (clientX / viewportWidth) * 2 - 1;
  const uvy = 1 - (clientY / viewportHeight) * 2;
  return { x: uvx * aspect * VIEW_SCALE + VIEW_OFFSET_X, y: uvy * VIEW_SCALE };
}
