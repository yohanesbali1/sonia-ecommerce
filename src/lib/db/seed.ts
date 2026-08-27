import type Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import { initialCategories, initialProducts, initialSettings } from './schema';

export function seedIfEmpty(db: Database.Database): void {
  const adminCount = db.prepare('SELECT COUNT(*) as count FROM admins').get() as { count: number };
  if (adminCount.count > 0) return;

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('admin123', salt);
  const now = new Date().toISOString();

  const insertAdmin = db.prepare(
    'INSERT INTO admins (name, email, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
  );
  insertAdmin.run('Owner Chérie', 'admin@cherie.com', passwordHash, now, now);

  const insertCategory = db.prepare(
    'INSERT INTO categories (name, slug, image, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
  );
  for (const cat of initialCategories) {
    insertCategory.run(cat.name, cat.slug, cat.image || '', cat.status || 'active', now, now);
  }

  const insertProduct = db.prepare(
    'INSERT INTO products (category_id, category_name, name, slug, description, price, discount_price, stock, status, featured, best_seller, rating, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );
  const insertProductImage = db.prepare(
    'INSERT INTO product_images (product_id, image, sort_order) VALUES (?, ?, ?)'
  );

  for (const prod of initialProducts) {
    const catRow = db.prepare('SELECT name FROM categories WHERE id = ?').get(prod.category_id) as { name: string } | undefined;
    const catName = catRow ? catRow.name : 'Umum';
    const createdDate = new Date(Date.now() - Math.random() * 7 * 86400000).toISOString();

    const result = insertProduct.run(
      prod.category_id, catName, prod.name, prod.slug, prod.description,
      prod.price, prod.discount_price, prod.stock, prod.status,
      prod.featured ? 1 : 0, prod.best_seller ? 1 : 0, prod.rating,
      createdDate, now
    );
    const productId = result.lastInsertRowid;

    for (let i = 0; i < prod.images.length; i++) {
      insertProductImage.run(productId, prod.images[i], i);
    }
  }

  const insertSettings = db.prepare(
    `INSERT INTO settings (id, store_name, store_tagline, logo_url, whatsapp, email, address, bank_name, bank_account_number, bank_account_holder, secondary_bank_name, secondary_account_number, secondary_account_holder, default_shipping_cost)
     VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  insertSettings.run(
    initialSettings.store_name, initialSettings.store_tagline || '',
    initialSettings.logo_url || '', initialSettings.whatsapp,
    initialSettings.email, initialSettings.address,
    initialSettings.bank_name, initialSettings.bank_account_number,
    initialSettings.bank_account_holder, initialSettings.secondary_bank_name || '',
    initialSettings.secondary_account_number || '', initialSettings.secondary_account_holder || '',
    initialSettings.default_shipping_cost
  );
}
