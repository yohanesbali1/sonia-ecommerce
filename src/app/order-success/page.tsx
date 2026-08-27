'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  MapPin,
  User,
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  let orderData: Record<string, unknown> | null = null;
  const orderParam = searchParams.get('order');
  if (orderParam) {
    try {
      orderData = JSON.parse(decodeURIComponent(orderParam));
    } catch {
      orderData = null;
    }
  }

  const orderNumber =
    (orderData?.order_number as string) || `SBL-${Math.floor(100000 + Math.random() * 900000)}`;
  const customerName = (orderData?.customer_name as string) || 'Pelanggan Setia';
  const whatsapp = (orderData?.whatsapp as string) || '-';
  const address = (orderData?.address as string) || '-';
  const city = (orderData?.city as string) || '';
  const province = (orderData?.province as string) || '';
  const items = (orderData?.items as Array<{ product_name: string; name: string; quantity: number; price: number }>) || [];
  const grandTotal = (orderData?.grand_total as number) || (orderData?.total as number) || 0;
  const shippingCost = (orderData?.shipping_cost as number) ?? 15000;
  const subtotal =
    (orderData?.subtotal as number) || (grandTotal > shippingCost ? grandTotal - shippingCost : grandTotal);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl p-6 sm:p-10 border border-[#FEBCBD]/50 shadow-xl shadow-[#FEBCBD]/20 text-center space-y-5 relative overflow-hidden"
      >
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-pink-100/60 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-emerald-100/60 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col items-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-400 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30"
          >
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </motion.div>

          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Pesanan Berhasil Terkirim ke WhatsApp
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#4A3A3A]">
              Terima Kasih, {customerName}! 💕
            </h1>
            <p className="text-xs sm:text-sm text-[#9A8585] max-w-md mx-auto leading-relaxed">
              Pesananmu telah diteruskan ke WhatsApp Admin{' '}
              <strong>SONIABALISHOP</strong>. Admin kami akan segera mengonfirmasi ketersediaan
              barang dan rincian pembayarannya.
            </p>
          </div>

          <div className="p-3 bg-[#FFF9F9] rounded-2xl border border-[#FEBCBD]/40 font-mono text-xs text-[#4A3A3A] font-bold">
            No. Referensi: <span className="text-[#F49A9D]">{orderNumber}</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-[#FEBCBD]/40 shadow-xs space-y-6"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#FFF1F1]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#F49A9D]" />
            <h2 className="font-display font-bold text-base text-[#4A3A3A]">Rincian Pesanan</h2>
          </div>
          <span className="text-xs font-medium text-[#9A8585]">
            Status:{' '}
            <span className="font-bold text-emerald-600">Menunggu Konfirmasi Admin WA</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/30 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-[#4A3A3A] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#F49A9D]" />
              Penerima
            </span>
            <p className="text-[#9A8585]">{customerName}</p>
            <p className="text-[#9A8585] font-mono">{whatsapp}</p>
          </div>

          <div className="space-y-1">
            <span className="font-bold text-[#4A3A3A] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#F49A9D]" />
              Alamat Pengiriman
            </span>
            <p className="text-[#9A8585] leading-relaxed">
              {address}
              {city ? `, ${city}` : ''}
              {province ? `, ${province}` : ''}
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#4A3A3A] uppercase tracking-wider">
              Produk yang Dipesan ({items.length} Item)
            </h3>
            <div className="divide-y divide-pink-50 border border-pink-100/60 rounded-2xl p-3 bg-white">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-[#4A3A3A]">
                      {item.product_name || item.name || `Produk ${idx + 1}`}
                    </p>
                    <p className="text-[11px] text-[#9A8585]">
                      {item.quantity} pcs × {formatRupiah(item.price)}
                    </p>
                  </div>
                  <span className="font-bold text-[#4A3A3A]">
                    {formatRupiah(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-[#FFF1F1] space-y-2 text-xs">
          {subtotal > 0 && (
            <div className="flex justify-between text-[#9A8585]">
              <span>Subtotal Produk</span>
              <span className="font-semibold text-[#4A3A3A]">{formatRupiah(subtotal)}</span>
            </div>
          )}
          <div className="flex justify-between text-[#9A8585]">
            <span>Ongkos Kirim</span>
            <span className="font-semibold text-[#4A3A3A]">{formatRupiah(shippingCost)}</span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-[#4A3A3A] pt-2 border-t border-pink-100">
            <span>Total Pembayaran</span>
            <span className="text-[#F49A9D]">{formatRupiah(grandTotal)}</span>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-2">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#FEBCBD] hover:bg-[#F49A9D] text-[#4A3A3A] font-bold text-xs sm:text-sm shadow-md shadow-[#FEBCBD]/40 transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Kembali Belanja di Toko</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => router.push('/products')}
          className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-[#FFF1F1] border border-[#FEBCBD]/60 text-[#4A3A3A] font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4 text-[#F49A9D]" />
          <span>Lihat Produk Lainnya</span>
        </button>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FEBCBD] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
