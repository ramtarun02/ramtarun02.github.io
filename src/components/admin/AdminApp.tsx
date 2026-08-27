'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { tokenAuth } from '@/lib/github/auth';
import { getViewer } from '@/lib/github/client';
import { COLLECTIONS } from '@/lib/forms/collections';
import { profileSchema } from '@/content/schema';
import { GlassPanel } from '@/components/glass/GlassPanel';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { CollectionEditor } from './CollectionEditor';
import { RepoPicker } from './RepoPicker';
import { Preview } from './Preview';
import { useAdminStore } from './useAdminStore';

const TARGET = { owner: 'ramtarun02', repo: 'web-portfolio', branch: 'main' } as const;

/** Auth lives in localStorage, an external store — not in React state. */
function subscribeToAuth(onChange: () => void): () => void {
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
}
const readAuth = () => tokenAuth.isAuthenticated();
const readAuthOnServer = () => false;

const PROFILE_COLLECTION = COLLECTIONS[0] ?? {
  key: 'profile',
  label: 'Profile',
  path: 'content/profile.json',
  shape: 'single' as const,
  schema: profileSchema,
  titleField: 'name',
  publishable: false,
};

export function AdminApp() {
  const authed = useSyncExternalStore(subscribeToAuth, readAuth, readAuthOnServer);
  const [login, setLogin] = useState<string | null>(null);
  const [active, setActive] = useState('profile');
  const [showPreview, setShowPreview] = useState(true);
  const [showRepos, setShowRepos] = useState(false);

  const store = useAdminStore(TARGET);
  const definition = useMemo(() => {
    const found = COLLECTIONS.find((collection) => collection.key === active);
    return found ?? PROFILE_COLLECTION;
  }, [active]);

  useEffect(() => {
    if (!authed) return;
    void getViewer(tokenAuth)
      .then((viewer) => setLogin(viewer.login))
      .catch(() => setLogin(null));
    void store.load();
    // Loading once, when authenticated. store.load is stable for a fixed target.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  if (!authed) return <SignIn onSignedIn={() => window.location.reload()} />;

  const entry = store.collections[definition.key];

  return (
    <div className="min-h-dvh" style={{ background: 'var(--ground)' }}>
      <header
        className="sticky top-0 z-30 flex flex-wrap items-center gap-4 px-6 py-3"
        style={{ background: 'var(--ground-raised)', borderBottom: '1px solid var(--edge)' }}
      >
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)' }}>Admin</span>
        <span className="u-label" style={{ color: 'var(--ink-faint)' }}>
          {login ? `signed in as ${login}` : 'token'} · {TARGET.owner}/{TARGET.repo}
        </span>

        <div className="ml-auto flex flex-wrap items-center gap-3">
          {store.savedAt ? (
            <span className="u-label" style={{ color: 'var(--good)' }}>
              saved {store.savedAt}
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => setShowPreview((value) => !value)}
            className="glass px-3 py-1.5 text-xs"
            style={{ borderRadius: 'var(--radius-pill)' }}
          >
            {showPreview ? 'Hide preview' : 'Show preview'}
          </button>
          <button
            type="button"
            onClick={() => void store.save()}
            disabled={store.saving || store.dirtyCount === 0}
            className="px-4 py-2 text-sm font-semibold disabled:opacity-40"
            style={{
              borderRadius: 'var(--radius-pill)',
              background: 'var(--accent)',
              color: 'var(--accent-contrast)',
            }}
          >
            {store.saving
              ? 'Committing…'
              : store.dirtyCount > 0
                ? `Save ${store.dirtyCount} change${store.dirtyCount === 1 ? '' : 's'}`
                : 'Saved'}
          </button>
          <button
            type="button"
            onClick={() => {
              tokenAuth.signOut();
              window.location.reload();
            }}
            className="glass px-3 py-1.5 text-xs"
            style={{ borderRadius: 'var(--radius-pill)' }}
          >
            Sign out
          </button>
          <ThemeToggle />
        </div>
      </header>

      {store.error ? (
        <p className="px-6 py-3 text-sm" style={{ color: 'var(--warn)' }}>
          {store.error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 px-6 py-4">
        {COLLECTIONS.map((collection) => (
          <button
            key={collection.key}
            type="button"
            onClick={() => setActive(collection.key)}
            className="glass px-4 py-2 text-sm"
            style={{
              borderRadius: 'var(--radius-pill)',
              color: collection.key === active ? 'var(--accent)' : 'var(--ink-muted)',
              borderColor:
                collection.key === active
                  ? 'color-mix(in srgb, var(--accent) 45%, transparent)'
                  : undefined,
            }}
          >
            {collection.label}
            {store.collections[collection.key]?.dirty ? ' •' : ''}
          </button>
        ))}
      </div>

      {store.state === 'loading' ? (
        <p className="px-6 py-10 text-sm" style={{ color: 'var(--ink-faint)' }}>
          Reading content from the repository…
        </p>
      ) : (
        <div className={`grid gap-6 px-6 pb-24 ${showPreview ? 'xl:grid-cols-2' : ''}`}>
          <section className="flex flex-col gap-4">
            {definition.key === 'projects' ? (
              <button
                type="button"
                onClick={() => setShowRepos((value) => !value)}
                className="glass self-start px-4 py-2 text-sm"
                style={{ borderRadius: 'var(--radius-pill)' }}
              >
                {showRepos ? 'Hide repositories' : 'Choose from my repositories'}
              </button>
            ) : null}

            {definition.key === 'projects' && showRepos ? (
              <RepoPicker
                user={TARGET.owner}
                projects={(entry?.data as Record<string, unknown>[]) ?? []}
                onChange={(next) => store.update('projects', next)}
              />
            ) : null}

            {entry ? (
              <CollectionEditor
                definition={definition}
                data={entry.data}
                onChange={(next) => store.update(definition.key, next)}
              />
            ) : null}
          </section>

          {showPreview ? (
            <aside className="xl:sticky xl:top-24 xl:self-start">
              <GlassPanel radius="lg" className="max-h-[75vh] overflow-y-auto p-4">
                <p className="u-label mb-4" style={{ color: 'var(--ink-faint)' }}>
                  Live preview
                </p>
                <Preview collectionKey={definition.key} data={entry?.data} selectedIndex={null} />
              </GlassPanel>
            </aside>
          ) : null}
        </div>
      )}
    </div>
  );
}

function SignIn({ onSignedIn }: { onSignedIn: () => void }) {
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setChecking(true);
    setError(null);
    tokenAuth.signIn(token);
    try {
      await getViewer(tokenAuth);
      onSignedIn();
    } catch {
      tokenAuth.signOut();
      setError('GitHub rejected that token. It needs Contents: read and write on this repository.');
      setChecking(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg items-center px-6">
      <GlassPanel radius="xl" className="w-full p-8">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)' }}>Admin</h1>
        <p className="mt-3 text-sm" style={{ color: 'var(--ink-muted)' }}>
          Paste a fine-grained GitHub token with <strong>Contents: read and write</strong> on{' '}
          <code className="font-[family-name:var(--font-mono)]">{TARGET.repo}</code>. It is kept in
          this browser only and sent nowhere except GitHub.
        </p>
        <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
          <input
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="github_pat_…"
            autoComplete="off"
            style={{
              background: 'var(--ground-raised)',
              border: '1px solid var(--edge)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--ink)',
              padding: '0.65rem 0.8rem',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
            }}
          />
          {error ? (
            <p className="text-sm" style={{ color: 'var(--warn)' }}>
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={!token || checking}
            className="px-5 py-2.5 text-sm font-semibold disabled:opacity-40"
            style={{
              borderRadius: 'var(--radius-pill)',
              background: 'var(--accent)',
              color: 'var(--accent-contrast)',
            }}
          >
            {checking ? 'Checking…' : 'Sign in'}
          </button>
        </form>
      </GlassPanel>
    </main>
  );
}
