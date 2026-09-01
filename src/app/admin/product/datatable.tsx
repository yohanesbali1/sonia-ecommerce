import { formatRupiah } from "@/lib/utils";
import { Product } from "@/types";
import { Edit2, Trash2, Star, Flame } from "lucide-react";

export default function DataTable(payload: any) {
  const {
    filteredProducts,
    loading,
    handleToggleActive,
    handleOpenEditModal,
    setProductToDelete,
    setDeleteModalOpen,
  } = payload;
  return (
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
              filteredProducts.map((p: Product) => (
                <tr
                  key={p.id}
                  className="hover:bg-[#FFF9F9]/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          p.images?.[0] ||
                          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800"
                        }
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover bg-[#FFF1F1] border border-[#FEBCBD]/30 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-semibold text-sm text-[#4A3A3A]">
                          {p.name}
                        </p>
                        <span className="text-[11px] text-[#9A8585]">
                          Slug: {p.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-[#4A3A3A] font-medium">
                    {p.category_name || "-"}
                  </td>

                  <td className="p-4">
                    <p className="font-bold text-[#4A3A3A]">
                      {formatRupiah(p.price)}
                    </p>
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
                          ? "bg-emerald-50 text-emerald-700"
                          : p.stock > 0
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {p.stock} pcs
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {p.featured && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold text-[10px] flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-500" />{" "}
                          Featured
                        </span>
                      )}
                      {p.best_seller && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold text-[10px] flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5 fill-rose-500" /> Best
                          Seller
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(p)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                        p.status
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {p.status ? "Aktif" : "Nonaktif"}
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
  );
}
