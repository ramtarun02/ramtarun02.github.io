'use client';

import { useState } from 'react';
import { Field } from './Field';
import { fieldsOf } from '@/lib/forms/zodFields';
import type { CollectionDef } from '@/lib/forms/collections';
import { GlassPanel } from '@/components/glass/GlassPanel';

type Item = Record<string, unknown>;

interface Props {
  definition: CollectionDef;
  data: unknown;
  onChange: (next: unknown) => void;
}

function isDraft(item: Item): boolean {
  return item['status'] === 'draft';
}

export function CollectionEditor({ definition, data, onChange }: Props) {
  const fields = fieldsOf(definition.schema);

  if (definition.shape === 'single') {
    const item = (data ?? {}) as Item;
    return (
      <div className="flex flex-col gap-5">
        {fields.map((spec) => (
          <Field
            key={spec.name}
            spec={spec}
            value={item[spec.name]}
            onChange={(next) => onChange({ ...item, [spec.name]: next })}
          />
        ))}
      </div>
    );
  }

  return <ListEditor definition={definition} data={data} onChange={onChange} />;
}

function ListEditor({ definition, data, onChange }: Props) {
  const items = (Array.isArray(data) ? data : []) as Item[];
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const fields = fieldsOf(definition.schema);

  function replace(index: number, item: Item) {
    const next = [...items];
    next[index] = item;
    onChange(next);
  }

  /** Reordering rewrites `order` so the stored file matches what is displayed. */
  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const a = next[index];
    const b = next[target];
    if (!a || !b) return;
    next[index] = b;
    next[target] = a;
    onChange(next.map((item, i) => ({ ...item, order: i })));
    setOpenIndex(openIndex === index ? target : openIndex === target ? index : openIndex);
  }

  function add() {
    // Derived from what is already there rather than from a clock, so the same
    // inputs always produce the same output — and the linter can see that.
    const existing = new Set(items.map((item) => String(item['id'])));
    let suffix = items.length + 1;
    while (existing.has(`entry-${suffix}`)) suffix += 1;
    const blank: Item = { id: `entry-${suffix}`, order: items.length, published: false };
    if (fields.some((field) => field.name === 'status')) blank['status'] = 'draft';
    onChange([...items, blank]);
    setOpenIndex(items.length);
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => {
        const open = openIndex === index;
        const title = String(item[definition.titleField] ?? item['id'] ?? 'Untitled');
        const published = item['published'] !== false && !isDraft(item);

        return (
          <GlassPanel key={String(item['id'] ?? index)} radius="md" className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : index)}
                className="flex-1 text-left"
                style={{ fontWeight: 600 }}
                aria-expanded={open}
              >
                {title}
              </button>

              <span
                className="u-label px-2 py-0.5"
                style={{
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--edge)',
                  color: published ? 'var(--good)' : 'var(--ink-faint)',
                }}
              >
                {isDraft(item) ? 'draft' : published ? 'live' : 'hidden'}
              </span>

              {definition.publishable ? (
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={item['published'] !== false}
                    onChange={(event) =>
                      replace(index, { ...item, published: event.target.checked })
                    }
                    style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
                  />
                  visible
                </label>
              ) : null}

              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="glass px-2 py-1 text-xs disabled:opacity-40"
                  style={{ borderRadius: 'var(--radius-sm)' }}
                  aria-label={`Move ${title} up`}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1}
                  className="glass px-2 py-1 text-xs disabled:opacity-40"
                  style={{ borderRadius: 'var(--radius-sm)' }}
                  aria-label={`Move ${title} down`}
                >
                  ↓
                </button>
              </div>
            </div>

            {open ? (
              <div
                className="mt-5 flex flex-col gap-5 border-t pt-5"
                style={{ borderColor: 'var(--edge)' }}
              >
                {fields.map((spec) => (
                  <Field
                    key={spec.name}
                    spec={spec}
                    value={item[spec.name]}
                    onChange={(next) => replace(index, { ...item, [spec.name]: next })}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => {
                    onChange(
                      items
                        .filter((_, i) => i !== index)
                        .map((entry, i) => ({ ...entry, order: i })),
                    );
                    setOpenIndex(null);
                  }}
                  className="glass self-start px-3 py-1.5 text-xs"
                  style={{ borderRadius: 'var(--radius-pill)', color: 'var(--warn)' }}
                >
                  Delete this entry
                </button>
              </div>
            ) : null}
          </GlassPanel>
        );
      })}

      <button
        type="button"
        onClick={add}
        className="glass self-start px-4 py-2 text-sm"
        style={{ borderRadius: 'var(--radius-pill)' }}
      >
        Add {definition.label.toLowerCase().replace(/s$/, '')}
      </button>
    </div>
  );
}
