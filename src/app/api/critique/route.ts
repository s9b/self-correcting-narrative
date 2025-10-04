
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, GenerationConfig } from '@google/genai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const generationConfig: GenerationConfig = {
  responseMimeType: "application/json",
};

async function getCritique(storyText: string, coachType: 'Character' | 'World'): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', generationConfig });
  
  const prompt = coachType === 'Character'
    ? `You are The Character Coach. Read the following story text. Provide 3 short bullet points focused on improving the character: their quirks, emotional stakes, and clear motivation. Output a JSON object with a single key "critA" containing a single string with the bullet points separated by semicolons. STORY_TEXT: "${storyText}"`
    : `You are The World Builder. Read the following story text. Provide 3 short bullet points about improving the setting: sensory details, unusual props, or a unique description of the location. Output a JSON object with a single key "critB" containing a single string with the bullet points separated by semicolons. STORY_TEXT: "${storyText}"`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  return text;
}

export async function POST(request: Request) {
  const { text } = await request.json();

  if (!text) {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });
  }

  try {
    const [charCritiqueJson, worldCritiqueJson] = await Promise.all([
      getCritique(text, 'Character'),
      getCritique(text, 'World'),
    ]);

    const charCritique = JSON.parse(charCritiqueJson).critA;
    const worldCritique = JSON.parse(worldCritiqueJson).critB;

    return NextResponse.json({ success: true, critA: charCritique, critB: worldCritique });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate critiques' }, { status: 500 });
  }
}
