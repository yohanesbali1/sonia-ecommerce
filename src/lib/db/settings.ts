import { eq } from 'drizzle-orm';
import { db, schema, ensureSeeded } from './connection';
import { StoreSettings } from '@/types';

export async function getSettings(): Promise<StoreSettings> {
  await ensureSeeded();
  const [row] = await db.select().from(schema.settings).where(eq(schema.settings.id, 1));
  if (!row) {
    return {
      store_name: 'SONIABALISHOP',
      store_tagline: 'Fashion, Beauty & Chic Boutique Collection',
      logo_url: '',
      whatsapp: '081234567890',
      email: 'order@soniabalishop.com',
      address: 'Jl. Sunset Road No. 88, Seminyak, Kuta, Bali',
    };
  }
  return {
    store_name: row.store_name ?? '',
    store_tagline: row.store_tagline ?? '',
    logo_url: row.logo_url ?? '',
    whatsapp: row.whatsapp ?? '',
    email: row.email ?? '',
    address: row.address ?? '',
  };
}

export async function updateSettings(updates: Partial<StoreSettings>): Promise<StoreSettings> {
  const current = await getSettings();
  const merged = { ...current, ...updates };
  await db.update(schema.settings).set({
    store_name: merged.store_name,
    store_tagline: merged.store_tagline || '',
    logo_url: merged.logo_url || '',
    whatsapp: merged.whatsapp,
    email: merged.email,
    address: merged.address,
  }).where(eq(schema.settings.id, 1));
  return getSettings();
}
