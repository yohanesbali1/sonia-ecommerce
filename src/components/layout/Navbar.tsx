'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { BrandLogo } from '@/components/layout/BrandLogo';

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const { totalItems, setIsCartDrawerOpen } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const currentView = pathname === '/' ? 'home' : 'products';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
    router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Banner Message */}
      <div className="bg-[#FFF1F1] border-b border-[#FEBCBD]/30 py-1.5 px-4 text-center text-xs font-medium text-[#4A3A3A] flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#F49A9D]" />
        <span>Pesanan Otomatis Terhubung Langsung ke WhatsApp Admin Toko 💕</span>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#FEBCBD]/40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-[#4A3A3A] hover:bg-[#FFF1F1] transition-colors cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo Component with uploaded identity */}
            <div
              onClick={() => router.push('/')}
              className="cursor-pointer group select-none"
            >
              <BrandLogo size="md" showText={true} />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              <button
                type="button"
                onClick={() => router.push('/')}
                className={`text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  currentView === 'home'
                    ? 'text-[#F49A9D] border-b-2 border-[#FEBCBD] pb-0.5'
                    : 'text-[#4A3A3A] hover:text-[#F49A9D]'
                }`}
              >
                Beranda
              </button>

              <button
                type="button"
                onClick={() => router.push('/products')}
                className={`text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  currentView === 'products'
                    ? 'text-[#F49A9D] border-b-2 border-[#FEBCBD] pb-0.5'
                    : 'text-[#4A3A3A] hover:text-[#F49A9D]'
                }`}
              >
                Katalog Produk
              </button>

              <button
                type="button"
                onClick={() => router.push('/products?category=skincare-glow')}
                className="text-xs font-bold uppercase tracking-wider text-[#4A3A3A] hover:text-[#F49A9D] transition-colors cursor-pointer"
              >
                Skincare
              </button>

              <button
                type="button"
                onClick={() => router.push('/products?category=feminine-dresses')}
                className="text-xs font-bold uppercase tracking-wider text-[#4A3A3A] hover:text-[#F49A9D] transition-colors cursor-pointer"
              >
                Fashion
              </button>

              <button
                type="button"
                onClick={() => router.push('/products?filter=best_seller')}
                className="text-xs font-bold uppercase tracking-wider text-[#4A3A3A] hover:text-[#F49A9D] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F49A9D]" />
                <span>Best Seller</span>
              </button>
            </nav>

            {/* Right Action Icons & Search */}
            <div className="flex items-center gap-3">
              {/* Search Bar on Desktop */}
              {/* <form onSubmit={handleSearchSubmit} className="hidden md:flex relative items-center">
                <div className="relative px-3.5 py-1.5 rounded-full flex items-center gap-2 bg-[#FFF1F1] border border-[#FEBCBD]/40 focus-within:border-[#F49A9D] focus-within:ring-2 focus-within:ring-[#FEBCBD]/30 transition-all">
                  <Search className="w-3.5 h-3.5 text-[#F49A9D] shrink-0" />
                  <input
                    type="text"
                    placeholder="Cari busana, skincare..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none focus:outline-hidden text-xs w-32 lg:w-44 text-[#4A3A3A] placeholder-[#9A8585]"
                  />
                </div>
              </form> */}

              {/* Cart Drawer Trigger */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative p-2.5 rounded-full bg-[#FFF1F1] hover:bg-[#FEBCBD]/60 text-[#4A3A3A] transition-colors border border-[#FEBCBD]/30 shadow-xs cursor-pointer"
                title="Keranjang Belanja"
              >
                <ShoppingBag className="w-5 h-5 text-[#F49A9D]" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#F49A9D] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xs"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Admin Panel Trigger */}
              <button
                type="button"
                onClick={() => router.push(isAuthenticated ? '/admin/products' : '/admin/login')}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-pink-50 hover:bg-pink-100/70 border border-pink-200 text-xs font-bold text-[#F49A9D] transition-colors shadow-2xs cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#F49A9D]" />
                <span>{isAuthenticated ? 'Admin Panel' : 'Kelola Toko'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-[#FEBCBD]/30 bg-white px-4 pt-3 pb-6 space-y-3 overflow-hidden"
            >
              {/* Mobile Search */}
              {/* <form onSubmit={handleSearchSubmit} className="relative mb-3">
                <input
                  type="text"
                  placeholder="Cari produk cantik..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs rounded-full bg-[#FFF9F9] border border-[#FEBCBD]/50 focus:outline-hidden focus:border-[#F49A9D]"
                />
                <Search className="w-4 h-4 text-[#9A8585] absolute left-3 top-3" />
              </form> */}

              <div className="flex flex-col gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    router.push('/');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2.5 px-3 rounded-xl text-[#4A3A3A] hover:bg-[#FFF1F1]"
                >
                  Beranda
                </button>
                <button
                  type="button"
                  onClick={() => {
                    router.push('/products');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2.5 px-3 rounded-xl text-[#4A3A3A] hover:bg-[#FFF1F1]"
                >
                  Katalog Semua Produk
                </button>
                <button
                  type="button"
                  onClick={() => {
                    router.push('/products?filter=best_seller');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2.5 px-3 rounded-xl text-[#4A3A3A] bg-[#FFF1F1] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F49A9D]" />
                    Koleksi Best Seller
                  </span>
                  <span className="text-[10px] text-[#F49A9D] font-bold">Populer</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    router.push(isAuthenticated ? '/admin/products' : '/admin/login');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2.5 px-3 rounded-xl text-xs font-bold text-[#F49A9D] hover:bg-[#FFF1F1]"
                >
                  {isAuthenticated ? 'Masuk Panel Admin' : 'Login Admin Toko'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
