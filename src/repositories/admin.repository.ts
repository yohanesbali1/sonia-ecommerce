import { db } from '@/lib/db';
import { Admin, StoreSettings } from '@/types';

export const adminRepository = {
  getAdminByEmail(email: string): Admin | undefined {
    return db.getAdminByEmail(email);
  },

  getAdminById(id: number): Admin | undefined {
    return db.getAdminById(id);
  },

  getSettings(): StoreSettings {
    return db.getSettings();
  },

  updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    return db.updateSettings(updates);
  },
};
