'use client';

import { useGameStore } from '../../store/game.store';

export function OpeningInfo() {
  const { opening, moves } = useGameStore();

  if (moves.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800/60 rounded-lg border border-zinc-700/50 text-sm">
      <span className="text-amber-400 text-base">♜</span>
      {opening ? (
        <>
          <span className="font-semibold text-zinc-200">{opening.name}</span>
          <span className="text-zinc-500 text-xs">{opening.eco}</span>
          <span className="text-zinc-600 text-xs ml-auto">
            {opening.ply} {opening.ply === 1 ? 'move' : 'moves'} of theory
          </span>
        </>
      ) : (
        <span className="text-zinc-500 italic">Out of book</span>
      )}
    </div>
  );
}
