'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '../../store/game.store';
import { normalizeCp } from '../../lib/analyzer';

export function EvaluationBar() {
  const { moves, currentMoveIndex, phase } = useGameStore();

  const currentMove = moves[currentMoveIndex];
  const evalData = currentMove?.evalAfter ?? currentMove?.evalBefore ?? null;

  let score = 0;
  if (evalData) {
    if (evalData.mate !== null) {
      score = evalData.mate > 0 ? 1500 : -1500;
    } else {
      score = normalizeCp(evalData.score, null);
    }
  }

  // Convert score to percentage (0-100), 50 = equal
  const clampedScore = Math.max(-600, Math.min(600, score));
  const whitePercent = 50 + (clampedScore / 600) * 50;
  const blackPercent = 100 - whitePercent;

  const displayEval = () => {
    if (!evalData) return '0.0';
    if (evalData.mate !== null) {
      return `M${Math.abs(evalData.mate)}`;
    }
    const cp = evalData.score / 100;
    return (cp >= 0 ? '+' : '') + cp.toFixed(1);
  };

  return (
    <div className="flex flex-col items-center gap-1 h-full">
      <div className="text-xs font-mono text-zinc-400 select-none">
        {score < 0 ? displayEval() : ''}
      </div>
      <div className="relative flex flex-col w-8 flex-1 rounded-full overflow-hidden border border-zinc-700 shadow-inner">
        {/* Black side */}
        <motion.div
          className="bg-zinc-900 w-full"
          animate={{ height: `${blackPercent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
        {/* White side */}
        <motion.div
          className="bg-white w-full flex-1"
          animate={{ height: `${whitePercent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
        {/* Center line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-zinc-500 opacity-50" />
      </div>
      <div className="text-xs font-mono text-zinc-400 select-none">
        {score >= 0 ? displayEval() : ''}
      </div>
    </div>
  );
}
