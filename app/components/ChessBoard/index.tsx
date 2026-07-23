'use client';

import { Chessboard } from 'react-chessboard';
import { useGameStore } from '../../store/game.store';
import { useChessGame } from '../../hooks/useChessGame';
import type { Square } from 'chess.js';
import { useMemo } from 'react';

const BOARD_THEMES = {
  default: { light: '#f0d9b5', dark: '#b58863' },
  green: { light: '#ffffdd', dark: '#86a666' },
  blue: { light: '#dee3e6', dark: '#8ca2ad' },
  brown: { light: '#f0d9b5', dark: '#946f51' },
};

export function ChessBoardComponent() {
  const { fen, phase, playerColor, settings, moves, currentMoveIndex } = useGameStore();
  const { onDrop } = useChessGame();

  const theme = BOARD_THEMES[settings.boardTheme] ?? BOARD_THEMES.default;

  // Show arrows for best move suggestion
  const arrows = useMemo(() => {
    if (!settings.showArrows) return [];
    const move = moves[currentMoveIndex];
    if (!move?.evalAfter?.bestMove) return [];
    const bm = move.evalAfter.bestMove;
    if (bm.length < 4) return [];
    return [
      {
        from: bm.slice(0, 2) as Square,
        to: bm.slice(2, 4) as Square,
        color: 'rgba(0,128,255,0.6)',
        brushName: 'blue',
      },
    ];
  }, [moves, currentMoveIndex, settings.showArrows]);

  // Highlight squares for last move
  const customSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    const move = moves[currentMoveIndex];
    if (move?.uci && move.uci.length >= 4) {
      const fromSq = move.uci.slice(0, 2);
      const toSq = move.uci.slice(2, 4);
      const highlight = { backgroundColor: 'rgba(255, 255, 0, 0.35)' };
      styles[fromSq] = highlight;
      styles[toSq] = highlight;
    }
    return styles;
  }, [moves, currentMoveIndex]);

  const boardOrientation = playerColor === 'b' ? 'black' : 'white';

  const isDraggable = phase === 'playing';

  return (
    <div className="w-full aspect-square max-w-[560px] mx-auto rounded-lg overflow-hidden shadow-2xl">
      <Chessboard
        id="main-board"
        position={fen}
        onPieceDrop={onDrop}
        boardOrientation={boardOrientation}
        isDraggablePiece={({ piece }) => {
          if (!isDraggable) return false;
          const pieceColor = piece[0]; // 'w' or 'b'
          return pieceColor === playerColor;
        }}
        customBoardStyle={{ borderRadius: '4px' }}
        customLightSquareStyle={{ backgroundColor: theme.light }}
        customDarkSquareStyle={{ backgroundColor: theme.dark }}
        customSquareStyles={customSquareStyles}
        customArrows={arrows as any}
        animationDuration={
          settings.animationSpeed === 'fast'
            ? 100
            : settings.animationSpeed === 'slow'
            ? 400
            : 200
        }
        showBoardNotation
        promotionDialogVariant="modal"
      />
    </div>
  );
}
