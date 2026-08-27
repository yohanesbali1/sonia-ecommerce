import {
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

export async function getCategories(all = false): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/categories?all=${all}`);
  if (!res.ok) throw new Error('Gagal memuat kategori');
  return res.json();
}

export async function getAdminCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/admin/categories`, {
    headers: getAdminHeaders(),
  });
  if (!res.ok) throw new Error('Gagal memuat kategori admin');
  return res.json();
}

export async function createAdminCategory(
  categoryData: Partial<Category>
): Promise<Category> {
  const res = await fetch(`${API_BASE}/admin/categories`, {
    method: 'POST',
    headers: getAdminHeaders(),
    body: JSON.stringify(categoryData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Gagal membuat kategori');
  return data;
}

export async function updateAdminCategory(
  id: number,
  categoryData: Partial<Category>
): Promise<Category> {
  const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
    method: 'PUT',
    headers: getAdminHeaders(),
    body: JSON.stringify(categoryData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Gagal memperbarui kategori');
  return data;
}

export async function deleteAdminCategory(
  id: number
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
    method: 'DELETE',
    headers: getAdminHeaders(),
  });
  if (!res.ok) throw new Error('Gagal menghapus kategori');
  return res.json();
}

export const createCategory = createAdminCategory;
export const updateCategory = updateAdminCategory;
export const deleteCategory = deleteAdminCategory;
