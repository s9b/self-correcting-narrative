
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { draft } = await request.json();

  if (!draft) {
    return NextResponse.json({ error: 'Draft is required' }, { status: 400 });
  }

  // TODO: Call Gemini API to generate world building critique
  const critique = `This is a world-building critique of the draft. The world is not very immersive.`;

  return NextResponse.json({ critique });
}
