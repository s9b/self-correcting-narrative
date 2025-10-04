import Image from "next/image";

export default function Home() {
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
            ></textarea>
            <div className="mt-4 flex justify-end">
              <button className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
                Create Story
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
              <div className="text-gray-600 italic h-32">
                [The storyteller's first draft will appear here...]
              </div>
            </div>

            {/* Character Coach */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                  Character Coach
                </span>
              </h3>
              <div className="text-gray-600 italic h-32">
                [The character coach's feedback will appear here...]
              </div>
            </div>

            {/* World Builder */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                  World Builder
                </span>
              </h3>
              <div className="text-gray-600 italic h-32">
                [The world builder's feedback will appear here...]
              </div>
            </div>
          </div>

           {/* Revised Story */}
           <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">2. Polished Story</h2>
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-500">The storyteller's revised and improved draft.</p>
                <button className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path></svg>
                  Play Narration
                </button>
              </div>
              <div className="text-gray-600 italic h-48">
                [The final, polished story will appear here, with a typewriter effect...]
              </div>
              <div className="mt-4 h-56 bg-gray-200 rounded-md flex items-center justify-center">
                <p className="text-gray-500 italic">[AI-generated illustration will appear here]</p>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
}