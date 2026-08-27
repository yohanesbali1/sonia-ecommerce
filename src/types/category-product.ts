export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  status?: 'active' | 'inactive';
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}
