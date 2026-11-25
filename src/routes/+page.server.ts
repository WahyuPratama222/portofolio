import type { PageServerLoad } from './$types';
import { getFeaturedProjects } from '$lib/server/queries/projects';
import { getHighlightedCertificates } from '$lib/server/queries/certificates';
import { getAllExperiences } from '$lib/server/queries/experiences';

export const load: PageServerLoad = async () => {
	// Run the three queries at the same time instead of one after another
	const [featured, certificates, experiences] = await Promise.all([
		getFeaturedProjects(3),
		getHighlightedCertificates(3),
		getAllExperiences()
	]);

	return { featured, certificates, experiences };
};
