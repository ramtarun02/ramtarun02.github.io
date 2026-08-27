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
  /** Rendered element. Use a semantic tag — `section`, `article`, `aside`. */
  as?: ElementType;
  variant?: GlassVariant;
  radius?: GlassRadius;
  className?: string;
}

/**
 * The site's one glass surface. Every panel, card and chip is this component,
 * so the material stays consistent and there is a single place to change it.
 */
export function GlassPanel({
  children,
  as: Tag = 'div',
  variant = 'default',
  radius = 'lg',
  className = '',
}: GlassPanelProps) {
  const classes = ['glass', 'u-squircle', VARIANT_CLASS[variant], className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} style={{ borderRadius: RADIUS_VAR[radius] }}>
      {children}
    </Tag>
  );
}
