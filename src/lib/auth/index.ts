import jwt from 'jsonwebtoken';
import { getAdminById } from '@/lib/db';
import { Admin } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'cherie-secret-jwt-key-2026-femme-chic';

export function generateAdminToken(admin: Admin): string {
  return jwt.sign(
    { id: admin.id, email: admin.email, name: admin.name },
    JWT_SECRET,
    { expiresIn: '7d' },
  );
}

export function verifyAdminToken(token: string): { id: number; email: string; name: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; email: string; name: string };
  } catch {
    return null;
  }
}

export async function getAdminFromRequest(request: Request): Promise<Admin | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  const payload = verifyAdminToken(token);
  if (!payload) return null;

  const admin = await getAdminById(payload.id);
  return admin || null;
}
