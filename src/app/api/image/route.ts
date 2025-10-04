
import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(request: Request) {
  const { revisedStory } = await request.json();

  if (!revisedStory) {
    return NextResponse.json({ error: 'Revised story is required' }, { status: 400 });
  }

  try {
    // @ts-expect-error
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const generationPrompt = `Read the following story and produce a short image prompt for an illustration (1–2 sentences). Keep the prompt explicit about style: "children's book illustration, watercolor, warm tones".\n\nSTORY: "${revisedStory}"`;
    
    const result = await model.generateContent(generationPrompt);
    const response = await result.response;
    const imagePrompt = await response.text();

    const imageUrl = `https://source.unsplash.com/1024x768/?${encodeURIComponent(imagePrompt)}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}

