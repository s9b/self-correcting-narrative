
import { NextResponse } from 'next/server';
import { GenerationConfig } from '@google/genai';

interface CritiqueResponse {
  critA?: string;
  critB?: string;
}

const generationConfig: GenerationConfig = {
  responseMimeType: "application/json",
};

async function getCritique(storyText: string, coachType: 'Character' | 'World'): Promise<CritiqueResponse> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

  const prompt = coachType === 'Character'
    ? `You are The Character Coach. Read the following story text. Provide 3 short bullet points focused on improving the character: their quirks, emotional stakes, and clear motivation. Output a JSON object with a single key "critA" containing a single string with the bullet points separated by semicolons. STORY_TEXT: "${storyText}"`
    : `You are The World Builder. Read the following story text. Provide 3 short bullet points about improving the setting: sensory details, unusual props, or a unique description of the location. Output a JSON object with a single key "critB" containing a single string with the bullet points separated by semicolons. STORY_TEXT: "${storyText}"`;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt,
        }],
      }],
      generationConfig: generationConfig,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Gemini API error:', errorData);
    throw new Error(`Failed to get critique from Gemini API: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  
  // Extract JSON from the response text, in case the model wraps it in markdown.
  const jsonMatch = text.match(/```json\\n?([\s\S]*?)\\n?```/);
  const jsonString = jsonMatch ? jsonMatch[1] : text;

  return JSON.parse(jsonString);
}

export async function POST(request: Request) {
  const { text } = await request.json();

  if (!text) {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });
  }

  try {
    const [charCritique, worldCritique] = await Promise.all([
      getCritique(text, 'Character'),
      getCritique(text, 'World'),
    ]);

    return NextResponse.json({ success: true, critA: charCritique.critA, critB: worldCritique.critB });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate critiques' }, { status: 500 });
  }
}
