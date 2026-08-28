'use client';

import { useState } from 'react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const ACCESS_KEY = process.env['NEXT_PUBLIC_WEB3FORMS_KEY'];

const fieldStyle: React.CSSProperties = {
  background: 'var(--ground-raised)',
  border: '1px solid var(--edge)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--ink)',
  padding: '0.7rem 0.85rem',
  width: '100%',
  fontSize: 'var(--text-base)',
};

/**
 * Posts to Web3Forms, which needs no server of its own — so this works on a
 * static host. Without a configured key the form does not pretend to work: it
 * says so and falls back to the links, because a contact form that silently
 * discards messages is worse than no contact form.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string | null>(null);

  if (!ACCESS_KEY) {
    return (
      <p className="u-measure text-sm" style={{ color: 'var(--ink-faint)' }}>
        The form is not connected yet — set <code>NEXT_PUBLIC_WEB3FORMS_KEY</code> to switch it on.
        Until then the links above are the way to reach me.
      </p>
    );
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: a real person never fills a hidden field.
    if (data.get('company')) {
      setStatus('sent');
      return;
    }

    setStatus('sending');
    setMessage(null);
    data.append('access_key', ACCESS_KEY ?? '');
    data.append('subject', 'Message from the portfolio site');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      });
      if (!response.ok) throw new Error(String(response.status));
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
      setMessage('That did not send. Email me directly and I will pick it up.');
    }
  }

  if (status === 'sent') {
    return (
      <p className="u-measure" style={{ color: 'var(--good)' }}>
        Thank you — that reached me. I will reply as soon as I can.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="u-label" style={{ color: 'var(--ink-faint)' }}>
            Your name
          </span>
          <input name="name" required autoComplete="name" style={fieldStyle} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="u-label" style={{ color: 'var(--ink-faint)' }}>
            Email
          </span>
          <input name="email" type="email" required autoComplete="email" style={fieldStyle} />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="u-label" style={{ color: 'var(--ink-faint)' }}>
          What are you working on?
        </span>
        <textarea
          name="message"
          required
          rows={5}
          style={{ ...fieldStyle, resize: 'vertical', lineHeight: 1.6 }}
        />
      </label>

      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }}
      />

      {message ? (
        <p className="text-sm" style={{ color: 'var(--warn)' }}>
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex min-h-11 items-center self-start px-6 py-3 text-sm font-semibold disabled:opacity-50"
        style={{
          borderRadius: 'var(--radius-pill)',
          background: 'var(--accent)',
          color: 'var(--accent-contrast)',
        }}
      >
        {status === 'sending' ? 'Sending…' : 'Send'}
      </button>
    </form>
  );
}
