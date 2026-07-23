'use client';

import { GameSetupModal, GameControls } from './components/GameControls';
import { ChessBoardComponent } from './components/ChessBoard';
import { EvaluationBar } from './components/EvaluationBar';
import { MoveHistory } from './components/MoveHistory';
import { AnalysisPanel } from './components/AnalysisPanel';
import { OpeningInfo } from './components/OpeningInfo';
import { Statistics } from './components/Statistics';
import { EvalChart } from './components/EvalChart';
import { useGameStore } from './store/game.store';

export default function Home() {
  const { phase } = useGameStore();

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Setup modal */}
      <GameSetupModal />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <span className="text-2xl">♟</span>
          <div>
            <h1 className="font-bold text-white text-lg leading-tight">AI Chess Coach</h1>
            <p className="text-xs text-zinc-500 leading-tight">Powered by Stockfish</p>
          </div>
        </div>
        <GameControls />
      </header>

      {/* Main layout */}
      {phase !== 'setup' && (
        <main className="flex flex-1 gap-4 p-4 max-w-[1400px] mx-auto w-full">
          {/* Left sidebar */}
          <aside className="hidden lg:flex flex-col gap-3 w-56 shrink-0">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex-1 flex flex-col">
              <MoveHistory />
            </div>
          </aside>

          {/* Center: board + eval bar */}
          <section className="flex flex-col gap-3 flex-1 min-w-0">
            <OpeningInfo />

            <div className="flex gap-3 items-stretch">
              {/* Eval bar */}
              <div className="hidden sm:flex w-8 shrink-0 py-2">
                <EvaluationBar />
              </div>

              {/* Board */}
              <div className="flex-1 min-w-0">
                <ChessBoardComponent />
              </div>
            </div>

            {/* Chart below board */}
            <EvalChart />

            {/* Stats */}
            <Statistics />

            {/* Move history on mobile */}
            <div className="lg:hidden bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden max-h-48">
              <MoveHistory />
            </div>
          </section>

          {/* Right sidebar: analysis */}
          <aside className="hidden md:flex flex-col gap-3 w-72 shrink-0">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl flex-1 overflow-hidden">
              <AnalysisPanel />
            </div>
          </aside>
        </main>
      )}
    </div>
  );
}
