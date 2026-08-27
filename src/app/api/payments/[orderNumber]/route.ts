import { NextRequest, NextResponse } from 'next/server';
import { uploadPaymentProof } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> },
) {
  try {
    const { orderNumber } = await params;
    const { proof_image } = await request.json();

    if (!proof_image) {
      return NextResponse.json({ error: 'proof_image is required' }, { status: 400 });
    }

    const order = await uploadPaymentProof(orderNumber, proof_image);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
