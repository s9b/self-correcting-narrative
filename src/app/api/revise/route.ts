
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { text, critA, critB } = await request.json();

  if (!text || !critA || !critB) {
    return NextResponse.json({ error: 'Text and critiques are required' }, { status: 400 });
  }

  // TODO: Call Gemini API to generate revised story
  const revised = `Squeaky the squirrel clutched his lucky acorn so tightly his paws trembled. Today was his first day at Oakwood Academy, a school carved inside the Great Oak.`;

  return NextResponse.json({ success: true, text: revised });
}
