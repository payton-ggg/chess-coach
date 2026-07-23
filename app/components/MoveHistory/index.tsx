'use client';

import { useGameStore } from '../../store/game.store';
import type { MoveCategory } from '../../types';

const CATEGORY_CONFIG: Record<NonNullable<MoveCategory>, { label: string; color: string; icon: string }> = {
  brilliant: { label: 'Brilliant', color: 'text-cyan-400', icon: '✦✦' },
  great:     { label: 'Great',     color: 'text-blue-400',  icon: '✦' },
  best:      { label: 'Best',      color: 'text-emerald-400', icon: '★' },
  excellent: { label: 'Excellent', color: 'text-green-400', icon: '✓' },
  good:      { label: 'Good',      color: 'text-lime-400',  icon: '·' },
  book:      { label: 'Book',      color: 'text-amber-300', icon: '⊙' },
  inaccuracy:{ label: 'Inaccuracy',color: 'text-yellow-400',icon: '?!' },
  mistake:   { label: 'Mistake',   color: 'text-orange-400',icon: '?' },
  blunder:   { label: 'Blunder',   color: 'text-red-500',   icon: '??' },
  forced:    { label: 'Forced',    color: 'text-zinc-400',  icon: '□' },
};

export function CategoryBadge({ category }: { category: MoveCategory }) {
  if (!category) return null;
  const cfg = CATEGORY_CONFIG[category];
  return (
    <span className={`text-xs font-bold ${cfg.color}`} title={cfg.label}>
      {cfg.icon}
    </span>
  );
}

export function MoveHistory() {
  const { moves, currentMoveIndex, setCurrentMoveIndex, chess } = useGameStore();

  const pairs: Array<[typeof moves[0] | null, typeof moves[0] | null]> = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push([moves[i] ?? null, moves[i + 1] ?? null]);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 border-b border-zinc-800 text-sm font-semibold text-zinc-300">
        Moves
      </div>
      <div className="flex-1 overflow-y-auto">
        {pairs.length === 0 ? (
          <div className="text-zinc-500 text-sm px-3 py-4 text-center">
            No moves yet
          </div>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {pairs.map(([white, black], idx) => (
                <tr
                  key={idx}
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/30"
                >
                  <td className="px-2 py-1 text-zinc-500 w-8 select-none">{idx + 1}.</td>
                  <td
                    className={`px-2 py-1 cursor-pointer rounded transition-colors ${
                      white && moves.indexOf(white) === currentMoveIndex
                        ? 'bg-zinc-700 text-white font-semibold'
                        : 'text-zinc-200 hover:text-white'
                    }`}
                    onClick={() => white && setCurrentMoveIndex(moves.indexOf(white))}
                  >
                    <span className="flex items-center gap-1">
                      {white?.san}
                      {white && <CategoryBadge category={white.category} />}
                    </span>
                  </td>
                  <td
                    className={`px-2 py-1 cursor-pointer rounded transition-colors ${
                      black && moves.indexOf(black) === currentMoveIndex
                        ? 'bg-zinc-700 text-white font-semibold'
                        : 'text-zinc-200 hover:text-white'
                    }`}
                    onClick={() => black && setCurrentMoveIndex(moves.indexOf(black))}
                  >
                    {black && (
                      <span className="flex items-center gap-1">
                        {black.san}
                        <CategoryBadge category={black.category} />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
