export type MoveCategory =
  | 'brilliant'
  | 'great'
  | 'best'
  | 'excellent'
  | 'good'
  | 'book'
  | 'inaccuracy'
  | 'mistake'
  | 'blunder'
  | 'forced'
  | null;

export interface EngineEval {
  score: number; // centipawns (positive = white ahead)
  mate: number | null; // moves to mate (null if not forced)
  bestMove: string; // UCI
  pv: string[]; // principal variation in UCI
  depth: number;
}

export interface AnalyzedMove {
  san: string;
  uci: string;
  fen: string; // position AFTER the move
  fenBefore: string;
  moveNumber: number;
  color: 'w' | 'b';
  evalBefore: EngineEval | null;
  evalAfter: EngineEval | null;
  category: MoveCategory;
  scoreLoss: number; // centipawns lost (always >=0)
  explanation: string;
  timestamp: number;
}

export interface GameSettings {
  playerColor: 'w' | 'b' | 'random';
  opponentElo: number;
  opponentDepth: number;
  opponentTime: number; // ms per move
  autoAnalyze: boolean;
  showArrows: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  boardTheme: 'default' | 'green' | 'blue' | 'brown';
  pieceStyle: 'default' | 'cburnett' | 'alpha';
  analysisDepth: number;
  analysisTime: number;
}

export interface GameResult {
  result: '1-0' | '0-1' | '1/2-1/2' | '*';
  reason:
    | 'checkmate'
    | 'stalemate'
    | 'repetition'
    | 'fifty-move'
    | 'insufficient'
    | 'resignation'
    | 'timeout'
    | null;
}

export type GamePhase = 'setup' | 'playing' | 'analyzing' | 'finished';

export interface OpeningInfo {
  name: string;
  eco: string;
  moves: string; // PGN moves string
  ply: number; // how many plies covered
}

export interface GameStats {
  white: SideStats;
  black: SideStats;
}

export interface SideStats {
  accuracy: number;
  brilliant: number;
  great: number;
  best: number;
  excellent: number;
  good: number;
  book: number;
  inaccuracy: number;
  mistake: number;
  blunder: number;
  avgCentipawnLoss: number;
  bestMove: string | null;
  worstMove: string | null;
  longestBestStreak: number;
}

export const ELO_LEVELS = [
  { elo: 600, depth: 2, label: 'Beginner' },
  { elo: 800, depth: 3, label: 'Novice' },
  { elo: 1000, depth: 4, label: 'Amateur' },
  { elo: 1200, depth: 6, label: 'Intermediate' },
  { elo: 1500, depth: 8, label: 'Club Player' },
  { elo: 1800, depth: 10, label: 'Advanced' },
  { elo: 2000, depth: 12, label: 'Expert' },
  { elo: 2400, depth: 15, label: 'Master' },
  { elo: 2800, depth: 18, label: 'Grandmaster' },
] as const;
