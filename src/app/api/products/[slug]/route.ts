import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlugOrId, getProducts } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = await getProductBySlugOrId(slug);

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const allProducts = await getProducts({
    category_id: product.category_id,
    onlyActive: true,
  });
  const recommendations = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return NextResponse.json({ product, recommendations });
}
