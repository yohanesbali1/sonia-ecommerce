import { eq, and, or, sql, count, desc, ilike } from 'drizzle-orm';
import { db, schema } from './connection';
import { getSettings } from './settings';
import { Order, OrderItem, Payment, OrderStatus, PaymentStatus } from '@/types';

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
  for (const item of orderInput.items) {
    const [product] = await db.select().from(schema.products).where(eq(schema.products.id, item.product_id));
    if (!product) {
      return { order: null as unknown as Order, payment: null as unknown as Payment, error: `Produk ID #${item.product_id} tidak ditemukan.` };
    }
    if (product.status) {
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

  // const settings = await getSettings();
  const shipping_cost =  15000;
  const total = subtotal + shipping_cost;

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
