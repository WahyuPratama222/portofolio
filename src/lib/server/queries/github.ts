// Fetches the GitHub contribution calendar from a public third-party API (no token needed).
//
// The API takes about 1 second per call, so visitors should almost never wait for it:
//   1. memory cache    -> instant, but lost whenever a serverless instance restarts
//   2. Upstash Redis   -> ~30ms, shared by every instance (skipped when the env vars are missing)
//   3. the real API    -> ~1s, only when nothing is cached yet
// Data younger than FRESH_MS is served as is. Older data (up to STALE_MS) is still served
// instantly while a refresh runs in the background (stale-while-revalidate).
import { Redis } from '@upstash/redis';
import { env } from '$env/dynamic/private';

export type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
export type Contributions = { total: number; days: Day[] };

type Entry = { at: number; data: Contributions };

const FRESH_MS = 60 * 60 * 1000; // 1 hour
const STALE_MS = 7 * 24 * 60 * 60 * 1000; // keep old data for a week as a fallback
const REDIS_PREFIX = 'portfolio:github:';

const memory = new Map<string, Entry>();
const inflight = new Map<string, Promise<Contributions | null>>();

// Created lazily so the app still boots when the env vars are missing (e.g. local dev)
let redis: Redis | null | undefined;
function getRedis(): Redis | null {
	if (redis !== undefined) return redis;
	redis =
		env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
			? new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN })
			: null;
	return redis;
}

async function readEntry(username: string): Promise<Entry | null> {
	const local = memory.get(username);
	if (local && Date.now() - local.at < FRESH_MS) return local;

	// Another instance may already have refreshed it, so check Redis before giving up on memory
	const r = getRedis();
	if (r) {
		try {
			const remote = await r.get<Entry>(REDIS_PREFIX + username);
			if (remote && (!local || remote.at > local.at)) {
				memory.set(username, remote);
				return remote;
			}
		} catch (err) {
			console.error('Redis read failed (GitHub contributions):', err);
		}
	}
	return local ?? null;
}

async function writeEntry(username: string, entry: Entry) {
	memory.set(username, entry);

	const r = getRedis();
	if (!r) return;
	try {
		await r.set(REDIS_PREFIX + username, entry, { ex: STALE_MS / 1000 });
	} catch (err) {
		console.error('Redis write failed (GitHub contributions):', err);
	}
}

// Calls the real API. Concurrent callers share one request.
function refresh(username: string, fallback: Entry | null): Promise<Contributions | null> {
	const running = inflight.get(username);
	if (running) return running;

	const job = (async () => {
		try {
			const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
			if (!res.ok) throw new Error(`GitHub contributions API returned ${res.status}`);

			const json = (await res.json()) as {
				total: Record<string, number>;
				contributions: Day[];
			};

			const data: Contributions = {
				total: json.total?.lastYear ?? json.contributions.reduce((sum, d) => sum + d.count, 0),
				days: json.contributions
			};

			await writeEntry(username, { at: Date.now(), data });
			return data;
		} catch (err) {
			console.error('Failed to load GitHub contributions:', err);
			// Fall back to old data, or null so the page simply hides the graph
			return fallback?.data ?? null;
		} finally {
			inflight.delete(username);
		}
	})();

	inflight.set(username, job);
	return job;
}

// Returns cached data when possible; only calls the real API when nothing usable is cached
export async function getGithubContributions(username: string): Promise<Contributions | null> {
	const entry = await readEntry(username);

	if (entry) {
		const age = Date.now() - entry.at;
		if (age < FRESH_MS) return entry.data;

		if (age < STALE_MS) {
			// Serve the old data right away and refresh quietly in the background
			void refresh(username, entry);
			return entry.data;
		}
	}

	// Nothing usable cached: this visitor has to wait for the API
	return refresh(username, entry);
}
