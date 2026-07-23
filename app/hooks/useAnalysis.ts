'use client';

import { useCallback } from 'react';
import { useGameStore } from '../store/game.store';
import { useStockfish } from './useStockfish';
import { classifyMove, isBrilliantMove, buildExplanation, normalizeCp } from '../lib/analyzer';
import { findOpening } from '../lib/opening-db';
import type { EngineEval } from '../types';

export function useAnalysis() {
  const { analyze } = useStockfish();

  const analyzeMove = useCallback(
    async (moveIndex: number) => {
      // Always read fresh state
      const { moves, settings, setAnalyzedMove } = useGameStore.getState();
      const move = moves[moveIndex];
      if (!move) return;

      try {
        // Eval before: reuse previous move's evalAfter if available
        let evalBefore: EngineEval;
        const prevEvalAfter = moveIndex > 0 ? moves[moveIndex - 1]?.evalAfter : null;
        if (prevEvalAfter) {
          evalBefore = prevEvalAfter;
        } else {
          evalBefore = await analyze(move.fenBefore, settings.analysisDepth, settings.analysisTime);
        }

        const evalAfter = await analyze(move.fen, settings.analysisDepth, settings.analysisTime);

        const brilliant = isBrilliantMove(evalBefore, evalAfter, move.uci, move.san);

        // Normalise to the moving side's perspective
        const cpBefore = move.color === 'b' ? -evalBefore.score : evalBefore.score;
        const cpAfter  = move.color === 'b' ? -evalAfter.score  : evalAfter.score;
        const mateBefore = move.color === 'b' && evalBefore.mate !== null ? -evalBefore.mate : evalBefore.mate;
        const mateAfter  = move.color === 'b' && evalAfter.mate  !== null ? -evalAfter.mate  : evalAfter.mate;

        const adjustedBefore: EngineEval = { ...evalBefore, score: normalizeCp(cpBefore, mateBefore) };
        const adjustedAfter:  EngineEval = { ...evalAfter,  score: normalizeCp(cpAfter,  mateAfter)  };

        const { category, scoreLoss } = classifyMove(adjustedBefore, adjustedAfter, false, brilliant);
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
    const sans = moves.map((m) => m.san);
    const op = findOpening(sans);
    setOpening(
      op ? { name: op.name, eco: op.eco, moves: op.moves, ply: op.moves.split(' ').length } : null
    );
  }, []);

  return { analyzeMove, updateOpening };
}
