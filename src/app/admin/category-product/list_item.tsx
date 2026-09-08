import { Category } from "@/types";
import { Edit2, Trash2 } from "lucide-react";

export default function ListItem(payload: any) {
  const {
    categories,
    loading,
    handleOpenEdit,
    setCategoryToDelete,
    setDeleteModalOpen,
  } = payload;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading ? (
        <></>
      ) : (
        categories.map((cat: Category) => (
          <div
            key={cat.id}
            className="bg-white rounded-3xl p-5 border border-[#FEBCBD]/40 shadow-xs flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <img
                src={
                  cat.image ||
                  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800"
                }
                alt={cat.name}
                className="w-14 h-14 rounded-2xl object-cover bg-[#FFF1F1] border border-[#FEBCBD]/30 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="font-semibold text-sm text-[#4A3A3A]">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-[#9A8585] block font-mono">
                  slug: {cat.slug}
                </span>
                <span
                  className={
                    "inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full " +
                    (cat.status
                      ? "bg-green-50 text-green-600"
                      : "bg-rose-50 text-rose-600")
                  }
                >
                  {cat.status ? "Aktif" : "Tidak Aktif"}
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
        ))
      )}
    </div>
  );
}
