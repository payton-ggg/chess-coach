'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useGameStore } from '../store/game.store';
import { useStockfish } from './useStockfish';
import { useAnalysis } from './useAnalysis';

export function useChessGame() {
  const {
    chess,
    makeMove,
    phase,
    isComputerTurn,
    settings,
    currentAnalyzingIndex,
    moves,
    setCurrentAnalyzingIndex,
  } = useGameStore();

  const { analyze, getBestMove } = useStockfish();
  const { analyzeMove, updateOpening } = useAnalysis();
  const computerThinkingRef = useRef(false);

  // Analyze newly added move
  useEffect(() => {
    if (currentAnalyzingIndex === null) return;
    if (phase === 'playing' || phase === 'finished') {
      analyzeMove(currentAnalyzingIndex).then(() => {
        setCurrentAnalyzingIndex(null);
        updateOpening();
      });
    }
  }, [currentAnalyzingIndex]);

  // Computer move
  useEffect(() => {
    if (!isComputerTurn || phase !== 'playing' || computerThinkingRef.current) return;

    computerThinkingRef.current = true;
    const fen = chess.fen();

    getBestMove(fen, settings.opponentDepth, settings.opponentTime, settings.opponentElo)
      .then((uci) => {
        if (uci) makeMove(uci);
      })
      .finally(() => {
        computerThinkingRef.current = false;
      });
  }, [isComputerTurn, phase]);

  const onDrop = useCallback(
    (sourceSquare: string, targetSquare: string, piece: string): boolean => {
      if (phase !== 'playing') return false;
      if (isComputerTurn) return false;

      const isPromotion =
        piece.toLowerCase().includes('p') &&
        ((piece[0] === 'w' && targetSquare[1] === '8') ||
          (piece[0] === 'b' && targetSquare[1] === '1'));

      const uci = `${sourceSquare}${targetSquare}${isPromotion ? 'q' : ''}`;
      return makeMove(uci);
    },
    [phase, isComputerTurn, makeMove]
  );

  return { onDrop };
}
