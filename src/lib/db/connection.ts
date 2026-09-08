import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import postgres from 'postgres';
import * as schema from './tables';

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('Database URL is not configured');
}

const isNeon = process.env.DB_DRIVER === 'neon';

export const db = isNeon
  ? drizzleNeon(neon(dbUrl), { schema })
  : drizzlePostgres(postgres(dbUrl), { schema });

export { schema };

let seeded = false;

export async function ensureSeeded() {
  if (seeded) return;
  const { seedDatabase } = await import('./seed');
  await seedDatabase();
  seeded = true;
}
