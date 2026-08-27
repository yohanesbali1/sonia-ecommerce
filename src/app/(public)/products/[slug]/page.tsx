'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  Heart,
  Star,
  ShoppingBag,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Plus,
  Minus,
  CheckCircle,
  Share2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Product } from '@/types';
import { getProductDetail } from '@/services/product.service';
import { formatRupiah } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { ProductCard } from '@/components/product/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart, setIsCartDrawerOpen } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const res = await getProductDetail(slug);
        setProduct(res.product);
        setRecommendations(res.recommendations);
        setSelectedImageIndex(0);
        setQuantity(1);
      } catch (err: unknown) {
        showToast(err instanceof Error ? err.message : 'Gagal memuat produk', 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-[4/5] bg-white rounded-3xl border border-[#FEBCBD]/40" />
          <div className="space-y-4">
            <div className="h-4 bg-[#FFF1F1] w-1/4 rounded-full" />
            <div className="h-8 bg-[#FFF1F1] w-3/4 rounded-full" />
            <div className="h-6 bg-[#FFF1F1] w-1/3 rounded-full" />
            <div className="h-32 bg-[#FFF1F1] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-[#9A8585] mb-4">Produk tidak ditemukan 💕</p>
        <button
          type="button"
          onClick={() => router.push('/products')}
          className="px-6 py-2.5 rounded-full bg-[#FEBCBD] text-[#4A3A3A] font-semibold text-sm"
        >
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  const hasDiscount = Boolean(
    product.discount_price &&
      product.discount_price > 0 &&
      product.discount_price < product.price
  );
  const currentPrice = hasDiscount ? product.discount_price! : product.price;
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    router.push('/checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Tautan produk berhasil disalin 💕', 'pink');
    }
  };

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => router.push('/products')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#9A8585] hover:text-[#4A3A3A] transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Kembali ke Katalog Produk</span>
      </button>

      {/* Main Product Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            key={selectedImageIndex}
            className="aspect-[4/5] rounded-3xl overflow-hidden bg-white border border-[#FEBCBD]/40 shadow-md relative"
          >
            <img
              src={images[selectedImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-rose-500 text-white font-bold text-xs rounded-full shadow-sm">
                Hemat {formatRupiah(product.price - product.discount_price!)}
              </span>
            )}
          </motion.div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-[#F49A9D] shadow-md scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${idx}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header & Badges */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F49A9D] bg-[#FFF1F1] px-3 py-1 rounded-full">
                {product.category_name || 'Koleksi Butik'}
              </span>
              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-full text-[#9A8585] hover:text-[#4A3A3A] hover:bg-[#FFF1F1] transition-colors"
                title="Bagikan Produk"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#4A3A3A] leading-tight">
              {product.name}
            </h1>

            {/* Rating & Stock status */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-semibold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating ? product.rating.toFixed(1) : '5.0'} / 5.0</span>
                <span className="text-[#9A8585] font-normal">(Ulasan Pelanggan)</span>
              </div>

              <span className="text-stone-300">•</span>

              <div className="flex items-center gap-1.5 font-medium">
                {product.stock > 0 ? (
                  <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Stok Tersedia ({product.stock} pcs)
                  </span>
                ) : (
                  <span className="text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full">
                    Stok Habis
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-white border border-[#FEBCBD]/40 shadow-xs flex items-baseline gap-3">
            <span className="font-display text-3xl font-extrabold text-[#4A3A3A]">
              {formatRupiah(currentPrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-[#9A8585] line-through">
                {formatRupiah(product.price)}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#4A3A3A]">
              Deskripsi Produk
            </h3>
            <p className="text-sm text-[#9A8585] leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div className="space-y-2 pt-2 border-t border-[#FFF1F1]">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4A3A3A] block">
                Jumlah Pesanan
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white rounded-full p-1 border border-[#FEBCBD]/50 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FFF9F9] text-[#4A3A3A] hover:bg-[#FEBCBD] transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-[#4A3A3A]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    disabled={quantity >= product.stock}
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FFF9F9] text-[#4A3A3A] hover:bg-[#FEBCBD] transition-colors disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-[#9A8585]">
                  Subtotal:{' '}
                  <strong className="text-[#4A3A3A]">{formatRupiah(currentPrice * quantity)}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className="flex-1 py-3.5 px-6 rounded-full bg-[#FFF1F1] hover:bg-[#FEBCBD]/60 text-[#4A3A3A] font-bold text-sm flex items-center justify-center gap-2 border border-[#FEBCBD] transition-all disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4 text-[#F49A9D]" />
              <span>+ Tambah ke Keranjang</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              disabled={isOutOfStock}
              onClick={handleBuyNow}
              className="flex-1 py-3.5 px-6 rounded-full bg-[#FEBCBD] hover:bg-[#F49A9D] text-[#4A3A3A] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FEBCBD]/40 transition-all disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-[#4A3A3A]" />
              <span>Beli Sekarang 💕</span>
            </motion.button>
          </div>

          {/* Guarantees Mini */}
          <div className="grid grid-cols-2 gap-3 pt-4 text-xs text-[#9A8585] border-t border-[#FFF1F1]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#F49A9D]" />
              <span>Siap Kirim ke Seluruh Indonesia</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F49A9D]" />
              <span>Garansi 100% Produk Original</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div className="pt-12 border-t border-[#FEBCBD]/30 space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#F49A9D]" />
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#4A3A3A]">
              Rekomendasi Produk Serupa 💕
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((rec) => (
              <ProductCard key={rec.id} product={rec} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
