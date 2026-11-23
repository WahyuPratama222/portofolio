import { client, db, schema } from './seed-db';

// Each certificate lists the names of its tags; they must exist (run seed-tags.ts first).
type CertificateSeed = typeof schema.certificates.$inferInsert & { tags: string[] };

const certificatesSeed: CertificateSeed[] = [
	{
		name: '1st Place — Redesign Challenge: S.H.I.F.T (Shaping High-Fidelity Interfaces & Fullstack Technologies)',
		description:
			'Diselenggarakan oleh Google Developer Groups on Campus Universitas Sriwijaya (GDGoC UNSRI). Berperan sebagai Backend Developer dalam tim lintas peran (UI/UX Designer, Backend Developer, dan Frontend Developer) untuk membangun logika backend serta integrasi API pendukung redesign high-fidelity interface.',
		date: '2026-07-10',
		previewImage: null,
		isWinner: true,
		tags: ['Competition']
	}
];

async function seed() {
	const allTags = await db.select().from(schema.tags);
	const tagId = new Map(allTags.map((t) => [t.name, t.id]));

	// Only certificates are cleared (their tag links are removed by the cascade)
	await db.delete(schema.certificates);

	for (const { tags: tagNames, ...certificate } of certificatesSeed) {
		const [row] = await db.insert(schema.certificates).values(certificate).returning();

		const links = tagNames.map((name) => {
			const id = tagId.get(name);
			if (!id) throw new Error(`Tag "${name}" not found. Run seed-tags.ts first.`);
			return { certificateId: row.id, tagId: id };
		});
		if (links.length) await db.insert(schema.certificateTags).values(links);
	}

	console.log(`Certificates seed done (${certificatesSeed.length})`);
}

seed().finally(() => client.end());
