'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, FolderTree, X, Sparkles } from 'lucide-react';
import { Category } from '@/types';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/services/category-product.service';
import { useToast } from '@/context/ToastContext';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
    is_active: true,
  });

  const { showToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const cats = await getCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      image: cat.image || '',
      is_active: cat.is_active || false,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Nama kategori wajib diisi', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        showToast('Kategori berhasil diperbarui 💕', 'pink');
      } else {
        await createCategory(formData);
        showToast('Kategori baru berhasil ditambahkan ✨', 'pink');
      }
      setModalOpen(false);
      loadData();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Gagal menyimpan kategori', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      setIsSubmitting(true);
      await deleteCategory(categoryToDelete.id);
      showToast('Kategori berhasil dihapus', 'pink');
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
      loadData();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Gagal menghapus kategori', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#4A3A3A]">
            Kategori Produk Butik 💕
          </h1>
          <p className="text-xs text-[#9A8585]">
            Kelola pengelompokan produk untuk mempermudah customer menelusuri koleksi
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-2xl bg-[#FEBCBD] hover:bg-[#F49A9D] text-[#4A3A3A] font-bold text-xs flex items-center gap-2 shadow-md shadow-[#FEBCBD]/40 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-3xl p-5 border border-[#FEBCBD]/40 shadow-xs flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800'}
                alt={cat.name}
                className="w-14 h-14 rounded-2xl object-cover bg-[#FFF1F1] border border-[#FEBCBD]/30 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="font-semibold text-sm text-[#4A3A3A]">{cat.name}</h3>
                <span className="text-[11px] text-[#9A8585] block font-mono">
                  slug: {cat.slug}
                </span>
                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  Aktif
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleOpenEdit(cat)}
                className="p-2 rounded-xl bg-[#FFF1F1] text-[#4A3A3A] hover:bg-[#FEBCBD] transition-colors"
                title="Edit Kategori"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setCategoryToDelete(cat);
                  setDeleteModalOpen(true);
                }}
                className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                title="Hapus Kategori"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#FEBCBD]/50 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#FFF1F1]">
                <h2 className="font-display font-bold text-base text-[#4A3A3A]">
                  {editingCategory ? 'Edit Kategori 💕' : 'Tambah Kategori Baru ✨'}
                </h2>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-full text-[#9A8585] hover:text-[#4A3A3A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-[#4A3A3A]">Nama Kategori *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Skincare Organik"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden focus:border-[#F49A9D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#4A3A3A]">Slug (URL) (Opsional)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="Contoh: skincare-organik"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden focus:border-[#F49A9D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#4A3A3A]">URL Foto Thumbnail</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#FFF1F1]">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2 rounded-full bg-[#FFF1F1] text-[#4A3A3A] font-semibold text-xs hover:bg-[#FEBCBD]/40"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 rounded-full bg-[#FEBCBD] hover:bg-[#F49A9D] text-[#4A3A3A] font-bold text-xs shadow-md shadow-[#FEBCBD]/40 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Kategori'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteModalOpen && categoryToDelete && (
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
                Hapus Kategori?
              </h3>
              <p className="text-xs text-[#9A8585]">
                Kategori <strong>&quot;{categoryToDelete.name}&quot;</strong> akan dihapus.
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
                  onClick={handleDelete}
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
