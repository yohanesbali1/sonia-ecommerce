"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RefreshCw,
  MessageSquare,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { getStoreSettings } from "@/services/payment.service";
import { getCategories } from "@/services/category-product.service";

export const Footer: React.FC = () => {
  const router = useRouter();

  const [storeSettings, setStoreSettings] = React.useState<any>(null);
  const [categories, setCategories] = React.useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        // setLoading(true);
        const [storeSettings, categories] = await Promise.all([
          getStoreSettings(),
          getCategories(),
        ]);
        setStoreSettings(storeSettings);
        setCategories(categories);
      } catch (err) {
        console.error("Error loading home data:", err);
      } finally {
        // setLoading(false);
      }
    }
    loadData();
  }, []);

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
              <h4 className="font-bold text-sm text-[#4A3A3A]">
                100% Produk Original
              </h4>
              <p className="text-xs text-[#9A8585]">
                Kualitas butik terjamin & elegan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF1F1] flex items-center justify-center text-[#F49A9D] shrink-0 shadow-xs">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#4A3A3A]">
                Pengiriman Cepat & Aman
              </h4>
              <p className="text-xs text-[#9A8585]">
                Packaging rapi ke seluruh Indonesia
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF1F1] flex items-center justify-center text-[#F49A9D] shrink-0 shadow-xs">
              <MessageSquare className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#4A3A3A]">
                Pemesanan Cepat via WA
              </h4>
              <p className="text-xs text-[#9A8585]">
                Checkout langsung terhubung ke WhatsApp Admin
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#FFF1F1]">
        <div className="space-y-4">
          <BrandLogo size="md" showText={true} />
          <p className="text-xs text-[#9A8585] leading-relaxed">
            Destinasi belanja fashion, dress cantik, skincare, dan aksesori
            wanita dengan gaya feminin & chic. Menghadirkan sentuhan anggun
            dalam setiap penampilanmu.
          </p>
          <div className="flex items-center gap-2 text-xs text-[#4A3A3A] font-semibold bg-[#FFF1F1] px-3 py-1.5 rounded-full w-fit">
            <Sparkles className="w-3.5 h-3.5 text-[#F49A9D]" />
            <span>Order Praktis Langsung ke WhatsApp 💕</span>
          </div>
        </div>

        <div>
          <h4 className="font-display font-bold text-sm text-[#4A3A3A] mb-4">
            Koleksi Pilihan
          </h4>
          <ul className="space-y-2.5 text-xs text-[#9A8585] font-medium">
            {categories.length > 0 ? (
              categories.slice(0, 4).map((cat) => (
                <li key={cat.id} className="truncate">
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/products?category=${cat.slug}`)
                    }
                    className="hover:text-[#F49A9D] transition-colors cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))
            ) : (
              <li className="text-xs text-[#9A8585]">
                Tidak ada kategori tersedia
              </li>
            )}
          </ul>
        </div>

        {/* Col 3: Bantuan & Belanja */}
        <div>
          <h4 className="font-display font-bold text-sm text-[#4A3A3A] mb-4">
            Menu Navigasi
          </h4>
          <ul className="space-y-2.5 text-xs text-[#9A8585] font-medium">
            <li>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="hover:text-[#F49A9D] transition-colors cursor-pointer"
              >
                Beranda
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => router.push("/products")}
                className="hover:text-[#F49A9D] transition-colors cursor-pointer"
              >
                Koleksi Semua Produk
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => router.push("/products?filter=best_seller")}
                className="hover:text-[#F49A9D] transition-colors cursor-pointer"
              >
                Produk Terlaris (Best Seller)
              </button>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-display font-bold text-sm text-[#4A3A3A] mb-4">
            Kontak & Alamat
          </h4>
          <div className="flex items-start gap-2 text-xs text-[#9A8585]">
            <MapPin className="w-4 h-4 text-[#F49A9D] shrink-0 mt-0.5" />
            <span>{storeSettings?.address || "-"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#9A8585]">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{storeSettings?.whatsapp ?? "-"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#9A8585]">
            <Mail className="w-4 h-4 text-[#F49A9D] shrink-0" />
            <span>{storeSettings?.email ?? "-"}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#9A8585] gap-3">
        <p>© 2026 SONIABALISHOP. Seluruh hak cipta dilindungi.</p>
        <p className="flex items-center gap-1 font-medium">
          Dibuat dengan penuh cinta untuk wanita Indonesia 💕
        </p>
      </div>
    </footer>
  );
};
