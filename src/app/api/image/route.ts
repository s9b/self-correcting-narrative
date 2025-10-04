
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { revisedStory } = await request.json();

  if (!revisedStory) {
    return NextResponse.json({ error: 'Revised story is required' }, { status: 400 });
  }

  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

    const generationPrompt = `Read the following story and produce a short image prompt for an illustration (1–2 sentences). Keep the prompt explicit about style: "children's book illustration, watercolor, warm tones".\n\nSTORY: "${revisedStory}"`;
    
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
      return NextResponse.json({ error: 'Failed to generate image prompt from Gemini API' }, { status: response.status });
    }

    const data = await response.json();
    const imagePrompt = data.candidates[0].content.parts[0].text;

    const imageUrl = `https://source.unsplash.com/1024x768/?${encodeURIComponent(imagePrompt)}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}

