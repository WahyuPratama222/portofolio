import { db } from '$lib/server/db';
import { certificates } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

// Load each certificate together with its tags
const withTags = { certificateTags: { with: { tag: true } } } as const;

// /certificate: everything, newest first
export async function getAllCertificates() {
	return db.query.certificates.findMany({
		orderBy: desc(certificates.date),
		with: withTags
	});
}

// Home: a small teaser, competition winners first, then newest
export async function getHighlightedCertificates(limit = 3) {
	return db.query.certificates.findMany({
		orderBy: [desc(certificates.isWinner), desc(certificates.date)],
		limit,
		with: withTags
	});
}
