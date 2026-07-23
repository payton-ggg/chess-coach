import { create } from 'zustand';
import { Chess } from 'chess.js';
import type { AnalyzedMove, GamePhase, GameResult, GameSettings, OpeningInfo } from '../types';

interface GameState {
  chess: Chess;
  fen: string;
  phase: GamePhase;
  moves: AnalyzedMove[];
  currentMoveIndex: number;
  result: GameResult | null;
  settings: GameSettings;
  playerColor: 'w' | 'b';
  isComputerTurn: boolean;
  opening: OpeningInfo | null;
  currentAnalyzingIndex: number | null;

  initGame: (settings: GameSettings) => void;
  makeMove: (uci: string) => boolean;
  setAnalyzedMove: (index: number, data: Partial<AnalyzedMove>) => void;
  setOpening: (opening: OpeningInfo | null) => void;
  setPhase: (phase: GamePhase) => void;
  setResult: (result: GameResult) => void;
  setCurrentMoveIndex: (index: number) => void;
  setCurrentAnalyzingIndex: (index: number | null) => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  resetGame: () => void;
}

const DEFAULT_SETTINGS: GameSettings = {
  playerColor: 'w',
  opponentElo: 1500,
  opponentDepth: 8,
  opponentTime: 1000,
  autoAnalyze: true,
  showArrows: true,
  animationSpeed: 'normal',
  boardTheme: 'default',
  pieceStyle: 'default',
  analysisDepth: 18,
  analysisTime: 2000,
};

export const useGameStore = create<GameState>((set, get) => ({
  chess: new Chess(),
  fen: new Chess().fen(),
  phase: 'setup',
  moves: [],
  currentMoveIndex: -1,
  result: null,
  settings: DEFAULT_SETTINGS,
  playerColor: 'w',
  isComputerTurn: false,
  opening: null,
  currentAnalyzingIndex: null,

  initGame: (settings) => {
    const chess = new Chess();
    const playerColor =
      settings.playerColor === 'random'
        ? Math.random() < 0.5
          ? 'w'
          : 'b'
        : settings.playerColor;

    set({
      chess,
      fen: chess.fen(),
      phase: 'playing',
      moves: [],
      currentMoveIndex: -1,
      result: null,
      settings,
      playerColor,
      isComputerTurn: playerColor === 'b',
      opening: null,
      currentAnalyzingIndex: null,
    });
  },

  makeMove: (uci) => {
    const { chess, moves, playerColor } = get();
    const fenBefore = chess.fen();
    try {
      const from = uci.slice(0, 2);
      const to = uci.slice(2, 4);
      const promotion = uci.length > 4 ? uci[4] : undefined;
      const result = chess.move({ from, to, promotion });
      if (!result) return false;

      const newMove: AnalyzedMove = {
        san: result.san,
        uci,
        fen: chess.fen(),
        fenBefore,
        moveNumber: Math.ceil(moves.length / 2) + 1,
        color: result.color,
        evalBefore: null,
        evalAfter: null,
        category: null,
        scoreLoss: 0,
        explanation: '',
        timestamp: Date.now(),
      };

      const newMoves = [...moves, newMove];
      const newIndex = newMoves.length - 1;

      let phase: GamePhase = 'playing';
      let gameResult: GameResult | null = null;

      if (chess.isGameOver()) {
        phase = 'finished';
        if (chess.isCheckmate()) {
          gameResult = {
            result: chess.turn() === 'w' ? '0-1' : '1-0',
            reason: 'checkmate',
          };
        } else if (chess.isStalemate()) {
          gameResult = { result: '1/2-1/2', reason: 'stalemate' };
        } else if (chess.isThreefoldRepetition()) {
          gameResult = { result: '1/2-1/2', reason: 'repetition' };
        } else if (chess.isInsufficientMaterial()) {
          gameResult = { result: '1/2-1/2', reason: 'insufficient' };
        } else {
          gameResult = { result: '1/2-1/2', reason: 'fifty-move' };
        }
      }

      set({
        fen: chess.fen(),
        moves: newMoves,
        currentMoveIndex: newIndex,
        isComputerTurn: phase === 'playing' && chess.turn() !== playerColor,
        phase,
        result: gameResult,
        currentAnalyzingIndex: newIndex,
      });

      return true;
    } catch {
      return false;
    }
  },

  setAnalyzedMove: (index, data) => {
    const { moves } = get();
    const updated = [...moves];
    updated[index] = { ...updated[index], ...data };
    set({ moves: updated });
  },

  setOpening: (opening) => set({ opening }),
  setPhase: (phase) => set({ phase }),
  setResult: (result) => set({ result }),
  setCurrentMoveIndex: (index) => set({ currentMoveIndex: index }),
  setCurrentAnalyzingIndex: (index) => set({ currentAnalyzingIndex: index }),
  updateSettings: (settings) =>
    set((s) => ({ settings: { ...s.settings, ...settings } })),

  resetGame: () => {
    const chess = new Chess();
    set({
      chess,
      fen: chess.fen(),
      phase: 'setup',
      moves: [],
      currentMoveIndex: -1,
      result: null,
      isComputerTurn: false,
      opening: null,
      currentAnalyzingIndex: null,
    });
  },
}));
