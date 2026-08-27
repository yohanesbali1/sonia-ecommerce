import Database from 'better-sqlite3';
import path from 'path';
import { CREATE_TABLES_SQL, initialSettings } from './schema';
import { seedIfEmpty } from './seed';
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
  DashboardStats
} from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'store.sqlite');

export class StoreDatabase {
  private db: Database.Database;

  constructor() {
    const fs = require('fs');
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    this.db = new Database(DB_PATH);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    this.db.exec(CREATE_TABLES_SQL);
    seedIfEmpty(this.db);
  }

  // --- ADMIN METHODS ---
  public getAdminByEmail(email: string): Admin | undefined {
    const row = this.db.prepare('SELECT * FROM admins WHERE LOWER(email) = LOWER(?)').get(email) as Admin | undefined;
    return row;
  }

  public getAdminById(id: number): Admin | undefined {
    const row = this.db.prepare('SELECT id, name, email, created_at, updated_at FROM admins WHERE id = ?').get(id) as Admin | undefined;
    return row;
  }

  // --- SETTINGS METHODS ---
  public getSettings(): StoreSettings {
    const row = this.db.prepare('SELECT * FROM settings WHERE id = 1').get() as Record<string, unknown>;
    if (!row) return initialSettings;
    return {
      store_name: row.store_name as string,
      store_tagline: row.store_tagline as string,
      logo_url: row.logo_url as string,
      whatsapp: row.whatsapp as string,
      email: row.email as string,
      address: row.address as string,
      bank_name: row.bank_name as string,
      bank_account_number: row.bank_account_number as string,
      bank_account_holder: row.bank_account_holder as string,
      secondary_bank_name: row.secondary_bank_name as string,
      secondary_account_number: row.secondary_account_number as string,
      secondary_account_holder: row.secondary_account_holder as string,
      default_shipping_cost: row.default_shipping_cost as number,
    };
  }

