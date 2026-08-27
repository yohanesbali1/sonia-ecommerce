import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '@/lib/db';
import { Category } from '@/types';

export const categoryProductRepository = {
  async getCategories(onlyActive = true): Promise<Category[]> {
    return getCategories(onlyActive);
  },

  async getCategoryById(id: number): Promise<Category | undefined> {
    return getCategoryById(id);
  },

  async createCategory(input: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    return createCategory(input);
  },

  async updateCategory(id: number, updates: Partial<Category>): Promise<Category | undefined> {
    return updateCategory(id, updates);
  },

  async deleteCategory(id: number): Promise<boolean> {
    return deleteCategory(id);
  },
};
