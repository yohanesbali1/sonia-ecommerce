import { eq } from 'drizzle-orm';
import { db, schema, ensureSeeded } from './connection';
import { Category } from '@/types';

export async function getCategories(onlyActive = true): Promise<Category[]> {
  await ensureSeeded();
  if (onlyActive) {
    const rows = await db.select().from(schema.categories)
      .where(eq(schema.categories.status, true))
      .orderBy(schema.categories.id);
    return rows as Category[];
  }
  const rows = await db.select().from(schema.categories).orderBy(schema.categories.id);
  return rows as Category[];
}

export async function getCategoryById(id: number): Promise<Category | undefined> {
  const [row] = await db.select().from(schema.categories).where(eq(schema.categories.id, id));
  return row as Category | undefined;
}

export async function createCategory(input: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {

  console.log(input);
  const now = new Date().toISOString();
  const [row] = await db.insert(schema.categories).values({
    name: input.name,
    slug: input.slug || '',
    image: input.image || '',
    status: input.status,
    created_at: now,
    updated_at: now,
  }).returning();
  return row as Category;
}

export async function updateCategory(id: number, updates: Partial<Category>): Promise<Category | undefined> {
  const existing = await getCategoryById(id);
  if (!existing) return undefined;
  const merged = { ...existing, ...updates, updated_at: new Date().toISOString() };
  await db.update(schema.categories).set({
    name: merged.name,
    slug: merged.slug,
    image: merged.image || '',
    status: merged.status,
    updated_at: merged.updated_at,
  }).where(eq(schema.categories.id, id));

  if (updates.name) {
    await db.update(schema.products).set({ category_name: updates.name })
      .where(eq(schema.products.category_id, id));
  }

  return getCategoryById(id);
}

export async function deleteCategory(id: number): Promise<boolean> {
  const result = await db.delete(schema.categories).where(eq(schema.categories.id, id)).execute();
  return Boolean(result);
}