  public updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    const current = this.getSettings();
    const merged = { ...current, ...updates };
    this.db.prepare(
      `UPDATE settings SET store_name=?, store_tagline=?, logo_url=?, whatsapp=?, email=?, address=?, bank_name=?, bank_account_number=?, bank_account_holder=?, secondary_bank_name=?, secondary_account_number=?, secondary_account_holder=?, default_shipping_cost=? WHERE id=1`
    ).run(
      merged.store_name, merged.store_tagline || '', merged.logo_url || '',
      merged.whatsapp, merged.email, merged.address,
      merged.bank_name, merged.bank_account_number, merged.bank_account_holder,
      merged.secondary_bank_name || '', merged.secondary_account_number || '',
      merged.secondary_account_holder || '', merged.default_shipping_cost
    );
    return this.getSettings();
  }

  // --- CATEGORIES METHODS ---
  public getCategories(onlyActive = true): Category[] {
    if (onlyActive) {
      return this.db.prepare("SELECT * FROM categories WHERE status = 'active' ORDER BY id").all() as Category[];
    }
    return this.db.prepare('SELECT * FROM categories ORDER BY id').all() as Category[];
  }

  public getCategoryById(id: number): Category | undefined {
    return this.db.prepare('SELECT * FROM categories WHERE id = ?').get(id) as Category | undefined;
  }

  public createCategory(input: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Category {
    const now = new Date().toISOString();
    const result = this.db.prepare(
      'INSERT INTO categories (name, slug, image, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(input.name, input.slug, input.image || '', input.status || 'active', now, now);
    return this.db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid) as Category;
  }

  public updateCategory(id: number, updates: Partial<Category>): Category | undefined {
    const existing = this.getCategoryById(id);
    if (!existing) return undefined;
    const merged = { ...existing, ...updates, updated_at: new Date().toISOString() };
    this.db.prepare(
      'UPDATE categories SET name=?, slug=?, image=?, status=?, updated_at=? WHERE id=?'
    ).run(merged.name, merged.slug, merged.image || '', merged.status || 'active', merged.updated_at, id);
    if (updates.name) {
      this.db.prepare('UPDATE products SET category_name=? WHERE category_id=?').run(updates.name, id);
    }
    return this.getCategoryById(id);
  }

  public deleteCategory(id: number): boolean {
    const result = this.db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    return result.changes > 0;
  }

  // --- PRODUCTS METHODS ---
  public getProducts(params?: {
    search?: string;
    category_id?: number;
    category_slug?: string;
    featured?: boolean;
    best_seller?: boolean;
    sort?: string;
    onlyActive?: boolean;
  }): Product[] {
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (params?.onlyActive !== false) {
      conditions.push("p.status = 'active'");
    }

    if (params?.search) {
      conditions.push('(LOWER(p.name) LIKE ? OR LOWER(p.description) LIKE ? OR LOWER(p.category_name) LIKE ?)');
      const q = `%${params.search.toLowerCase().trim()}%`;
      values.push(q, q, q);
    }

    if (params?.category_id) {
      conditions.push('p.category_id = ?');
      values.push(Number(params.category_id));
    }

    if (params?.category_slug) {
      conditions.push('p.category_id = (SELECT id FROM categories WHERE slug = ?)');
      values.push(params.category_slug);
    }

    if (params?.featured !== undefined) {
      conditions.push('p.featured = ?');
      values.push(params.featured ? 1 : 0);
    }

    if (params?.best_seller !== undefined) {
      conditions.push('p.best_seller = ?');
      values.push(params.best_seller ? 1 : 0);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    let orderBy = 'ORDER BY p.created_at DESC';
    if (params?.sort) {
      switch (params.sort) {
        case 'price_asc': orderBy = 'ORDER BY COALESCE(NULLIF(p.discount_price, 0), p.price) ASC'; break;
        case 'price_desc': orderBy = 'ORDER BY COALESCE(NULLIF(p.discount_price, 0), p.price) DESC'; break;
        case 'popular': orderBy = 'ORDER BY COALESCE(p.rating, 0) DESC'; break;
        case 'newest': orderBy = 'ORDER BY p.created_at DESC'; break;
      }
    }

    const rows = this.db.prepare(`SELECT p.* FROM products p ${where} ${orderBy}`).all(...values) as Product[];

    return rows.map(row => {
      const images = this.db.prepare('SELECT image FROM product_images WHERE product_id = ? ORDER BY sort_order')
        .all(row.id) as { image: string }[];
      return { ...row, images: images.map(i => i.image) };
    });
  }

  public getProductBySlugOrId(identifier: string | number): Product | undefined {
    const row = this.db.prepare(
      'SELECT * FROM products WHERE slug = ? OR id = ?'
    ).get(String(identifier), Number(identifier)) as Product | undefined;
    if (!row) return undefined;
    const images = this.db.prepare('SELECT image FROM product_images WHERE product_id = ? ORDER BY sort_order')
      .all(row.id) as { image: string }[];
    return { ...row, images: images.map(i => i.image) };
  }

  public createProduct(input: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Product {
    const now = new Date().toISOString();
    const catRow = this.db.prepare('SELECT name FROM categories WHERE id = ?').get(input.category_id) as { name: string } | undefined;
    const catName = catRow ? catRow.name : 'Umum';

    const result = this.db.prepare(
      `INSERT INTO products (category_id, category_name, name, slug, description, price, discount_price, stock, status, featured, best_seller, rating, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      input.category_id, catName, input.name, input.slug,
      input.description || '', input.price, input.discount_price || 0,
      input.stock, input.status || 'active', input.featured ? 1 : 0,
      input.best_seller ? 1 : 0, input.rating || 0, now, now
    );

    const productId = Number(result.lastInsertRowid);
    const insertImage = this.db.prepare('INSERT INTO product_images (product_id, image, sort_order) VALUES (?, ?, ?)');
    if (input.images && input.images.length > 0) {
      input.images.forEach((img, i) => insertImage.run(productId, img, i));
    }

    return this.getProductBySlugOrId(productId)!;
  }

  public updateProduct(id: number, updates: Partial<Product>): Product | undefined {
    const existing = this.db.prepare('SELECT * FROM products WHERE id = ?').get(id) as Product | undefined;
    if (!existing) return undefined;

    let catName = existing.category_name;
    if (updates.category_id) {
      const catRow = this.db.prepare('SELECT name FROM categories WHERE id = ?').get(updates.category_id) as { name: string } | undefined;
      if (catRow) catName = catRow.name;
    }

    const now = new Date().toISOString();
    this.db.prepare(
      `UPDATE products SET category_id=?, category_name=?, name=?, slug=?, description=?, price=?, discount_price=?, stock=?, status=?, featured=?, best_seller=?, rating=?, updated_at=? WHERE id=?`
    ).run(
      updates.category_id ?? existing.category_id,
      catName,
      updates.name ?? existing.name,
      updates.slug ?? existing.slug,
      updates.description ?? existing.description,
      updates.price ?? existing.price,
      updates.discount_price ?? existing.discount_price,
      updates.stock ?? existing.stock,
      updates.status ?? existing.status,
      updates.featured !== undefined ? (updates.featured ? 1 : 0) : existing.featured,
      updates.best_seller !== undefined ? (updates.best_seller ? 1 : 0) : existing.best_seller,
      updates.rating ?? existing.rating,
      now, id
    );

    if (updates.images) {
      this.db.prepare('DELETE FROM product_images WHERE product_id = ?').run(id);
      const insertImage = this.db.prepare('INSERT INTO product_images (product_id, image, sort_order) VALUES (?, ?, ?)');
      updates.images.forEach((img, i) => insertImage.run(id, img, i));
    }

    return this.getProductBySlugOrId(id);
  }

  public deleteProduct(id: number): boolean {
    const result = this.db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return result.changes > 0;
  }

  // --- ORDERS & CHECKOUT METHODS ---
  public createOrder(orderInput: {
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
  }): { order: Order; payment: Payment; error?: string } {
    // Stock validation
    for (const item of orderInput.items) {
      const product = this.db.prepare('SELECT * FROM products WHERE id = ?').get(item.product_id) as Product | undefined;
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
          error: `Stok produk "${product.name}" tidak mencukupi (sisa: ${product.stock}, diminta: ${item.quantity}).`
        };
      }
    }

    // Calculate subtotal
    let subtotal = 0;
    const orderItemsData: Array<{ product_id: number; product_name: string; product_image: string; price: number; quantity: number; subtotal: number }> = [];

    for (const item of orderInput.items) {
      const product = this.db.prepare('SELECT * FROM products WHERE id = ?').get(item.product_id) as Product;
      const unitPrice = product.discount_price && product.discount_price > 0 ? product.discount_price : product.price;
      const itemSubtotal = unitPrice * item.quantity;
      subtotal += itemSubtotal;

      const images = this.db.prepare('SELECT image FROM product_images WHERE product_id = ? ORDER BY sort_order LIMIT 1').all(product.id) as { image: string }[];
      orderItemsData.push({
        product_id: product.id,
        product_name: product.name,
        product_image: images[0]?.image || '',
        price: unitPrice,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });
    }

    const settings = this.getSettings();
    const shipping_cost = settings.default_shipping_cost || 15000;
    const total = subtotal + shipping_cost;

    // Generate unique order number
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const todayCount = this.db.prepare(
      "SELECT COUNT(*) as count FROM orders WHERE created_at >= ?"
    ).get(new Date().toISOString().slice(0, 10)) as { count: number };
    const orderNumber = `ORD-${todayStr}-${String(todayCount.count + 1).padStart(4, '0')}`;

    const hasProof = Boolean(orderInput.payment_proof && orderInput.payment_proof.trim().length > 0);
    const initialOrderStatus: OrderStatus = hasProof ? 'WAITING_APPROVAL' : 'PENDING_PAYMENT';
    const initialPaymentStatus: PaymentStatus = hasProof ? 'WAITING_APPROVAL' : 'PENDING';
    const now = new Date().toISOString();

    const insertOrder = this.db.prepare(
      `INSERT INTO orders (order_number, customer_name, whatsapp, email, address, city, province, postal_code, notes, subtotal, shipping_cost, total, payment_status, order_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const orderResult = insertOrder.run(
      orderNumber, orderInput.customer_name.trim(), orderInput.whatsapp.trim(),
      orderInput.email?.trim() || null, orderInput.address.trim(), orderInput.city.trim(),
      orderInput.province.trim(), orderInput.postal_code.trim(), orderInput.notes?.trim() || '',
      subtotal, shipping_cost, total, initialPaymentStatus, initialOrderStatus, now, now
    );
    const orderId = Number(orderResult.lastInsertRowid);

    const insertItem = this.db.prepare(
      `INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity, subtotal) VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    const createdItems: OrderItem[] = [];
    for (const oi of orderItemsData) {
      const itemResult = insertItem.run(orderId, oi.product_id, oi.product_name, oi.product_image, oi.price, oi.quantity, oi.subtotal);
      createdItems.push({ id: Number(itemResult.lastInsertRowid), order_id: orderId, ...oi });
    }

    const insertPayment = this.db.prepare(
      `INSERT INTO payments (order_id, method, amount, proof_image, paid_at, status) VALUES (?, ?, ?, ?, ?, ?)`
    );
    const paymentResult = insertPayment.run(
      orderId, orderInput.payment_method || 'Bank BCA Transfer', total,
      orderInput.payment_proof || null, hasProof ? now : null, initialPaymentStatus
    );
    const newPayment: Payment = {
      id: Number(paymentResult.lastInsertRowid),
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

  public uploadPaymentProof(orderNumber: string, proofImage: string): Order | undefined {
    const order = this.db.prepare('SELECT * FROM orders WHERE order_number = ?').get(orderNumber) as Order | undefined;
    if (!order) return undefined;

    const now = new Date().toISOString();
    this.db.prepare(
      "UPDATE payments SET proof_image=?, paid_at=?, status='WAITING_APPROVAL' WHERE order_id=?"
    ).run(proofImage, now, order.id);
    this.db.prepare(
      "UPDATE orders SET payment_status='WAITING_APPROVAL', order_status='WAITING_APPROVAL', updated_at=? WHERE id=?"
    ).run(now, order.id);

    return this.getOrderById(order.id);
  }

  public trackOrder(orderNumber: string, whatsapp: string): Order | undefined {
    const cleanNum = orderNumber.trim().toUpperCase();
    const cleanWa = whatsapp.trim().replace(/[^0-9]/g, '');

    const order = this.db.prepare('SELECT * FROM orders WHERE UPPER(order_number) = ?').get(cleanNum) as Order | undefined;
    if (!order) return undefined;

    const orderWa = order.whatsapp.replace(/[^0-9]/g, '');
    const matchWa = orderWa === cleanWa || orderWa.endsWith(cleanWa) || cleanWa.endsWith(orderWa);
    if (!matchWa) return undefined;

    return this.getOrderById(order.id);
  }

  public getOrderById(orderId: number): Order | undefined {
    const order = this.db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as Order | undefined;
    if (!order) return undefined;

    const items = this.db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId) as OrderItem[];
    const payment = this.db.prepare('SELECT * FROM payments WHERE order_id = ?').get(orderId) as Payment | undefined;

    return { ...order, items, payment };
  }

  public getOrders(statusFilter?: string, search?: string): Order[] {
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (statusFilter && statusFilter !== 'ALL') {
      if (statusFilter === 'WAITING_APPROVAL') {
        conditions.push("(order_status = 'WAITING_APPROVAL' OR payment_status = 'WAITING_APPROVAL')");
      } else {
        conditions.push('order_status = ?');
        values.push(statusFilter);
      }
    }

    if (search) {
      conditions.push('(LOWER(order_number) LIKE ? OR LOWER(customer_name) LIKE ? OR whatsapp LIKE ?)');
      const q = `%${search.toLowerCase()}%`;
      values.push(q, q, q);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const orders = this.db.prepare(`SELECT * FROM orders ${where} ORDER BY created_at DESC`).all(...values) as Order[];

    return orders.map(order => {
      const items = this.db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id) as OrderItem[];
      const payment = this.db.prepare('SELECT * FROM payments WHERE order_id = ?').get(order.id) as Payment | undefined;
      return { ...order, items, payment };
    });
  }

  public approvePayment(orderId: number): { success: boolean; order?: Order; error?: string } {
    const order = this.db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as Order | undefined;
    if (!order) return { success: false, error: 'Pesanan tidak ditemukan' };

    const payment = this.db.prepare('SELECT * FROM payments WHERE order_id = ?').get(orderId) as Payment | undefined;
    if (!payment) return { success: false, error: 'Data pembayaran tidak ditemukan' };

    const items = this.db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId) as OrderItem[];
    const now = new Date().toISOString();

    const deductStock = this.db.prepare('UPDATE products SET stock = MAX(0, stock - ?), updated_at = ? WHERE id = ?');
    for (const item of items) {
      deductStock.run(item.quantity, now, item.product_id);
    }

    this.db.prepare("UPDATE payments SET status='PAID', approved_at=?, rejected_at=NULL, rejection_reason=NULL WHERE order_id=?").run(now, orderId);
    this.db.prepare("UPDATE orders SET payment_status='PAID', order_status='PROCESSING', rejection_reason=NULL, updated_at=? WHERE id=?").run(now, orderId);

    return { success: true, order: this.getOrderById(orderId) };
  }

  public rejectPayment(orderId: number, reason: string): { success: boolean; order?: Order; error?: string } {
    const order = this.db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as Order | undefined;
    if (!order) return { success: false, error: 'Pesanan tidak ditemukan' };

    const payment = this.db.prepare('SELECT * FROM payments WHERE order_id = ?').get(orderId) as Payment | undefined;
    if (!payment) return { success: false, error: 'Data pembayaran tidak ditemukan' };

    const now = new Date().toISOString();
    this.db.prepare("UPDATE payments SET status='REJECTED', rejected_at=?, rejection_reason=? WHERE order_id=?").run(now, reason.trim(), orderId);
    this.db.prepare("UPDATE orders SET payment_status='REJECTED', order_status='REJECTED', rejection_reason=?, updated_at=? WHERE id=?").run(reason.trim(), now, orderId);

    return { success: true, order: this.getOrderById(orderId) };
  }

  public updateOrderStatus(orderId: number, newStatus: OrderStatus, extra?: { tracking_number?: string; courier?: string }): Order | undefined {
    const order = this.db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as Order | undefined;
    if (!order) return undefined;

    const previousStatus = order.order_status;
    const now = new Date().toISOString();

    this.db.prepare(
      'UPDATE orders SET order_status=?, tracking_number=COALESCE(?, tracking_number), courier=COALESCE(?, courier), updated_at=? WHERE id=?'
    ).run(newStatus, extra?.tracking_number || null, extra?.courier || null, now, orderId);

    if (newStatus === 'CANCELLED' && ['PAID', 'PROCESSING', 'SHIPPED'].includes(previousStatus)) {
      const items = this.db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId) as OrderItem[];
      const returnStock = this.db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?');
      for (const item of items) {
        returnStock.run(item.quantity, item.product_id);
      }
    }

    return this.getOrderById(orderId);
  }

  // --- DASHBOARD STATS ---
  public getDashboardStats(): DashboardStats {
    const totalOrders = (this.db.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number }).count;
    const pendingPayment = (this.db.prepare("SELECT COUNT(*) as count FROM orders WHERE order_status = 'PENDING_PAYMENT'").get() as { count: number }).count;
    const waitingApproval = (this.db.prepare("SELECT COUNT(*) as count FROM orders WHERE order_status = 'WAITING_APPROVAL' OR payment_status = 'WAITING_APPROVAL'").get() as { count: number }).count;
    const processingOrders = (this.db.prepare("SELECT COUNT(*) as count FROM orders WHERE order_status = 'PROCESSING'").get() as { count: number }).count;
    const completedOrders = (this.db.prepare("SELECT COUNT(*) as count FROM orders WHERE order_status = 'COMPLETED'").get() as { count: number }).count;
    const totalProducts = (this.db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number }).count;

    const uniqueCustomers = (this.db.prepare('SELECT COUNT(DISTINCT whatsapp) as count FROM orders').get() as { count: number }).count;

    const totalRevenue = (this.db.prepare(
      "SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE payment_status = 'PAID' AND order_status != 'CANCELLED' AND order_status != 'REJECTED'"
    ).get() as { total: number }).total;

    // Sales chart data (last 7 days)
    const salesChartMap: Record<string, { sales: number; orders: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().slice(0, 10);
      salesChartMap[dateKey] = { sales: 0, orders: 0 };
    }

    const recentPaidOrders = this.db.prepare(
      "SELECT created_at, total, payment_status, order_status FROM orders WHERE created_at >= date('now', '-7 days')"
    ).all() as { created_at: string; total: number; payment_status: string; order_status: string }[];

    for (const o of recentPaidOrders) {
      const dateKey = o.created_at.slice(0, 10);
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

    const categoryDistribution = this.db.prepare(
      'SELECT c.name, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) as count FROM categories c ORDER BY c.id'
    ).all() as { name: string; count: number }[];

    const recentOrders = this.getOrders().slice(0, 5);

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
}

export const db = new StoreDatabase();
