import { Trash2 } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  deleteCategory,
} from "@/services/category-product.service";
import { useToast } from "@/context/ToastContext";

export default function ModalDelete(payload: any) {
  const {
    deleteModalOpen,
    setDeleteModalOpen,
    categoryToDelete,
    loadData
  } = payload;

  const { showToast } = useToast();

  const [bussy, setBussy] = useState(false);


  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      setBussy(true);
      await deleteCategory(categoryToDelete.id);
      showToast("Kategori berhasil dihapus", "pink");
      setDeleteModalOpen(false);
      loadData();
    } catch (err: unknown) {
      showToast(
        err instanceof Error ? err.message : "Gagal menghapus kategori",
        "error",
      );
    } finally {
      setBussy(false);
    }
  };
  return (
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
              Kategori <strong>&quot;{categoryToDelete.name}&quot;</strong> akan
              dihapus.
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
                onClick={handleDelete}
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
