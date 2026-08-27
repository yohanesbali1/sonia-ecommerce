import { db } from '@/lib/db';
import { Product, ProductImage } from '@/types';

export const productRepository = {
  getProducts(params?: {
    search?: string;
    category_id?: number;
    category_slug?: string;
    featured?: boolean;
    best_seller?: boolean;
    sort?: string;
    onlyActive?: boolean;
  }): Product[] {
    return db.getProducts(params);
  },

  getProductBySlugOrId(identifier: string | number): Product | undefined {
    return db.getProductBySlugOrId(identifier);
  },

  createProduct(input: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Product {
    return db.createProduct(input);
  },

  updateProduct(id: number, updates: Partial<Product>): Product | undefined {
    return db.updateProduct(id, updates);
  },

  deleteProduct(id: number): boolean {
    return db.deleteProduct(id);
  },
};
