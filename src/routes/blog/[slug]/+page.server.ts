import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPost } from '$lib/server/blog';

export const load: PageServerLoad = async ({ params }) => {
	const post = await getPost(params.slug);
	if (!post) error(404, 'Artikel tidak ditemukan');
	return post;
};
