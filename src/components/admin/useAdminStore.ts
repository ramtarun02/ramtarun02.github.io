'use client';

import { useCallback, useRef, useState } from 'react';
import { getFile, putFile, GitHubError, type RepoTarget } from '@/lib/github/client';
import { tokenAuth } from '@/lib/github/auth';
import { COLLECTIONS, type CollectionDef } from '@/lib/forms/collections';

export type LoadState = 'idle' | 'loading' | 'ready' | 'error';

export interface CollectionState {
  /** Parsed JSON: an array for list collections, an object for the profile. */
  data: unknown;
  /** Blob SHA from GitHub, needed to update without clobbering. */
  sha: string | undefined;
  dirty: boolean;
}

/**
 * Loads every collection from the repository, tracks edits, and commits the
 * ones that changed. Content is read from GitHub rather than from the bundle,
 * so the admin always edits what is actually deployed — not what happened to be
 * compiled into the page you are looking at.
 */
export function useAdminStore(target: RepoTarget) {
  const [state, setState] = useState<LoadState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [collections, setCollections] = useState<Record<string, CollectionState>>({});
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const loadedOnce = useRef(false);

  const load = useCallback(async () => {
    setState('loading');
    setError(null);
    try {
      const entries: Record<string, CollectionState> = {};
      for (const collection of COLLECTIONS) {
        const file = await getFile(tokenAuth, target, collection.path);
        if (!file) {
          entries[collection.key] = {
            data: collection.shape === 'list' ? [] : {},
            sha: undefined,
            dirty: false,
          };
          continue;
        }
        entries[collection.key] = {
          data: JSON.parse(file.text) as unknown,
          sha: file.sha,
          dirty: false,
        };
      }
      setCollections(entries);
      setState('ready');
      loadedOnce.current = true;
    } catch (caught) {
      setError(
        caught instanceof GitHubError
          ? `${caught.message} (${caught.status})`
          : 'Could not read the repository.',
      );
      setState('error');
    }
  }, [target]);

  const update = useCallback((key: string, data: unknown) => {
    setCollections((current) => {
      const existing = current[key];
      if (!existing) return current;
      return { ...current, [key]: { ...existing, data, dirty: true } };
    });
  }, []);

  const save = useCallback(
    async (definitions: CollectionDef[] = COLLECTIONS) => {
      setSaving(true);
      setError(null);
      try {
        const next = { ...collections };
        for (const definition of definitions) {
          const entry = next[definition.key];
          if (!entry?.dirty) continue;
          const text = `${JSON.stringify(entry.data, null, 2)}\n`;
          const result = await putFile(
            tokenAuth,
            target,
            definition.path,
            text,
            `content: update ${definition.label.toLowerCase()} via admin`,
            entry.sha,
          );
          next[definition.key] = { ...entry, sha: result.sha, dirty: false };
        }
        setCollections(next);
        setSavedAt(new Date().toLocaleTimeString());
      } catch (caught) {
        setError(
          caught instanceof GitHubError
            ? `${caught.message} (${caught.status})`
            : 'Could not write to the repository.',
        );
      } finally {
        setSaving(false);
      }
    },
    [collections, target],
  );

  const dirtyCount = Object.values(collections).filter((entry) => entry.dirty).length;

  return { state, error, collections, load, update, save, saving, savedAt, dirtyCount };
}
