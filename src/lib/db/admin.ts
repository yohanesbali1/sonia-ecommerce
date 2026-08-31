import { eq, ilike } from 'drizzle-orm';
import { db, schema, ensureSeeded } from './connection';
import { Admin } from '@/types';

export async function getAdminByEmail(email: string): Promise<Admin | undefined> {
  await ensureSeeded();
  const [row] = await db.select().from(schema.admins).where(ilike(schema.admins.email, email));
  return row as Admin | undefined;
}

export async function getAdminById(id: number): Promise<Admin | undefined> {
  await ensureSeeded();
  const [row] = await db.select({
    id: schema.admins.id,
    name: schema.admins.name,
    email: schema.admins.email,
    created_at: schema.admins.created_at,
    updated_at: schema.admins.updated_at,
  }).from(schema.admins).where(eq(schema.admins.id, id));
  return row as Admin | undefined;
}
