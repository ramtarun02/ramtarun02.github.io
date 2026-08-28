'use client';

import type { FieldSpec } from '@/lib/forms/zodFields';
import { isProseArray } from '@/lib/forms/zodFields';

type Value = unknown;

interface FieldProps {
  spec: FieldSpec;
  value: Value;
  onChange: (next: Value) => void;
}

const inputStyle: React.CSSProperties = {
  background: 'var(--ground-raised)',
  border: '1px solid var(--edge)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--ink)',
  padding: '0.55rem 0.7rem',
  width: '100%',
  fontSize: 'var(--text-sm)',
};

/** One field, rendered from its schema-derived spec. */
export function Field({ spec, value, onChange }: FieldProps) {
  const label = (
    <span className="u-label" style={{ color: 'var(--ink-faint)' }}>
      {spec.label}
      {spec.optional ? '' : ' *'}
    </span>
  );

  if (spec.kind === 'unsupported') {
    return (
      <label className="flex flex-col gap-1.5">
        {label}
        <span className="text-xs" style={{ color: 'var(--warn)' }}>
          This field&rsquo;s type has no editor yet — edit it in the file directly.
        </span>
      </label>
    );
  }

  if (spec.kind === 'boolean') {
    return (
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          style={{ width: 18, height: 18, accentColor: 'var(--accent)' }}
        />
        {label}
      </label>
    );
  }

  if (spec.kind === 'enum') {
    return (
      <label className="flex flex-col gap-1.5">
        {label}
        <select
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value)}
          style={inputStyle}
        >
          {spec.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (spec.kind === 'number') {
    return (
      <label className="flex flex-col gap-1.5">
        {label}
        <input
          type="number"
          value={typeof value === 'number' ? value : ''}
          onChange={(event) =>
            onChange(event.target.value === '' ? undefined : Number(event.target.value))
          }
          style={inputStyle}
        />
      </label>
    );
  }

  if (spec.kind === 'markdown') {
    return (
      <label className="flex flex-col gap-1.5">
        {label}
        <span className="text-xs" style={{ color: 'var(--ink-faint)' }}>
          Markdown. Use <code>```chart name</code>, <code>```keynumbers</code>,{' '}
          <code>```finding Title</code> or <code>```caution Title</code> for the blocks Markdown has
          no syntax for.
        </span>
        <textarea
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value || undefined)}
          rows={26}
          spellCheck
          style={{
            ...inputStyle,
            resize: 'vertical',
            lineHeight: 1.65,
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)',
          }}
        />
      </label>
    );
  }

  if (spec.kind === 'text') {
    return (
      <label className="flex flex-col gap-1.5">
        {label}
        <textarea
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value || undefined)}
          rows={4}
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.55 }}
        />
      </label>
    );
  }

  if (spec.kind === 'stringArray') {
    const items = Array.isArray(value) ? (value as string[]) : [];
    const prose = isProseArray(spec.name);
    return (
      <div className="flex flex-col gap-2">
        {label}
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            {prose ? (
              <textarea
                value={item}
                rows={3}
                onChange={(event) => {
                  const next = [...items];
                  next[index] = event.target.value;
                  onChange(next);
                }}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.55 }}
              />
            ) : (
              <input
                value={item}
                onChange={(event) => {
                  const next = [...items];
                  next[index] = event.target.value;
                  onChange(next);
                }}
                style={inputStyle}
              />
            )}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              className="glass px-2.5 py-1.5 text-xs"
              style={{ borderRadius: 'var(--radius-sm)' }}
              aria-label={`Remove ${spec.label} entry ${index + 1}`}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ''])}
          className="glass self-start px-3 py-1.5 text-xs"
          style={{ borderRadius: 'var(--radius-pill)' }}
        >
          Add {spec.label.toLowerCase()}
        </button>
      </div>
    );
  }

  if (spec.kind === 'objectArray') {
    const items = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
    return (
      <div className="flex flex-col gap-3">
        {label}
        {items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 p-3"
            style={{ border: '1px solid var(--edge)', borderRadius: 'var(--radius-sm)' }}
          >
            {spec.fields?.map((child) => (
              <Field
                key={child.name}
                spec={child}
                value={item[child.name]}
                onChange={(next) => {
                  const copy = [...items];
                  copy[index] = { ...item, [child.name]: next };
                  onChange(copy);
                }}
              />
            ))}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              className="glass self-start px-3 py-1.5 text-xs"
              style={{ borderRadius: 'var(--radius-pill)', color: 'var(--warn)' }}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, {}])}
          className="glass self-start px-3 py-1.5 text-xs"
          style={{ borderRadius: 'var(--radius-pill)' }}
        >
          Add entry
        </button>
      </div>
    );
  }

  return (
    <label className="flex flex-col gap-1.5">
      {label}
      <input
        value={typeof value === 'string' ? value : ''}
        onChange={(event) => onChange(event.target.value || undefined)}
        style={inputStyle}
      />
    </label>
  );
}
