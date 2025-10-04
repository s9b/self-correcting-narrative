'use client';

import { useState, useRef } from 'react';
import Typewriter from 'typewriter-effect';

export default function Home() {
  const [idea, setIdea] = useState('');
  const [draft, setDraft] = useState('');
  const [characterCritique, setCharacterCritique] = useState('');
  const [worldCritique, setWorldCritique] = useState('');
  const [revisedStory, setRevisedStory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [isNarrationLoading, setIsNarrationLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleCreateStory = async () => {
    if (!idea) return;
    setLoading(true);
    setDraft('');
    setCharacterCritique('');
    setWorldCritique('');
    setRevisedStory('');
    setImageUrl('');
    setAudioUrl('');

    try {
      // 1. Generate draft
      const storyResponse = await fetch('/api/storyteller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      });
      if (!storyResponse.ok) throw new Error('Failed to generate story');
      const storyData = await storyResponse.json();
      setDraft(storyData.draft);

      // 2. Get critiques in parallel
      const [charResponse, worldResponse] = await Promise.all([
        fetch('/api/character-coach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ draft: storyData.draft }),
        }),
        fetch('/api/world-builder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ draft: storyData.draft }),
        }),
      ]);

      if (!charResponse.ok) throw new Error('Failed to get character critique');
      if (!worldResponse.ok) throw new Error('Failed to get world critique');

      const charData = await charResponse.json();
      const worldData = await worldResponse.json();

      setCharacterCritique(charData.critique);
      setWorldCritique(worldData.critique);

      // 3. Get revised story
      const reviserResponse = await fetch('/api/reviser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draft: storyData.draft,
          characterCritique: charData.critique,
          worldCritique: worldData.critique,
        }),
      });

      if (!reviserResponse.ok) throw new Error('Failed to revise story');
      const reviserData = await reviserResponse.json();
      setRevisedStory(reviserData.revisedStory);

      // 4. Get image
      const imageResponse = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revisedStory: reviserData.revisedStory }),
      });

      if (!imageResponse.ok) throw new Error('Failed to generate image');
      const imageData = await imageResponse.json();
      setImageUrl(imageData.imageUrl);

    } catch (error) {
      console.error(error);
      // You might want to show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  const handlePlayNarration = async () => {
    if (!revisedStory) return;
    setIsNarrationLoading(true);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revisedStory }),
      });

      if (!response.ok) throw new Error('Failed to generate narration');
      const data = await response.json();
      setAudioUrl(data.audioUrl);
      if (audioRef.current) {
        audioRef.current.src = data.audioUrl;
        audioRef.current.play();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsNarrationLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 font-sans">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Self-Correcting Narrative Engine
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Story Input */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">1. Start with an idea</h2>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              rows={4}
              placeholder="A lonely robot discovers a hidden garden on a desolate planet..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              disabled={loading}
            ></textarea>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:bg-gray-400"
                onClick={handleCreateStory}
                disabled={loading || !idea}
              >
                {loading ? 'Creating...' : 'Create Story'}
              </button>
            </div>
          </div>

          {/* AI Agent Placeholders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Storyteller */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                  Storyteller
                </span>
              </h3>
              <div className="text-gray-800 h-40 overflow-y-auto prose prose-sm">
                {draft ? (
                  <Typewriter
                    options={{
                      strings: draft,
                      autoStart: true,
                      delay: 20,
                      cursor: '_',
                    }}
                  />
                ) : (
                  <p className="text-gray-500 italic">[The storyteller's first draft will appear here...]</p>
                )}
              </div>
            </div>

            {/* Character Coach */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                  Character Coach
                </span>
              </h3>
              <div className="text-gray-800 h-40 overflow-y-auto prose prose-sm">
                {characterCritique ? (
                   <Typewriter
                   options={{
                     strings: characterCritique,
                     autoStart: true,
                     delay: 20,
                     cursor: '_',
                   }}
                 />
                ) : (
                  <p className="text-gray-500 italic">[The character coach's feedback will appear here...]</p>
                )}
              </div>
            </div>

            {/* World Builder */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                  World Builder
                </span>
              </h3>
              <div className="text-gray-800 h-40 overflow-y-auto prose prose-sm">
                {worldCritique ? (
                   <Typewriter
                   options={{
                     strings: worldCritique,
                     autoStart: true,
                     delay: 20,
                     cursor: '_',
                   }}
                 />
                ) : (
                  <p className="text-gray-500 italic">[The world builder's feedback will appear here...]</p>
                )}
              </div>
            </div>
          </div>

           {/* Revised Story */}
           <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">2. Polished Story</h2>
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-500">The storyteller's revised and improved draft.</p>
                <button
                  className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                  onClick={handlePlayNarration}
                  disabled={!revisedStory || isNarrationLoading}
                >
                  {isNarrationLoading ? (
                    <>Loading Audio...</>
                  ) : (
                    <><svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path></svg>
                    Play Narration</>
                  )}
                </button>
              </div>
              <div className="text-gray-800 h-48 overflow-y-auto prose prose-lg">
                {revisedStory ? (
                    <Typewriter
                    options={{
                      strings: revisedStory,
                      autoStart: true,
                      delay: 20,
                      cursor: '_',
                    }}
                  />
                  ) : (
                    <p className="text-gray-500 italic">[The final, polished story will appear here, with a typewriter effect...]</p>
                  )
                }
              </div>
              <div className="mt-4 h-56 bg-gray-200 rounded-md flex items-center justify-center">
                {imageUrl ? (
                  <img src={imageUrl} alt="AI-generated illustration" className="w-full h-full object-cover rounded-md" />
                ) : (
                  <p className="text-gray-500 italic">[AI-generated illustration will appear here]</p>
                )}
              </div>
            </div>
        </div>
        <audio ref={audioRef} />
      </main>
    </div>
  );
}
