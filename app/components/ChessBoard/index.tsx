'use client';

import { Chessboard } from 'react-chessboard';
import type { PieceDropHandlerArgs, PieceHandlerArgs, Arrow } from 'react-chessboard';
import { useGameStore } from '../../store/game.store';
import { useChessGame } from '../../hooks/useChessGame';
import { useMemo } from 'react';

const BOARD_THEMES = {
  default: { light: '#f0d9b5', dark: '#b58863' },
  green:   { light: '#ffffdd', dark: '#86a666' },
  blue:    { light: '#dee3e6', dark: '#8ca2ad' },
  brown:   { light: '#f0d9b5', dark: '#946f51' },
};

export function ChessBoardComponent() {
  const { fen, phase, playerColor, settings, moves, currentMoveIndex } = useGameStore();
  const { onDrop } = useChessGame();

  const theme = BOARD_THEMES[settings.boardTheme] ?? BOARD_THEMES.default;

  const arrows = useMemo<Arrow[]>(() => {
    if (!settings.showArrows) return [];
    const move = moves[currentMoveIndex];
    const bm = move?.evalAfter?.bestMove;
    if (!bm || bm.length < 4) return [];
    return [{ startSquare: bm.slice(0, 2), endSquare: bm.slice(2, 4), color: 'rgba(0,128,255,0.7)' }];
  }, [moves, currentMoveIndex, settings.showArrows]);

  const squareStyles = useMemo<Record<string, React.CSSProperties>>(() => {
    const styles: Record<string, React.CSSProperties> = {};
    const move = moves[currentMoveIndex];
    if (move?.uci && move.uci.length >= 4) {
      const highlight = { backgroundColor: 'rgba(255,255,0,0.35)' };
      styles[move.uci.slice(0, 2)] = highlight;
      styles[move.uci.slice(2, 4)] = highlight;
    }
    return styles;
  }, [moves, currentMoveIndex]);

  const handleDrop = ({ sourceSquare, targetSquare, piece }: PieceDropHandlerArgs): boolean => {
    if (!targetSquare) return false;
    const isPromotion =
      piece.pieceType.toLowerCase() === 'p' &&
      ((piece.pieceType[0] === 'w' && targetSquare[1] === '8') ||
        (piece.pieceType[0] === 'b' && targetSquare[1] === '1'));
    return onDrop(sourceSquare, targetSquare, piece.pieceType);
  };

  const canDrag = ({ piece }: PieceHandlerArgs): boolean => {
    if (phase !== 'playing') return false;
    return piece.pieceType[0] === playerColor;
  };

  const animMs =
    settings.animationSpeed === 'fast' ? 100 :
    settings.animationSpeed === 'slow' ? 400 : 200;

  return (
    <div className="w-full aspect-square max-w-[560px] mx-auto rounded-lg overflow-hidden shadow-2xl">
      <Chessboard
        options={{
          position: fen,
          boardOrientation: playerColor === 'b' ? 'black' : 'white',
          onPieceDrop: handleDrop,
          canDragPiece: canDrag,
          allowDragging: phase === 'playing',
          lightSquareStyle: { backgroundColor: theme.light },
          darkSquareStyle: { backgroundColor: theme.dark },
          squareStyles,
          arrows,
          animationDurationInMs: animMs,
          showNotation: true,
          boardStyle: { borderRadius: '4px' },
          allowDrawingArrows: false,
        }}
      />
    </div>
  );
}
