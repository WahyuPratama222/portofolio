import { client, db, schema } from './seed-db';

const experiencesSeed: (typeof schema.experiences.$inferInsert)[] = [
	{
		orgName: 'Himpunan Mahasiswa Teknik Informatika (HMIF) - Universitas Sriwijaya',
		role: 'BPH Wakadin KOMINFO',
		type: 'organization',
		startDate: '2026-03-01',
		endDate: '2026-11-30',
		points: [
			'Mendampingi Kepala Dinas KOMINFO dalam memimpin dan menentukan arah kebijakan strategis Dinas KOMINFO HMIF.',
			'Mensupervisi kinerja Divisi Humas dan Divisi Multimedia guna memastikan seluruh program kerja publikasi berjalan sesuai target.'
		],
		locationType: 'onsite',
		logoUrl: null
	},
	{
		orgName: 'Google Developer Groups on Campus (GDGoC) - Universitas Sriwijaya',
		role: 'Member Back-End Development',
		type: 'organization',
		startDate: '2026-01-01',
		endDate: '2026-10-10',
		points: [
			'Fokus pada pembuatan REST API dan implementasi logika backend menggunakan teknologi web modern.',
			'Menerapkan sistem arsitektur yang scalable dan standar clean code dalam pengembangan proyek bersama.',
			'Terpilih sebagai Best Final Project untuk divisi Back-End Development.'
		],
		locationType: 'hybrid',
		logoUrl: null
	},
	{
		orgName: 'Himpunan Mahasiswa Teknik Informatika (HMIF) - Universitas Sriwijaya',
		role: 'Staff Humas KOMINFO',
		type: 'organization',
		startDate: '2025-03-01',
		endDate: '2025-11-30',
		points: [
			'Mengelola dan mengoptimalkan seluruh kanal media sosial resmi HMIF untuk meningkatkan publikasi program kerja.',
			'Membangun hubungan komunikasi yang efektif antara organisasi dengan pihak internal maupun eksternal kampus.'
		],
		locationType: 'onsite',
		logoUrl: null
	}
];

async function seed() {
	// Only experiences are cleared, nothing else is touched
	await db.delete(schema.experiences);
	await db.insert(schema.experiences).values(experiencesSeed);

	console.log(`Experiences seed done (${experiencesSeed.length})`);
}

seed().finally(() => client.end());
