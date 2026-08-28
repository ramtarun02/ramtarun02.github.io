import { describe, expect, it } from 'vitest';
import { fieldsOf } from '@/lib/forms/zodFields';
import { caseStudySchema, postSchema } from '@/content/schema';

describe('markdown fields', () => {
  it('gives the document body its own editor kind, not a small textarea', () => {
    expect(fieldsOf(caseStudySchema).find((f) => f.name === 'body')?.kind).toBe('markdown');
    expect(fieldsOf(postSchema).find((f) => f.name === 'body')?.kind).toBe('markdown');
  });

  it('still treats short prose fields as plain textareas', () => {
    expect(fieldsOf(caseStudySchema).find((f) => f.name === 'thesis')?.kind).toBe('text');
    expect(fieldsOf(caseStudySchema).find((f) => f.name === 'title')?.kind).toBe('string');
  });
});
