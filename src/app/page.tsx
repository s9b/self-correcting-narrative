import StoryStage from '@/components/StoryStage';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-semibold mb-4 text-center">Writer's Room — Self-Correcting Narrative</h1>
        <StoryStage />
      </div>
    </main>
  );
}