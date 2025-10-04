'use client';

import { useState, useRef } from 'react';
import Typewriter from 'typewriter-effect';

export default function StoryStage() {
  const [prompt, setPrompt] = useState('A story about a nervous squirrel\'s first day of school');
  const [stage, setStage] = useState('idle');
  const [draft, setDraft] = useState('');
  const [critA, setCritA] = useState('');
  const [critB, setCritB] = useState('');
  const [finalStory, setFinalStory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isNarrationLoading, setIsNarrationLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  async function runPipeline() {
    setStage('drafting');
    setDraft('');
    setCritA('');
    setCritB('');
    setFinalStory('');
    setImageUrl('');
    setAudioUrl('');

    try {
      const res1 = await fetch('/api/draft', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) });
      const j1 = await res1.json();
      setDraft(j1.text);

      setStage('critiquing');
      const res2 = await fetch('/api/critique', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: j1.text }) });
      const j2 = await res2.json();
      setCritA(j2.critA);
      setCritB(j2.critB);

      setStage('revising');
      const res3 = await fetch('/api/revise', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: j1.text, critA: j2.critA, critB: j2.critB }) });
      const j3 = await res3.json();
      setFinalStory(j3.text);

      const imageResponse = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revisedStory: j3.text }),
      });
      const imageData = await imageResponse.json();
      setImageUrl(imageData.imageUrl);

      setStage('done');
    } catch (error) {
      console.error(error);
      setStage('error');
    }
  }

  const handlePlayNarration = async () => {
    if (!finalStory) return;
    setIsNarrationLoading(true);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revisedStory: finalStory }),
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
    <div className="bg-white p-6 rounded-2xl shadow space-y-8">
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full p-3 border rounded mb-3" rows={2} />
      <div className="flex gap-2">
        <button onClick={runPipeline} className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={stage !== 'idle' && stage !== 'done' && stage !== 'error'}>
          {stage === 'idle' || stage === 'done' || stage === 'error' ? 'Create Story' : `Stage: ${stage}...`}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded">
          <h3 className="font-semibold">The Storyteller</h3>
          <div className="text-gray-800 h-40 overflow-y-auto prose prose-sm">
            {draft ? <Typewriter options={{ strings: draft, autoStart: true, delay: 10, cursor: '' }} /> : <p className="text-gray-500 italic">Draft will appear here...</p>}
          </div>
        </div>

        <div className="p-4 border rounded">
          <h3 className="font-semibold">Critics</h3>
          <div className="text-gray-800 h-40 overflow-y-auto prose prose-sm">
            <p className="mt-2 text-sm text-gray-700">Character Coach: {critA ? <Typewriter options={{ strings: critA, autoStart: true, delay: 10, cursor: '' }} /> : 'waiting...'}</p>
            <p className="mt-2 text-sm text-gray-700">World Builder: {critB ? <Typewriter options={{ strings: critB, autoStart: true, delay: 10, cursor: '' }} /> : 'waiting...'}</p>
          </div>
        </div>

        <div className="p-4 border rounded md:col-span-2">
          <h3 className="font-semibold">Final Story</h3>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500">The storyteller's revised and improved draft.</p>
            <button
              className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 disabled:text-gray-400"
              onClick={handlePlayNarration}
              disabled={!finalStory || isNarrationLoading}
            >
              {isNarrationLoading ? (
                <>
Loading Audio...
</>
              ) : (
                <><svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path></svg>
Play Narration</>
              )}
            </button>
          </div>
          <div className="text-gray-800 h-48 overflow-y-auto prose prose-lg">
            {finalStory ? <Typewriter options={{ strings: finalStory, autoStart: true, delay: 10, cursor: '' }} /> : <p className="text-gray-500 italic">The revised story will appear here.</p>}
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

      <div className="mt-4 text-sm text-gray-500">Stage: {stage}</div>
      <audio ref={audioRef} />
    </div>
  );
}
