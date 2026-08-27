/**
 * Authentication adapter.
 *
 * Hosting is not settled (build spec §2), and the two candidate flows need
 * different machinery: a fine-grained token works on any static host, while
 * OAuth needs a server route to exchange the code. Everything above this
 * interface is written against `GitHubAuth`, so switching costs one file.
 */
export interface GitHubAuth {
  readonly kind: 'token' | 'oauth';
  getToken(): string | null;
  isAuthenticated(): boolean;
  signIn(token: string): void;
  signOut(): void;
}

const TOKEN_KEY = 'trp-admin-token';

/**
 * Token adapter: the user pastes a fine-grained personal access token scoped to
 * the portfolio repository. Held in localStorage, so it is per-browser and
 * never leaves the machine except as an Authorization header to api.github.com.
 */
export const tokenAuth: GitHubAuth = {
  kind: 'token',

  getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return Boolean(this.getToken());
  },

  signIn(token: string) {
    try {
      localStorage.setItem(TOKEN_KEY, token.trim());
    } catch {
      // Blocked storage: the session still works until the tab is closed.
    }
  },

  signOut() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // Nothing to clean up.
    }
  },
};
