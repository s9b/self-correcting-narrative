
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { text, critA, critB } = await request.json();

  if (!text || !critA || !critB) {
    return NextResponse.json({ error: 'Text and critiques are required' }, { status: 400 });
  }

  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

    const generationPrompt = `You are The Storyteller (Senior). Given the ORIGINAL_DRAFT, CRITIQUE_A, and CRITIQUE_B, rewrite the story into 200–300 words that incorporate both critiques. Make the voice warm and slightly whimsical. Output only the new story.\n\nORIGINAL_DRAFT: "${text}"\n\nCRITIQUE_A: "${critA}"\n\nCRITIQUE_B: "${critB}"`;
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: generationPrompt,
          }],
        }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return NextResponse.json({ error: 'Failed to revise story from Gemini API' }, { status: response.status });
    }

    const data = await response.json();
    const revisedText = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ success: true, text: revisedText });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to revise story' }, { status: 500 });
  }
}
