import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlugOrId, updateProduct } from '@/lib/db';
import { getAdminFromRequest } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const productId = Number(id);
  const product = await getProductBySlugOrId(productId);

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const newStatus = product.status ? true : false;
  const updated = await updateProduct(productId, { status: newStatus });

  return NextResponse.json(updated);
}
