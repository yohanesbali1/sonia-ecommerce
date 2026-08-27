import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, and, or, like, sql, count, desc, asc, ilike } from 'drizzle-orm';
import * as schema from './tables';
import {
  Admin,
  Category,
  Product,
  Order,
  OrderItem,
  Payment,
  StoreSettings,
  OrderStatus,
  PaymentStatus,
  DashboardStats,
} from '@/types';

const sqlConn = neon(process.env.DATABASE_URL!);
export const db = drizzle(sqlConn, { schema });

export { schema };

function toProduct(row: typeof schema.products.$inferSelect, images: string[]): Product {
  return {
    ...row,
    category_name: row.category_name ?? undefined,
    description: row.description ?? '',
    discount_price: row.discount_price ?? undefined,
    status: (row.status as 'active' | 'inactive') ?? 'active',
    featured: Boolean(row.featured),
    best_seller: Boolean(row.best_seller),
    rating: row.rating ?? undefined,
    images,
    created_at: row.created_at ?? undefined,
    updated_at: row.updated_at ?? undefined,
  };
}

// --- SEED FLAG ---
let seeded = false;

async function ensureSeeded() {
  if (seeded) return;
  const { seedDatabase } = await import('./seed');
  await seedDatabase();
  seeded = true;
}

// --- ADMIN METHODS ---
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

// --- SETTINGS METHODS ---
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
      bank_name: 'Bank BCA',
      bank_account_number: '8271039482',
      bank_account_holder: 'SONIABALISHOP',
      secondary_bank_name: 'Bank Mandiri',
      secondary_account_number: '1270009847123',
      secondary_account_holder: 'SONIABALISHOP',
      default_shipping_cost: 15000,
    };
  }
  return {
    store_name: row.store_name ?? '',
    store_tagline: row.store_tagline ?? '',
    logo_url: row.logo_url ?? '',
    whatsapp: row.whatsapp ?? '',
    email: row.email ?? '',
    address: row.address ?? '',
    bank_name: row.bank_name ?? '',
    bank_account_number: row.bank_account_number ?? '',
    bank_account_holder: row.bank_account_holder ?? '',
    secondary_bank_name: row.secondary_bank_name ?? '',
    secondary_account_number: row.secondary_account_number ?? '',
    secondary_account_holder: row.secondary_account_holder ?? '',
    default_shipping_cost: row.default_shipping_cost ?? 15000,
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
    bank_name: merged.bank_name,
    bank_account_number: merged.bank_account_number,
    bank_account_holder: merged.bank_account_holder,
    secondary_bank_name: merged.secondary_bank_name || '',
    secondary_account_number: merged.secondary_account_number || '',
    secondary_account_holder: merged.secondary_account_holder || '',
    default_shipping_cost: merged.default_shipping_cost,
  }).where(eq(schema.settings.id, 1));
  return getSettings();
}

