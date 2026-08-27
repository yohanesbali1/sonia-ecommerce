'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Admin } from '@/types';
import { adminLogin as apiAdminLogin, getAdminProfile } from '@/services/auth.service';
import { useToast } from '@/context/ToastContext';

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(() => typeof window === 'undefined' ? null : localStorage.getItem('cherie_admin_token'));
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    async function checkAuth() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await getAdminProfile();
        setAdmin(data.admin);
      } catch (err) {
        console.error('Session expired or invalid', err);
        localStorage.removeItem('cherie_admin_token');
        setToken(null);
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, [token]);

  const login = async (email: string, password: string, remember = true): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await apiAdminLogin(email, password);
      console.log(res.success);
      if (res.success && res.token) {
        if (remember) {
          localStorage.setItem('cherie_admin_token', res.token);
        } else {
          sessionStorage.setItem('cherie_admin_token', res.token);
          localStorage.setItem('cherie_admin_token', res.token);
        }
        setToken(res.token);
        setAdmin(res.admin);
        showToast(`Selamat datang kembali, ${res.admin.name}! ✨`, 'pink');
        return true;
      }
      return false;
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Login gagal', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('cherie_admin_token');
    sessionStorage.removeItem('cherie_admin_token');
    setToken(null);
    setAdmin(null);
    showToast('Berhasil logout dari panel admin', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: Boolean(admin && token),
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
