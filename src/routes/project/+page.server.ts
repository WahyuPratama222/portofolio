import type { PageServerLoad } from './$types';
import { getProjectsPage } from '$lib/server/queries/projects';

export const load: PageServerLoad = async ({ url }) => {
	// Clamp page to a positive integer
	const page = Math.max(1, Number(url.searchParams.get('page')) || 1);

	// Only accept known status values, ignore anything else
	const s = url.searchParams.get('status');
	const status = s === 'ongoing' || s === 'completed' ? s : undefined;

	const result = await getProjectsPage(page, 6, status);

	return {
		...result,
		page,
		status: status ?? 'all'
	};
};
