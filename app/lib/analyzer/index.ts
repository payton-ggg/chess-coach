import type { EngineEval, MoveCategory, AnalyzedMove } from '../../types';

// Scores are always from White's POV in UCI. Clamp to ±1500cp.
export function normalizeCp(score: number, mate: number | null): number {
  if (mate !== null) {
    return mate > 0 ? 10000 - Math.abs(mate) : -(10000 - Math.abs(mate));
  }
  return Math.max(-1500, Math.min(1500, score));
}

// evalBefore / evalAfter MUST already be in the moving side's perspective
// (positive = good for the mover) before calling this.
export function classifyMove(
  cpBefore: number,
  cpAfter: number,
  isBrilliant: boolean
): { category: MoveCategory; scoreLoss: number } {
  if (isBrilliant) {
    const loss = Math.max(0, cpBefore - cpAfter);
    return { category: 'brilliant', scoreLoss: loss };
  }

  // how many centipawns the mover lost by playing this move
  const cpLoss = Math.max(0, cpBefore - cpAfter);

  let category: MoveCategory;
  if (cpLoss <= 10)       category = 'best';
  else if (cpLoss <= 25)  category = 'excellent';
  else if (cpLoss <= 50)  category = 'good';
  else if (cpLoss <= 100) category = 'inaccuracy';
  else if (cpLoss <= 200) category = 'mistake';
  else                    category = 'blunder';

  return { category, scoreLoss: cpLoss };
}

export function isBrilliantMove(
  evalBefore: EngineEval,
  evalAfter: EngineEval,
  uci: string,
  san: string,
  color: 'w' | 'b'
): boolean {
  const sign = color === 'w' ? 1 : -1;
  const before = sign * normalizeCp(evalBefore.score, evalBefore.mate);
  const after  = sign * normalizeCp(evalAfter.score,  evalAfter.mate);

  // Must not be losing
  if (after < before - 50) return false;

  const isSacrifice = san.includes('x') && /[RQBN]/.test(san[0] ?? '');
  const leadsToMate = evalAfter.mate !== null && sign * evalAfter.mate > 0 && evalBefore.mate === null;
  const isOnlyMove  = evalBefore.pv?.[0] === uci;

  return (leadsToMate && isSacrifice) ||
         (leadsToMate && isOnlyMove)  ||
         (isSacrifice && isOnlyMove && after >= before - 30);
}

export function buildExplanation(move: Partial<AnalyzedMove>): string {
  const { san, category, scoreLoss, evalAfter, color } = move;
  if (!category || !san) return '';

  const sign = color === 'w' ? 1 : -1;
  const scoreStr = evalAfter
    ? evalAfter.mate !== null
      ? `Mate in ${Math.abs(evalAfter.mate)}`
      : `${((sign * evalAfter.score) / 100).toFixed(2)}`
    : '';

  switch (category) {
    case 'brilliant':
      return `Brilliant move! ${san} is a spectacular play — likely a sacrifice or unique tactical idea leading to a decisive advantage. ${scoreStr}`;
    case 'great':
      return `Great move! ${san} is one of the best continuations in this position. ${scoreStr}`;
    case 'best':
      return `Best move. ${san} is the engine's top choice. ${scoreStr}`;
    case 'excellent':
      return `Excellent move. ${san} is very strong, only ${scoreLoss}cp from optimal. ${scoreStr}`;
    case 'good':
      return `Good move. ${san} is a solid continuation (${scoreLoss}cp loss). ${scoreStr}`;
    case 'book':
      return `Book move. ${san} follows established opening theory.`;
    case 'inaccuracy':
      return `Inaccuracy. ${san} loses ${scoreLoss}cp — a more precise continuation was available. ${scoreStr}`;
    case 'mistake':
      return `Mistake! ${san} loses ${scoreLoss}cp and significantly weakens your position. ${scoreStr}`;
    case 'blunder':
      return `Blunder! ${san} drops ${scoreLoss}cp. Review this position carefully. ${scoreStr}`;
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

  const sign = color === 'w' ? 1 : -1;

  const totalLoss = colorMoves.reduce((acc, m) => {
    const before = sign * normalizeCp(m.evalBefore!.score, m.evalBefore!.mate);
    const after  = sign * normalizeCp(m.evalAfter!.score,  m.evalAfter!.mate);
    const wBefore = cpToWinProb(before);
    const wAfter  = cpToWinProb(after);
    return acc + Math.max(0, wBefore - wAfter);
  }, 0);

  const avgLoss = totalLoss / colorMoves.length;
  return Math.round(Math.max(0, (1 - avgLoss) * 100) * 10) / 10;
}
