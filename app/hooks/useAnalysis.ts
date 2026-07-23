'use client';

import { useCallback } from 'react';
import { useGameStore } from '../store/game.store';
import { useStockfish } from './useStockfish';
import { classifyMove, isBrilliantMove, buildExplanation, normalizeCp } from '../lib/analyzer';
import { findOpening } from '../lib/opening-db';

export function useAnalysis() {
  const { analyze } = useStockfish();

  const analyzeMove = useCallback(
    async (moveIndex: number) => {
      const { moves, settings, setAnalyzedMove } = useGameStore.getState();
      const move = moves[moveIndex];
      if (!move) return;

      try {
        // Reuse previous evalAfter as evalBefore when possible
        const prevEvalAfter = moveIndex > 0 ? moves[moveIndex - 1]?.evalAfter : null;
        const evalBefore = prevEvalAfter
          ? prevEvalAfter
          : await analyze(move.fenBefore, settings.analysisDepth, settings.analysisTime);

        const evalAfter = await analyze(move.fen, settings.analysisDepth, settings.analysisTime);

        const sign = move.color === 'w' ? 1 : -1;

        // Convert to the moving side's perspective (positive = good for mover)
        const cpBefore = sign * normalizeCp(evalBefore.score, evalBefore.mate);
        const cpAfter  = sign * normalizeCp(evalAfter.score,  evalAfter.mate);

        const brilliant = isBrilliantMove(evalBefore, evalAfter, move.uci, move.san, move.color);
        const { category, scoreLoss } = classifyMove(cpBefore, cpAfter, brilliant);
        const explanation = buildExplanation({ ...move, category, scoreLoss, evalAfter });

        setAnalyzedMove(moveIndex, { evalBefore, evalAfter, category, scoreLoss, explanation });
      } catch (e) {
        console.error('Analysis error:', e);
      }
    },
    [analyze]
  );

  const updateOpening = useCallback(() => {
    const { moves, setOpening } = useGameStore.getState();
    const op = findOpening(moves.map((m) => m.san));
    setOpening(
      op ? { name: op.name, eco: op.eco, moves: op.moves, ply: op.moves.split(' ').length } : null
    );
  }, []);

  return { analyzeMove, updateOpening };
}
