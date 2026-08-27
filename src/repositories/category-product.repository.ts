import { db } from '@/lib/db';
import { Category } from '@/types';

export const categoryProductRepository = {
  getCategories(onlyActive = true): Category[] {
    return db.getCategories(onlyActive);
  },

  getCategoryById(id: number): Category | undefined {
    return db.getCategoryById(id);
  },

  createCategory(input: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Category {
    return db.createCategory(input);
  },

  updateCategory(id: number, updates: Partial<Category>): Category | undefined {
    return db.updateCategory(id, updates);
  },

  deleteCategory(id: number): boolean {
    return db.deleteCategory(id);
  },
};
