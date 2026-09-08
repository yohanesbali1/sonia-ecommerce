import { eq, and, or, sql, count, desc } from 'drizzle-orm';
import { db, schema } from './connection';
import { getOrders } from './order';
import { DashboardStats } from '@/types';

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
