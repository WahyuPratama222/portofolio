import { client, db, schema } from './seed-db';

// Each project lists the names of its tags; they must exist (run seed-tags.ts first).
type ProjectSeed = typeof schema.projects.$inferInsert & { tags: string[] };

const projectsSeed: ProjectSeed[] = [
	{
		name: 'HeavyLift Backend',
		description:
			'Backend REST API untuk sistem manajemen gym berbasis NestJS, Prisma 5, PostgreSQL, dan Redis — mencakup autentikasi JWT multi-device dengan refresh token reuse detection, manajemen member, paket, trainer, alat, review, dan pengumuman, integrasi Xendit & webhook, rate limiting, logging Pino, Swagger/OpenAPI, 147 unit test Jest, serta Docker & CI/CD GitHub Actions ke GHCR.',
		problemSolved:
			'Menyediakan sistem backend manajemen gym yang terstruktur, aman terhadap reuse token dan race condition transaksi pembayaran, terdokumentasi otomatis, serta siap di-build dan di-push secara konsisten via Docker dan CI/CD.',
		status: 'completed',
		role: ['Back-End Developer'],
		previewImage: null,
		githubUrl: 'https://github.com/WahyuPratama222/heavylift-backend',
		webUrl: null,
		githubVisibility: 'public',
		webVisibility: 'hidden',
		isFeatured: true,
		sortOrder: 1,
		tags: [
			'Node.js',
			'NestJS',
			'TypeScript',
			'PostgreSQL',
			'Prisma',
			'Redis',
			'Docker',
			'GitHub Actions',
			'Xendit',
			'Swagger'
		]
	},
	{
		name: 'IGRS Backend API',
		description:
			'Public read-only REST API untuk platform Indonesia Game Rating System (IGRS) berbasis NestJS, Prisma 5, dan PostgreSQL (Supabase) — menyediakan statistik dashboard, kategori rating usia, katalog dan detail game dengan filter multi-kriteria serta autocomplete search, dan berita/pengumuman, lengkap dengan validasi DTO, Swagger/OpenAPI, helmet, logging request, dan deployment di Railway.',
		problemSolved:
			'Menyediakan layanan data klasifikasi game, rating usia, pencarian, dan berita yang terstruktur, tervalidasi, serta dapat diakses publik secara cepat dan terdokumentasi.',
		status: 'completed',
		role: ['Back-End Developer'],
		previewImage: null,
		githubUrl: 'https://github.com/WahyuPratama222/igrs-redesign-backend',
		webUrl: 'https://igrs-redesign-backend-team9.up.railway.app/api/docs',
		githubVisibility: 'public',
		webVisibility: 'public',
		isFeatured: true,
		sortOrder: 2,
		tags: [
			'Node.js',
			'NestJS',
			'TypeScript',
			'PostgreSQL',
			'Prisma',
			'Supabase',
			'Swagger',
			'Railway'
		]
	},
	{
		name: 'Portofolio',
		description:
			'Aplikasi web portofolio pribadi full-stack yang dibangun menggunakan runtime Bun, SvelteKit, Tailwind CSS, dan TypeScript, dengan PostgreSQL saat development, Supabase untuk deployment di Vercel, Redis, serta Resend.',
		problemSolved:
			'Menyediakan satu tempat terpusat untuk menampilkan project, skill, dan pengalaman secara terstruktur sehingga recruiter dan kolaborator bisa menilai kemampuan saya dengan cepat, sekaligus menjadi sarana belajar membangun aplikasi full-stack end-to-end.',
		status: 'completed',
		role: ['Full-Stack Developer'],
		previewImage: null,
		githubUrl: null,
		webUrl: null,
		githubVisibility: 'hidden',
		webVisibility: 'public',
		isFeatured: true,
		sortOrder: 3,
		tags: [
			'Bun',
			'SvelteKit',
			'Tailwind CSS',
			'TypeScript',
			'Drizzle',
			'PostgreSQL',
			'Docker',
			'Supabase',
			'Redis',
			'Resend',
			'Vercel'
		]
	}
];

async function seed() {
	const allTags = await db.select().from(schema.tags);
	const tagId = new Map(allTags.map((t) => [t.name, t.id]));

	// Only projects are cleared (their tag links are removed by the cascade)
	await db.delete(schema.projects);

	for (const { tags: tagNames, ...project } of projectsSeed) {
		const [row] = await db.insert(schema.projects).values(project).returning();

		const links = tagNames.map((name) => {
			const id = tagId.get(name);
			if (!id) throw new Error(`Tag "${name}" not found. Run seed-tags.ts first.`);
			return { projectId: row.id, tagId: id };
		});
		await db.insert(schema.projectTags).values(links);
	}

	console.log(`Projects seed done (${projectsSeed.length})`);
}

seed().finally(() => client.end());
