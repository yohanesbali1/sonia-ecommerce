'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import {
  Search,
  Filter,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Eye,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { getAdminOrders } from '@/services/order.service';
import { formatRupiah, formatDateIndo, getOrderStatusLabel } from '@/lib/utils';

export default function AdminOrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('filter') || 'all');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getAdminOrders({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchQuery || undefined,
      });
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch admin orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, searchQuery]);

  const filterTabs = [
    { id: 'all', label: 'Semua Pesanan' },
    { id: 'WAITING_APPROVAL', label: 'Menunggu Approval ⏳' },
    { id: 'PAID', label: 'Sudah Dibayar' },
    { id: 'PROCESSING', label: 'Diproses' },
    { id: 'SHIPPED', label: 'Dikirim' },
    { id: 'COMPLETED', label: 'Selesai' },
    { id: 'REJECTED', label: 'Ditolak' },
    { id: 'CANCELLED', label: 'Dibatalkan' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#4A3A3A]">
          Kelola Pesanan & Pembayaran 💕
        </h1>
        <p className="text-xs text-[#9A8585]">
          Verifikasi bukti transfer pelanggan, ubah status pesanan, dan input nomor resi pengiriman.
        </p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold shrink-0 transition-all ${
              statusFilter === tab.id
                ? 'bg-[#FEBCBD] text-[#4A3A3A] shadow-xs'
                : 'bg-white border border-[#FEBCBD]/40 text-[#9A8585] hover:text-[#4A3A3A] hover:bg-[#FFF1F1]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-4 border border-[#FEBCBD]/40 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Cari berdasarkan Order ID, nama penerima, atau WhatsApp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden focus:border-[#F49A9D]"
          />
          <Search className="w-3.5 h-3.5 text-[#9A8585] absolute left-3 top-2.5" />
        </div>
        <span className="text-xs text-[#9A8585] font-semibold">
          Total: {orders.length} pesanan
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-[#FEBCBD]/40 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FFF9F9] text-[#9A8585] border-b border-[#FFF1F1]">
              <tr>
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Tanggal</th>
                <th className="p-4 font-semibold">Bukti Bayar</th>
                <th className="p-4 font-semibold">Total Tagihan</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFF1F1]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#9A8585]">
                    Memuat daftar pesanan...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#9A8585]">
                    Belum ada pesanan pada filter ini 💕
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const s = getOrderStatusLabel(order.order_status);
                  const hasProof = Boolean(order.payment?.proof_image);

                  return (
                    <tr key={order.id} className="hover:bg-[#FFF9F9]/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#4A3A3A]">
                        {order.order_number}
                      </td>

                      <td className="p-4">
                        <p className="font-semibold text-sm text-[#4A3A3A]">
                          {order.customer_name}
                        </p>
                        <span className="text-[11px] text-[#9A8585]">
                          WA: {order.whatsapp} • {order.city}
                        </span>
                      </td>

                      <td className="p-4 text-[#9A8585]">
                        {formatDateIndo(order.created_at)}
                      </td>

                      <td className="p-4">
                        {hasProof ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-[11px]">
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Ada Bukti</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#9A8585]">Belum Ada</span>
                        )}
                      </td>

                      <td className="p-4 font-bold text-[#4A3A3A]">
                        {formatRupiah(order.total)}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${s.bg} ${s.color}`}
                        >
                          {s.label}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => router.push(`/admin/order/${order.id}`)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs ${
                            order.order_status === 'WAITING_APPROVAL'
                              ? 'bg-[#FEBCBD] hover:bg-[#F49A9D] text-[#4A3A3A]'
                              : 'bg-[#FFF1F1] hover:bg-[#FEBCBD] text-[#4A3A3A]'
                          }`}
                        >
                          {order.order_status === 'WAITING_APPROVAL' ? 'Verifikasi Bayar' : 'Detail'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
