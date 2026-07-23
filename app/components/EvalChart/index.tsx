'use client';

import { useMemo } from 'react';
import { useGameStore } from '../../store/game.store';
import { normalizeCp } from '../../lib/analyzer';
import type { MoveCategory } from '../../types';

const CAT_POINT_COLORS: Record<NonNullable<MoveCategory>, string> = {
  brilliant:  '#06b6d4',
  great:      '#3b82f6',
  best:       '#10b981',
  excellent:  '#22c55e',
  good:       '#84cc16',
  book:       '#fbbf24',
  inaccuracy: '#eab308',
  mistake:    '#f97316',
  blunder:    '#ef4444',
  forced:     '#71717a',
};

export function EvalChart() {
  const { moves } = useGameStore();

  const data = useMemo(() => {
    return moves.map((m, i) => {
      const ev = m.evalAfter;
      if (!ev) return { index: i, score: 0, category: m.category, san: m.san, moveNum: m.moveNumber, color: m.color };
      const raw = ev.mate !== null
        ? (ev.mate > 0 ? 600 : -600)
        : normalizeCp(ev.score, null);
      const clamped = Math.max(-600, Math.min(600, raw));
      return { index: i, score: clamped, category: m.category, san: m.san, moveNum: m.moveNumber, color: m.color };
    });
  }, [moves]);

  if (data.length < 2) return null;

  const width = 100;
  const height = 40;
  const padX = 2;
  const padY = 4;
  const innerW = width - 2 * padX;
  const innerH = height - 2 * padY;

  const xScale = (i: number) => padX + (i / (data.length - 1)) * innerW;
  const yScale = (s: number) => padY + (1 - (s + 600) / 1200) * innerH;

  const polylineWhite = data
    .map((d) => `${xScale(d.index)},${yScale(Math.max(0, d.score))}`)
    .join(' ');

  // Build SVG path for area fill (above center = white advantage)
  const buildPath = (positive: boolean) => {
    const pts = data.map((d) => ({
      x: xScale(d.index),
      y: yScale(positive ? Math.max(0, d.score) : Math.min(0, d.score)),
    }));
    const centerY = yScale(0);
    const start = `M${pts[0].x},${centerY}`;
    const lines = pts.map((p) => `L${p.x},${p.y}`).join(' ');
    const end = `L${pts[pts.length - 1].x},${centerY} Z`;
    return `${start} ${lines} ${end}`;
  };

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-3">
      <h3 className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Evaluation Chart</h3>
      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-24 overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Background */}
          <rect x={padX} y={padY} width={innerW} height={innerH / 2} fill="#27272a" />
          <rect x={padX} y={padY + innerH / 2} width={innerW} height={innerH / 2} fill="#18181b" />

          {/* White advantage area */}
          <path d={buildPath(true)} fill="rgba(255,255,255,0.15)" />
          {/* Black advantage area */}
          <path d={buildPath(false)} fill="rgba(0,0,0,0.4)" />

          {/* Center line */}
          <line x1={padX} y1={yScale(0)} x2={width - padX} y2={yScale(0)} stroke="#52525b" strokeWidth="0.5" />

          {/* Blunder/Mistake markers */}
          {data.map((d) => {
            if (!d.category || !['blunder', 'mistake', 'brilliant'].includes(d.category)) return null;
            const color = CAT_POINT_COLORS[d.category] ?? '#71717a';
            return (
              <circle
                key={d.index}
                cx={xScale(d.index)}
                cy={yScale(d.score)}
                r="1.5"
                fill={color}
                stroke="none"
              >
                <title>{`${d.color === 'w' ? d.moveNum + '.' : d.moveNum + '...'} ${d.san} (${d.category})`}</title>
              </circle>
            );
          })}

          {/* Main line */}
          <polyline
            points={data.map((d) => `${xScale(d.index)},${yScale(d.score)}`).join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="0.8"
          />
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-zinc-600 mt-1 px-1">
          <span>1</span>
          {data.length > 4 && <span>{Math.round(data.length / 2)}</span>}
          <span>{data.length}</span>
        </div>
      </div>
    </div>
  );
}
