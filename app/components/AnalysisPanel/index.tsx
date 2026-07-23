'use client';

import { useGameStore } from '../../store/game.store';
import { CategoryBadge } from '../MoveHistory';

export function AnalysisPanel() {
  const { moves, currentMoveIndex, currentAnalyzingIndex } = useGameStore();

  const move = moves[currentMoveIndex];
  const isAnalyzing = currentAnalyzingIndex !== null;

  const bestMoveUci = move?.evalAfter?.bestMove ?? move?.evalBefore?.bestMove ?? null;
  const pv = move?.evalAfter?.pv ?? move?.evalBefore?.pv ?? [];
  const depth = move?.evalAfter?.depth ?? move?.evalBefore?.depth ?? null;
  const mate = move?.evalAfter?.mate ?? null;
  const cp = move?.evalAfter?.score ?? 0;

  const evalDisplay = () => {
    if (!move?.evalAfter) return '—';
    if (mate !== null) return `Mate in ${Math.abs(mate)}`;
    return (cp >= 0 ? '+' : '') + (cp / 100).toFixed(2);
  };

  return (
    <div className="flex flex-col gap-3 p-3 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-300">Analysis</h3>
        {isAnalyzing && (
          <span className="text-xs text-amber-400 animate-pulse">Analyzing…</span>
        )}
      </div>

      {move ? (
        <>
          {/* Move header */}
          <div className="flex items-center gap-2 bg-zinc-800 rounded-lg p-3">
            <span className="text-lg font-bold text-white">{move.san}</span>
            <CategoryBadge category={move.category} />
            <span className="text-sm text-zinc-400 ml-auto">
              {move.category
                ? move.category.charAt(0).toUpperCase() + move.category.slice(1)
                : '—'}
            </span>
          </div>

          {/* Explanation */}
          {move.explanation && (
            <div className="text-sm text-zinc-300 leading-relaxed bg-zinc-800/50 rounded-lg p-3">
              {move.explanation}
            </div>
          )}

          {/* Eval info */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-zinc-800 rounded-lg p-2 text-center">
              <div className="text-xs text-zinc-500 mb-1">Evaluation</div>
              <div className="text-sm font-mono font-bold text-white">{evalDisplay()}</div>
            </div>
            <div className="bg-zinc-800 rounded-lg p-2 text-center">
              <div className="text-xs text-zinc-500 mb-1">Depth</div>
              <div className="text-sm font-mono font-bold text-white">{depth ?? '—'}</div>
            </div>
            <div className="bg-zinc-800 rounded-lg p-2 text-center">
              <div className="text-xs text-zinc-500 mb-1">Score Loss</div>
              <div className="text-sm font-mono font-bold text-white">
                {move.evalAfter ? `${move.scoreLoss}cp` : '—'}
              </div>
            </div>
            <div className="bg-zinc-800 rounded-lg p-2 text-center">
              <div className="text-xs text-zinc-500 mb-1">Best Move</div>
              <div className="text-sm font-mono font-bold text-emerald-400">
                {bestMoveUci ?? '—'}
              </div>
            </div>
          </div>

          {/* Principal Variation */}
          {pv.length > 0 && (
            <div className="bg-zinc-800 rounded-lg p-3">
              <div className="text-xs text-zinc-500 mb-2">Principal Variation</div>
              <div className="font-mono text-xs text-zinc-300 break-all leading-relaxed">
                {pv.slice(0, 8).join(' ')}
                {pv.length > 8 ? ' …' : ''}
              </div>
            </div>
          )}

          {/* Eval before/after */}
          {move.evalBefore && move.evalAfter && (
            <div className="bg-zinc-800 rounded-lg p-3">
              <div className="text-xs text-zinc-500 mb-2">Score change</div>
              <div className="flex items-center gap-3 text-sm font-mono">
                <span className="text-zinc-300">
                  {move.color === 'w'
                    ? (move.evalBefore.score >= 0 ? '+' : '') + (move.evalBefore.score / 100).toFixed(2)
                    : ((-move.evalBefore.score) >= 0 ? '+' : '') + ((-move.evalBefore.score) / 100).toFixed(2)}
                </span>
                <span className="text-zinc-600">→</span>
                <span
                  className={
                    move.category === 'blunder' || move.category === 'mistake'
                      ? 'text-red-400'
                      : move.category === 'brilliant' || move.category === 'best'
                      ? 'text-emerald-400'
                      : 'text-zinc-300'
                  }
                >
                  {move.color === 'w'
                    ? (move.evalAfter.score >= 0 ? '+' : '') + (move.evalAfter.score / 100).toFixed(2)
                    : ((-move.evalAfter.score) >= 0 ? '+' : '') + ((-move.evalAfter.score) / 100).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-zinc-500 text-sm text-center py-8">
          Make a move to see analysis
        </div>
      )}
    </div>
  );
}
