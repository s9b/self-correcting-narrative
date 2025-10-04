
import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(request: Request) {
  const { text, critA, critB } = await request.json();

  if (!text || !critA || !critB) {
    return NextResponse.json({ error: 'Text and critiques are required' }, { status: 400 });
  }

  try {
    // @ts-ignore
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const generationPrompt = `You are The Storyteller (Senior). Given the ORIGINAL_DRAFT, CRITIQUE_A, and CRITIQUE_B, rewrite the story into 200–300 words that incorporate both critiques. Make the voice warm and slightly whimsical. Output only the new story.\n\nORIGINAL_DRAFT: "${text}"\n\nCRITIQUE_A: "${critA}"\n\nCRITIQUE_B: "${critB}"`;
    
    const result = await model.generateContent(generationPrompt);
    const response = await result.response;
    const revisedText = await response.text();

    return NextResponse.json({ success: true, text: revisedText });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to revise story' }, { status: 500 });
  }
}
