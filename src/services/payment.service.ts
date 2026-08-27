import {
  Order,
  StoreSettings,
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

export async function uploadPaymentProof(
  orderNumber: string,
  proofImage: string
): Promise<{ success: boolean; message: string; order: Order }> {
  const res = await fetch(`${API_BASE}/payments/${orderNumber}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ proof_image: proofImage }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Gagal mengunggah bukti pembayaran');
  }
  return data;
}

export async function getStoreSettings(): Promise<StoreSettings> {
  const res = await fetch(`${API_BASE}/settings`);
  if (!res.ok) throw new Error('Gagal memuat pengaturan toko');
  return res.json();
}

export async function getAdminSettings(): Promise<StoreSettings> {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    headers: getAdminHeaders(),
  });
  if (!res.ok) throw new Error('Gagal memuat pengaturan toko');
  return res.json();
}

export async function updateAdminSettings(
  settings: Partial<StoreSettings>
): Promise<{ success: boolean; message: string; settings: StoreSettings }> {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    method: 'PUT',
    headers: getAdminHeaders(),
    body: JSON.stringify(settings),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Gagal memperbarui pengaturan toko');
  return data;
}
