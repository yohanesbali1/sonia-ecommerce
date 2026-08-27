import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = db.getProductBySlugOrId(slug);

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const recommendations = db.getProducts({
    category_id: product.category_id,
    onlyActive: true,
  }).filter((p) => p.id !== product.id).slice(0, 4);

  return NextResponse.json({ product, recommendations });
}
