import type { LayoutServerLoad } from './$types';
import { getGithubContributions } from '$lib/server/queries/github';
import { GITHUB_USERNAME } from '$lib/data/socials';

export const load: LayoutServerLoad = async () => ({
	// Not awaited on purpose: the page renders first and the graph streams in after.
	contributions: getGithubContributions(GITHUB_USERNAME)
});
