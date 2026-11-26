import matter from 'gray-matter';
import { Marked } from 'marked';
import { createHighlighter, type Highlighter } from 'shiki';
import { dev } from '$app/environment';

// All markdown files are bundled at build time, so this works on Vercel without filesystem access
const files = import.meta.glob('/src/content/blog/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

export type PostMeta = {
	slug: string;
	title: string;
	description: string;
	date: string; // ISO yyyy-mm-dd
	updated: string | null;
	tags: string[];
	// Optional cover image (frontmatter `cover: /blog/my-post.webp`, file lives in static/blog/)
	cover: string | null;
	readingMinutes: number;
	draft: boolean;
};

const toISO = (value: unknown): string | null => {
	if (!value) return null;
	const d = value instanceof Date ? value : new Date(String(value));
	return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
};

function parse(path: string, raw: string) {
	const { data, content } = matter(raw);
	const slug = path.split('/').pop()!.replace(/\.md$/, '');
	const words = content.trim().split(/\s+/).length;

	const meta: PostMeta = {
		slug,
		title: String(data.title ?? slug),
		description: String(data.description ?? ''),
		date: toISO(data.date) ?? '1970-01-01',
		updated: toISO(data.updated),
		tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
		cover: data.cover ? String(data.cover) : null,
		readingMinutes: Math.max(1, Math.round(words / 200)),
		draft: data.draft === true
	};
	return { meta, content };
}

const posts = Object.entries(files)
	.map(([path, raw]) => parse(path, raw))
	// Drafts are visible while developing, hidden in production
	.filter((p) => dev || !p.meta.draft)
	.sort((a, b) => b.meta.date.localeCompare(a.meta.date));

export function getAllPosts(): PostMeta[] {
	return posts.map((p) => p.meta);
}

// ---- Markdown rendering with Shiki ----

let highlighterPromise: Promise<Highlighter> | null = null;
const LANGS = ['ts', 'js', 'json', 'bash', 'sql', 'svelte', 'html', 'css', 'yaml', 'dockerfile'];

const getHighlighter = () =>
	(highlighterPromise ??= createHighlighter({ themes: ['github-dark'], langs: LANGS }));

const escapeHtml = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function render(markdown: string): Promise<string> {
	const highlighter = await getHighlighter();
	const loaded = highlighter.getLoadedLanguages();

	const marked = new Marked({
		async: true,
		walkTokens: async (token) => {
			if (token.type !== 'code') return;
			const lang = (token.lang ?? '').trim().split(/\s+/)[0] || 'text';
			const body = loaded.includes(lang)
				? highlighter.codeToHtml(token.text, { lang, theme: 'github-dark' })
				: `<pre class="shiki"><code>${escapeHtml(token.text)}</code></pre>`;

			// Turn the code token into a ready-made html token
			Object.assign(token, {
				type: 'html',
				block: true,
				text: `<div class="code-block"><div class="code-head"><span>${escapeHtml(lang)}</span></div>${body}</div>`
			});
		}
	});

	return marked.parse(markdown) as Promise<string>;
}

export async function getPost(slug: string) {
	const found = posts.find((p) => p.meta.slug === slug);
	if (!found) return null;
	return { meta: found.meta, html: await render(found.content) };
}
