import type { ElementType, ReactNode } from 'react';

export type GlassVariant = 'default' | 'strong' | 'quiet';
export type GlassRadius = 'sm' | 'md' | 'lg' | 'xl' | 'pill';

const VARIANT_CLASS: Record<GlassVariant, string> = {
  default: '',
  strong: 'glass--strong',
  quiet: 'glass--quiet',
};

const RADIUS_VAR: Record<GlassRadius, string> = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  pill: 'var(--radius-pill)',
};

export interface GlassPanelProps {
  children: ReactNode;
  as?: ElementType;
  variant?: GlassVariant;
  radius?: GlassRadius;
  className?: string;
  /**
   * Lifts, warms its edge and catches a travelling highlight on hover or
   * focus. Use on anything a reader can act on; a static panel sitting on a
   * moving background reads as a sticker rather than as part of the scene.
   */
  interactive?: boolean;
}

/** The site's one panel surface, so the material has a single definition. */
export function GlassPanel({
  children,
  as: Tag = 'div',
  variant = 'default',
  radius = 'lg',
  className = '',
  interactive = false,
}: GlassPanelProps) {
  const classes = [
    'glass',
    'u-squircle',
    VARIANT_CLASS[variant],
    interactive ? 'panel-interactive panel-alive' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} style={{ borderRadius: RADIUS_VAR[radius] }}>
      {children}
    </Tag>
  );
}
