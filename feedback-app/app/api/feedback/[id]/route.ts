import { NextResponse } from 'next/server';
import { updateFeedback, deleteFeedback } from '@/lib/db';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await updateFeedback(id, body);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    console.error('[PATCH /api/feedback]', err);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteFeedback(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/feedback]', err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
