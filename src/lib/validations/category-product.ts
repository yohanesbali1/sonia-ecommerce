import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi'),
  slug: z.string().min(1, 'Slug wajib diisi'),
  image: z.string().optional(),
  status: z.boolean().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();
