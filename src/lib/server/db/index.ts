import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

// prepare: false is required for the Supabase transaction pooler (port 6543),
// which does not support prepared statements. It is harmless for local Postgres too.
const client = postgres(env.DATABASE_URL, { prepare: false });

export const db = drizzle(client, { schema });
