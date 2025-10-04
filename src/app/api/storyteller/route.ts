
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { idea } = await request.json();

  if (!idea) {
    return NextResponse.json({ error: 'Story idea is required' }, { status: 400 });
  }

  // TODO: Call Gemini API to generate a bland draft
  const draft = `This is a bland story about ${idea}. It is very boring and needs a lot of work.`;

  return NextResponse.json({ draft });
}
