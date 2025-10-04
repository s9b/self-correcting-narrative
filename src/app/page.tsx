
import StoryStage from '@/components/StoryStage';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          Writer&apos;s Room
        </h1>
        <StoryStage />
      </div>
    </main>
  );
}
