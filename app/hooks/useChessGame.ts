'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useGameStore } from '../store/game.store';
import { useStockfish } from './useStockfish';
import { useAnalysis } from './useAnalysis';

export function useChessGame() {
  const { getBestMove } = useStockfish();
  const { analyzeMove, updateOpening } = useAnalysis();
  const computerThinkingRef = useRef(false);

  // Read latest store state inside effects via ref to avoid stale closure
  const storeRef = useRef(useGameStore.getState());
  useEffect(() => {
    return useGameStore.subscribe((state) => { storeRef.current = state; });
  }, []);

  // Analyze newly added move
  useEffect(() => {
    return useGameStore.subscribe((state, prev) => {
      if (
        state.currentAnalyzingIndex !== null &&
        state.currentAnalyzingIndex !== prev.currentAnalyzingIndex &&
        (state.phase === 'playing' || state.phase === 'finished')
      ) {
        const idx = state.currentAnalyzingIndex;
        analyzeMove(idx).then(() => {
          useGameStore.getState().setCurrentAnalyzingIndex(null);
          updateOpening();
        });
      }
    });
  }, [analyzeMove, updateOpening]);

  // Computer move — triggers whenever isComputerTurn flips to true
  useEffect(() => {
    return useGameStore.subscribe((state, prev) => {
      if (
        state.isComputerTurn &&
        !prev.isComputerTurn &&
        state.phase === 'playing' &&
        !computerThinkingRef.current
      ) {
        computerThinkingRef.current = true;
        const { chess, settings, makeMove } = storeRef.current;
        const fen = chess.fen();

        getBestMove(fen, settings.opponentDepth, settings.opponentTime, settings.opponentElo)
          .then((uci) => {
            if (uci && useGameStore.getState().phase === 'playing') {
              makeMove(uci);
            }
          })
          .finally(() => {
            computerThinkingRef.current = false;
          });
      }
    });
  }, [getBestMove]);

  const onDrop = useCallback(
    (sourceSquare: string, targetSquare: string, piece: string): boolean => {
      const { phase, isComputerTurn, makeMove } = storeRef.current;
      if (phase !== 'playing' || isComputerTurn) return false;

      const isPromotion =
        piece.toLowerCase().includes('p') &&
        ((piece[0] === 'w' && targetSquare[1] === '8') ||
          (piece[0] === 'b' && targetSquare[1] === '1'));

      return makeMove(`${sourceSquare}${targetSquare}${isPromotion ? 'q' : ''}`);
    },
    []
  );

  return { onDrop };
}
