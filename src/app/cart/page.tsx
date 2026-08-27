'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatRupiah } from '@/lib/utils';
import { EmptyState } from '@/components/ui/EmptyState';

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          title="Keranjang Belanjamu Masih Kosong 💕"
          description="Yuk telusuri koleksi fashion, beauty, dan perhiasan manis kami untuk mengisi keranjangmu."
          actionText="Mulai Belanja Sekarang ✨"
          onAction={() => router.push('/products')}
          icon="bag"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            type="button"
            onClick={() => router.push('/products')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9A8585] hover:text-[#4A3A3A] mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Lanjut Berbelanja</span>
          </button>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#4A3A3A]">
            Keranjang Belanja ({totalItems} item) 💕
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items Table */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => {
            const price =
              item.product.discount_price && item.product.discount_price > 0
                ? item.product.discount_price
                : item.product.price;
            const itemTotal = price * item.quantity;

            return (
              <motion.div
                layout
                key={item.product.id}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-[#FEBCBD]/40 shadow-xs flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={
                      item.product.images?.[0] ||
                      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800'
                    }
                    alt={item.product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-[#FFF1F1] shrink-0 border border-[#FEBCBD]/30 cursor-pointer"
                    onClick={() => router.push(`/products/${item.product.slug}`)}
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-[11px] font-semibold text-[#F49A9D] uppercase tracking-wider block">
                      {item.product.category_name || 'Butik'}
                    </span>
                    <h3
                      onClick={() => router.push(`/products/${item.product.slug}`)}
                      className="font-semibold text-sm sm:text-base text-[#4A3A3A] hover:text-[#F49A9D] cursor-pointer transition-colors leading-snug"
                    >
                      {item.product.name}
                    </h3>
                    <span className="text-xs text-[#9A8585] block mt-1">
                      Harga Satuan: <strong>{formatRupiah(price)}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-[#FFF1F1]">
                  {/* Quantity Counter */}
                  <div className="flex items-center gap-2 bg-[#FFF9F9] rounded-full p-1 border border-[#FEBCBD]/50">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center bg-white text-[#4A3A3A] hover:bg-[#FEBCBD] transition-colors shadow-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-[#4A3A3A]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      disabled={item.quantity >= item.product.stock}
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center bg-white text-[#4A3A3A] hover:bg-[#FEBCBD] transition-colors shadow-xs disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <span className="text-xs text-[#9A8585] block">Total</span>
                    <span className="text-sm sm:text-base font-bold text-[#4A3A3A]">
                      {formatRupiah(itemTotal)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-[#9A8585] hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                    title="Hapus dari keranjang"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#FEBCBD]/50 shadow-sm space-y-6 sticky top-28">
          <h2 className="font-display font-bold text-lg text-[#4A3A3A] pb-3 border-b border-[#FFF1F1]">
            Ringkasan Pesanan
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-[#9A8585]">
              <span>Total Produk ({totalItems} item)</span>
              <span className="font-semibold text-[#4A3A3A]">{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#9A8585]">
              <span>Estimasi Ongkir</span>
              <span className="text-[#4A3A3A]">Dihitung saat checkout</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#FFF1F1] flex justify-between items-baseline">
            <span className="font-semibold text-sm text-[#4A3A3A]">Subtotal Belanja</span>
            <span className="font-display font-extrabold text-xl text-[#4A3A3A]">
              {formatRupiah(subtotal)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => router.push('/checkout')}
            className="w-full py-3.5 px-6 rounded-full bg-[#FEBCBD] hover:bg-[#F49A9D] text-[#4A3A3A] font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FEBCBD]/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Lanjut ke Pembayaran</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-center text-[#9A8585] leading-relaxed">
            🌸 Belanja aman & cepat tanpa perlu registrasi akun.
          </p>
        </div>
      </div>
    </div>
  );
}
