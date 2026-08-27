import {
  Product,
  Category,
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

export async function getProducts(params?: {
  search?: string;
  category_id?: number;
  category_slug?: string;
  sort?: string;
  featured?: boolean;
  best_seller?: boolean;
  all?: boolean;
}): Promise<Product[]> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.category_id) query.set('category_id', String(params.category_id));
  if (params?.category_slug) query.set('category_slug', params.category_slug);
  if (params?.sort) query.set('sort', params.sort);
  if (params?.featured) query.set('featured', 'true');
  if (params?.best_seller) query.set('best_seller', 'true');
  if (params?.all) query.set('all', 'true');

  const res = await fetch(`${API_BASE}/products?${query.toString()}`);
  if (!res.ok) throw new Error('Gagal memuat produk');
  return res.json();
}

export async function getProductDetail(
  slugOrId: string | number
): Promise<{ product: Product; recommendations: Product[] }> {
  const res = await fetch(`${API_BASE}/products/${slugOrId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Produk tidak ditemukan');
  }
  return res.json();
}

export async function getAdminProducts(
  search?: string,
  category_id?: number
): Promise<Product[]> {
  const query = new URLSearchParams();
  if (search) query.set('search', search);
  if (category_id) query.set('category_id', String(category_id));

  const res = await fetch(`${API_BASE}/admin/products?${query.toString()}`, {
    headers: getAdminHeaders(),
  });
  if (!res.ok) throw new Error('Gagal memuat produk admin');
  return res.json();
}

export async function createAdminProduct(productData: Partial<Product>): Promise<Product> {
  const res = await fetch(`${API_BASE}/admin/products`, {
    method: 'POST',
    headers: getAdminHeaders(),
    body: JSON.stringify(productData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Gagal membuat produk');
  return data;
}

export async function updateAdminProduct(
  id: number,
  productData: Partial<Product>
): Promise<Product> {
  const res = await fetch(`${API_BASE}/admin/products/${id}`, {
    method: 'PUT',
    headers: getAdminHeaders(),
    body: JSON.stringify(productData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Gagal memperbarui produk');
  return data;
}

export async function deleteAdminProduct(
  id: number
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/admin/products/${id}`, {
    method: 'DELETE',
    headers: getAdminHeaders(),
  });
  if (!res.ok) throw new Error('Gagal menghapus produk');
  return res.json();
}

export async function toggleAdminProductStatus(id: number): Promise<Product> {
  const res = await fetch(`${API_BASE}/admin/products/${id}/toggle-status`, {
    method: 'PATCH',
    headers: getAdminHeaders(),
  });
  if (!res.ok) throw new Error('Gagal mengubah status produk');
  return res.json();
}

export const createProduct = createAdminProduct;
export const updateProduct = updateAdminProduct;
export const deleteProduct = deleteAdminProduct;

export async function getAdminDashboardStats(): Promise<import('@/types').DashboardStats> {
  const res = await fetch(`${API_BASE}/admin/dashboard`, {
    headers: getAdminHeaders(),
  });
  if (!res.ok) throw new Error('Gagal memuat statistik admin');
  return res.json();
}
