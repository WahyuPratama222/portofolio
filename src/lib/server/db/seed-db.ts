import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Shared connection for every seed script.
// Bun loads .env automatically, so process.env works outside SvelteKit.
const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

export const client = postgres(url);
export const db = drizzle(client, { schema });
export { schema };
