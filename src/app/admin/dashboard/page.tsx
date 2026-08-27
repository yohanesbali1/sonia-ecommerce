'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  ShoppingBag,
  DollarSign,
  Package,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { getAdminDashboardStats } from '@/services/product.service';
import { DashboardStats, Order } from '@/types';
import { formatRupiah, formatDateIndo, getOrderStatusLabel } from '@/lib/utils';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const data = await getAdminDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-white rounded-2xl w-1/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white rounded-3xl" />
          ))}
        </div>
        <div className="h-64 bg-white rounded-3xl" />
      </div>
    );
  }

  const s = stats?.stats || {
    total_orders: 0,
    waiting_approval_count: 0,
    paid_count: 0,
    completed_count: 0,
    total_revenue: 0,
    total_products: 0,
  };

  const chartData = [
    { day: 'Sen', sales: 450000, orders: 2 },
    { day: 'Sel', sales: 680000, orders: 3 },
    { day: 'Rab', sales: 320000, orders: 1 },
    { day: 'Kam', sales: 890000, orders: 4 },
    { day: 'Jum', sales: 1200000, orders: 5 },
    { day: 'Sab', sales: 1540000, orders: 7 },
    { day: 'Min', sales: 980000, orders: 4 },
  ];

  const categoryDistribution = [
    { name: 'Skincare', value: 40, color: '#FEBCBD' },
    { name: 'Makeup', value: 25, color: '#F49A9D' },
    { name: 'Gaun/Fashion', value: 20, color: '#FAD02C' },
    { name: 'Aksesori', value: 15, color: '#A0C4FF' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1F1] text-xs font-semibold text-[#F49A9D] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ringkasan Bisnis Real-Time</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#4A3A3A]">
            Dashboard Admin Butik 💕
          </h1>
        </div>

        {s.waiting_approval_count > 0 && (
          <button
            type="button"
            onClick={() => router.push('/admin/order?filter=WAITING_APPROVAL')}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-500/20 hover:bg-amber-600 transition-all animate-pulse"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{s.waiting_approval_count} Pesanan Menunggu Approval!</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-5 border border-[#FEBCBD]/40 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#9A8585]">Total Pendapatan</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="font-display text-2xl font-bold text-[#4A3A3A] block">
              {formatRupiah(s.total_revenue)}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Transaksi Terverifikasi
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-amber-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700">Menunggu Approval</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="font-display text-2xl font-bold text-[#4A3A3A] block">
              {s.waiting_approval_count} Pesanan
            </span>
            <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 mt-1">
              Perlu verifikasi bukti transfer
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#FEBCBD]/40 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#9A8585]">Total Pesanan Masuk</span>
            <div className="w-10 h-10 rounded-2xl bg-[#FFF1F1] text-[#F49A9D] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="font-display text-2xl font-bold text-[#4A3A3A] block">
              {s.total_orders} Pesanan
            </span>
            <span className="text-[11px] text-[#9A8585] mt-1 block">
              {s.completed_count} Selesai diantar
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#FEBCBD]/40 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#9A8585]">Katalog Produk</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="font-display text-2xl font-bold text-[#4A3A3A] block">
              {s.total_products} Produk
            </span>
            <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">
              Aktif & Siap Dipesan
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#FEBCBD]/40 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-[#4A3A3A]">
                Tren Penjualan Mingguan
              </h3>
              <p className="text-xs text-[#9A8585]">Statistik pendapatan harian (Rp)</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FEBCBD" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FEBCBD" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FFF1F1" />
                <XAxis dataKey="day" stroke="#9A8585" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#9A8585"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `Rp${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val: string | number | (string | number)[]) => [formatRupiah(Number(val)), 'Penjualan']}
                  contentStyle={{
                    backgroundColor: '#FFF9F9',
                    borderColor: '#FEBCBD',
                    borderRadius: '1rem',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#F49A9D"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#FEBCBD]/40 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-[#4A3A3A]">
              Distribusi Kategori
            </h3>
            <p className="text-xs text-[#9A8585]">Porsi minat pembeli</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: string | number | (string | number)[]) => [`${val}%`, 'Porsi']}
                  contentStyle={{
                    backgroundColor: '#FFF9F9',
                    borderColor: '#FEBCBD',
                    borderRadius: '1rem',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {categoryDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[#4A3A3A] truncate">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-[#FEBCBD]/40 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#FFF1F1]">
          <div>
            <h3 className="font-display font-bold text-base text-[#4A3A3A]">
              Pesanan Terbaru Masuk 💕
            </h3>
            <p className="text-xs text-[#9A8585]">Daftar transaksi pelanggan terakhir</p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/admin/order')}
            className="text-xs font-bold text-[#F49A9D] hover:underline flex items-center gap-1"
          >
            <span>Semua Pesanan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#9A8585] border-b border-[#FFF1F1]">
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Tanggal</th>
                <th className="pb-3 font-semibold">Total</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFF1F1]">
              {stats?.recent_orders?.map((order: Order) => {
                const s = getOrderStatusLabel(order.order_status);
                return (
                  <tr key={order.id} className="hover:bg-[#FFF9F9] transition-colors">
                    <td className="py-3 font-mono font-bold text-[#4A3A3A]">
                      {order.order_number}
                    </td>
                    <td className="py-3 font-semibold text-[#4A3A3A]">
                      {order.customer_name}
                      <span className="text-[11px] text-[#9A8585] block font-normal">
                        {order.whatsapp}
                      </span>
                    </td>
                    <td className="py-3 text-[#9A8585]">
                      {formatDateIndo(order.created_at)}
                    </td>
                    <td className="py-3 font-bold text-[#4A3A3A]">
                      {formatRupiah(order.total)}
                    </td>
                    <td className="py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${s.bg} ${s.color}`}>
                        {s.label}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => router.push(`/admin/order/${order.id}`)}
                        className="px-3 py-1 rounded-xl bg-[#FFF1F1] hover:bg-[#FEBCBD] text-[#4A3A3A] font-semibold text-xs transition-colors"
                      >
                        Detail & Proses
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
