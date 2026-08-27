import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { order_number, whatsapp } = await request.json();

    if (!order_number || !whatsapp) {
      return NextResponse.json({ error: 'order_number and whatsapp are required' }, { status: 400 });
    }

    const order = db.trackOrder(order_number, whatsapp);

    if (!order) {
      return NextResponse.json({ error: 'Order not found or whatsapp does not match' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
