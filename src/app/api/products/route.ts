import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get('search') || undefined;
  const category_id = searchParams.get('category_id') ? Number(searchParams.get('category_id')) : undefined;
  const category_slug = searchParams.get('category_slug') || undefined;
  const sort = searchParams.get('sort') || undefined;
  const featured = searchParams.get('featured') === 'true' ? true : undefined;
  const best_seller = searchParams.get('best_seller') === 'true' ? true : undefined;
  const all = searchParams.get('all') === 'true';

  const products = await getProducts({
    search,
    category_id,
    category_slug,
    sort,
    featured,
    best_seller,
    onlyActive: all ? false : undefined,
  });

  return NextResponse.json(products);
}