// --- CATEGORIES METHODS ---
export async function getCategories(onlyActive = true): Promise<Category[]> {
  await ensureSeeded();
  if (onlyActive) {
    const rows = await db.select().from(schema.categories)
      .where(eq(schema.categories.status, 'active'))
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
  const now = new Date().toISOString();
  const [row] = await db.insert(schema.categories).values({
    name: input.name,
    slug: input.slug,
    image: input.image || '',
    status: input.status || 'active',
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
    status: merged.status || 'active',
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
  return (result.rowCount ?? 0) > 0;
}

// --- PRODUCTS METHODS ---
export async function getProducts(params?: {
  search?: string;
  category_id?: number;
  category_slug?: string;
  featured?: boolean;
  best_seller?: boolean;
  sort?: string;
  onlyActive?: boolean;
}): Promise<Product[]> {
  await ensureSeeded();
  const conditions = [];

  if (params?.onlyActive !== false) {
    conditions.push(eq(schema.products.status, 'active'));
  }

  if (params?.search) {
    const q = `%${params.search.toLowerCase().trim()}%`;
    conditions.push(or(
      ilike(schema.products.name, q),
      ilike(schema.products.description, q),
      ilike(schema.products.category_name, q),
    )!);
  }

  if (params?.category_id) {
    conditions.push(eq(schema.products.category_id, Number(params.category_id)));
  }

  if (params?.category_slug) {
    const [cat] = await db.select({ id: schema.categories.id })
      .from(schema.categories)
      .where(eq(schema.categories.slug, params.category_slug));
    if (cat) {
      conditions.push(eq(schema.products.category_id, cat.id));
    }
  }

  if (params?.featured !== undefined) {
    conditions.push(eq(schema.products.featured, params.featured ? 1 : 0));
  }

  if (params?.best_seller !== undefined) {
    conditions.push(eq(schema.products.best_seller, params.best_seller ? 1 : 0));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  let orderClause = desc(schema.products.created_at);
  if (params?.sort) {
    switch (params.sort) {
      case 'price_asc': orderClause = asc(sql`COALESCE(NULLIF(${schema.products.discount_price}, 0), ${schema.products.price})`); break;
      case 'price_desc': orderClause = desc(sql`COALESCE(NULLIF(${schema.products.discount_price}, 0), ${schema.products.price})`); break;
      case 'popular': orderClause = desc(sql`COALESCE(${schema.products.rating}, 0)`); break;
      case 'newest': orderClause = desc(schema.products.created_at); break;
    }
  }

  const rows = await db.select().from(schema.products).where(where).orderBy(orderClause);

  const products: Product[] = [];
  for (const row of rows) {
    const images = await db.select({ image: schema.productImages.image })
      .from(schema.productImages)
      .where(eq(schema.productImages.product_id, row.id))
      .orderBy(schema.productImages.sort_order);
    products.push(toProduct(row, images.map(i => i.image)));
  }
  return products;
}

export async function getProductBySlugOrId(identifier: string | number): Promise<Product | undefined> {
  const [row] = await db.select().from(schema.products).where(
    or(eq(schema.products.slug, String(identifier)), eq(schema.products.id, Number(identifier)))
  );
  if (!row) return undefined;
  const images = await db.select({ image: schema.productImages.image })
    .from(schema.productImages)
    .where(eq(schema.productImages.product_id, row.id))
    .orderBy(schema.productImages.sort_order);
  return toProduct(row, images.map(i => i.image));
}

export async function createProduct(input: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  const now = new Date().toISOString();
  const [catRow] = await db.select({ name: schema.categories.name })
    .from(schema.categories)
    .where(eq(schema.categories.id, input.category_id));
  const catName = catRow ? catRow.name : 'Umum';

  const [row] = await db.insert(schema.products).values({
    category_id: input.category_id,
    category_name: catName,
    name: input.name,
    slug: input.slug,
    description: input.description || '',
    price: input.price,
    discount_price: input.discount_price || 0,
    stock: input.stock,
    status: input.status || 'active',
    featured: input.featured ? 1 : 0,
    best_seller: input.best_seller ? 1 : 0,
    rating: input.rating || 0,
    created_at: now,
    updated_at: now,
  }).returning();

  if (input.images && input.images.length > 0) {
    for (let i = 0; i < input.images.length; i++) {
      await db.insert(schema.productImages).values({
        product_id: row.id,
        image: input.images[i],
        sort_order: i,
      });
    }
  }

  const created = await getProductBySlugOrId(row.id);
  return created!;
}

export async function updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined> {
  const [existing] = await db.select().from(schema.products).where(eq(schema.products.id, id));
  if (!existing) return undefined;

  let catName = existing.category_name;
  if (updates.category_id) {
    const [catRow] = await db.select({ name: schema.categories.name })
      .from(schema.categories)
      .where(eq(schema.categories.id, updates.category_id));
    if (catRow) catName = catRow.name;
  }

  const now = new Date().toISOString();
  await db.update(schema.products).set({
    category_id: updates.category_id ?? existing.category_id,
    category_name: catName,
    name: updates.name ?? existing.name,
    slug: updates.slug ?? existing.slug,
    description: updates.description ?? existing.description,
    price: updates.price ?? existing.price,
    discount_price: updates.discount_price ?? existing.discount_price,
    stock: updates.stock ?? existing.stock,
    status: updates.status ?? existing.status,
    featured: updates.featured !== undefined ? (updates.featured ? 1 : 0) : existing.featured,
    best_seller: updates.best_seller !== undefined ? (updates.best_seller ? 1 : 0) : existing.best_seller,
    rating: updates.rating ?? existing.rating,
    updated_at: now,
  }).where(eq(schema.products.id, id));

  if (updates.images) {
    await db.delete(schema.productImages).where(eq(schema.productImages.product_id, id));
    for (let i = 0; i < updates.images.length; i++) {
      await db.insert(schema.productImages).values({
        product_id: id,
        image: updates.images[i],
        sort_order: i,
      });
    }
  }

  return getProductBySlugOrId(id);
}

export async function deleteProduct(id: number): Promise<boolean> {
  const result = await db.delete(schema.products).where(eq(schema.products.id, id)).execute();
  return (result.rowCount ?? 0) > 0;
}

// --- ORDERS & CHECKOUT METHODS ---
export async function createOrder(orderInput: {
  customer_name: string;
  whatsapp: string;
  email?: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  notes?: string;
  items: { product_id: number; quantity: number }[];
  payment_method: string;
  payment_proof?: string;
}): Promise<{ order: Order; payment: Payment; error?: string }> {
  // Stock validation
  for (const item of orderInput.items) {
    const [product] = await db.select().from(schema.products).where(eq(schema.products.id, item.product_id));
    if (!product) {
      return { order: null as unknown as Order, payment: null as unknown as Payment, error: `Produk ID #${item.product_id} tidak ditemukan.` };
    }
    if (product.status !== 'active') {
      return { order: null as unknown as Order, payment: null as unknown as Payment, error: `Produk "${product.name}" sedang tidak aktif.` };
    }
    if (product.stock < item.quantity) {
      return {
        order: null as unknown as Order,
        payment: null as unknown as Payment,
        error: `Stok produk "${product.name}" tidak mencukupi (sisa: ${product.stock}, diminta: ${item.quantity}).`,
      };
    }
  }

  // Calculate subtotal
  let subtotal = 0;
  const orderItemsData: Array<{ product_id: number; product_name: string; product_image: string; price: number; quantity: number; subtotal: number }> = [];

  for (const item of orderInput.items) {
    const [product] = await db.select().from(schema.products).where(eq(schema.products.id, item.product_id));
    const unitPrice = product.discount_price && product.discount_price > 0 ? product.discount_price : product.price;
    const itemSubtotal = unitPrice * item.quantity;
    subtotal += itemSubtotal;

    const [imgRow] = await db.select({ image: schema.productImages.image })
      .from(schema.productImages)
      .where(eq(schema.productImages.product_id, product.id))
      .orderBy(schema.productImages.sort_order)
      .limit(1);
    orderItemsData.push({
      product_id: product.id,
      product_name: product.name,
      product_image: imgRow?.image || '',
      price: unitPrice,
      quantity: item.quantity,
      subtotal: itemSubtotal,
    });
  }

  const settings = await getSettings();
  const shipping_cost = settings.default_shipping_cost || 15000;
  const total = subtotal + shipping_cost;

  // Generate unique order number
  const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const [countRow] = await db.select({ count: count() })
    .from(schema.orders)
    .where(sql`${schema.orders.created_at} >= ${new Date().toISOString().slice(0, 10)}`);
  const orderNumber = `ORD-${todayStr}-${String((countRow?.count ?? 0) + 1).padStart(4, '0')}`;

  const hasProof = Boolean(orderInput.payment_proof && orderInput.payment_proof.trim().length > 0);
  const initialOrderStatus: OrderStatus = hasProof ? 'WAITING_APPROVAL' : 'PENDING_PAYMENT';
  const initialPaymentStatus: PaymentStatus = hasProof ? 'WAITING_APPROVAL' : 'PENDING';
  const now = new Date().toISOString();

  const [orderRow] = await db.insert(schema.orders).values({
    order_number: orderNumber,
    customer_name: orderInput.customer_name.trim(),
    whatsapp: orderInput.whatsapp.trim(),
    email: orderInput.email?.trim() || null,
    address: orderInput.address.trim(),
    city: orderInput.city.trim(),
    province: orderInput.province.trim(),
    postal_code: orderInput.postal_code.trim(),
    notes: orderInput.notes?.trim() || '',
    subtotal,
    shipping_cost,
    total,
    payment_status: initialPaymentStatus,
    order_status: initialOrderStatus,
    created_at: now,
    updated_at: now,
  }).returning();

  const orderId = orderRow.id;

  const createdItems: OrderItem[] = [];
  for (const oi of orderItemsData) {
    const [itemRow] = await db.insert(schema.orderItems).values({
      order_id: orderId,
      product_id: oi.product_id,
      product_name: oi.product_name,
      product_image: oi.product_image,
      price: oi.price,
      quantity: oi.quantity,
      subtotal: oi.subtotal,
    }).returning();
    createdItems.push({ id: itemRow.id, order_id: orderId, ...oi });
  }

  const [paymentRow] = await db.insert(schema.payments).values({
    order_id: orderId,
    method: orderInput.payment_method || 'Bank BCA Transfer',
    amount: total,
    proof_image: orderInput.payment_proof || null,
    paid_at: hasProof ? now : null,
    status: initialPaymentStatus,
  }).returning();

  const newPayment: Payment = {
    id: paymentRow.id,
    order_id: orderId,
    method: orderInput.payment_method || 'Bank BCA Transfer',
    amount: total,
    proof_image: orderInput.payment_proof || undefined,
    paid_at: hasProof ? now : undefined,
    status: initialPaymentStatus,
  };

  const newOrder: Order = {
    id: orderId,
    order_number: orderNumber,
    customer_name: orderInput.customer_name.trim(),
    whatsapp: orderInput.whatsapp.trim(),
    email: orderInput.email?.trim() || undefined,
    address: orderInput.address.trim(),
    city: orderInput.city.trim(),
    province: orderInput.province.trim(),
    postal_code: orderInput.postal_code.trim(),
    notes: orderInput.notes?.trim() || '',
    subtotal,
    shipping_cost,
    total,
    payment_status: initialPaymentStatus,
    order_status: initialOrderStatus,
    created_at: now,
    updated_at: now,
    items: createdItems,
    payment: newPayment,
  };

  return { order: newOrder, payment: newPayment };
}

export async function uploadPaymentProof(orderNumber: string, proofImage: string): Promise<Order | undefined> {
  const [order] = await db.select().from(schema.orders).where(eq(schema.orders.order_number, orderNumber));
  if (!order) return undefined;

  const now = new Date().toISOString();
  await db.update(schema.payments).set({
    proof_image: proofImage,
    paid_at: now,
    status: 'WAITING_APPROVAL',
  }).where(eq(schema.payments.order_id, order.id));

  await db.update(schema.orders).set({
    payment_status: 'WAITING_APPROVAL',
    order_status: 'WAITING_APPROVAL',
    updated_at: now,
  }).where(eq(schema.orders.id, order.id));

  return getOrderById(order.id);
}

export async function trackOrder(orderNumber: string, whatsapp: string): Promise<Order | undefined> {
  const cleanNum = orderNumber.trim().toUpperCase();
  const cleanWa = whatsapp.trim().replace(/[^0-9]/g, '');

  const [order] = await db.select().from(schema.orders).where(sql`UPPER(${schema.orders.order_number}) = ${cleanNum}`);
  if (!order) return undefined;

  const orderWa = order.whatsapp.replace(/[^0-9]/g, '');
  const matchWa = orderWa === cleanWa || orderWa.endsWith(cleanWa) || cleanWa.endsWith(orderWa);
  if (!matchWa) return undefined;

  return getOrderById(order.id);
}

export async function getOrderById(orderId: number): Promise<Order | undefined> {
  const [order] = await db.select().from(schema.orders).where(eq(schema.orders.id, orderId));
  if (!order) return undefined;

  const items = await db.select().from(schema.orderItems).where(eq(schema.orderItems.order_id, orderId));
  const [payment] = await db.select().from(schema.payments).where(eq(schema.payments.order_id, orderId));

  return { ...order, items, payment } as unknown as Order;
}

export async function getOrders(statusFilter?: string, search?: string): Promise<Order[]> {
  const conditions = [];

  if (statusFilter && statusFilter !== 'ALL') {
    if (statusFilter === 'WAITING_APPROVAL') {
      conditions.push(or(
        eq(schema.orders.order_status, 'WAITING_APPROVAL'),
        eq(schema.orders.payment_status, 'WAITING_APPROVAL'),
      )!);
    } else {
      conditions.push(eq(schema.orders.order_status, statusFilter));
    }
  }

  if (search) {
    const q = `%${search.toLowerCase()}%`;
    conditions.push(or(
      ilike(schema.orders.order_number, q),
      ilike(schema.orders.customer_name, q),
      sql`${schema.orders.whatsapp} LIKE ${q}`,
    )!);
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const orders = await db.select().from(schema.orders).where(where).orderBy(desc(schema.orders.created_at));

  const result: Order[] = [];
  for (const order of orders) {
    const items = await db.select().from(schema.orderItems).where(eq(schema.orderItems.order_id, order.id));
    const [payment] = await db.select().from(schema.payments).where(eq(schema.payments.order_id, order.id));
    result.push({ ...order, items, payment } as unknown as Order);
  }
  return result;
}

export async function approvePayment(orderId: number): Promise<{ success: boolean; order?: Order; error?: string }> {
  const [order] = await db.select().from(schema.orders).where(eq(schema.orders.id, orderId));
  if (!order) return { success: false, error: 'Pesanan tidak ditemukan' };

  const [payment] = await db.select().from(schema.payments).where(eq(schema.payments.order_id, orderId));
  if (!payment) return { success: false, error: 'Data pembayaran tidak ditemukan' };

  const items = await db.select().from(schema.orderItems).where(eq(schema.orderItems.order_id, orderId));
  const now = new Date().toISOString();

  for (const item of items) {
    await db.update(schema.products).set({
      stock: sql`GREATEST(0, ${schema.products.stock} - ${item.quantity})`,
      updated_at: now,
    }).where(eq(schema.products.id, item.product_id));
  }

  await db.update(schema.payments).set({
    status: 'PAID',
    approved_at: now,
    rejected_at: null,
    rejection_reason: null,
  }).where(eq(schema.payments.order_id, orderId));

  await db.update(schema.orders).set({
    payment_status: 'PAID',
    order_status: 'PROCESSING',
    rejection_reason: null,
    updated_at: now,
  }).where(eq(schema.orders.id, orderId));

  return { success: true, order: await getOrderById(orderId) };
}

export async function rejectPayment(orderId: number, reason: string): Promise<{ success: boolean; order?: Order; error?: string }> {
  const [order] = await db.select().from(schema.orders).where(eq(schema.orders.id, orderId));
  if (!order) return { success: false, error: 'Pesanan tidak ditemukan' };

  const [payment] = await db.select().from(schema.payments).where(eq(schema.payments.order_id, orderId));
  if (!payment) return { success: false, error: 'Data pembayaran tidak ditemukan' };

  const now = new Date().toISOString();
  await db.update(schema.payments).set({
    status: 'REJECTED',
    rejected_at: now,
    rejection_reason: reason.trim(),
  }).where(eq(schema.payments.order_id, orderId));

  await db.update(schema.orders).set({
    payment_status: 'REJECTED',
    order_status: 'REJECTED',
    rejection_reason: reason.trim(),
    updated_at: now,
  }).where(eq(schema.orders.id, orderId));

  return { success: true, order: await getOrderById(orderId) };
}

export async function updateOrderStatus(
  orderId: number,
  newStatus: OrderStatus,
  extra?: { tracking_number?: string; courier?: string },
): Promise<Order | undefined> {
  const [order] = await db.select().from(schema.orders).where(eq(schema.orders.id, orderId));
  if (!order) return undefined;

  const previousStatus = order.order_status;
  const now = new Date().toISOString();

  await db.update(schema.orders).set({
    order_status: newStatus,
    tracking_number: extra?.tracking_number || order.tracking_number,
    courier: extra?.courier || order.courier,
    updated_at: now,
  }).where(eq(schema.orders.id, orderId));

  if (newStatus === 'CANCELLED' && ['PAID', 'PROCESSING', 'SHIPPED'].includes(previousStatus)) {
    const items = await db.select().from(schema.orderItems).where(eq(schema.orderItems.order_id, orderId));
    for (const item of items) {
      await db.update(schema.products).set({
        stock: sql`${schema.products.stock} + ${item.quantity}`,
      }).where(eq(schema.products.id, item.product_id));
    }
  }

  return getOrderById(orderId);
}

// --- DASHBOARD STATS ---
export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalOrdersRow] = await db.select({ count: count() }).from(schema.orders);
  const totalOrders = totalOrdersRow?.count ?? 0;

  const [pendingPaymentRow] = await db.select({ count: count() }).from(schema.orders)
    .where(eq(schema.orders.order_status, 'PENDING_PAYMENT'));
  const pendingPayment = pendingPaymentRow?.count ?? 0;

  const [waitingApprovalRow] = await db.select({ count: count() }).from(schema.orders)
    .where(or(eq(schema.orders.order_status, 'WAITING_APPROVAL'), eq(schema.orders.payment_status, 'WAITING_APPROVAL'))!);
  const waitingApproval = waitingApprovalRow?.count ?? 0;

  const [processingOrdersRow] = await db.select({ count: count() }).from(schema.orders)
    .where(eq(schema.orders.order_status, 'PROCESSING'));
  const processingOrders = processingOrdersRow?.count ?? 0;

  const [completedOrdersRow] = await db.select({ count: count() }).from(schema.orders)
    .where(eq(schema.orders.order_status, 'COMPLETED'));
  const completedOrders = completedOrdersRow?.count ?? 0;

  const [totalProductsRow] = await db.select({ count: count() }).from(schema.products);
  const totalProducts = totalProductsRow?.count ?? 0;

  const [uniqueCustomersRow] = await db.select({ count: sql<number>`COUNT(DISTINCT ${schema.orders.whatsapp})` }).from(schema.orders);
  const uniqueCustomers = uniqueCustomersRow?.count ?? 0;

  const [totalRevenueRow] = await db.select({ total: sql<number>`COALESCE(SUM(${schema.orders.total}), 0)` })
    .from(schema.orders)
    .where(and(
      eq(schema.orders.payment_status, 'PAID'),
      sql`${schema.orders.order_status} != 'CANCELLED'`,
      sql`${schema.orders.order_status} != 'REJECTED'`,
    )!);
  const totalRevenue = totalRevenueRow?.total ?? 0;

  // Sales chart data (last 7 days)
  const salesChartMap: Record<string, { sales: number; orders: number }> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().slice(0, 10);
    salesChartMap[dateKey] = { sales: 0, orders: 0 };
  }

  const recentPaidOrders = await db.select({
    created_at: schema.orders.created_at,
    total: schema.orders.total,
    payment_status: schema.orders.payment_status,
    order_status: schema.orders.order_status,
  }).from(schema.orders)
    .where(sql`${schema.orders.created_at} >= (now() - interval '7 days')`);

  for (const o of recentPaidOrders) {
    const dateKey = (o.created_at ?? '').slice(0, 10);
    if (salesChartMap[dateKey]) {
      salesChartMap[dateKey].orders += 1;
      if (o.payment_status === 'PAID' || o.order_status === 'COMPLETED') {
        salesChartMap[dateKey].sales += o.total;
      }
    }
  }

  const salesChart = Object.entries(salesChartMap).map(([k, v]) => {
    const [year, month, day] = k.split('-');
    return { date: `${day}/${month}`, sales: v.sales, orders: v.orders };
  });

  const categoryDistribution = await db.select({
    name: schema.categories.name,
    count: sql<number>`(SELECT COUNT(*) FROM ${schema.products} p WHERE p.category_id = ${schema.categories.id})`,
  }).from(schema.categories).orderBy(schema.categories.id);

  const recentOrders = (await getOrders()).slice(0, 5);

  return {
    total_orders: totalOrders,
    pending_payment: pendingPayment,
    waiting_approval: waitingApproval,
    processing_orders: processingOrders,
    completed_orders: completedOrders,
    total_products: totalProducts,
    total_customers: uniqueCustomers,
    total_revenue: totalRevenue,
    recent_orders: recentOrders,
    sales_chart: salesChart,
    category_distribution: categoryDistribution,
  };
}
