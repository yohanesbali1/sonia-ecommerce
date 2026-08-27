export interface ProductImage {
  id: number;
  product_id: number;
  image: string;
  sort_order: number;
}

export interface Product {
  id: number;
  category_id: number;
  category_name?: string;
  category_slug?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount_price?: number;
  stock: number;
  status?: 'active' | 'inactive';
  is_active?: boolean;
  featured?: boolean;
  is_featured?: boolean;
  best_seller?: boolean;
  is_best_seller?: boolean;
  rating?: number;
  images: string[];
  created_at?: string;
  updated_at?: string;
}
