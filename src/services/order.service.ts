import {
  Order,
  OrderStatus,
} from '@/types';

const API_BASE = '/api';

function getAdminHeaders(): HeadersInit {
  const token = localStorage.getItem('cherie_admin_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function submitCheckout(payload: {
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
}): Promise<{ success: boolean; message: string; order: Order }> {
  const res = await fetch(`${API_BASE}/orders/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Gagal memproses pesanan');
  }
  return data;
}

export async function trackCustomerOrder(
  orderNumber: string,
  whatsapp: string
): Promise<{ success: boolean; order: Order }> {
  const res = await fetch(`${API_BASE}/orders/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order_number: orderNumber, whatsapp }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Pesanan tidak ditemukan');
  }
  return data;
}

export async function getAdminOrders(
  paramsOrStatus?: string | { status?: string; search?: string },
  searchParam?: string
): Promise<Order[]> {
  const query = new URLSearchParams();

  if (typeof paramsOrStatus === 'string') {
    if (paramsOrStatus && paramsOrStatus !== 'all') query.set('status', paramsOrStatus);
    if (searchParam) query.set('search', searchParam);
  } else if (paramsOrStatus && typeof paramsOrStatus === 'object') {
    if (paramsOrStatus.status && paramsOrStatus.status !== 'all') {
      query.set('status', paramsOrStatus.status);
    }
    if (paramsOrStatus.search) {
      query.set('search', paramsOrStatus.search);
    }
  }

  const res = await fetch(`${API_BASE}/admin/orders?${query.toString()}`, {
    headers: getAdminHeaders(),
  });
  if (!res.ok) throw new Error('Gagal memuat daftar pesanan');
  return res.json();
}

export async function getAdminOrderDetail(id: number): Promise<{ order: Order }> {
  const res = await fetch(`${API_BASE}/admin/orders/${id}`, {
    headers: getAdminHeaders(),
  });
  if (!res.ok) throw new Error('Gagal memuat detail pesanan');
  const data = await res.json();
  if (data && data.order) return data;
  return { order: data };
}

export async function approveOrderPayment(
  id: number
): Promise<{ success: boolean; message: string; order: Order }> {
  const res = await fetch(`${API_BASE}/admin/orders/${id}/approve-payment`, {
    method: 'POST',
    headers: getAdminHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Gagal menyetujui pembayaran');
  return data;
}

export async function rejectOrderPayment(
  id: number,
  reason: string
): Promise<{ success: boolean; message: string; order: Order }> {
  const res = await fetch(`${API_BASE}/admin/orders/${id}/reject-payment`, {
    method: 'POST',
    headers: getAdminHeaders(),
    body: JSON.stringify({ reason }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Gagal menolak pembayaran');
  return data;
}

export async function updateAdminOrderStatus(
  id: number,
  opts: { status: OrderStatus; tracking_number?: string; courier?: string } | OrderStatus,
  extra?: { tracking_number?: string; courier?: string }
): Promise<{ success: boolean; message: string; order: Order }> {
  let bodyPayload: { status: OrderStatus; tracking_number?: string; courier?: string };
  if (typeof opts === 'string') {
    bodyPayload = { status: opts, ...extra };
  } else {
    bodyPayload = opts;
  }

  const res = await fetch(`${API_BASE}/admin/orders/${id}/status`, {
    method: 'PATCH',
    headers: getAdminHeaders(),
    body: JSON.stringify(bodyPayload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Gagal memperbarui status pesanan');
  return data;
}

export const updateOrderStatus = updateAdminOrderStatus;
