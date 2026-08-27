import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get('all') === 'true';
  const onlyActive = !all;
  const categories = db.getCategories(onlyActive);
  return NextResponse.json(categories);
}
