import type { PageServerLoad } from './$types';
import { getAllCertificates } from '$lib/server/queries/certificates';

const PAGE_SIZE = 9; // 3 columns x 3 rows

export const load: PageServerLoad = async ({ url }) => {
	const all = await getAllCertificates(); // newest first

	// Only accept the known value, ignore anything else
	const filter = url.searchParams.get('filter') === 'winner' ? 'winner' : 'all';
	const filtered = filter === 'winner' ? all.filter((c) => c.isWinner) : all;

	// Clamp the page number so ?page=999 or ?page=abc never breaks the page
	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const requested = Number(url.searchParams.get('page'));
	const page = Number.isInteger(requested) && requested >= 1 ? Math.min(requested, totalPages) : 1;

	return {
		items: filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
		filter,
		page,
		totalPages
	};
};
