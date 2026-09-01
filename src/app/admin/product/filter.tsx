import { Category } from "@/types";
import { Search } from "lucide-react";
export default function Filter(payload: any) {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
  } = payload;
  return (
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
        <span className="text-xs text-[#9A8585] whitespace-nowrap">
          Kategori:
        </span>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden"
        >
          <option value="all">Semua Kategori</option>
          {categories.map((c: Category) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
