import type { PageServerLoad } from './$types';
import { getAllPosts } from '$lib/server/blog';

const PAGE_SIZE = 9; // 3 columns x 3 rows

export const load: PageServerLoad = async ({ url }) => {
	// Newest first
	const all = [...getAllPosts()].sort((a, b) => b.date.localeCompare(a.date));

	// Clamp the page number so ?page=999 or ?page=abc never breaks the page
	const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
	const requested = Number(url.searchParams.get('page'));
	const page = Number.isInteger(requested) && requested >= 1 ? Math.min(requested, totalPages) : 1;

	return {
		posts: all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
		page,
		totalPages
	};
};
