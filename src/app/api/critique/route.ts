
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { text } = await request.json();

  if (!text) {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });
  }

  // TODO: Call Gemini API to generate critiques
  const critA = `The character is flat. Make fear more specific and give a quirky habit.`;
  const critB = `The setting is vague. Make the school more vivid, e.g., a school inside an oak tree.`;

  return NextResponse.json({ success: true, critA, critB });
}
