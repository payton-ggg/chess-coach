import type { EngineEval, MoveCategory, AnalyzedMove } from '../../types';

export function normalizeCp(score: number, mate: number | null): number {
  if (mate !== null) {
    return mate > 0 ? 10000 - mate : -10000 + Math.abs(mate);
  }
  return Math.max(-1500, Math.min(1500, score));
}

export function classifyMove(
  evalBefore: EngineEval,
  evalAfter: EngineEval,
  isBookMove: boolean,
  isBrilliant: boolean
): { category: MoveCategory; scoreLoss: number } {
  if (isBookMove) return { category: 'book', scoreLoss: 0 };

  const before = normalizeCp(evalBefore.score, evalBefore.mate);
  const after = normalizeCp(evalAfter.score, evalAfter.mate);

  // Score is always from white's perspective; loss is relative to whose turn it was
  const colorSign = evalBefore.score !== undefined ? 1 : 1;
  const loss = before - after; // positive = white lost material

  // When it's black's turn, white gain = black loss
  const actualLoss = colorSign * loss;

  const absBefore = Math.abs(before);
  const absAfter = Math.abs(after);
  let cpLoss = absBefore - absAfter;
  // If signs flipped (blunder that changes who's winning)
  if (Math.sign(before) !== Math.sign(after) && before !== 0 && after !== 0) {
    cpLoss = Math.abs(before) + Math.abs(after);
  }

  if (isBrilliant) return { category: 'brilliant', scoreLoss: Math.max(0, cpLoss) };

  // best move played
  const isBestMove =
    evalAfter.bestMove === undefined ||
    evalBefore.bestMove === undefined ||
    cpLoss <= 10;

  let category: MoveCategory;

  if (cpLoss <= 5) {
    category = 'best';
  } else if (cpLoss <= 15) {
    category = 'excellent';
  } else if (cpLoss <= 30) {
    category = 'good';
  } else if (cpLoss <= 60) {
    category = 'inaccuracy';
  } else if (cpLoss <= 120) {
    category = 'mistake';
  } else {
    category = 'blunder';
  }

  return { category, scoreLoss: Math.max(0, cpLoss) };
}

export function isBrilliantMove(
  evalBefore: EngineEval,
  evalAfter: EngineEval,
  uci: string,
  san: string
): boolean {
  // Must be close to best move
  const cpDiff =
    Math.abs(normalizeCp(evalBefore.score, evalBefore.mate)) -
    Math.abs(normalizeCp(evalAfter.score, evalAfter.mate));
  if (cpDiff < -10) return false;

  const isSacrifice = san.includes('x') && /[RQBN]/.test(san[0] || '');
  const leadsToMate =
    evalAfter.mate !== null && evalAfter.mate > 0 && evalBefore.mate === null;
  const prevBest = evalBefore.pv?.[0];
  const isOnlyMove = prevBest === uci;

  if (leadsToMate && isSacrifice) return true;
  if (leadsToMate && isOnlyMove) return true;
  if (isSacrifice && isOnlyMove && cpDiff < 50) return true;

  return false;
}

export function buildExplanation(move: Partial<AnalyzedMove>): string {
  const { san, category, scoreLoss, evalAfter } = move;

  if (!category || !san) return '';

  const scoreStr =
    evalAfter?.mate !== null && evalAfter?.mate !== undefined
      ? `Mate in ${Math.abs(evalAfter.mate)}`
      : evalAfter
      ? `${(evalAfter.score / 100).toFixed(2)}`
      : '';

  switch (category) {
    case 'brilliant':
      return `Brilliant move! ${san} is a spectacular play — likely involving a sacrifice or a unique tactical idea that wins material or leads to a decisive advantage. ${scoreStr}`;
    case 'great':
      return `Great move! ${san} is one of the best continuations in this position. ${scoreStr}`;
    case 'best':
      return `Best move. ${san} is the engine's top choice. ${scoreStr}`;
    case 'excellent':
      return `Excellent move. ${san} is very strong, losing only ${scoreLoss} centipawns from optimal. ${scoreStr}`;
    case 'good':
      return `Good move. ${san} is a solid continuation. Minor inaccuracies (${scoreLoss}cp) can be improved, but this is playable. ${scoreStr}`;
    case 'book':
      return `Book move. ${san} follows established opening theory.`;
    case 'inaccuracy':
      return `Inaccuracy. ${san} loses ${scoreLoss} centipawns. The position could have been handled better — look for more precise continuations. ${scoreStr}`;
    case 'mistake':
      return `Mistake! ${san} loses ${scoreLoss} centipawns. This significantly weakens your position. Consider what you missed. ${scoreStr}`;
    case 'blunder':
      return `Blunder! ${san} drops ${scoreLoss} centipawns. This is a serious error that may cost the game. Review this position carefully. ${scoreStr}`;
    default:
      return '';
  }
}

export function cpToWinProb(cp: number): number {
  return 1 / (1 + Math.pow(10, -cp / 400));
}

export function calcAccuracy(moves: AnalyzedMove[], color: 'w' | 'b'): number {
  const colorMoves = moves.filter((m) => m.color === color && m.evalBefore && m.evalAfter);
  if (colorMoves.length === 0) return 100;

  const totalWinLoss = colorMoves.reduce((acc, m) => {
    const before = normalizeCp(m.evalBefore!.score, m.evalBefore!.mate);
    const after = normalizeCp(m.evalAfter!.score, m.evalAfter!.mate);
    const wBefore = cpToWinProb(color === 'w' ? before : -before);
    const wAfter = cpToWinProb(color === 'w' ? after : -after);
    return acc + Math.max(0, wBefore - wAfter);
  }, 0);

  const avgLoss = totalWinLoss / colorMoves.length;
  return Math.round(Math.max(0, (1 - avgLoss) * 100) * 10) / 10;
}
