import { sql } from 'drizzle-orm';
import { client, db, schema } from './seed-db';

// Run this first: projects and certificates link to these tags by name.
// Colors are the dot colors shown next to each tag, so they need to be visible on the dark cards.
const tagsSeed = [
	// Tech stack
	{ name: 'Node.js', color: '#339933' },
	{ name: 'NestJS', color: '#E0234E' },
	{ name: 'TypeScript', color: '#3178C6' },
	{ name: 'PostgreSQL', color: '#4169E1' },
	{ name: 'Prisma', color: '#5A67D8' },
	{ name: 'Drizzle', color: '#C5F74F' },
	{ name: 'Redis', color: '#DC382D' },
	{ name: 'Docker', color: '#2496ED' },
	{ name: 'GitHub Actions', color: '#2088FF' },
	{ name: 'Xendit', color: '#0066FF' },
	{ name: 'Swagger', color: '#85EA2D' },
	{ name: 'Supabase', color: '#3ECF8E' },
	{ name: 'Railway', color: '#B794F4' },
	{ name: 'Bun', color: '#FBF0DF' },
	{ name: 'SvelteKit', color: '#FF3E00' },
	{ name: 'Tailwind CSS', color: '#06B6D4' },
	{ name: 'Vercel', color: '#FFFFFF' },
	{ name: 'Resend', color: '#E5E7EB' },

	// Certificate categories
	{ name: 'Competition', color: '#FFBD2E' },
	{ name: 'Course', color: '#3B82F6' }
];

async function seed() {
	// Upsert by name, so running this again only updates colors and never duplicates tags
	await db
		.insert(schema.tags)
		.values(tagsSeed)
		.onConflictDoUpdate({ target: schema.tags.name, set: { color: sql`excluded.color` } });

	console.log(`Tags seed done (${tagsSeed.length})`);
}

seed().finally(() => client.end());
