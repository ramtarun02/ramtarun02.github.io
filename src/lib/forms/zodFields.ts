import { z } from 'zod';

/**
 * Derives an editing form from a Zod schema.
 *
 * This is the reason the content layer is schema-first: adding a field to a
 * collection changes the type, the validation and the admin form at once. There
 * is no second place to remember.
 *
 * Only the constructs the content schemas actually use are handled. Anything
 * else surfaces as `unsupported` rather than silently rendering nothing — a
 * field you cannot see is worse than one labelled as unhandled.
 */

export type FieldKind =
  | 'string'
  | 'text'
  | 'markdown'
  | 'number'
  | 'boolean'
  | 'enum'
  | 'stringArray'
  | 'objectArray'
  | 'unsupported';

export interface FieldSpec {
  name: string;
  label: string;
  kind: FieldKind;
  optional: boolean;
  options?: string[];
  /** For objectArray: the shape of one element. */
  fields?: FieldSpec[];
}

/** Field names whose content is prose and deserves a textarea. */
const MULTILINE = new Set([
  'body',
  'summary',
  'summaryShort',
  'body',
  'abstract',
  'thesis',
  'description',
  'caption',
  'credit',
  'subtitle',
  'note',
]);

const MULTILINE_ARRAYS = new Set(['paragraphs', 'highlights', 'summaryLong']);

function humanise(name: string): string {
  const spaced = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[-_]/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** Peels optional/default/nullable wrappers, reporting whether it was optional. */
function unwrap(schema: z.ZodTypeAny): { inner: z.ZodTypeAny; optional: boolean } {
  let current = schema;
  let optional = false;
  // Wrappers can nest: .optional().default(...) and so on.
  for (let depth = 0; depth < 8; depth += 1) {
    if (current instanceof z.ZodOptional) {
      optional = true;
      current = current.unwrap() as z.ZodTypeAny;
      continue;
    }
    if (current instanceof z.ZodNullable) {
      optional = true;
      current = current.unwrap() as z.ZodTypeAny;
      continue;
    }
    if (current instanceof z.ZodDefault) {
      optional = true;
      current = current.removeDefault() as z.ZodTypeAny;
      continue;
    }
    break;
  }
  return { inner: current, optional };
}

function kindOf(
  name: string,
  schema: z.ZodTypeAny,
): Pick<FieldSpec, 'kind' | 'options' | 'fields'> {
  if (schema instanceof z.ZodString) {
    if (name === 'body') return { kind: 'markdown' };
    return { kind: MULTILINE.has(name) ? 'text' : 'string' };
  }
  if (schema instanceof z.ZodNumber) return { kind: 'number' };
  if (schema instanceof z.ZodBoolean) return { kind: 'boolean' };
  if (schema instanceof z.ZodEnum) {
    return { kind: 'enum', options: [...(schema.options as string[])] };
  }
  if (schema instanceof z.ZodArray) {
    const element = unwrap(schema.element as z.ZodTypeAny).inner;
    if (element instanceof z.ZodString) {
      return { kind: 'stringArray', ...(MULTILINE_ARRAYS.has(name) ? {} : {}) };
    }
    if (element instanceof z.ZodObject) {
      return { kind: 'objectArray', fields: fieldsOf(element) };
    }
    return { kind: 'unsupported' };
  }
  return { kind: 'unsupported' };
}

/** Field specs for one object schema, in declaration order. */
export function fieldsOf(schema: z.ZodObject<z.ZodRawShape>): FieldSpec[] {
  const shape = schema.shape;
  return Object.entries(shape).map(([name, raw]) => {
    const { inner, optional } = unwrap(raw as z.ZodTypeAny);
    const { kind, options, fields } = kindOf(name, inner);
    return {
      name,
      label: humanise(name),
      kind,
      optional,
      ...(options ? { options } : {}),
      ...(fields ? { fields } : {}),
    };
  });
}

/** Whether a string array should render as textareas rather than inputs. */
export function isProseArray(name: string): boolean {
  return MULTILINE_ARRAYS.has(name);
}
