import { getAdminByEmail, getAdminById, getSettings, updateSettings } from '@/lib/db';
import { Admin, StoreSettings } from '@/types';

export const adminRepository = {
  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    return getAdminByEmail(email);
  },

  async getAdminById(id: number): Promise<Admin | undefined> {
    return getAdminById(id);
  },

  async getSettings(): Promise<StoreSettings> {
    return getSettings();
  },

  async updateSettings(updates: Partial<StoreSettings>): Promise<StoreSettings> {
    return updateSettings(updates);
  },
};
