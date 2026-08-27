import { NextRequest, NextResponse } from 'next/server';
import { getCategories } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get('all') === 'true';
  const onlyActive = !all;
  const categories = await getCategories(onlyActive);
  return NextResponse.json(categories);
}
