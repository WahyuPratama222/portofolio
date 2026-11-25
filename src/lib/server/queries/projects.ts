import { db } from '$lib/server/db';
import { projects } from '$lib/server/db/schema';
import { asc, count, eq } from 'drizzle-orm';

// Load each project together with its tags
const withTags = { projectTags: { with: { tag: true } } } as const;

// Never send hidden links to the browser (the "lock" feature)
function sanitize<
	T extends {
		githubUrl: string | null;
		webUrl: string | null;
		githubVisibility: string;
		webVisibility: string;
	}
>(p: T): T {
	return {
		...p,
		githubUrl: p.githubVisibility === 'public' ? p.githubUrl : null,
		webUrl: p.webVisibility === 'public' ? p.webUrl : null
	};
}

// Home: only a few featured projects as a teaser
export async function getFeaturedProjects(limit = 3) {
	const rows = await db.query.projects.findMany({
		where: eq(projects.isFeatured, true),
		orderBy: asc(projects.sortOrder),
		limit,
		with: withTags
	});
	return rows.map(sanitize);
}

// /project: all projects, paginated, with an optional status filter
export async function getProjectsPage(
	page: number,
	pageSize = 6,
	status?: 'ongoing' | 'completed'
) {
	const where = status ? eq(projects.status, status) : undefined;

	const [rows, [{ total }]] = await Promise.all([
		db.query.projects.findMany({
			where,
			orderBy: asc(projects.sortOrder),
			limit: pageSize,
			offset: (page - 1) * pageSize,
			with: withTags
		}),
		db.select({ total: count() }).from(projects).where(where)
	]);

	return {
		items: rows.map(sanitize),
		total,
		totalPages: Math.max(1, Math.ceil(total / pageSize))
	};
}
