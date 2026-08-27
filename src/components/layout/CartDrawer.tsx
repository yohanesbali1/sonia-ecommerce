'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatRupiah } from '@/lib/utils';

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItems,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartDrawerOpen(false)}
          className="fixed inset-0 bg-stone-900/30 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-[#FFF9F9] shadow-2xl flex flex-col border-l border-[#FEBCBD]/40"
          >
            {/* Header */}
            <div className="p-5 bg-white border-b border-[#FFF1F1] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#FFF1F1] flex items-center justify-center text-[#F49A9D]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-[#4A3A3A]">
                    Keranjang Cantik 💕
                  </h3>
                  <p className="text-xs text-[#9A8585]">
                    {totalItems} item terpilih untukmu
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(false)}
                className="p-2 rounded-full text-[#9A8585] hover:text-[#4A3A3A] hover:bg-[#FFF1F1] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-[#FFF1F1] flex items-center justify-center text-[#FEBCBD] mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="font-medium text-[#4A3A3A] mb-1">
                    Keranjangmu masih kosong 💕
                  </p>
                  <p className="text-xs text-[#9A8585] max-w-xs mb-6">
                    Yuk cari produk favoritmu dari koleksi terbaru kami!
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      router.push('/products');
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#FEBCBD] hover:bg-[#F49A9D] text-[#4A3A3A] text-sm font-semibold transition-all shadow-sm"
                  >
                    Mulai Belanja ✨
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const price =
                    item.product.discount_price && item.product.discount_price > 0
                      ? item.product.discount_price
                      : item.product.price;
                  const itemSubtotal = price * item.quantity;

                  return (
                    <motion.div
                      layout
                      key={item.product.id}
                      className="bg-white rounded-2xl p-3.5 border border-[#FEBCBD]/30 shadow-xs flex gap-3 items-center"
                    >
                      <img
                        src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800'}
                        alt={item.product.name}
                        className="w-18 h-18 rounded-xl object-cover bg-[#FFF1F1] shrink-0"
                        referrerPolicy="no-referrer"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-[#4A3A3A] line-clamp-1 leading-snug">
                            {item.product.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-[#9A8585] hover:text-rose-600 p-1 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-xs font-bold text-[#4A3A3A] mt-0.5">
                          {formatRupiah(price)}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#FFF1F1]">
                          <div className="flex items-center gap-1.5 bg-[#FFF9F9] rounded-full p-0.5 border border-[#FEBCBD]/40">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity - 1)
                              }
                              className="w-6 h-6 rounded-full flex items-center justify-center bg-white text-[#4A3A3A] hover:bg-[#FFF1F1] text-xs shadow-xs"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-semibold text-[#4A3A3A]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              disabled={item.quantity >= item.product.stock}
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1)
                              }
                              className="w-6 h-6 rounded-full flex items-center justify-center bg-white text-[#4A3A3A] hover:bg-[#FFF1F1] text-xs shadow-xs disabled:opacity-40"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs font-semibold text-[#F49A9D]">
                            {formatRupiah(itemSubtotal)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer / Checkout Button */}
            {cart.length > 0 && (
              <div className="p-5 bg-white border-t border-[#FFF1F1] space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#9A8585]">Subtotal ({totalItems} item)</span>
                  <span className="font-display font-bold text-lg text-[#4A3A3A]">
                    {formatRupiah(subtotal)}
                  </span>
                </div>
                <p className="text-[11px] text-[#9A8585]">
                  *Ongkos kirim akan dihitung pada halaman checkout
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    router.push('/checkout');
                  }}
                  className="w-full py-3.5 px-6 rounded-full bg-[#FEBCBD] hover:bg-[#F49A9D] text-[#4A3A3A] font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FEBCBD]/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Lanjut ke Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
