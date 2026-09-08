import { useToast } from "@/context/ToastContext";
import { deleteProduct } from "@/services/product.service";
import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";


export default function DeleteProductModal(payload: any) {
  const {
    deleteModalOpen,
    setDeleteModalOpen,
    productToDelete,
    loadData
  } = payload;

  const [bussy, setBussy] = useState(false);
  const { showToast } = useToast();

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      setBussy(true);
      await deleteProduct(productToDelete.id);
      showToast("Produk berhasil dihapus", "pink");
      setDeleteModalOpen(false);

      loadData();
    } catch (err: unknown) {
      showToast(
        err instanceof Error ? err.message : "Gagal menghapus produk",
        "error",
      );
    } finally {
      setBussy(false);
    }
  };


  return (
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
              Produk <strong>&quot;{productToDelete.name}&quot;</strong> akan
              dihapus secara permanen dari katalog toko.
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
                disabled={bussy}
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-500/20"
              >
                {bussy ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
