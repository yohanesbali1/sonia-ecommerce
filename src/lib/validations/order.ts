import { z } from 'zod';

export const checkoutSchema = z.object({
  customer_name: z.string().min(1, 'Nama wajib diisi'),
  whatsapp: z.string().min(1, 'WhatsApp wajib diisi'),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  address: z.string().min(1, 'Alamat wajib diisi'),
  city: z.string().min(1, 'Kota wajib diisi'),
  province: z.string().min(1, 'Provinsi wajib diisi'),
  postal_code: z.string().min(1, 'Kode pos wajib diisi'),
  notes: z.string().optional(),
  items: z.array(z.object({
    product_id: z.number(),
    quantity: z.number().min(1),
  })).min(1, 'Minimal 1 produk'),
  payment_method: z.string().min(1, 'Metode pembayaran wajib dipilih'),
  payment_proof: z.string().optional(),
});

export const orderStatusSchema = z.object({
  status: z.enum([
    'PENDING_PAYMENT', 'WAITING_APPROVAL', 'PAID', 'PROCESSING',
    'SHIPPED', 'COMPLETED', 'CANCELLED', 'REJECTED'
  ]),
  tracking_number: z.string().optional(),
  courier: z.string().optional(),
});
