
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { prompt } = await request.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  // TODO: Call Gemini API to generate a bland draft
  const text = `The squirrel was named Sam. He was scared. He went to school.`;

  return NextResponse.json({ success: true, text });
}
