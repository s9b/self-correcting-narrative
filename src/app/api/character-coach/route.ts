
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { draft } = await request.json();

  if (!draft) {
    return NextResponse.json({ error: 'Draft is required' }, { status: 400 });
  }

  // TODO: Call Gemini API to generate character critique
  const critique = `This is a character critique of the draft. The characters are not well-developed.`;

  return NextResponse.json({ critique });
}
