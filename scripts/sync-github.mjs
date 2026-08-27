#!/usr/bin/env node
/**
 * Refreshes content/github-cache.json from the GitHub REST API.
 *
 * The cache is committed so builds never depend on the network or on GitHub's
 * unauthenticated rate limit. Run this (or press Refresh in the admin) when you
 * want the stars, languages and timestamps brought up to date.
 *
 *   node scripts/sync-github.mjs [--user <login>]
 */
import { writeFile } from 'node:fs/promises';

const args = process.argv.slice(2);
const userIndex = args.indexOf('--user');
const user = userIndex >= 0 ? args[userIndex + 1] : 'ramtarun02';
const token = process.env.GITHUB_TOKEN;

const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-sync' };
if (token) headers.Authorization = `Bearer ${token}`;

const response = await fetch(
  `https://api.github.com/users/${user}/repos?per_page=100&sort=updated`,
  { headers },
);

if (!response.ok) {
  console.error(`GitHub returned ${response.status}. The existing cache was left untouched.`);
  process.exit(1);
}

const repos = await response.json();

const cache = {
  user,
  fetchedAt: new Date().toISOString(),
  repos: repos
    .filter((repo) => !repo.fork && !repo.archived)
    .map((repo) => ({
      name: repo.name,
      description: repo.description ?? '',
      language: repo.language ?? null,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      topics: repo.topics ?? [],
      homepage: repo.homepage || null,
      url: repo.html_url,
      pushedAt: repo.pushed_at,
    })),
};

await writeFile('content/github-cache.json', `${JSON.stringify(cache, null, 2)}\n`);
console.log(`Cached ${cache.repos.length} repositories for ${user}.`);
