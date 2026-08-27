'use client';

import React, { useEffect, useState } from 'react';
import { Save, Store, CreditCard, Truck, Phone, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import { StoreSettings } from '@/types';
import { getStoreSettings, updateAdminSettings } from '@/services/payment.service';
import { useToast } from '@/context/ToastContext';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>({
    store_name: 'SONIABALISHOP',
    tagline: 'Fashion, Beauty & Chic Boutique Collection 💕',
    logo: '',
    whatsapp: '081234567890',
    email: 'order@soniabalishop.com',
    address: 'Jl. Sunset Road No. 88, Seminyak, Kuta, Bali',
    bank_name: 'Bank BCA',
    bank_account_number: '8271039482',
    bank_account_holder: 'SONIABALISHOP',
    secondary_bank_name: 'Bank Mandiri',
    secondary_account_number: '1270009847123',
    secondary_account_holder: 'SONIABALISHOP',
    default_shipping_cost: 15000,
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getStoreSettings();
        setSettings(data);
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await updateAdminSettings(settings);
      setSettings(res.settings);
      showToast('Pengaturan toko & WhatsApp berhasil disimpan 💕', 'pink');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Gagal menyimpan pengaturan', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-[#9A8585] space-y-2">
        <div className="w-8 h-8 mx-auto border-3 border-[#FEBCBD] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs">Memuat pengaturan toko...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#4A3A3A]">
          Pengaturan Toko & WhatsApp 💕
        </h1>
        <p className="text-xs text-[#9A8585]">
          Kelola nomor WhatsApp penerima pesanan langsung, identitas toko, nomor rekening, dan tarif pengiriman.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-gradient-to-br from-emerald-500/10 via-pink-50 to-white rounded-3xl p-6 border-2 border-emerald-300/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-emerald-200/60">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm sm:text-base text-[#4A3A3A] flex items-center gap-2">
                <span>Nomor WhatsApp Penerima Pesanan (Order WA)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                  Otomatis Terhubung
                </span>
              </h2>
              <p className="text-[11px] text-[#9A8585]">
                Ketika pelanggan klik &quot;Kirim Pesanan&quot;, sistem akan langsung mengalihkan pesanan ke nomor ini.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-6 space-y-1.5">
              <label className="font-bold text-xs text-[#4A3A3A] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nomor WhatsApp Admin / Toko</span>
                <span className="text-rose-500 font-bold">*</span>
              </label>
              <input
                type="text"
                name="whatsapp"
                required
                value={settings.whatsapp}
                onChange={handleChange}
                placeholder="Contoh: 081234567890 atau 6281234567890"
                className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-emerald-400 font-bold font-mono text-sm text-[#4A3A3A] focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
              />
              <span className="text-[11px] text-emerald-700 font-medium block">
                ✓ Bisa format 08... atau 628... Sistem akan otomatis menyesuaikan link wa.me.
              </span>
            </div>

            <div className="sm:col-span-6 bg-white p-4 rounded-2xl border border-emerald-200 text-xs text-[#4A3A3A] space-y-1.5">
              <span className="font-bold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Alur Pemesanan Langsung:
              </span>
              <p className="text-[11px] text-[#9A8585] leading-relaxed">
                Pelanggan mengisi nama & alamat checkout → klik &quot;Kirim Pesanan ke WhatsApp&quot; → Chat WhatsApp terbuka otomatis dengan format teks lengkap berisi data pembeli, rincian produk, dan total bayar.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#FEBCBD]/40 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#FFF1F1]">
            <Store className="w-5 h-5 text-[#F49A9D]" />
            <h2 className="font-display font-semibold text-base text-[#4A3A3A]">
              Profil Toko & Informasi Umum
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-[#4A3A3A]">Nama Toko</label>
              <input
                type="text"
                name="store_name"
                value={settings.store_name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs font-bold text-[#4A3A3A] focus:outline-hidden focus:border-[#F49A9D]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#4A3A3A]">Tagline Toko</label>
              <input
                type="text"
                name="tagline"
                value={settings.tagline}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden focus:border-[#F49A9D]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#4A3A3A]">Email Toko (Opsional)</label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden focus:border-[#F49A9D]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[#4A3A3A]">Lokasi / Alamat Toko</label>
              <input
                type="text"
                name="address"
                value={settings.address}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden focus:border-[#F49A9D]"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#FEBCBD]/40 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#FFF1F1]">
            <CreditCard className="w-5 h-5 text-[#F49A9D]" />
            <h2 className="font-display font-semibold text-base text-[#4A3A3A]">
              Informasi Rekening Bank Toko (Bila Ditampilkan)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/40 space-y-3">
              <span className="font-bold text-xs text-[#4A3A3A] block pb-1 border-b border-[#FEBCBD]/20">
                Rekening Utama (BCA)
              </span>

              <div className="space-y-1">
                <label className="font-semibold text-[#4A3A3A]">Nama Bank</label>
                <input
                  type="text"
                  name="bank_name"
                  value={settings.bank_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#4A3A3A]">Nomor Rekening</label>
                <input
                  type="text"
                  name="bank_account_number"
                  value={settings.bank_account_number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#FEBCBD]/50 font-mono font-bold text-xs text-[#4A3A3A] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#4A3A3A]">Nama Pemilik Rekening</label>
                <input
                  type="text"
                  name="bank_account_holder"
                  value={settings.bank_account_holder}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/40 space-y-3">
              <span className="font-bold text-xs text-[#4A3A3A] block pb-1 border-b border-[#FEBCBD]/20">
                Rekening Cadangan (Mandiri)
              </span>

              <div className="space-y-1">
                <label className="font-semibold text-[#4A3A3A]">Nama Bank</label>
                <input
                  type="text"
                  name="secondary_bank_name"
                  value={settings.secondary_bank_name || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#4A3A3A]">Nomor Rekening</label>
                <input
                  type="text"
                  name="secondary_account_number"
                  value={settings.secondary_account_number || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#FEBCBD]/50 font-mono font-bold text-xs text-[#4A3A3A] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#4A3A3A]">Nama Pemilik Rekening</label>
                <input
                  type="text"
                  name="secondary_account_holder"
                  value={settings.secondary_account_holder || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#FEBCBD]/40 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#FFF1F1]">
            <Truck className="w-5 h-5 text-[#F49A9D]" />
            <h2 className="font-display font-semibold text-base text-[#4A3A3A]">
              Tarif Pengiriman Ekspedisi
            </h2>
          </div>

          <div className="max-w-xs space-y-1 text-xs">
            <label className="font-semibold text-[#4A3A3A]">Ongkos Kirim Flat (Rp)</label>
            <input
              type="number"
              min={0}
              name="default_shipping_cost"
              value={settings.default_shipping_cost}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 font-bold text-xs text-[#4A3A3A] focus:outline-hidden"
            />
            <span className="text-[11px] text-[#9A8585] block">
              *Dihitung otomatis ke dalam total checkout
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 rounded-full bg-[#FEBCBD] hover:bg-[#F49A9D] text-[#4A3A3A] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#FEBCBD]/40 transition-all hover:scale-105 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Pengaturan 💕'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
