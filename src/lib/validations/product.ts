import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Nama produk wajib diisi'),
  slug: z.string().min(1, 'Slug wajib diisi'),
  category_id: z.number().min(1, 'Kategori wajib dipilih'),
  description: z.string().optional(),
  price: z.number().min(0, 'Harga tidak boleh negatif'),
  discount_price: z.number().optional(),
  stock: z.number().min(0, 'Stok tidak boleh negatif'),
  images: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  best_seller: z.boolean().optional(),
  rating: z.number().optional(),
});

export const updateProductSchema = createProductSchema.partial();
