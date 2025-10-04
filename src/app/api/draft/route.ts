
import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(request: Request) {
  const { prompt } = await request.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  try {
    // @ts-expect-error: Vercel type resolution issue
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const generationPrompt = `You are The Storyteller. Given this prompt: "${prompt}", produce a bland short draft of ~120 words for a kid-friendly story. Keep it simple and intentionally unpolished. Output only the story text.`;
    const result = await model.generateContent(generationPrompt);
    const response = await result.response;
    const text = await response.text();

    return NextResponse.json({ success: true, text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate draft' }, { status: 500 });
  }
}
