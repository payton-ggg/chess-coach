'use client';

import { useCallback, useRef } from 'react';
import { useGameStore } from '../store/game.store';
import { useStockfish } from './useStockfish';
import { classifyMove, isBrilliantMove, buildExplanation, normalizeCp } from '../lib/analyzer';
import { findOpening } from '../lib/opening-db';
import type { EngineEval } from '../types';

export function useAnalysis() {
  const { moves, setAnalyzedMove, setOpening, settings } = useGameStore();
  const { analyze } = useStockfish();
  const analyzingRef = useRef(false);

  const analyzeMove = useCallback(
    async (moveIndex: number) => {
      if (analyzingRef.current) return;
      const move = moves[moveIndex];
      if (!move) return;

      analyzingRef.current = true;

      try {
        // Evaluate position BEFORE the move
        let evalBefore: EngineEval;
        if (moveIndex > 0 && moves[moveIndex - 1].evalAfter) {
          evalBefore = moves[moveIndex - 1].evalAfter!;
        } else {
          evalBefore = await analyze(move.fenBefore, settings.analysisDepth, settings.analysisTime);
        }

        // Evaluate position AFTER the move
        const evalAfter = await analyze(move.fen, settings.analysisDepth, settings.analysisTime);

        const brilliant = isBrilliantMove(evalBefore, evalAfter, move.uci, move.san);

        // Correct sign for color perspective
        const cpBefore = normalizeCp(
          move.color === 'b' ? -evalBefore.score : evalBefore.score,
          move.color === 'b' && evalBefore.mate !== null ? -evalBefore.mate : evalBefore.mate
        );
        const cpAfter = normalizeCp(
          move.color === 'b' ? -evalAfter.score : evalAfter.score,
          move.color === 'b' && evalAfter.mate !== null ? -evalAfter.mate : evalAfter.mate
        );
        const adjustedBefore: EngineEval = { ...evalBefore, score: cpBefore };
        const adjustedAfter: EngineEval = { ...evalAfter, score: cpAfter };

        const { category, scoreLoss } = classifyMove(adjustedBefore, adjustedAfter, false, brilliant);

        const partialMove = { ...move, category, scoreLoss, evalBefore, evalAfter };
        const explanation = buildExplanation(partialMove);

        setAnalyzedMove(moveIndex, { evalBefore, evalAfter, category, scoreLoss, explanation });
      } catch (e) {
        console.error('Analysis error:', e);
      } finally {
        analyzingRef.current = false;
      }
    },
    [moves, analyze, setAnalyzedMove, settings]
  );

  const updateOpening = useCallback(() => {
    const sans = moves.map((m) => m.san);
    const op = findOpening(sans);
    setOpening(
      op
        ? { name: op.name, eco: op.eco, moves: op.moves, ply: op.moves.split(' ').length }
        : null
    );
  }, [moves, setOpening]);

  return { analyzeMove, updateOpening };
}
