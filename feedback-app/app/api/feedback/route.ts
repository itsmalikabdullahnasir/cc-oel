import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getAllFeedback, addFeedback } from '@/lib/db';

export async function GET() {
  try {
    const feedback = await getAllFeedback();
    return NextResponse.json(feedback);
  } catch (err) {
    console.error('[GET /api/feedback]', err);
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, category } = body;

    if (!content?.trim() || !category) {
      return NextResponse.json({ error: 'Content and category are required' }, { status: 400 });
    }
    if (content.trim().length > 500) {
      return NextResponse.json({ error: 'Content must be 500 characters or fewer' }, { status: 400 });
    }

    const feedback = await addFeedback({
      id: uuidv4(),
      content: content.trim(),
      category,
      isReviewed: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (err) {
    console.error('[POST /api/feedback]', err);
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}
