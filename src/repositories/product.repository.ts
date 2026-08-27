import { getProducts, getProductBySlugOrId, createProduct, updateProduct, deleteProduct } from '@/lib/db';
import { Product } from '@/types';

export const productRepository = {
  async getProducts(params?: {
    search?: string;
    category_id?: number;
    category_slug?: string;
    featured?: boolean;
    best_seller?: boolean;
    sort?: string;
    onlyActive?: boolean;
  }): Promise<Product[]> {
    return getProducts(params);
  },

  async getProductBySlugOrId(identifier: string | number): Promise<Product | undefined> {
    return getProductBySlugOrId(identifier);
  },

  async createProduct(input: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    return createProduct(input);
  },

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined> {
    return updateProduct(id, updates);
  },

  async deleteProduct(id: number): Promise<boolean> {
    return deleteProduct(id);
  },
};
