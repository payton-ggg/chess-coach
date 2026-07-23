'use client';

import { useGameStore } from '../../store/game.store';
import { calcAccuracy } from '../../lib/analyzer';
import type { MoveCategory, SideStats } from '../../types';

const CATEGORIES: NonNullable<MoveCategory>[] = [
  'brilliant', 'great', 'best', 'excellent', 'good', 'book', 'inaccuracy', 'mistake', 'blunder',
];

const CAT_COLORS: Record<NonNullable<MoveCategory>, string> = {
  brilliant:  'bg-cyan-500',
  great:      'bg-blue-500',
  best:       'bg-emerald-500',
  excellent:  'bg-green-500',
  good:       'bg-lime-500',
  book:       'bg-amber-400',
  inaccuracy: 'bg-yellow-500',
  mistake:    'bg-orange-500',
  blunder:    'bg-red-600',
  forced:     'bg-zinc-500',
};

const CAT_LABELS: Record<NonNullable<MoveCategory>, string> = {
  brilliant:  'Brilliant',
  great:      'Great',
  best:       'Best',
  excellent:  'Excellent',
  good:       'Good',
  book:       'Book',
  inaccuracy: 'Inaccuracy',
  mistake:    'Mistake',
  blunder:    'Blunder',
  forced:     'Forced',
};

function buildSideStats(moves: ReturnType<typeof useGameStore.getState>['moves'], color: 'w' | 'b'): SideStats {
  const colorMoves = moves.filter((m) => m.color === color);
  const stats: SideStats = {
    accuracy: calcAccuracy(moves, color),
    brilliant: 0, great: 0, best: 0, excellent: 0, good: 0,
    book: 0, inaccuracy: 0, mistake: 0, blunder: 0,
    avgCentipawnLoss: 0,
    bestMove: null,
    worstMove: null,
    longestBestStreak: 0,
  };

  let totalLoss = 0;
  let minLoss = Infinity;
  let maxLoss = -Infinity;
  let streak = 0;
  let maxStreak = 0;

  colorMoves.forEach((m) => {
    if (m.category && m.category !== 'forced') {
      (stats as any)[m.category] = ((stats as any)[m.category] ?? 0) + 1;
    }
    totalLoss += m.scoreLoss;
    if (m.scoreLoss < minLoss) { minLoss = m.scoreLoss; stats.bestMove = m.san; }
    if (m.scoreLoss > maxLoss) { maxLoss = m.scoreLoss; stats.worstMove = m.san; }
    if (m.category === 'best' || m.category === 'brilliant') {
      streak++;
      maxStreak = Math.max(maxStreak, streak);
    } else {
      streak = 0;
    }
  });

  stats.avgCentipawnLoss = colorMoves.length > 0 ? Math.round(totalLoss / colorMoves.length) : 0;
  stats.longestBestStreak = maxStreak;

  return stats;
}

function AccuracyRing({ value }: { value: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color = value >= 90 ? '#10b981' : value >= 75 ? '#3b82f6' : value >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="96" height="96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#3f3f46" strokeWidth="8" />
        <circle
          cx="48" cy="48" r={r} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="text-center">
        <div className="text-xl font-bold text-white">{value.toFixed(1)}</div>
        <div className="text-xs text-zinc-500">%</div>
      </div>
    </div>
  );
}

function SidePanel({ stats, label, color }: { stats: SideStats; label: string; color: 'white' | 'black' }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className={`w-6 h-6 rounded-full border-2 ${color === 'white' ? 'bg-white border-zinc-400' : 'bg-zinc-900 border-zinc-400'}`} />
        <span className="font-semibold text-zinc-200">{label}</span>
      </div>
      <AccuracyRing value={stats.accuracy} />
      <div className="text-xs text-zinc-500 -mt-1">Accuracy</div>

      <div className="flex flex-col gap-1 mt-1">
        {CATEGORIES.map((cat) => {
          const count = (stats as any)[cat] as number;
          if (count === 0) return null;
          return (
            <div key={cat} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${CAT_COLORS[cat]}`} />
              <span className="text-xs text-zinc-400 flex-1">{CAT_LABELS[cat]}</span>
              <span className="text-xs font-bold text-zinc-200">{count}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-1 border-t border-zinc-800 pt-2 text-xs text-zinc-500 space-y-1">
        <div className="flex justify-between">
          <span>Avg. loss</span>
          <span className="text-zinc-300">{stats.avgCentipawnLoss}cp</span>
        </div>
        {stats.longestBestStreak > 0 && (
          <div className="flex justify-between">
            <span>Best streak</span>
            <span className="text-zinc-300">{stats.longestBestStreak}</span>
          </div>
        )}
        {stats.worstMove && (
          <div className="flex justify-between">
            <span>Worst move</span>
            <span className="text-red-400 font-mono">{stats.worstMove}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function Statistics() {
  const { moves, phase } = useGameStore();

  if (phase !== 'finished' && moves.length < 2) return null;

  const whiteStats = buildSideStats(moves, 'w');
  const blackStats = buildSideStats(moves, 'b');

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-zinc-300 mb-4 border-b border-zinc-800 pb-2">
        Game Statistics
      </h3>
      <div className="grid grid-cols-2 gap-4 divide-x divide-zinc-800">
        <SidePanel stats={whiteStats} label="White" color="white" />
        <div className="pl-4">
          <SidePanel stats={blackStats} label="Black" color="black" />
        </div>
      </div>
    </div>
  );
}
