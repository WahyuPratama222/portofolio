import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';

export type RateLimitResult = { ok: true } | { ok: false; retryAfter: number };

// Created lazily so the app still boots when the env vars are missing (e.g. local dev)
let limiter: Ratelimit | null | undefined;

function getLimiter(): Ratelimit | null {
	if (limiter !== undefined) return limiter;

	if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
		limiter = null;
		return limiter;
	}

	limiter = new Ratelimit({
		redis: new Redis({
			url: env.UPSTASH_REDIS_REST_URL,
			token: env.UPSTASH_REDIS_REST_TOKEN
		}),
		// 3 messages per 10 minutes per IP
		limiter: Ratelimit.slidingWindow(3, '10 m'),
		prefix: 'portfolio:contact'
	});
	return limiter;
}

export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
	const rl = getLimiter();

	if (!rl) {
		// Skipping is fine locally, but production must never run without a limiter
		if (dev) return { ok: true };
		throw new Error('UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set');
	}

	try {
		const { success, reset } = await rl.limit(identifier);
		if (success) return { ok: true };
		return { ok: false, retryAfter: Math.max(1, Math.ceil((reset - Date.now()) / 1000)) };
	} catch (err) {
		// If Upstash itself is down, let real visitors through instead of blocking everyone
		console.error('Rate limiter unavailable:', err);
		return { ok: true };
	}
}
