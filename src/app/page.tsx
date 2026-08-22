import { MainExperience } from '../components/experience';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-100 p-4 sm:p-8 dark:bg-zinc-950 font-sans">
      {/* Header / Brand Area */}
      <header className="mb-8 flex flex-col items-center text-center">
        <h1 className="text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
          DAEJEON RANDOM TRIP
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          고민 없이 떠나는 대전 당일치기 & 반일 랜덤 여행 코스 추천
        </p>
      </header>

      {/* Main Experience Container */}
      <main className="flex w-full flex-1 flex-col items-center justify-start">
        <MainExperience />
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-zinc-400 dark:text-zinc-600">
        &copy; {new Date().getFullYear()} Daejeon Random Trip MVP
      </footer>
    </div>
  );
}
