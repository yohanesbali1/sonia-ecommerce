import {
  createOrder,
  getOrderById,
  getOrders,
  approvePayment,
  rejectPayment,
  updateOrderStatus,
  getDashboardStats,
  uploadPaymentProof,
  trackOrder,
} from '@/lib/db';
import { Order, Payment, OrderStatus, DashboardStats } from '@/types';

export const orderRepository = {
  async createOrder(orderInput: {
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
    return createOrder(orderInput);
  },

  async getOrderById(orderId: number): Promise<Order | undefined> {
    return getOrderById(orderId);
  },

  async getOrders(statusFilter?: string, search?: string): Promise<Order[]> {
    return getOrders(statusFilter, search);
  },

  async approvePayment(orderId: number): Promise<{ success: boolean; order?: Order; error?: string }> {
    return approvePayment(orderId);
  },

  async rejectPayment(orderId: number, reason: string): Promise<{ success: boolean; order?: Order; error?: string }> {
    return rejectPayment(orderId, reason);
  },

  async updateOrderStatus(orderId: number, newStatus: OrderStatus, extra?: { tracking_number?: string; courier?: string }): Promise<Order | undefined> {
    return updateOrderStatus(orderId, newStatus, extra);
  },

  async getDashboardStats(): Promise<DashboardStats> {
    return getDashboardStats();
  },

  async uploadPaymentProof(orderNumber: string, proofImage: string): Promise<Order | undefined> {
    return uploadPaymentProof(orderNumber, proofImage);
  },

  async trackOrder(orderNumber: string, whatsapp: string): Promise<Order | undefined> {
    return trackOrder(orderNumber, whatsapp);
  },
};
