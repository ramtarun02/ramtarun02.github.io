import type { GitHubAuth } from './auth';

const API = 'https://api.github.com';

export interface RepoTarget {
  owner: string;
  repo: string;
  branch: string;
}

export class GitHubError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'GitHubError';
  }
}

async function request<T>(auth: GitHubAuth, path: string, init?: RequestInit): Promise<T> {
  const token = auth.getToken();
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    let message = `GitHub returned ${response.status}`;
    try {
      const parsed = JSON.parse(detail) as { message?: string };
      if (parsed.message) message = parsed.message;
    } catch {
      // Non-JSON error body; the status alone will have to do.
    }
    throw new GitHubError(message, response.status);
  }

  return (await response.json()) as T;
}

export interface FileContents {
  /** Blob SHA — required to update the file without clobbering someone else. */
  sha: string;
  text: string;
}

/** UTF-8 safe base64, in both directions. Content files contain en dashes. */
function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function decodeBase64(base64: string): string {
  const binary = atob(base64.replace(/\n/g, ''));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export async function getFile(
  auth: GitHubAuth,
  target: RepoTarget,
  path: string,
): Promise<FileContents | null> {
  try {
    const data = await request<{ sha: string; content: string }>(
      auth,
      `/repos/${target.owner}/${target.repo}/contents/${path}?ref=${target.branch}`,
    );
    return { sha: data.sha, text: decodeBase64(data.content) };
  } catch (error) {
    if (error instanceof GitHubError && error.status === 404) return null;
    throw error;
  }
}

export async function putFile(
  auth: GitHubAuth,
  target: RepoTarget,
  path: string,
  text: string,
  message: string,
  sha: string | undefined,
): Promise<{ sha: string }> {
  const data = await request<{ content: { sha: string } }>(
    auth,
    `/repos/${target.owner}/${target.repo}/contents/${path}`,
    {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: encodeBase64(text),
        branch: target.branch,
        ...(sha ? { sha } : {}),
      }),
    },
  );
  return { sha: data.content.sha };
}

/** Commits a binary asset (an image) already encoded as base64. */
export async function putBinary(
  auth: GitHubAuth,
  target: RepoTarget,
  path: string,
  base64: string,
  message: string,
  sha: string | undefined,
): Promise<void> {
  await request(auth, `/repos/${target.owner}/${target.repo}/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: base64,
      branch: target.branch,
      ...(sha ? { sha } : {}),
    }),
  });
}

export interface RemoteRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  homepage: string | null;
  html_url: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
}

export async function listRepos(auth: GitHubAuth, user: string): Promise<RemoteRepo[]> {
  return request<RemoteRepo[]>(auth, `/users/${user}/repos?per_page=100&sort=updated`);
}

export async function getViewer(auth: GitHubAuth): Promise<{ login: string }> {
  return request<{ login: string }>(auth, '/user');
}
