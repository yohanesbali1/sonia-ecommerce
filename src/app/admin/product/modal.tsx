import { useToast } from "@/context/ToastContext";
import {
  createProductSchema,
  updateProductSchema,
} from "@/lib/validations/product";
import { createProduct, updateProduct } from "@/services/product.service";
import { Category } from "@/types";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
export default function ModalData(payload: any) {
  const { setModalOpen, editingProduct, modalOpen, categories, loadData } =
    payload;

  let form = {
    name: "",
    category_id: 1,
    price: 150000,
    discount_price: 0,
    stock: 15,
    slug: "",
    description: "",
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
    ],
    featured: false,
    best_seller: false,
    status: true,
  };

  const { showToast } = useToast();

  const [formData, setFormData] = useState(form);

  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (modalOpen) {
      setFormData(form);
      if (editingProduct) {
        setFormData({
          name: editingProduct.name,
          slug: editingProduct.slug,
          category_id: editingProduct.category_id,
          price: editingProduct.price,
          discount_price: editingProduct.discount_price || 0,
          stock: editingProduct.stock,
          description: editingProduct.description || "",
          images:
            editingProduct.images && editingProduct.images.length > 0
              ? editingProduct.images
              : [""],
          featured: editingProduct.featured || false,
          best_seller: editingProduct.best_seller || false,
          status: editingProduct.status || false,
        });
      }
    }
  }, [modalOpen, editingProduct]);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Nama produk wajib diisi", "error");
      return;
    }
    if (formData.price <= 0) {
      showToast("Harga produk harus lebih dari 0", "error");
      return;
    }

    try {
      setBusy(true);
      const payload = {
        ...formData,
        images: formData.images.filter((img) => img.trim().length > 0),
      };

      const schema = editingProduct ? updateProductSchema : createProductSchema;

      const result = schema.safeParse(formData);

      console.log(result.error);
      if (!result.success) {
        const message = result.error.issues[0]?.message ?? "Data tidak valid";

        showToast(message, "error");
        return;
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        showToast("Produk berhasil diperbarui 💕", "pink");
      } else {
        await createProduct(payload);
        showToast("Produk baru berhasil ditambahkan ✨", "pink");
      }
      setModalOpen(false);
      loadData();
    } catch (err: unknown) {
      console.log(err);
      showToast(
        err instanceof Error ? err.message : "Gagal menyimpan produk",
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
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#FEBCBD]/50 shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#FFF1F1]">
              <h2 className="font-display font-bold text-lg text-[#4A3A3A]">
                {editingProduct
                  ? "Edit Produk Butik 💕"
                  : "Tambah Produk Baru ✨"}
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
                <label className="font-semibold text-[#4A3A3A]">
                  Nama Produk *
                </label>
                <input
                  type="text"
                  required
                  disabled={busy}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Contoh: Rose Quartz Glow Serum"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden focus:border-[#F49A9D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#4A3A3A]">
                    Kategori *
                  </label>
                  <select
                    value={formData.category_id}
                    disabled={busy}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category_id: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden"
                  >
                    {categories.map((c: Category) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#4A3A3A]">
                    Stok Barang (pcs) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#4A3A3A]">
                    Harga Normal (Rp) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    disabled={busy}
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#4A3A3A]">
                    Harga Diskon/Promo (Rp) (Opsional)
                  </label>
                  <input
                    type="number"
                    disabled={busy}
                    min={0}
                    value={formData.discount_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount_price: Number(e.target.value),
                      })
                    }
                    placeholder="0 jika tidak ada promo"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#4A3A3A]">
                  URL Foto Gambar Utama *
                </label>
                <input
                  type="url"
                  disabled={busy}
                  value={formData.images[0] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, images: [e.target.value] })
                  }
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
                <label className="font-semibold text-[#4A3A3A]">
                  Deskripsi Lengkap
                </label>
                <textarea
                  rows={3}
                  disabled={busy}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Tuliskan detail bahan, manfaat, cara pemakaian..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden"
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

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    disabled={busy}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        featured: e.target.checked,
                      })
                    }
                    className="rounded text-[#F49A9D] focus:ring-[#FEBCBD]"
                  />
                  <span className="font-medium text-[#4A3A3A]">
                    Jadikan Featured Product
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.best_seller}
                    disabled={busy}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        best_seller: e.target.checked,
                      })
                    }
                    className="rounded text-[#F49A9D] focus:ring-[#FEBCBD]"
                  />
                  <span className="font-medium text-[#4A3A3A]">
                    Jadikan Best Seller
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.status}
                    disabled={busy}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.checked })
                    }
                    className="rounded text-[#F49A9D] focus:ring-[#FEBCBD]"
                  />
                  <span className="font-medium text-[#4A3A3A]">
                    Status Aktif Dijual
                  </span>
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
                  disabled={busy}
                  className="px-6 py-2.5 rounded-full bg-[#FEBCBD] hover:bg-[#F49A9D] text-[#4A3A3A] font-bold text-xs shadow-md shadow-[#FEBCBD]/40 disabled:opacity-50"
                >
                  {busy ? "Menyimpan..." : "Simpan Produk 💕"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
