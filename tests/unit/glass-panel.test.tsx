import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GlassPanel } from '@/components/glass/GlassPanel';

describe('GlassPanel', () => {
  it('is a glass surface with squircle geometry by default', () => {
    render(<GlassPanel>content</GlassPanel>);
    const panel = screen.getByText('content');
    expect(panel).toHaveClass('glass');
    expect(panel).toHaveClass('u-squircle');
  });

  it('renders the semantic element it is given', () => {
    render(<GlassPanel as="article">semantic</GlassPanel>);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('maps variants onto modifier classes rather than inline styles', () => {
    render(<GlassPanel variant="strong">strong</GlassPanel>);
    expect(screen.getByText('strong')).toHaveClass('glass--strong');
  });

  it('drives radius from a token, never a hardcoded pixel value', () => {
    render(<GlassPanel radius="pill">pill</GlassPanel>);
    expect(screen.getByText('pill')).toHaveStyle({ borderRadius: 'var(--radius-pill)' });
  });
});
