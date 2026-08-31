import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

import {
  createCategory,
  updateCategory,
} from "@/services/category-product.service";
import { useToast } from "@/context/ToastContext";
import {
  createCategorySchema,
  updateCategorySchema,
} from "@/lib/validations/category-product";

export default function ModalData(payload: any) {
  const { modalOpen, setModalOpen, editingCategory, loadData } = payload;

  const { showToast } = useToast();

  const [busy, setBusy] = useState(false);

  const form = {
    name: "",
    slug: "",
    image: "",
    status: true,
  };

  const [formData, setFormData] = useState(form);

  useEffect(() => {
    if (modalOpen) {
      setFormData(form);

      if (editingCategory) {
        setFormData({
          name: editingCategory.name ?? "",
          slug: editingCategory.slug ?? "",
          image: editingCategory.image ?? "",
          status: editingCategory.status ?? "active",
        });
      }
    }
  }, [modalOpen, editingCategory]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setBusy(true);

      const schema = editingCategory
        ? updateCategorySchema
        : createCategorySchema;

      const result = schema.safeParse(formData);

      if (!result.success) {
        const message = result.error.issues[0]?.message ?? "Data tidak valid";

        showToast(message, "error");
        return;
      }

      if (editingCategory) {
        await updateCategory(editingCategory.id, result.data);

        showToast("Kategori berhasil diperbarui 💕", "pink");
      } else {
        await createCategory(result.data);

        showToast("Kategori baru berhasil ditambahkan ✨", "pink");
      }

      setModalOpen(false);
      loadData();
    } catch (err: unknown) {
      showToast(
        err instanceof Error ? err.message : "Gagal menyimpan kategori",
        "error",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
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
                {editingCategory
                  ? "Edit Kategori 💕"
                  : "Tambah Kategori Baru ✨"}
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
              {/* Nama */}
              <div className="space-y-1">
                <label className="font-semibold text-[#4A3A3A]">
                  Nama Kategori *
                </label>

                <input
                  type="text"
                  required
                  disabled={busy}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Contoh: Skincare Organik"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden focus:border-[#F49A9D]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#4A3A3A]">Slug</label>

                <input
                  type="text"
                  value={formData.slug}
                  disabled={busy}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slug: e.target.value,
                    })
                  }
                  placeholder="Contoh: skincare-organik"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden focus:border-[#F49A9D]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#4A3A3A]">
                  URL Foto Thumbnail
                </label>

                <input
                  type="url"
                  value={formData.image}
                  disabled={busy}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      image: e.target.value,
                    })
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.checked })
                  }
                  className="rounded text-[#F49A9D] focus:ring-[#FEBCBD]"
                />
                <span className="font-medium text-[#4A3A3A]">
                  Status Aktif Ditampilkan
                </span>
              </label>

              {/* Actions */}
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
                  disabled={busy}
                  className="px-6 py-2 rounded-full bg-[#FEBCBD] hover:bg-[#F49A9D] text-[#4A3A3A] font-bold text-xs shadow-md shadow-[#FEBCBD]/40 disabled:opacity-50"
                >
                  {busy ? "Menyimpan..." : "Simpan Kategori"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
