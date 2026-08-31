'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  FolderTree,
  Settings,
  LogOut,
  Store,
  Menu,
  X,
  Sparkles,
  LayoutDashboardIcon,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { BrandLogo } from '@/components/layout/BrandLogo';

interface AdminLayoutProps {
  currentView: string;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentView,
  children,
}) => {
  const { admin, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Admin menu strictly limited to Products, Categories, and Settings
  const menuItems = [
    {
      id: 'admin-dashboard',
      label: 'Dashboard',
      icon: LayoutDashboardIcon,
    },
    {
      id: 'admin-product',
      label: 'Kelola Produk',
      icon: Package,
    },
    {
      id: 'admin-category-product',
      label: 'Kelola Kategori',
      icon: FolderTree,
    },
    {
      id: 'admin-setting',
      label: 'Pengaturan Toko & WA',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F9] flex flex-col lg:flex-row">
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-white border-b border-[#FEBCBD]/40 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-[#4A3A3A] hover:bg-[#FFF1F1]"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <BrandLogo size="sm" showText={true} textClassName="text-sm font-bold" />
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#FEBCBD]/40 p-6 flex flex-col justify-between transform transition-transform duration-200 ease-in-out lg:translate-x-0  md:h-screen ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Brand */}
          <div className="flex items-center justify-between">
            <BrandLogo size="md" showText={true} textClassName="text-base font-black" />

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-[#9A8585] hover:text-[#4A3A3A]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-pink-50 border border-pink-200/60 text-[11px] text-[#F49A9D] font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Admin Management Panel</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    router.push(`/admin/${item.id.replace('admin-', '')}`);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#FEBCBD] text-[#4A3A3A] shadow-xs'
                      : 'text-[#9A8585] hover:text-[#4A3A3A] hover:bg-[#FFF1F1]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#4A3A3A]' : 'text-[#9A8585]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile & Actions at bottom */}
        <div className="space-y-3 pt-6 border-t border-[#FFF1F1]">
          {/* Quick Store View Switch */}
          <button
            type="button"
            onClick={() => router.push('/')}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-2xl bg-[#FFF9F9] hover:bg-[#FFF1F1] border border-[#FEBCBD]/50 text-xs font-bold text-[#4A3A3A] transition-colors"
          >
            <Store className="w-3.5 h-3.5 text-[#F49A9D]" />
            <span>Kunjungi Toko Online</span>
          </button>

          {/* Admin Details */}
          <div className="p-3 rounded-2xl bg-[#FFF1F1]/60 flex items-center justify-between">
            <div className="truncate">
              <span className="font-bold text-xs text-[#4A3A3A] block truncate">
                {admin?.name || 'Administrator'}
              </span>
              <span className="text-[11px] text-[#9A8585] truncate block">
                {admin?.email || 'admin@soniabalishop.com'}
              </span>
            </div>
            <button
              type="button"
              onClick={logout}
              className="p-1.5 text-[#9A8585] hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-h-screen lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
