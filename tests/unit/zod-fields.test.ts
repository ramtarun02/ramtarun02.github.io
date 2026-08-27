import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { fieldsOf } from '@/lib/forms/zodFields';
import { experienceSchema, profileSchema, projectSchema } from '@/content/schema';

describe('fieldsOf', () => {
  it('derives kinds from the schema rather than from a hand-written list', () => {
    const fields = fieldsOf(
      z.object({
        title: z.string(),
        count: z.number(),
        live: z.boolean(),
        state: z.enum(['draft', 'published']),
        tags: z.array(z.string()),
      }),
    );
    const byName = Object.fromEntries(fields.map((f) => [f.name, f.kind]));
    expect(byName).toEqual({
      title: 'string',
      count: 'number',
      live: 'boolean',
      state: 'enum',
      tags: 'stringArray',
    });
  });

  it('sees through optional and default wrappers', () => {
    const fields = fieldsOf(
      z.object({
        a: z.string().optional(),
        b: z.number().default(3),
        c: z.string(),
      }),
    );
    expect(fields.find((f) => f.name === 'a')?.optional).toBe(true);
    expect(fields.find((f) => f.name === 'b')?.optional).toBe(true);
    expect(fields.find((f) => f.name === 'b')?.kind).toBe('number');
    expect(fields.find((f) => f.name === 'c')?.optional).toBe(false);
  });

  it('carries enum options through so a select can be rendered', () => {
    const fields = fieldsOf(z.object({ tone: z.enum(['finding', 'caution']) }));
    expect(fields[0]?.options).toEqual(['finding', 'caution']);
  });

  it('recurses into arrays of objects', () => {
    const fields = fieldsOf(
      z.object({ links: z.array(z.object({ label: z.string(), href: z.string() })) }),
    );
    expect(fields[0]?.kind).toBe('objectArray');
    expect(fields[0]?.fields?.map((f) => f.name)).toEqual(['label', 'href']);
  });

  it('gives prose fields a textarea', () => {
    const fields = fieldsOf(z.object({ summary: z.string(), title: z.string() }));
    expect(fields.find((f) => f.name === 'summary')?.kind).toBe('text');
    expect(fields.find((f) => f.name === 'title')?.kind).toBe('string');
  });

  it('labels anything it cannot handle rather than dropping it silently', () => {
    const fields = fieldsOf(z.object({ weird: z.map(z.string(), z.string()) }));
    expect(fields[0]?.kind).toBe('unsupported');
  });

  it('handles the real content schemas end to end', () => {
    expect(fieldsOf(profileSchema).find((f) => f.name === 'links')?.kind).toBe('objectArray');
    expect(fieldsOf(experienceSchema).find((f) => f.name === 'kind')?.options).toEqual([
      'role',
      'internship',
      'education',
    ]);
    expect(fieldsOf(projectSchema).find((f) => f.name === 'featured')?.kind).toBe('boolean');
  });
});
