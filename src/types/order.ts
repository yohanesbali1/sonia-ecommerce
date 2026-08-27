import { Product } from './product';

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'WAITING_APPROVAL'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED';

export type PaymentStatus =
  | 'PENDING'
  | 'WAITING_APPROVAL'
  | 'PAID'
  | 'REJECTED';

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  product_image?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Payment {
  id: number;
  order_id: number;
  method: string;
  amount: number;
  proof_image?: string;
  paid_at?: string;
  status: PaymentStatus;
  approved_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  whatsapp: string;
  email?: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  notes?: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  rejection_reason?: string;
  tracking_number?: string;
  courier?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  payment?: Payment;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DashboardStats {
  stats?: {
    total_orders: number;
    waiting_approval_count: number;
    paid_count: number;
    completed_count: number;
    total_revenue: number;
    total_products: number;
  };
  total_orders?: number;
  pending_payment?: number;
  waiting_approval?: number;
  processing_orders?: number;
  completed_orders?: number;
  total_products?: number;
  total_customers?: number;
  total_revenue?: number;
  recent_orders?: Order[];
  sales_chart?: { date: string; sales: number; orders: number }[];
  category_distribution?: { name: string; count: number }[];
}
