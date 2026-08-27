import { OrderStatus, PaymentStatus } from '@/types';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateIndo(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function getOrderStatusLabel(status: OrderStatus): { label: string; color: string; bg: string; border: string } {
  switch (status) {
    case 'PENDING_PAYMENT':
      return { label: 'Menunggu Pembayaran', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
    case 'WAITING_APPROVAL':
      return { label: 'Menunggu Approval Admin', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200' };
    case 'PAID':
      return { label: 'Pembayaran Diterima', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    case 'PROCESSING':
      return { label: 'Sedang Diproses', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' };
    case 'SHIPPED':
      return { label: 'Dalam Pengiriman', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' };
    case 'COMPLETED':
      return { label: 'Selesai 💕', color: 'text-emerald-800', bg: 'bg-emerald-100', border: 'border-emerald-300' };
    case 'CANCELLED':
      return { label: 'Dibatalkan', color: 'text-stone-700', bg: 'bg-stone-100', border: 'border-stone-200' };
    case 'REJECTED':
      return { label: 'Pembayaran Ditolak', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' };
    default:
      return { label: status, color: 'text-stone-700', bg: 'bg-stone-50', border: 'border-stone-200' };
  }
}

export function getPaymentStatusLabel(status: PaymentStatus): { label: string; color: string; bg: string } {
  switch (status) {
    case 'PENDING':
      return { label: 'Belum Bayar', color: 'text-amber-700', bg: 'bg-amber-50' };
    case 'WAITING_APPROVAL':
      return { label: 'Menunggu Verifikasi', color: 'text-indigo-700', bg: 'bg-indigo-50' };
    case 'PAID':
      return { label: 'Terverifikasi', color: 'text-emerald-700', bg: 'bg-emerald-50' };
    case 'REJECTED':
      return { label: 'Ditolak', color: 'text-rose-700', bg: 'bg-rose-50' };
    default:
      return { label: status, color: 'text-stone-700', bg: 'bg-stone-50' };
  }
}
