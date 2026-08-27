'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { BrandLogo } from '@/components/layout/BrandLogo';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('admin@cherie.com');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/product');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Email dan password wajib diisi', 'error');
      return;
    }

    setIsSubmitting(true);
    const success = await login(email, password, rememberMe);
    setIsSubmitting(false);

    if (success) {
      router.push('/admin/product');
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@cherie.com');
    setPassword('admin123');
    showToast('Kredensial demo terisi ✨', 'pink');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#FEBCBD]/50 shadow-xl space-y-6"
      >
        <div className="text-center space-y-3 flex flex-col items-center">
          <BrandLogo size="lg" showText={false} />
          <div>
            <h1 className="font-display text-2xl font-bold text-[#4A3A3A]">
              SONIABALISHOP Admin 💕
            </h1>
            <p className="text-xs text-[#9A8585] mt-0.5">
              Kelola produk, kategori, dan pengaturan toko
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-200/80 text-xs text-[#4A3A3A] space-y-1">
          <div className="flex items-center justify-between font-bold text-[#F49A9D]">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Akun Demo Admin:
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] underline hover:text-[#4A3A3A] cursor-pointer"
            >
              Auto-Fill Akun
            </button>
          </div>
          <p className="text-[11px] text-[#9A8585] font-mono">
            Email: admin@cherie.com | Pass: admin123
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-[#4A3A3A]">Email Admin</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden focus:border-[#F49A9D]"
                placeholder="admin@soniabalishop.com"
              />
              <Mail className="w-4 h-4 text-[#9A8585] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-[#4A3A3A]">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFF9F9] border border-[#FEBCBD]/50 text-xs text-[#4A3A3A] focus:outline-hidden focus:border-[#F49A9D]"
                placeholder="••••••••"
              />
              <Lock className="w-4 h-4 text-[#9A8585] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer text-[#4A3A3A]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[#FEBCBD] text-[#F49A9D] focus:ring-0"
              />
              <span>Ingat saya di perangkat ini</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-[#FEBCBD] hover:bg-[#F49A9D] text-[#4A3A3A] font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#FEBCBD]/40 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Memeriksa...' : 'Masuk ke Dashboard Admin'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="text-xs font-semibold text-[#9A8585] hover:text-[#4A3A3A] transition-colors"
          >
            ← Kembali ke Beranda Toko
          </button>
        </div>
      </motion.div>
    </div>
  );
}
