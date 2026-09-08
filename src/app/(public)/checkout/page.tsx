'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  MessageSquare,
  Send,
  MapPin,
  User,
  Phone,
  FileText,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ExternalLink,
  RotateCw,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { getStoreSettings, submitCheckout } from '@/services/payment.service';
import { StoreSettings, Order } from '@/types';
import { formatRupiah } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();
  const { showToast } = useToast();

  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Customer Form Fields
  const [formData, setFormData] = useState({
    customer_name: '',
    whatsapp: '',
    email: '',
    address: '',
    city: '',
    province: '',
    postal_code: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // WhatsApp Sending Confirmation & Status States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeWaUrl, setActiveWaUrl] = useState('');
  const [checkoutErrorNotice, setCheckoutErrorNotice] = useState<string | null>(null);
  const [pendingOrderPayload, setPendingOrderPayload] = useState<any>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getStoreSettings();
        setSettings(data);
      } catch (err) {
        console.error('Failed to load settings', err);
      }
    }
    loadSettings();
  }, []);

  if (cart.length === 0 && !showConfirmModal) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-pink-50 flex items-center justify-center text-[#F49A9D]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-display text-2xl font-bold text-[#4A3A3A]">
          Keranjang belanjamu kosong 💕
        </h2>
        <p className="text-xs sm:text-sm text-[#9A8585] max-w-md mx-auto">
          Kamu belum memilih produk. Yuk jelajahi koleksi busana, kecantikan, dan aksesori favoritmu!
        </p>
        <button
          type="button"
          onClick={() => router.push('/products')}
          className="px-8 py-3 rounded-full bg-[#FEBCBD] hover:bg-[#F49A9D] text-[#4A3A3A] font-bold text-xs sm:text-sm shadow-md shadow-[#FEBCBD]/40 cursor-pointer"
        >
          Lihat Katalog Produk
        </button>
      </div>
    );
  }

  const shippingCost = 0;
  const grandTotal = subtotal + shippingCost;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (checkoutErrorNotice) {
      setCheckoutErrorNotice(null);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Nama lengkap wajib diisi';
    }
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'Nomor WhatsApp wajib diisi';
    } else if (!/^[0-9+ ]{8,16}$/.test(formData.whatsapp.trim())) {
      newErrors.whatsapp = 'Nomor WhatsApp tidak valid (contoh: 08123456789)';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Alamat pengiriman wajib diisi';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'Kota/Kabupaten wajib diisi';
    }
    if (!formData.province.trim()) {
      newErrors.province = 'Provinsi wajib diisi';
    }
    if (!formData.postal_code.trim()) {
      newErrors.postal_code = 'Kode pos wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCleanWhatsApp = (rawNumber: string) => {
    let clean = rawNumber.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    } else if (!clean.startsWith('62')) {
      clean = '62' + clean;
    }
    return clean;
  };

  const handleInitiateWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Mohon lengkapi seluruh data pengiriman yang bertanda bintang (*)', 'error');
      return;
    }

    setCheckoutErrorNotice(null);

    // 1. Get destination WhatsApp from store settings
    const adminWa = settings?.whatsapp?.trim() || '081234567890';
    const cleanAdminWa = formatCleanWhatsApp(adminWa);

    // 2. Format item lines
    const itemsText = cart
      .map((item, idx) => {
        const itemPrice = item.product.discount_price || item.product.price;
        const itemTotal = itemPrice * item.quantity;
        return `${idx + 1}. *${item.product.name}*\n   • Jumlah: ${item.quantity} pcs\n   • Harga: ${formatRupiah(itemPrice)} (Total: ${formatRupiah(itemTotal)})`;
      })
      .join('\n\n');

    // 3. Construct the aesthetic WhatsApp order text
    const storeTitle = settings?.store_name || 'SONIABALISHOP';
    const waMessage = `🌸 *PESANAN BARU - ${storeTitle.toUpperCase()}* 🌸
----------------------------------------
👤 *DATA PEMBELI:*
• *Nama:* ${formData.customer_name.trim()}
• *No. WhatsApp:* ${formData.whatsapp.trim()}
• *Email:* ${formData.email.trim() || '-'}
• *Alamat Lengkap:* ${formData.address.trim()}
• *Kota/Kab:* ${formData.city.trim()}
• *Provinsi:* ${formData.province.trim()}
• *Kode Pos:* ${formData.postal_code.trim()}
• *Catatan Tambahan:* ${formData.notes.trim() || '-'}

🛍️ *RINCIAN PRODUK:*
${itemsText}

💰 *TOTAL PEMBAYARAN:*
• Subtotal Produk: ${formatRupiah(subtotal)}
• Ongkos Kirim: ${formatRupiah(shippingCost)}
• *TOTAL AKHIR: ${formatRupiah(grandTotal)}*
----------------------------------------
Halo Admin ${storeTitle}, saya ingin memesan barang di atas. Mohon konfirmasi ketersediaan barang dan info nomor rekening transfernya ya kak. Terima kasih! 💕`;

    // 4. Create pending order summary for success screen
    const orderDataToPass = {
      order_number: `SBL-${Date.now().toString().slice(-6)}`,
      customer_name: formData.customer_name.trim(),
      whatsapp: formData.whatsapp.trim(),
      email: formData.email.trim() || undefined,
      address: formData.address.trim(),
      city: formData.city.trim(),
      province: formData.province.trim(),
      postal_code: formData.postal_code.trim(),
      notes: formData.notes.trim() || undefined,
      subtotal: subtotal,
      shipping_cost: shippingCost,
      grand_total: grandTotal,
      items: cart.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.discount_price || item.product.price,
        quantity: item.quantity,
      })),
    };

    setPendingOrderPayload(orderDataToPass);

    // 5. Generate WhatsApp link
    const encodedMessage = encodeURIComponent(waMessage);
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanAdminWa}&text=${encodedMessage}`;
    setActiveWaUrl(waUrl);

    // 6. Open WhatsApp in new tab
    const newTab = window.open(waUrl, '_blank');
    if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
      // If popup blocked, notify gently
      showToast('Pop-up terblokir. Gunakan tombol buka WhatsApp pada dialog.', 'pink');
    }

    // 7. Show interactive confirmation dialog on checkout page
    setShowConfirmModal(true);
  };

  const handleConfirmSentWhatsApp = async () => {
    if (!pendingOrderPayload) return;

    setIsSubmitting(true);
    try {
      // 1. Sync order to backend
      const itemsPayload = cart.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      }));
      await submitCheckout({
        customer_name: formData.customer_name.trim(),
        whatsapp: formData.whatsapp.trim(),
        email: formData.email.trim() || undefined,
        address: formData.address.trim(),
        city: formData.city.trim(),
        province: formData.province.trim(),
        postal_code: formData.postal_code.trim(),
        notes: formData.notes.trim() || undefined,
        items: itemsPayload,
        payment_method: 'WhatsApp Direct Order',
      });
    } catch (err) {
      console.warn('Backend order sync note:', err);
    } finally {
      setIsSubmitting(false);
      setShowConfirmModal(false);
      clearCart();
      showToast('Pesanan berhasil terkirim ke WhatsApp 💕', 'pink');
      // Navigate to Order Success Page with order data via state
      router.push(
        `/order-success?order=${encodeURIComponent(JSON.stringify(pendingOrderPayload))}`
      );
    }
  };

  const handleCancelOrNotSent = () => {
    setShowConfirmModal(false);
    setCheckoutErrorNotice(
      'Pesanan belum terkirim ke WhatsApp (pengiriman dibatalkan). Formulir dan barang di keranjang belanja Anda tetap tersimpan utuh. Silakan periksa kembali dan klik "Kirim Pesanan" saat siap.'
    );
    showToast('Pengiriman WhatsApp dibatalkan atau belum selesai', 'error');
  };

  const handleReopenWhatsApp = () => {
    if (activeWaUrl) {
      window.open(activeWaUrl, '_blank');
      showToast('Membuka ulang WhatsApp...', 'pink');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() => router.push('/cart')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9A8585] hover:text-[#4A3A3A] mb-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Keranjang</span>
        </button>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#4A3A3A] flex items-center gap-2">
          <span>Checkout Pesanan</span>
          <span className="text-xl">💕</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#9A8585] mt-1">
          Lengkapi data pengiriman di bawah ini. Pesanan akan langsung terhubung ke WhatsApp Admin
          untuk proses konfirmasi.
        </p>
      </div>

      {/* Error / Cancellation Notice Banner */}
      <AnimatePresence>
        {checkoutErrorNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-900 flex items-start gap-3 shadow-xs"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs space-y-1">
              <span className="font-bold text-rose-800 block">
                Status: Pengiriman WhatsApp Belum Selesai / Dibatalkan
              </span>
              <p className="text-rose-700/90 leading-relaxed">{checkoutErrorNotice}</p>
            </div>
            <button
              type="button"
              onClick={() => setCheckoutErrorNotice(null)}
              className="text-rose-400 hover:text-rose-700 p-1 text-xs"
            >
              Tutup
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={handleInitiateWhatsAppOrder}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Left Column: Customer Details & Shipping Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: Data Pengiriman */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#FEBCBD]/40 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#FFF1F1]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FFF1F1] flex items-center justify-center text-[#F49A9D]">
                  <User className="w-4 h-4" />
                </div>
                <h2 className="font-display font-bold text-base text-[#4A3A3A]">
                  Informasi Pembeli & Alamat Kirim
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-[#F49A9D] bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200/60">
                Tanpa Perlu Login
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Nama Lengkap */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-bold text-[#4A3A3A] flex items-center gap-1">
                  <span>Nama Lengkap Pembeli</span>
                  <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  name="customer_name"
                  required
                  placeholder="Contoh: Amanda Putri"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 rounded-2xl bg-[#FFF9F9] border text-xs text-[#4A3A3A] focus:outline-hidden transition-colors ${
                    errors.customer_name
                      ? 'border-rose-400 bg-rose-50/30'
                      : 'border-[#FEBCBD]/50 focus:border-[#F49A9D]'
                  }`}
                />
                {errors.customer_name && (
                  <p className="text-[11px] text-rose-500 font-medium">{errors.customer_name}</p>
                )}
              </div>

              {/* Nomor WhatsApp */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#4A3A3A] flex items-center gap-1">
                  <span>Nomor WhatsApp Aktif</span>
                  <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  required
                  placeholder="Contoh: 081234567890"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 rounded-2xl bg-[#FFF9F9] border text-xs text-[#4A3A3A] focus:outline-hidden transition-colors ${
                    errors.whatsapp
                      ? 'border-rose-400 bg-rose-50/30'
                      : 'border-[#FEBCBD]/50 focus:border-[#F49A9D]'
                  }`}
                />
                {errors.whatsapp && (
                  <p className="text-[11px] text-rose-500 font-medium">{errors.whatsapp}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#4A3A3A] flex items-center gap-1">
                  <span>Email (Opsional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="amanda@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden focus:border-[#F49A9D]"
                />
              </div>

              {/* Alamat Lengkap */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-bold text-[#4A3A3A] flex items-center gap-1">
                  <span>Alamat Lengkap Pengiriman</span>
                  <span className="text-rose-500 font-bold">*</span>
                </label>
                <textarea
                  rows={2}
                  name="address"
                  required
                  placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan..."
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 rounded-2xl bg-[#FFF9F9] border text-xs text-[#4A3A3A] focus:outline-hidden transition-colors ${
                    errors.address
                      ? 'border-rose-400 bg-rose-50/30'
                      : 'border-[#FEBCBD]/50 focus:border-[#F49A9D]'
                  }`}
                />
                {errors.address && (
                  <p className="text-[11px] text-rose-500 font-medium">{errors.address}</p>
                )}
              </div>

              {/* Kota / Kabupaten */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#4A3A3A] flex items-center gap-1">
                  <span>Kota / Kabupaten</span>
                  <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="Contoh: Denpasar / Jakarta Selatan"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 rounded-2xl bg-[#FFF9F9] border text-xs text-[#4A3A3A] focus:outline-hidden transition-colors ${
                    errors.city
                      ? 'border-rose-400 bg-rose-50/30'
                      : 'border-[#FEBCBD]/50 focus:border-[#F49A9D]'
                  }`}
                />
                {errors.city && (
                  <p className="text-[11px] text-rose-500 font-medium">{errors.city}</p>
                )}
              </div>

              {/* Provinsi */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#4A3A3A] flex items-center gap-1">
                  <span>Provinsi</span>
                  <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  name="province"
                  required
                  placeholder="Contoh: Bali / DKI Jakarta"
                  value={formData.province}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 rounded-2xl bg-[#FFF9F9] border text-xs text-[#4A3A3A] focus:outline-hidden transition-colors ${
                    errors.province
                      ? 'border-rose-400 bg-rose-50/30'
                      : 'border-[#FEBCBD]/50 focus:border-[#F49A9D]'
                  }`}
                />
                {errors.province && (
                  <p className="text-[11px] text-rose-500 font-medium">{errors.province}</p>
                )}
              </div>

              {/* Kode Pos */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#4A3A3A] flex items-center gap-1">
                  <span>Kode Pos</span>
                  <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  name="postal_code"
                  required
                  placeholder="Contoh: 80361"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 rounded-2xl bg-[#FFF9F9] border text-xs text-[#4A3A3A] focus:outline-hidden transition-colors ${
                    errors.postal_code
                      ? 'border-rose-400 bg-rose-50/30'
                      : 'border-[#FEBCBD]/50 focus:border-[#F49A9D]'
                  }`}
                />
                {errors.postal_code && (
                  <p className="text-[11px] text-rose-500 font-medium">{errors.postal_code}</p>
                )}
              </div>

              {/* Catatan Khusus */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#4A3A3A] flex items-center gap-1">
                  <span>Catatan untuk Penjual (Opsional)</span>
                </label>
                <input
                  type="text"
                  name="notes"
                  placeholder="Warna cadangan, kartu ucapan, dll"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden focus:border-[#F49A9D]"
                />
              </div>
            </div>
          </div>

          {/* Info Card: Direct WhatsApp Order Explanation */}
          <div className="bg-gradient-to-br from-pink-50 via-[#FFF9F9] to-emerald-50/40 rounded-3xl p-5 border border-[#FEBCBD]/40 text-xs space-y-3">
            <div className="flex items-center gap-2 text-[#4A3A3A] font-bold">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Pemesanan Cepat via WhatsApp</span>
            </div>
            <p className="text-[11px] text-[#9A8585] leading-relaxed">
              Setelah menekan tombol <strong>&quot;Kirim Pesanan ke WhatsApp&quot;</strong>,
              aplikasi akan membuka obrolan WhatsApp dengan nomor resmi admin (
              {settings?.whatsapp || '081234567890'}) beserta rincian pesanan. Jika kamu selesai
              mengirim, konfirmasi di layar untuk mendapatkan invoice tanda terima!
            </p>
          </div>
        </div>

        {/* Right Column: Order Summary & WhatsApp Action Button (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#FEBCBD]/40 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#FFF1F1]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#F49A9D]" />
                <h3 className="font-display font-bold text-base text-[#4A3A3A]">
                  Ringkasan Belanja ({cart.reduce((a, b) => a + b.quantity, 0)} Barang)
                </h3>
              </div>
            </div>

            {/* Items List */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-pink-50">
              {cart.map((item) => {
                const itemPrice = item.product.discount_price || item.product.price;
                return (
                  <div
                    key={item.product.id}
                    className="pt-2.5 first:pt-0 flex items-center gap-3"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-xl object-cover border border-[#FEBCBD]/30 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#4A3A3A] truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-[#9A8585]">
                        {item.quantity}x {formatRupiah(itemPrice)}
                      </p>
                    </div>
                    <span className="text-xs font-extrabold text-[#4A3A3A] shrink-0">
                      {formatRupiah(itemPrice * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Calculations */}
            <div className="space-y-2 pt-3 border-t border-[#FFF1F1] text-xs">
              <div className="flex justify-between text-[#9A8585]">
                <span>Subtotal Produk</span>
                <span className="font-semibold text-[#4A3A3A]">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#9A8585]">
                <span>Ongkos Kirim (Flat)</span>
                <span className="font-semibold text-[#4A3A3A]">
                  {formatRupiah(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-[#4A3A3A] pt-2 border-t border-pink-100">
                <span>Total Tagihan</span>
                <span className="text-base text-[#F49A9D]">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            {/* WhatsApp Submit Button */}
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Kirim Pesanan ke WhatsApp 💕</span>
                <Send className="w-3.5 h-3.5" />
              </motion.button>
              <p className="text-[10px] text-center text-[#9A8585] mt-2">
                🔒 Data aman & langsung terkirim ke WhatsApp resmi{' '}
                {settings?.store_name || 'SONIABALISHOP'}.
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* WhatsApp Delivery Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-[#FEBCBD]/60 shadow-2xl space-y-6 relative overflow-hidden text-center"
            >
              {/* Decorative Header Icon */}
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80 shadow-sm">
                <MessageSquare className="w-8 h-8 fill-emerald-100" />
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-[11px] font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Jendela WhatsApp Telah Dibuka
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#4A3A3A]">
                  Konfirmasi Pengiriman Pesanan
                </h3>
                <p className="text-xs sm:text-sm text-[#9A8585] leading-relaxed max-w-sm mx-auto">
                  Silakan periksa tab WhatsApp Anda dan tekan tombol{' '}
                  <strong>Kirim (Send)</strong> di obrolan admin. Apakah pesanan sudah terkirim?
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {/* Option 1: Yes, Sent (Success) */}
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmSentWhatsApp}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isSubmitting ? 'Memproses...' : 'Ya, Sudah Dikirim ke WhatsApp 💕'}
                  </span>
                </button>

                {/* Option 2: Re-open WhatsApp if didn't launch */}
                <button
                  type="button"
                  onClick={handleReopenWhatsApp}
                  className="w-full py-2.5 px-4 rounded-2xl bg-[#FFF9F9] hover:bg-[#FFF1F1] border border-[#FEBCBD]/60 text-xs font-bold text-[#4A3A3A] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5 text-[#F49A9D]" />
                  <span>WhatsApp Belum Terbuka? Klik Buka Ulang</span>
                </button>

                {/* Option 3: Not Sent / Cancelled (Stay on checkout with error banner) */}
                <button
                  type="button"
                  onClick={handleCancelOrNotSent}
                  className="w-full py-2.5 px-4 rounded-2xl hover:bg-rose-50 text-xs font-semibold text-rose-600 transition-colors cursor-pointer"
                >
                  ❌ Belum Dikirim / Batal (Kembali ke Formulir)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
