import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(request: Request) {
  const { text, critA, critB } = await request.json();

  if (!text || !critA || !critB) {
    return NextResponse.json({ error: 'Text and critiques are required' }, { status: 400 });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const generationPrompt = `You are The Storyteller (Senior). Given the ORIGINAL_DRAFT, CRITIQUE_A, and CRITIQUE_B, rewrite the story into 200–300 words that incorporate both critiques. Make the voice warm and slightly whimsical. Output only the new story.

ORIGINAL_DRAFT: "${text}"

CRITIQUE_A: "${critA}"

CRITIQUE_B: "${critB}"`;
    
    const result = await model.generateContent(generationPrompt);
    const response = await result.response;
    const revisedText = await response.text();

    return NextResponse.json({ success: true, text: revisedText });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to revise story' }, { status: 500 });
  }
}