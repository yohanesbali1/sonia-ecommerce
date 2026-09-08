"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Sparkles,
  Heart,
  ArrowRight,
  ShoppingBag,
  Star,
  CheckCircle,
  TrendingUp,
  Flame,
  Clock,
  ShieldCheck,
  Truck,
  Gift,
  Tag,
  DiscIcon,
} from "lucide-react";
import { Product, Category } from "@/types";
import { getProducts } from "@/services/product.service";
import { getCategories } from "@/services/category-product.service";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/LoadingSkeleton";
import { formatRupiah } from "@/lib/utils";

export default function HomePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [productDashboard, setProductDashboard] = useState<any>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [cats, feat, news, best] = await Promise.all([
          getCategories(),
          getProducts({ featured: true }),
          getProducts({ sort: "newest" }),
          getProducts({ best_seller: true }),
        ]);
        setCategories(cats);
        setFeaturedProducts(feat.slice(0, 4));
        setNewArrivals(news.slice(0, 4));
        setBestSellers(best.slice(0, 4));
        best.slice(0, 4).forEach((p) => {
          const hasDiscount = Boolean(
            p.discount_price &&
            p.discount_price > 0 &&
            p.discount_price < p.price,
          );

          const currentPrice = hasDiscount ? p.discount_price! : p.price;

          const discountPercent = hasDiscount
            ? Math.round(((p.price - p.discount_price!) / p.price) * 100)
            : 0;

          setProductDashboard((prev:any) => [
            ...prev,
            {
              ...p,
              currentPrice,
              discountPercent,
            },
          ]);
        });
      } catch (err) {
        console.error("Error loading home data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 overflow-hidden">
      {/* Bento Grid Hero Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="grid grid-cols-12 gap-5 sm:gap-6">
          {/* Main Hero Tile (8 Columns on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-12 lg:col-span-8 relative rounded-[2rem] bg-gradient-to-br from-[#FEBCBD] via-[#F49A9D] to-[#F49A9D] text-white p-6 sm:p-8 lg:p-10 overflow-hidden shadow-xl shadow-[#FEBCBD]/25 flex flex-col justify-between"
          >
            {/* Bento Dot Pattern Overlay */}
            <div className="absolute inset-0 bento-dot-pattern opacity-60 pointer-events-none" />

            {/* Glowing Accent Blobs */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#FEBCBD]/30 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Column: Copy & Actions */}
              <div className="md:col-span-7 space-y-5">
                {/* Header Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/25 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-white border border-white/30 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Koleksi Spesial 2026
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white text-[#F49A9D] text-[11px] font-extrabold shadow-xs flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-[#F49A9D]" /> 100% Feminine &
                    Glow
                  </span>
                </div>

                {/* Title & Copy */}
                <div className="space-y-2.5">
                  <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight drop-shadow-xs">
                    Temukan Produk <br />
                    <span className="underline decoration-white/60 decoration-wavy decoration-2">
                      Favoritmu
                    </span>{" "}
                    💕
                  </h1>
                  <p className="text-xs sm:text-sm text-white/95 leading-relaxed">
                    Hadirkan pesona anggun dengan koleksi gaun floral, skincare
                    glowing, tas pastel chic, dan aksesori mutiara air tawar
                    eksklusif.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => router.push("/products")}
                    className="px-6 py-2.5 sm:py-3 rounded-full bg-white text-[#4A3A3A] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-black/10 hover:bg-[#FFF9F9] transition-all"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#F49A9D]" />
                    <span>Belanja Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => router.push("/products?filter=featured")}
                    className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold text-xs sm:text-sm border border-white/40 transition-colors"
                  >
                    Lihat Pilihan ✨
                  </button>
                </div>
              </div>

              {/* Right Column: Product Image Showcase with Floating Cards */}
              <div className="md:col-span-5 relative flex justify-center md:justify-end">
                <div className="relative w-full max-w-[260px] sm:max-w-[280px]">
                  {/* Main Showcase Product Card */}
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="relative bg-white/90 backdrop-blur-md p-2.5 rounded-[1.75rem] shadow-xl border border-white/80 overflow-hidden cursor-pointer group"
                    onClick={() =>
                      router.push("/products?category=best-seller")
                    }
                  >
                    <div className="relative h-44 sm:h-52 w-full rounded-2xl overflow-hidden bg-pink-50">
                      <img
                        src={productDashboard[0]?.images[0]}
                        alt="French Floral Dress Preview"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold text-[#F49A9D] shadow-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#F49A9D]" />
                        <span>Best Seller</span>
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-semibold text-white">
                        ★ 4.9 (1.2k)
                      </div>
                    </div>

                    <div className="pt-2 px-1 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#9A8585] block font-medium">
                          {productDashboard[0]?.category_name}
                        </span>
                        <h4 className="text-xs font-bold text-[#4A3A3A] truncate max-w-[140px]">
                          {productDashboard[0]?.name}
                        </h4>
                      </div>
                      <span className="text-xs font-extrabold text-[#F49A9D]">
                        {formatRupiah(productDashboard[0]?.price)}
                      </span>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -top-3 -left-4 sm:-left-6 bg-white p-2 rounded-2xl shadow-lg border border-pink-100 flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() =>
                      router.push("/products?category=best-seller")
                    }
                  >
                    <img
                      src={productDashboard[1]?.images[0]}
                      alt="Glow Serum"
                      className="w-9 h-9 rounded-xl object-cover border border-pink-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="pr-1 text-left">
                      <span className="text-[9px] font-bold text-[#F49A9D] bg-pink-50 px-1.5 py-0.2 rounded-sm block w-fit">
                        {productDashboard[1]?.discountPercent}%
                      </span>
                      <span className="text-[10px] font-bold text-[#4A3A3A] block">
                        {productDashboard[1]?.name}
                      </span>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [4, -4, 4] }}
                    transition={{
                      duration: 3.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -bottom-3 -right-2 sm:-right-4 bg-white px-2.5 py-1.5 rounded-2xl shadow-lg border border-pink-100 flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() =>
                      router.push("/products?category=best-seller")
                    }
                  >
                    <div className="w-6 h-6 rounded-full bg-[#FFF1F1] flex items-center justify-center text-[#F49A9D]">
                      <Heart className="w-3.5 h-3.5 fill-[#FEBCBD] text-[#F49A9D]" />
                    </div>
                    <span className="text-[10px] font-bold text-[#4A3A3A]">
                      {productDashboard[2]?.name} ✨
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Bottom Floating Feature Pill */}
            <div className="relative z-10 mt-6 pt-3 border-t border-white/20 flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] font-medium text-white/90">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-white shrink-0" />
                <span>Tanpa Perlu Login</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-white shrink-0" />
                <span>Pengiriman Seluruh Indonesia</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-white shrink-0" />
                <span>Bonus Hadiah Cantik</span>
              </div>
            </div>
          </motion.div>

          {/* Bento Tile 2: Spotlight Product of the Week (4 Columns on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-12 lg:col-span-4 bg-white rounded-[2rem] p-5 sm:p-6 border border-[#FEBCBD]/40 shadow-sm flex flex-col justify-between relative overflow-hidden group cursor-pointer"
            onClick={() => router.push("/products?filter=featured")}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-pink-50 text-[10px] font-bold text-[#F49A9D] border border-pink-200 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#F49A9D]" /> Spotlight Pekan
                  Ini
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Ready Stock
                </span>
              </div>

              {/* Product Spotlight Visual */}
              <div className="relative h-36 sm:h-40 rounded-2xl overflow-hidden bg-pink-50 border border-[#FEBCBD]/30">
                <img
                  src={productDashboard[3]?.images[0]}
                  alt="Spotlight Product Collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 text-white">
                  <span className="text-[10px] font-medium text-pink-200">
                    Koleksi Terlaris
                  </span>
                  <h3 className="font-display font-bold text-sm text-white drop-shadow-xs">
                    {productDashboard[3]?.name}
                  </h3>
                </div>
              </div>

              <div>
                <p className="text-xs text-[#9A8585] leading-relaxed">
                  {productDashboard[3]?.description}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-pink-50 flex items-center justify-between">
              <span className="font-extrabold text-sm text-[#F49A9D]">
                Mulai {formatRupiah(productDashboard[3]?.price)}
              </span>
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-full bg-[#FEBCBD] hover:bg-[#F49A9D] text-[#4A3A3A] font-bold text-xs flex items-center gap-1 transition-colors shadow-2xs"
              >
                <span>Lihat Produk</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>

          {/* Bento Sub-Tile 1: Promo Voucher Capsule (4 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="col-span-12 sm:col-span-6 lg:col-span-4 bg-[#FFF1F1] rounded-[2rem] p-6 border border-[#FEBCBD]/50 shadow-xs flex flex-col justify-between relative overflow-hidden"
          >
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[10px] font-extrabold text-[#F49A9D] shadow-2xs">
                <Tag className="w-3 h-3" />
                <span>DISKON SETIAP HARI</span>
              </div>
              <h3 className="font-display font-bold text-base text-[#4A3A3A]">
                Cantik Makin Hemat ✨
              </h3>
              <p className="text-xs text-[#9A8585]">
                Temukan berbagai produk dengan penawaran spesial setiap hari.
                Yuk, cek dan temukan favoritmu!
              </p>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-[#F49A9D]">
              {" "}
              <DiscIcon className="w-4 h-4 text-emerald-500" />{" "}
              <span>Diskon Menarik Setiap Hari</span>{" "}
            </div>
          </motion.div>

          {/* Bento Sub-Tile 2: Fast Delivery & Packaging Guarantee (4 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-12 sm:col-span-6 lg:col-span-4 bg-white rounded-[2rem] p-6 border border-[#FEBCBD]/40 shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-2xl bg-pink-50 flex items-center justify-center text-[#F49A9D]">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-[#4A3A3A]">
                  Packaging Estetik & Aman 🎀
                </h4>
                <p className="text-xs text-[#9A8585] mt-1 leading-relaxed">
                  Setiap pesanan dikemas dengan box pink eksklusif, bubble wrap
                  tebal, dan pita manis.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#F49A9D]">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Garansi 100% Produk Original</span>
            </div>
          </motion.div>

          {/* Bento Sub-Tile 3: Shopping Guide / Catalog Fast-Link (4 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="col-span-12 lg:col-span-4 bg-gradient-to-tr from-[#FFF9F9] to-[#FFF1F1] rounded-[2rem] p-6 border border-[#FEBCBD]/40 shadow-xs flex flex-col justify-between cursor-pointer group"
            onClick={() => router.push("/products")}
          >
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[10px] font-extrabold text-[#4A3A3A] shadow-2xs">
                <Sparkles className="w-3 h-3 text-[#F49A9D]" />
                <span>SEMUA KOLEKSI</span>
              </div>
              <h4 className="font-display font-bold text-base text-[#4A3A3A] group-hover:text-[#F49A9D] transition-colors">
                Jelajahi Lebih dari 50+ Produk Cantik
              </h4>
              <p className="text-xs text-[#9A8585]">
                Mulai dari Skincare, Dress, Tas, hingga Aksesoris Mutiara.
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between pt-2 border-t border-pink-100">
              <span className="text-xs font-bold text-[#F49A9D]">
                Lihat Katalog Lengkap
              </span>
              <div className="w-7 h-7 rounded-full bg-[#FEBCBD] flex items-center justify-center text-[#4A3A3A] group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Bento Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#F49A9D] block mb-1">
              Kategori Pilihan
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#4A3A3A]">
              Jelajahi Berdasarkan Kategori 💕
            </h2>
          </div>
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="text-xs font-bold text-[#F49A9D] hover:underline flex items-center gap-1"
          >
            Semua Kategori <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -4 }}
              onClick={() => router.push(`/products?category=${cat.slug}`)}
              className="group bg-white rounded-[1.75rem] p-3.5 sm:p-4 border border-[#FEBCBD]/40 shadow-xs hover:shadow-md hover:shadow-[#FEBCBD]/20 transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
            >
              <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-2xl overflow-hidden bg-pink-50 mb-3 group-hover:scale-105 transition-transform duration-300 border border-[#FEBCBD]/30">
                <img
                  src={
                    cat.image ||
                    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600"
                  }
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-semibold text-xs sm:text-sm text-[#4A3A3A] group-hover:text-[#F49A9D] transition-colors leading-tight">
                {cat.name}
              </h3>
              <span className="text-[10px] text-[#9A8585] mt-1 flex items-center gap-0.5 group-hover:text-[#F49A9D]">
                Lihat <ArrowRight className="w-2.5 h-2.5" />
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#F49A9D] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pilihan Khusus</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#4A3A3A]">
              Featured Products 💕
            </h2>
          </div>
          <button
            type="button"
            onClick={() => router.push("/products?filter=featured")}
            className="text-xs font-bold text-[#4A3A3A] hover:text-[#F49A9D] flex items-center gap-1 group"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promo Banner Bento Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2rem] bg-gradient-to-r from-[#FEBCBD] via-[#F49A9D] to-[#F49A9D] text-white p-8 sm:p-10 lg:p-12 overflow-hidden shadow-xl shadow-[#FEBCBD]/20">
          <div className="absolute inset-0 bento-dot-pattern opacity-40 pointer-events-none" />
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/20 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
              <Flame className="w-4 h-4" />
              <span>Promo Spesial Bulan Ini</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold leading-tight drop-shadow-xs">
              Cantik Maksimal, Hemat hingga 30% ✨
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Dapatkan diskon istimewa untuk skincare rosewater, gaun floral,
              dan perhiasan mutiara air tawar original. Stok terbatas!
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => router.push("/products")}
                className="px-6 sm:px-8 py-3 rounded-full bg-white text-[#4A3A3A] font-bold text-xs sm:text-sm shadow-md hover:bg-[#FFF9F9] transition-all hover:scale-105"
              >
                Klaim Promo Sekarang 💕
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Bento Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#F49A9D] mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Paling Diminati</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#4A3A3A]">
              Best Sellers 🌸
            </h2>
          </div>
          <button
            type="button"
            onClick={() => router.push("/products?filter=best_seller")}
            className="text-xs font-bold text-[#4A3A3A] hover:text-[#F49A9D] flex items-center gap-1 group"
          >
            <span>Lihat Semua Best Seller</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* New Arrivals Bento Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#F49A9D] mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Rilisan Terbaru</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#4A3A3A]">
              New Arrivals ✨
            </h2>
          </div>
          <button
            type="button"
            onClick={() => router.push("/products?sort=newest")}
            className="text-xs font-bold text-[#4A3A3A] hover:text-[#F49A9D] flex items-center gap-1 group"
          >
            <span>Lihat Produk Terbaru</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
