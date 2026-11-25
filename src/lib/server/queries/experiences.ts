import { db } from '$lib/server/db';
import { experiences } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

// About: every experience, newest first (by start date)
export async function getAllExperiences() {
	return db.select().from(experiences).orderBy(desc(experiences.startDate));
}
