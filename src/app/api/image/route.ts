
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { revisedStory } = await request.json();

  if (!revisedStory) {
    return NextResponse.json({ error: 'Revised story is required' }, { status: 400 });
  }

  // TODO: Call Gemini API to generate an image
  const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(revisedStory.slice(0,20))}/1024/768`;

  return NextResponse.json({ imageUrl });
}
