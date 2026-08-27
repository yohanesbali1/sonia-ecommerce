import { db } from '@/lib/db';
import { Order, Payment, OrderStatus, DashboardStats } from '@/types';

export const orderRepository = {
  createOrder(orderInput: {
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
    return db.createOrder(orderInput);
  },

  getOrderById(orderId: number): Order | undefined {
    return db.getOrderById(orderId);
  },

  getOrders(statusFilter?: string, search?: string): Order[] {
    return db.getOrders(statusFilter, search);
  },

  approvePayment(orderId: number): { success: boolean; order?: Order; error?: string } {
    return db.approvePayment(orderId);
  },

  rejectPayment(orderId: number, reason: string): { success: boolean; order?: Order; error?: string } {
    return db.rejectPayment(orderId, reason);
  },

  updateOrderStatus(orderId: number, newStatus: OrderStatus, extra?: { tracking_number?: string; courier?: string }): Order | undefined {
    return db.updateOrderStatus(orderId, newStatus, extra);
  },

  getDashboardStats(): DashboardStats {
    return db.getDashboardStats();
  },

  uploadPaymentProof(orderNumber: string, proofImage: string): Order | undefined {
    return db.uploadPaymentProof(orderNumber, proofImage);
  },

  trackOrder(orderNumber: string, whatsapp: string): Order | undefined {
    return db.trackOrder(orderNumber, whatsapp);
  },
};
