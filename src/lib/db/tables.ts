import { pgTable, serial, text, integer, real, boolean, timestamp, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password'),
  created_at: text('created_at').notNull().default(sql`now()`),
  updated_at: text('updated_at').notNull().default(sql`now()`),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  image: text('image'),
  status: boolean('status').notNull().default(true),
  created_at: text('created_at').notNull().default(sql`now()`),
  updated_at: text('updated_at').notNull().default(sql`now()`),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  category_id: integer('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
  category_name: text('category_name'),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').default(''),
  price: integer('price').notNull().default(0),
  discount_price: integer('discount_price').default(0),
  stock: integer('stock').notNull().default(0),
  status: boolean('status').notNull().default(true),
  featured: integer('featured').notNull().default(0),
  best_seller: integer('best_seller').notNull().default(0),
  rating: real('rating').default(0),
  created_at: text('created_at').notNull().default(sql`now()`),
  updated_at: text('updated_at').notNull().default(sql`now()`),
});

export const productImages = pgTable('product_images', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  image: text('image').notNull(),
  sort_order: integer('sort_order').notNull().default(0),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  order_number: text('order_number').notNull().unique(),
  customer_name: text('customer_name').notNull(),
  whatsapp: text('whatsapp').notNull(),
  email: text('email'),
  address: text('address').notNull(),
  city: text('city').notNull(),
  province: text('province').notNull(),
  postal_code: text('postal_code').notNull(),
  notes: text('notes').default(''),
  subtotal: integer('subtotal').notNull().default(0),
  shipping_cost: integer('shipping_cost').notNull().default(0),
  total: integer('total').notNull().default(0),
  payment_status: text('payment_status').notNull().default('PENDING'),
  order_status: text('order_status').notNull().default('PENDING_PAYMENT'),
  rejection_reason: text('rejection_reason'),
  tracking_number: text('tracking_number'),
  courier: text('courier'),
  created_at: text('created_at').notNull().default(sql`now()`),
  updated_at: text('updated_at').notNull().default(sql`now()`),
});

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  product_id: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  product_name: text('product_name').notNull(),
  product_image: text('product_image').default(''),
  price: integer('price').notNull().default(0),
  quantity: integer('quantity').notNull().default(1),
  subtotal: integer('subtotal').notNull().default(0),
});

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  order_id: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  method: text('method').notNull().default('Bank Transfer'),
  amount: integer('amount').notNull().default(0),
  proof_image: text('proof_image'),
  paid_at: text('paid_at'),
  status: text('status').notNull().default('PENDING'),
  approved_at: text('approved_at'),
  rejected_at: text('rejected_at'),
  rejection_reason: text('rejection_reason'),
});

export const settings = pgTable('settings', {
  id: integer('id').primaryKey(),
  store_name: text('store_name').notNull().default(''),
  store_tagline: text('store_tagline').default(''),
  logo_url: text('logo_url').default(''),
  whatsapp: text('whatsapp').default(''),
  email: text('email').default(''),
  address: text('address').default(''),
}, (table) => [
  check('settings_id_check', sql`${table.id} = 1`),
]);
