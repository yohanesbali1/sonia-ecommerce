'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';

function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F9] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 mx-auto border-4 border-[#FEBCBD] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#9A8585] font-semibold">Memuat panel admin...</p>
        </div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const getViewFromPath = (path: string): string => {
    if (path.startsWith('/admin/product')) return 'admin-product';
    if (path.startsWith('/admin/category-product')) return 'admin-category-product';
    if (path.startsWith('/admin/order')) return 'admin-orders';
    if (path.startsWith('/admin/dashboard')) return 'admin-dashboard';
    if (path.startsWith('/admin/setting')) return 'admin-setting';
    return 'admin-products';
  };

  const currentView = getViewFromPath(pathname);

  // const handleNavigate = (view: string, param?: Record<string, string | number>) => {
  //   const routes: Record<string, string> = {
  //     'admin-products': '/admin/product',
  //     'admin-categories': '/admin/category-product',
  //     'admin-orders': '/admin/order',
  //     'admin-dashboard': '/admin/dashboard',
  //     'admin-settings': '/admin/settings',
  //   };

  //   if (view === 'home') {
  //     router.push('/');
  //     return;
  //   }

  //   if (view === 'admin-order-detail' && param?.id) {
  //     router.push(`/admin/order/${param.id}`);
  //     return;
  //   }

  //   const route = routes[view];
  //   if (route) {
  //     router.push(route);
  //   }
  // };

  return (
    <AdminLayout currentView={currentView}>
      {children}
    </AdminLayout>
  );
}

export default function AdminLayoutPage({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <AdminAuthWrapper>{children}</AdminAuthWrapper>
      </AuthProvider>
    </ToastProvider>
  );
}
