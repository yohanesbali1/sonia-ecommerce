'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Star, Sparkles, Heart } from 'lucide-react';
import { Product } from '@/types';
import { formatRupiah } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const router = useRouter();
  const hasDiscount = Boolean(product.discount_price && product.discount_price > 0 && product.discount_price < product.price);
  const currentPrice = hasDiscount ? product.discount_price! : product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discount_price!) / product.price) * 100)
    : 0;

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
  };

  const imageSrc = product.images?.[0] || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80';

  return (
    <motion.div
      id={`product-card-${product.id}`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onClick={() => router.push(`/products/${product.slug}`)}
      className="group relative bg-white rounded-[1.75rem] p-3.5 border border-[#FEBCBD]/40 shadow-xs hover:shadow-xl hover:shadow-[#FEBCBD]/20 transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden"
    >
      {/* Top Badges & Image Frame */}
      <div className="relative aspect-square sm:aspect-[4/5] rounded-2xl overflow-hidden bg-pink-50/60 mb-3 flex items-center justify-center">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Gradient Overlay for subtle contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges Container */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#F49A9D] text-white uppercase shadow-xs">
              -{discountPercent}%
            </span>
          )}
          {product.best_seller && (
            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#FEBCBD] text-[#4A3A3A] shadow-xs flex items-center gap-1 backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-[#4A3A3A]" /> Best Seller
            </span>
          )}
          {product.featured && !product.best_seller && (
            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-white/95 text-[#4A3A3A] shadow-xs flex items-center gap-1">
              <Heart className="w-3 h-3 text-[#F49A9D] fill-[#FEBCBD]" /> New
            </span>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-2xs flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-[#4A3A3A] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
              Habis Terjual
            </span>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col flex-1 justify-between px-1">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-[#9A8585] mb-1">
            <span className="truncate text-[11px] text-pink-400 font-semibold">{product.category_name || 'Boutique'}</span>
            <div className="flex items-center gap-1 text-amber-500 font-medium shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px]">{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
            </div>
          </div>

          {/* Product Name */}
          <h4 className="font-semibold text-[#4A3A3A] text-xs sm:text-sm line-clamp-1 group-hover:text-[#F49A9D] transition-colors leading-snug mb-1">
            {product.name}
          </h4>
        </div>

        {/* Price & Add to Cart Button */}
        <div className="pt-2 border-t border-pink-50 mt-1 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-[10px] text-[#9A8585] line-through leading-none">
                {formatRupiah(product.price)}
              </span>
            )}
            <span className="text-xs sm:text-sm font-bold text-[#F49A9D]">
              {formatRupiah(currentPrice)}
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.92 }}
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`py-1.5 px-3 rounded-full text-[11px] font-bold border transition-all duration-200 flex items-center gap-1 ${
              isOutOfStock
                ? 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed'
                : 'border-pink-200 text-pink-500 hover:bg-[#F49A9D] hover:border-[#F49A9D] hover:text-white shadow-2xs'
            }`}
            title="Tambah ke keranjang"
          >
            <ShoppingBag className="w-3 h-3" />
            <span className="hidden sm:inline">Beli</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
