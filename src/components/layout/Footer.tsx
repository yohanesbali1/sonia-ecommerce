'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw, MessageSquare } from 'lucide-react';
import { BrandLogo } from '@/components/layout/BrandLogo';

export const Footer: React.FC = () => {
  const router = useRouter();

  return (
    <footer className="bg-white border-t border-[#FEBCBD]/40 mt-16 pt-12 pb-8 text-[#4A3A3A]">
      {/* Values / USP Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-[#FFF9F9] rounded-3xl p-6 border border-[#FEBCBD]/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF1F1] flex items-center justify-center text-[#F49A9D] shrink-0 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#4A3A3A]">100% Produk Original</h4>
              <p className="text-xs text-[#9A8585]">Kualitas butik terjamin & elegan</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF1F1] flex items-center justify-center text-[#F49A9D] shrink-0 shadow-xs">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#4A3A3A]">Pengiriman Cepat & Aman</h4>
              <p className="text-xs text-[#9A8585]">Packaging rapi ke seluruh Indonesia</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF1F1] flex items-center justify-center text-[#F49A9D] shrink-0 shadow-xs">
              <MessageSquare className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#4A3A3A]">Pemesanan Cepat via WA</h4>
              <p className="text-xs text-[#9A8585]">Checkout langsung terhubung ke WhatsApp Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#FFF1F1]">
        {/* Col 1: Brand Info */}
        <div className="space-y-4">
          <BrandLogo size="md" showText={true} />
          <p className="text-xs text-[#9A8585] leading-relaxed">
            Destinasi belanja fashion, dress cantik, skincare, dan aksesori wanita dengan gaya feminin & chic. Menghadirkan sentuhan anggun dalam setiap penampilanmu.
          </p>
          <div className="flex items-center gap-2 text-xs text-[#4A3A3A] font-semibold bg-[#FFF1F1] px-3 py-1.5 rounded-full w-fit">
            <Sparkles className="w-3.5 h-3.5 text-[#F49A9D]" />
            <span>Order Praktis Langsung ke WhatsApp 💕</span>
          </div>
        </div>

        {/* Col 2: Kategori Populer */}
        <div>
          <h4 className="font-display font-bold text-sm text-[#4A3A3A] mb-4">Koleksi Pilihan</h4>
          <ul className="space-y-2.5 text-xs text-[#9A8585] font-medium">
            <li>
              <button
                type="button"
                onClick={() => router.push('/products?category=skincare-glow')}
                className="hover:text-[#F49A9D] transition-colors cursor-pointer"
              >
                Skincare & Glow Serum
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => router.push('/products?category=makeup-beauty')}
                className="hover:text-[#F49A9D] transition-colors cursor-pointer"
              >
                Makeup & Lip Tint Velvet
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => router.push('/products?category=feminine-dresses')}
                className="hover:text-[#F49A9D] transition-colors cursor-pointer"
              >
                Gaun & Dress Floral
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => router.push('/products?category=bags-accessories')}
                className="hover:text-[#F49A9D] transition-colors cursor-pointer"
              >
                Tas Pearl & Dompet Chic
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => router.push('/products?category=jewelry-pearls')}
                className="hover:text-[#F49A9D] transition-colors cursor-pointer"
              >
                Perhiasan Mutiara 18K
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Bantuan & Belanja */}
        <div>
          <h4 className="font-display font-bold text-sm text-[#4A3A3A] mb-4">Menu Navigasi</h4>
          <ul className="space-y-2.5 text-xs text-[#9A8585] font-medium">
            <li>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="hover:text-[#F49A9D] transition-colors cursor-pointer"
              >
                Beranda
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => router.push('/products')}
                className="hover:text-[#F49A9D] transition-colors cursor-pointer"
              >
                Koleksi Semua Produk
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => router.push('/products?filter=best_seller')}
                className="hover:text-[#F49A9D] transition-colors cursor-pointer"
              >
                Produk Terlaris (Best Seller)
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => router.push('/admin/login')}
                className="font-bold text-[#F49A9D] hover:underline transition-colors cursor-pointer"
              >
                Kelola Toko (Admin Panel)
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Kontak & Info */}
        <div className="space-y-3">
          <h4 className="font-display font-bold text-sm text-[#4A3A3A] mb-4">Kontak & Alamat</h4>
          <div className="flex items-start gap-2 text-xs text-[#9A8585]">
            <MapPin className="w-4 h-4 text-[#F49A9D] shrink-0 mt-0.5" />
            <span>Jl. Sunset Road No. 88, Seminyak, Kuta, Bali</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#9A8585]">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>0812-3456-7890 (WhatsApp Admin)</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#9A8585]">
            <Mail className="w-4 h-4 text-[#F49A9D] shrink-0" />
            <span>order@soniabalishop.com</span>
          </div>

          <div className="pt-2">
            <span className="text-[11px] font-bold text-[#4A3A3A] block mb-1">Menerima Pembayaran Transfer:</span>
            <div className="flex items-center gap-2 text-[11px] text-[#9A8585] font-mono">
              <span className="px-2 py-1 bg-[#FFF9F9] rounded-md border border-[#FEBCBD]/40 font-bold text-[#4A3A3A]">BCA</span>
              <span className="px-2 py-1 bg-[#FFF9F9] rounded-md border border-[#FEBCBD]/40 font-bold text-[#4A3A3A]">MANDIRI</span>
              <span className="px-2 py-1 bg-[#FFF9F9] rounded-md border border-[#FEBCBD]/40 font-bold text-[#4A3A3A]">QRIS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#9A8585] gap-3">
        <p>© 2026 SONIABALISHOP. Seluruh hak cipta dilindungi.</p>
        <p className="flex items-center gap-1 font-medium">
          Dibuat dengan penuh cinta untuk wanita Indonesia 💕
        </p>
      </div>
    </footer>
  );
};
