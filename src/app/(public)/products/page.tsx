'use client';

import { Suspense } from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X, ArrowUpDown, Sparkles } from 'lucide-react';
import { Product, Category } from '@/types';
import { getProducts } from '@/services/product.service';
import { getCategories } from '@/services/category-product.service';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialFilter = searchParams.get('filter') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function fetchFilteredProducts() {
      try {
        setLoading(true);
        const data = await getProducts({
          category_slug: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchQuery || undefined,
          sort: sortBy,
          featured: initialFilter === 'featured' ? true : undefined,
          best_seller: initialFilter === 'best_seller' ? true : undefined,
        });
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    }

    const debounceTimer = setTimeout(() => {
      fetchFilteredProducts();
    }, 200);

    return () => clearTimeout(debounceTimer);
  }, [selectedCategory, searchQuery, sortBy, initialFilter]);

  const clearFilters = useCallback(() => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('newest');
  }, []);

  const hasActiveFilters =
    selectedCategory !== 'all' || searchQuery.length > 0 || sortBy !== 'newest';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-gradient-to-r from-[#FFF1F1] via-[#FFF9F9] to-[#FEBCBD]/20 rounded-3xl p-6 sm:p-10 border border-[#FEBCBD]/30 shadow-xs">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#F49A9D] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Katalog Lengkap</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#4A3A3A]">
            Koleksi Produk Cantik & Elegan 💕
          </h1>
          <p className="text-xs sm:text-sm text-[#9A8585]">
            Pilih produk favoritmu, tambahkan ke keranjang, dan langsung checkout tanpa perlu login.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white border border-[#FEBCBD]/50 text-sm text-[#4A3A3A] placeholder-[#9A8585] focus:outline-hidden focus:border-[#F49A9D] focus:ring-2 focus:ring-[#FEBCBD]/30 shadow-2xs transition-all"
            />
            <Search className="w-4 h-4 text-[#9A8585] absolute left-3.5 top-3.5" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-[#9A8585] hover:text-[#4A3A3A]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-[#FEBCBD]/50 shadow-2xs text-xs font-medium text-[#4A3A3A]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#F49A9D]" />
              <span>Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-[#4A3A3A] font-semibold focus:outline-hidden cursor-pointer"
              >
                <option value="newest">Terbaru ✨</option>
                <option value="price_asc">Harga Terendah</option>
                <option value="price_desc">Harga Tertinggi</option>
                <option value="popular">Terpopuler (Rating)</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-3.5 py-2 rounded-2xl bg-[#FFF1F1] hover:bg-[#FEBCBD] text-xs font-semibold text-[#4A3A3A] transition-colors"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#FEBCBD] text-[#4A3A3A] shadow-xs'
                : 'bg-white border border-[#FEBCBD]/40 text-[#4A3A3A] hover:bg-[#FFF1F1]'
            }`}
          >
            Semua Kategori ({products.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-[#FEBCBD] text-[#4A3A3A] shadow-xs'
                  : 'bg-white border border-[#FEBCBD]/40 text-[#4A3A3A] hover:bg-[#FFF1F1]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : products.length === 0 ? (
        <EmptyState
          title="Produk tidak ditemukan 💕"
          description="Coba cari dengan kata kunci lain atau ubah filter kategorimu."
          actionText="Tampilkan Semua Produk"
          onAction={clearFilters}
          icon="search"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FEBCBD] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
