'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  Flame,
  Sparkles,
  X,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { Product, Category } from '@/types';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/services/product.service';
import { getCategories } from '@/services/category-product.service';
import { formatRupiah } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category_id: 0,
    price: 0,
    discount_price: 0,
    stock: 10,
    description: '',
    images: [''],
    is_featured: false,
    is_best_seller: false,
    is_active: true,
  });

  const { showToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load products/categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category_id: categories[0]?.id || 1,
      price: 150000,
      discount_price: 0,
      stock: 15,
      description: '',
      images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800'],
      is_featured: false,
      is_best_seller: false,
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      category_id: prod.category_id,
      price: prod.price,
      discount_price: prod.discount_price || 0,
      stock: prod.stock,
      description: prod.description || '',
      images: prod.images && prod.images.length > 0 ? prod.images : [''],
      is_featured: prod.is_featured || false,
      is_best_seller: prod.is_best_seller || false,
      is_active: prod.is_active || false,
    });
    setModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Nama produk wajib diisi', 'error');
      return;
    }
    if (formData.price <= 0) {
      showToast('Harga produk harus lebih dari 0', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        images: formData.images.filter((img) => img.trim().length > 0),
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        showToast('Produk berhasil diperbarui 💕', 'pink');
      } else {
        await createProduct(payload);
        showToast('Produk baru berhasil ditambahkan ✨', 'pink');
      }
      setModalOpen(false);
      loadData();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Gagal menyimpan produk', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      setIsSubmitting(true);
      await deleteProduct(productToDelete.id);
      showToast('Produk berhasil dihapus', 'pink');
      setDeleteModalOpen(false);
      setProductToDelete(null);
      loadData();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Gagal menghapus produk', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (prod: Product) => {
    try {
      await updateProduct(prod.id, { is_active: !prod.is_active });
      showToast(`Status produk diubah ke ${!prod.is_active ? 'Aktif' : 'Nonaktif'}`, 'pink');
      loadData();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Gagal memperbarui status', 'error');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || p.category_slug === selectedCategory || p.category_id === Number(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#4A3A3A]">
            Kelola Produk Butik 💕
          </h1>
          <p className="text-xs text-[#9A8585]">
            Tambah, edit katalog, kelola stok dan harga promo produkmu
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 rounded-2xl bg-[#FEBCBD] hover:bg-[#F49A9D] text-[#4A3A3A] font-bold text-xs flex items-center gap-2 shadow-md shadow-[#FEBCBD]/40 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-4 border border-[#FEBCBD]/40 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Cari nama produk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden focus:border-[#F49A9D]"
          />
          <Search className="w-3.5 h-3.5 text-[#9A8585] absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#9A8585] whitespace-nowrap">Kategori:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#FEBCBD]/40 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF9F9] text-[#9A8585] border-b border-[#FFF1F1]">
              <tr>
                <th className="p-4 font-semibold">Produk</th>
                <th className="p-4 font-semibold">Kategori</th>
                <th className="p-4 font-semibold">Harga / Diskon</th>
                <th className="p-4 font-semibold">Stok</th>
                <th className="p-4 font-semibold">Tag</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFF1F1]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#9A8585]">
                    Memuat data produk...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#9A8585]">
                    Tidak ada produk ditemukan 💕
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FFF9F9]/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800'}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-[#FFF1F1] border border-[#FEBCBD]/30 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-semibold text-sm text-[#4A3A3A]">{p.name}</p>
                          <span className="text-[11px] text-[#9A8585]">Slug: {p.slug}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-[#4A3A3A] font-medium">
                      {p.category_name || '-'}
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-[#4A3A3A]">{formatRupiah(p.price)}</p>
                      {p.discount_price && p.discount_price > 0 ? (
                        <span className="text-[11px] text-rose-500 font-semibold">
                          Promo: {formatRupiah(p.discount_price)}
                        </span>
                      ) : null}
                    </td>

                    <td className="p-4">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                          p.stock > 5
                            ? 'bg-emerald-50 text-emerald-700'
                            : p.stock > 0
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {p.stock} pcs
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {p.is_featured && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold text-[10px] flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-amber-500" /> Featured
                          </span>
                        )}
                        {p.is_best_seller && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold text-[10px] flex items-center gap-0.5">
                            <Flame className="w-2.5 h-2.5 fill-rose-500" /> Best Seller
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(p)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          p.is_active
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {p.is_active ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-xl bg-[#FFF1F1] text-[#4A3A3A] hover:bg-[#FEBCBD] transition-colors"
                          title="Edit Produk"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setProductToDelete(p);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#FEBCBD]/50 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#FFF1F1]">
                <h2 className="font-display font-bold text-lg text-[#4A3A3A]">
                  {editingProduct ? 'Edit Produk Butik 💕' : 'Tambah Produk Baru ✨'}
                </h2>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-full text-[#9A8585] hover:text-[#4A3A3A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-[#4A3A3A]">Nama Produk *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Rose Quartz Glow Serum"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden focus:border-[#F49A9D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#4A3A3A]">Kategori *</label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#4A3A3A]">Stok Barang (pcs) *</label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#4A3A3A]">Harga Normal (Rp) *</label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#4A3A3A]">Harga Diskon/Promo (Rp) (Opsional)</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.discount_price}
                      onChange={(e) => setFormData({ ...formData, discount_price: Number(e.target.value) })}
                      placeholder="0 jika tidak ada promo"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#4A3A3A]">URL Foto Gambar Utama *</label>
                  <input
                    type="url"
                    value={formData.images[0] || ''}
                    onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden"
                  />
                  {formData.images[0] && (
                    <div className="pt-2">
                      <img
                        src={formData.images[0]}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-xl border border-[#FEBCBD]/40"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#4A3A3A]">Deskripsi Lengkap</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tuliskan detail bahan, manfaat, cara pemakaian..."
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden"
                  />
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="rounded text-[#F49A9D] focus:ring-[#FEBCBD]"
                    />
                    <span className="font-medium text-[#4A3A3A]">Jadikan Featured Product</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_best_seller}
                      onChange={(e) => setFormData({ ...formData, is_best_seller: e.target.checked })}
                      className="rounded text-[#F49A9D] focus:ring-[#FEBCBD]"
                    />
                    <span className="font-medium text-[#4A3A3A]">Jadikan Best Seller</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="rounded text-[#F49A9D] focus:ring-[#FEBCBD]"
                    />
                    <span className="font-medium text-[#4A3A3A]">Status Aktif Dijual</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#FFF1F1]">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 rounded-full bg-[#FFF1F1] text-[#4A3A3A] font-semibold text-xs hover:bg-[#FEBCBD]/40"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-full bg-[#FEBCBD] hover:bg-[#F49A9D] text-[#4A3A3A] font-bold text-xs shadow-md shadow-[#FEBCBD]/40 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Produk 💕'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteModalOpen && productToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border border-rose-200 shadow-2xl space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-base text-[#4A3A3A]">
                Hapus Produk Ini?
              </h3>
              <p className="text-xs text-[#9A8585]">
                Produk <strong>&quot;{productToDelete.name}&quot;</strong> akan dihapus secara permanen dari katalog toko.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-[#FFF1F1] text-[#4A3A3A] font-semibold text-xs"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleDeleteConfirm}
                  className="px-5 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-500/20"
                >
                  {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
