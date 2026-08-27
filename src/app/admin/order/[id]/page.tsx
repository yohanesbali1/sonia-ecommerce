'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  Clock,
  Phone,
  Mail,
  MapPin,
  Image as ImageIcon,
  ExternalLink,
  X,
  Send,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import {
  getAdminOrderDetail,
  approveOrderPayment,
  rejectOrderPayment,
  updateOrderStatus,
} from '@/services/order.service';
import { formatRupiah, formatDateIndo, getOrderStatusLabel } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const orderId = Number(id);
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('Nominal transfer tidak sesuai dengan total tagihan.');
  const [shipModalOpen, setShipModalOpen] = useState(false);
  const [courier, setCourier] = useState('J&T Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);

  const { showToast } = useToast();

  const loadDetail = async () => {
    try {
      setLoading(true);
      const res = await getAdminOrderDetail(orderId);
      setOrder(res.order);
      if (res.order.courier) setCourier(res.order.courier);
      if (res.order.tracking_number) setTrackingNumber(res.order.tracking_number);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Gagal memuat detail pesanan', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [orderId]);

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      const res = await approveOrderPayment(orderId);
      setOrder(res.order);
      showToast('Pembayaran berhasil disetujui & stok produk otomatis dipotong! 💕', 'pink');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Gagal menyetujui pembayaran', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await rejectOrderPayment(orderId, rejectionReason);
      setOrder(res.order);
      setRejectModalOpen(false);
      showToast('Pembayaran berhasil ditolak', 'pink');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Gagal menolak pembayaran', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      showToast('Nomor resi wajib diisi', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await updateOrderStatus(orderId, {
        status: 'SHIPPED',
        courier,
        tracking_number: trackingNumber,
      });
      setOrder(res.order);
      setShipModalOpen(false);
      showToast('Status pesanan diubah ke Dikirim (Resi Tersimpan) ✨', 'pink');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Gagal update pengiriman', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      setIsSubmitting(true);
      const res = await updateOrderStatus(orderId, { status: newStatus });
      setOrder(res.order);
      showToast(`Status berhasil diubah ke ${newStatus}`, 'pink');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Gagal update status', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-[#9A8585]">
        Memuat data pesanan...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-[#9A8585] mb-4">Pesanan tidak ditemukan</p>
        <button
          type="button"
          onClick={() => router.push('/admin/order')}
          className="px-5 py-2 bg-[#FEBCBD] text-[#4A3A3A] rounded-full text-xs font-semibold"
        >
          Kembali ke Daftar Pesanan
        </button>
      </div>
    );
  }

  const s = getOrderStatusLabel(order.order_status);
  const cleanWa = order.whatsapp.replace(/[^0-9]/g, '');
  const formattedWa = cleanWa.startsWith('0') ? `62${cleanWa.substring(1)}` : cleanWa;
  const waUrl = `https://wa.me/${formattedWa}?text=Halo%20Kak%20${encodeURIComponent(order.customer_name)},%20kami%20dari%20Ch%C3%A9rie%20Boutique%20mengenai%20pesanan%20${order.order_number}...`;

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => router.push('/admin/order')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9A8585] hover:text-[#4A3A3A] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Daftar Pesanan</span>
      </button>

      <div className="bg-white rounded-3xl p-6 border border-[#FEBCBD]/40 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-lg font-bold text-[#4A3A3A]">
              {order.order_number}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.bg} ${s.color}`}>
              {s.label}
            </span>
          </div>
          <p className="text-xs text-[#9A8585] mt-1">
            Dibuat pada {formatDateIndo(order.created_at)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {order.order_status === 'WAITING_APPROVAL' && (
            <>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleApprove}
                className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Setujui Pembayaran (Approve)</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setRejectModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 border border-rose-200 transition-all"
              >
                <XCircle className="w-4 h-4" />
                <span>Tolak Pembayaran</span>
              </button>
            </>
          )}

          {order.order_status === 'PAID' && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleStatusChange('PROCESSING')}
              className="px-4 py-2.5 rounded-2xl bg-[#FEBCBD] hover:bg-[#F49A9D] text-[#4A3A3A] font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Package className="w-4 h-4" />
              <span>Mulai Kemas (Processing)</span>
            </button>
          )}

          {order.order_status === 'PROCESSING' && (
            <button
              type="button"
              onClick={() => setShipModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-sky-500/20"
            >
              <Truck className="w-4 h-4" />
              <span>Kirim & Input No. Resi</span>
            </button>
          )}

          {order.order_status === 'SHIPPED' && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleStatusChange('COMPLETED')}
              className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Tandai Selesai (Completed)</span>
            </button>
          )}

          {['PENDING_PAYMENT', 'WAITING_APPROVAL'].includes(order.order_status) && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleStatusChange('CANCELLED')}
              className="px-3 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-semibold"
            >
              Batalkan
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#FEBCBD]/40 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-sm text-[#4A3A3A] pb-2 border-b border-[#FFF1F1]">
              Informasi Pelanggan & Alamat Pengiriman
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[#9A8585] block">Nama Penerima:</span>
                <p className="font-bold text-sm text-[#4A3A3A]">{order.customer_name}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[#9A8585] block">Nomor WhatsApp:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#4A3A3A]">{order.whatsapp}</span>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold text-[11px] transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Chat WA</span>
                  </a>
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <span className="text-[#9A8585] block">Alamat Tujuan:</span>
                <p className="text-[#4A3A3A] font-medium leading-relaxed">
                  {order.address}, {order.city}, {order.province} {order.postal_code}
                </p>
              </div>

              {order.notes && (
                <div className="sm:col-span-2 space-y-1 bg-[#FFF9F9] p-3 rounded-2xl border border-[#FEBCBD]/30">
                  <span className="text-[#9A8585] block font-semibold">Catatan dari Customer:</span>
                  <p className="text-[#4A3A3A] italic">&quot;{order.notes}&quot;</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#FEBCBD]/40 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-sm text-[#4A3A3A] pb-2 border-b border-[#FFF1F1]">
              Barang yang Dipesan
            </h3>

            <div className="space-y-3">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product_image || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800'}
                      alt={item.product_name}
                      className="w-14 h-14 rounded-2xl object-cover bg-[#FFF1F1] border border-[#FEBCBD]/30 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="font-semibold text-sm text-[#4A3A3A]">{item.product_name}</p>
                      <span className="text-[#9A8585]">
                        {item.quantity} pcs x {formatRupiah(item.price)}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-[#4A3A3A]">
                    {formatRupiah(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#FFF1F1] space-y-2 text-xs">
              <div className="flex justify-between text-[#9A8585]">
                <span>Subtotal Produk</span>
                <span className="font-semibold text-[#4A3A3A]">{formatRupiah(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#9A8585]">
                <span>Ongkos Kirim</span>
                <span className="font-semibold text-[#4A3A3A]">{formatRupiah(order.shipping_cost)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-[#FFF1F1]">
                <span className="font-bold text-sm text-[#4A3A3A]">Total Pembayaran</span>
                <span className="font-display font-bold text-xl text-[#4A3A3A]">
                  {formatRupiah(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#FEBCBD]/40 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-sm text-[#4A3A3A] pb-2 border-b border-[#FFF1F1]">
              Bukti Transfer & Pembayaran
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#9A8585] block">Metode Pembayaran:</span>
                <span className="font-bold text-[#4A3A3A]">{order.payment?.method || 'Bank Transfer'}</span>
              </div>

              <div>
                <span className="text-[#9A8585] block">Foto Bukti Transfer:</span>
                {order.payment?.proof_image ? (
                  <div className="mt-2 relative rounded-2xl overflow-hidden border-2 border-[#FEBCBD] bg-[#FFF9F9] group">
                    <img
                      src={order.payment.proof_image}
                      alt="Bukti Transfer Customer"
                      className="w-full h-48 object-cover cursor-pointer group-hover:scale-105 transition-transform"
                      onClick={() => setImagePreviewOpen(true)}
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreviewOpen(true)}
                      className="absolute bottom-2 right-2 px-3 py-1.5 rounded-full bg-black/70 text-white text-[11px] font-semibold backdrop-blur-xs flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Perbesar</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-center mt-1">
                    <p className="font-semibold text-xs">Belum ada bukti diunggah</p>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      Customer belum mengirimkan foto transfer
                    </p>
                  </div>
                )}
              </div>

              {order.payment?.status && (
                <div className="pt-2 border-t border-[#FFF1F1]">
                  <span className="text-[#9A8585] block">Status Verifikasi:</span>
                  <span className="font-semibold text-[#4A3A3A]">{order.payment.status}</span>
                </div>
              )}

              {order.tracking_number && (
                <div className="pt-3 border-t border-[#FFF1F1] space-y-1">
                  <span className="text-[#9A8585] block font-semibold">Resi Pengiriman:</span>
                  <p className="font-bold text-sky-700">{order.courier}</p>
                  <p className="font-mono text-xs font-bold text-[#4A3A3A]">{order.tracking_number}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {rejectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-rose-200 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#FFF1F1]">
                <h3 className="font-display font-bold text-base text-rose-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Tolak Bukti Pembayaran</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="p-1 text-[#9A8585] hover:text-[#4A3A3A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleReject} className="space-y-4 text-xs">
                <p className="text-[#9A8585]">
                  Alasan penolakan akan ditampilkan ke customer saat mengecek status pesanan agar mereka dapat mengupload bukti yang valid.
                </p>

                <div className="space-y-1">
                  <label className="font-semibold text-[#4A3A3A]">Alasan Penolakan *</label>
                  <textarea
                    rows={3}
                    required
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Contoh: Bukti buram / nominal tidak sesuai / nomor rekening salah"
                    className="w-full px-3.5 py-2 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden focus:border-[#F49A9D]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRejectModalOpen(false)}
                    className="px-4 py-2 rounded-full bg-[#FFF1F1] text-[#4A3A3A] font-semibold text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Memproses...' : 'Konfirmasi Tolak'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {shipModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-sky-200 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#FFF1F1]">
                <h3 className="font-display font-bold text-base text-sky-800 flex items-center gap-1.5">
                  <Truck className="w-4 h-4" />
                  <span>Input Resi & Ekspedisi Pengiriman</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShipModalOpen(false)}
                  className="p-1 text-[#9A8585] hover:text-[#4A3A3A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleShipSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-[#4A3A3A]">Nama Ekspedisi / Kurir *</label>
                  <select
                    value={courier}
                    onChange={(e) => setCourier(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden"
                  >
                    <option value="J&T Express">J&T Express</option>
                    <option value="SiCepat Express">SiCepat Express</option>
                    <option value="JNE Regular">JNE Regular</option>
                    <option value="AnterAja">AnterAja</option>
                    <option value="GoSend / GrabExpress">GoSend / GrabExpress</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#4A3A3A]">Nomor Resi Pengiriman *</label>
                  <input
                    type="text"
                    required
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Contoh: JT98271038291"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] uppercase font-mono focus:outline-hidden focus:border-[#F49A9D]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShipModalOpen(false)}
                    className="px-4 py-2 rounded-full bg-[#FFF1F1] text-[#4A3A3A] font-semibold text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan & Kirim Pesanan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {imagePreviewOpen && order.payment?.proof_image && (
          <div
            onClick={() => setImagePreviewOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-zoom-out"
          >
            <div className="relative max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/20">
              <img
                src={order.payment.proof_image}
                alt="Bukti Transfer Fullscreen"
                className="w-full h-full object-contain max-h-[85vh]"
              />
              <button
                type="button"
                onClick={() => setImagePreviewOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
