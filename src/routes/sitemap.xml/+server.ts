import { SITE_URL } from '$lib/config';
import { getAllPosts } from '$lib/server/blog';

const STATIC_PAGES = ['', '/project', '/certificate', '/blog'];

// Normalises "2026-11-01" or a full ISO string to YYYY-MM-DD
const day = (value: string) => new Date(value).toISOString().slice(0, 10);

export async function GET() {
	const posts = await getAllPosts();

	const urls = [
		...STATIC_PAGES.map((path) => `<url><loc>${SITE_URL}${path}</loc></url>`),
		...posts.map(
			(post) =>
				`<url><loc>${SITE_URL}/blog/${post.slug}</loc><lastmod>${day(post.updated ?? post.date)}</lastmod></url>`
		)
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600'
		}
	});
}
