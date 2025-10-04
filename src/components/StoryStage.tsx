'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Typewriter from 'typewriter-effect';

interface AgentCardProps {
  title: string;
  content: string;
  color: string;
  stage: string;
  currentStage: string;
}

const AgentCard = ({ title, content, color, stage, currentStage }: AgentCardProps) => {
  const isActive = stage === currentStage;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className={`bg-[var(--card-background)] border border-[var(--border-color)] rounded-lg p-6 ${isActive ? 'ring-2 ring-[var(--accent-indigo)]' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold text-[${color}]`}>{title}</h3>
        {isActive && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-3 h-3 rounded-full bg-[var(--accent-indigo)]"
          />
        )}
      </div>
      <div className="text-gray-300 h-40 overflow-y-auto prose prose-sm prose-invert">
        {content ? <Typewriter options={{ strings: content, autoStart: true, delay: 10, cursor: '' }} /> : <p className="text-gray-500 italic">Waiting...</p>}
      </div>
    </motion.div>
  );
};

export default function StoryStage() {
  const [prompt, setPrompt] = useState('A story about a nervous squirrel\'s first day of school');
  const [stage, setStage] = useState('idle');
  const [draft, setDraft] = useState('');
  const [critA, setCritA] = useState('');
  const [critB, setCritB] = useState('');
  const [finalStory, setFinalStory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isNarrating, setIsNarrating] = useState(false);
  const [error, setError] = useState('');

  async function runPipeline() {
    setStage('drafting');
    setDraft('');
    setCritA('');
    setCritB('');
    setFinalStory('');
    setImageUrl('');
    setError('');
    window.speechSynthesis.cancel();
    setIsNarrating(false);

    try {
      const res1 = await fetch('/api/draft', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) });
      if (!res1.ok) throw new Error('Failed to get draft from Storyteller.');
      const j1 = await res1.json();
      setDraft(j1.text);

      setStage('critiquing');
      const res2 = await fetch('/api/critique', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: j1.text }) });
      if (!res2.ok) throw new Error('Failed to get critiques from agents.');
      const j2 = await res2.json();
      setCritA(j2.critA);
      setCritB(j2.critB);

      setStage('revising');
      const res3 = await fetch('/api/revise', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: j1.text, critA: j2.critA, critB: j2.critB }) });
      if (!res3.ok) throw new Error('Failed to get revised story.');
      const j3 = await res3.json();
      setFinalStory(j3.text);

      setStage('illustrating');
      const imageResponse = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revisedStory: j3.text }),
      });
      if (!imageResponse.ok) throw new Error('Failed to get illustration.');
      const imageData = await imageResponse.json();
      setImageUrl(imageData.imageUrl);

      setStage('done');
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      setStage('error');
    }
  }

  const handlePlayNarration = () => {
    if (!finalStory || typeof window === 'undefined') return;
    if (isNarrating) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(finalStory);
    utterance.onstart = () => setIsNarrating(true);
    utterance.onend = () => setIsNarrating(false);
    utterance.onerror = () => setIsNarrating(false);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
      <div className="bg-[var(--card-background)] border border-[var(--border-color)] rounded-lg p-6 mb-8">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-3 bg-transparent border border-[var(--border-color)] rounded mb-4 focus:ring-2 focus:ring-[var(--accent-indigo)] outline-none"
          rows={2}
        />
        <button
          onClick={runPipeline}
          className="w-full px-4 py-3 bg-[var(--accent-indigo)] text-white font-semibold rounded hover:bg-indigo-700 transition-colors disabled:bg-gray-600"
          disabled={stage !== 'idle' && stage !== 'done' && stage !== 'error'}
        >
          {stage === 'idle' || stage === 'done' || stage === 'error' ? 'Create Story' : `Stage: ${stage}...`}
        </button>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-red-400 text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <AnimatePresence>
          {draft && <AgentCard title="The Storyteller" content={draft} color="var(--accent-indigo)" stage="drafting" currentStage={stage} />}
          {critA && <AgentCard title="Character Coach" content={critA} color="var(--accent-green)" stage="critiquing" currentStage={stage} />}
          {critB && <AgentCard title="World Builder" content={critB} color="var(--accent-yellow)" stage="critiquing" currentStage={stage} />}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {finalStory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
            <div className="bg-[var(--card-background)] border border-[var(--border-color)] rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-center">The Polished Story</h2>
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-400">The revised and improved draft.</p>
                <button
                  className="flex items-center text-sm font-medium text-[var(--accent-blue)] hover:text-blue-400 disabled:text-gray-500"
                  onClick={handlePlayNarration}
                  disabled={!finalStory}
                >
                  {isNarrating ? 'Stop Narration' : 'Play Narration'}
                </button>
              </div>
              <div className="text-gray-300 h-64 overflow-y-auto prose prose-lg prose-invert">
                <Typewriter options={{ strings: finalStory, autoStart: true, delay: 20, cursor: '' }} />
              </div>
              <div className="mt-6 h-64 bg-gray-900 rounded-md flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                  <motion.img
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    src={imageUrl}
                    alt="AI-generated illustration"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-gray-600 italic">{stage === 'illustrating' ? 'Generating illustration...' : 'Illustration will appear here'}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
