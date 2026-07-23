'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/game.store';
import type { GameSettings } from '../../types';
import { ELO_LEVELS } from '../../types';

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

export function GameSetupModal() {
  const { phase, initGame, resetGame } = useGameStore();
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);

  const selectedLevel = ELO_LEVELS.find((l) => l.elo === settings.opponentElo) ?? ELO_LEVELS[4];

  const update = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    // Auto-sync depth when elo changes
    if (key === 'opponentElo') {
      const level = ELO_LEVELS.find((l) => l.elo === value);
      if (level) newSettings.opponentDepth = level.depth;
    }
    setSettings(newSettings);
  };

  if (phase !== 'setup') return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 px-6 py-5 border-b border-zinc-700">
            <div className="flex items-center gap-3">
              <span className="text-3xl">♟</span>
              <div>
                <h2 className="text-xl font-bold text-white">AI Chess Coach</h2>
                <p className="text-sm text-zinc-400">Configure your game</p>
              </div>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-5">
            {/* Player color */}
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">
                Play as
              </label>
              <div className="flex gap-2">
                {(['w', 'b', 'random'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => update('playerColor', c)}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                      settings.playerColor === c
                        ? 'bg-white text-zinc-900 border-white'
                        : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    {c === 'w' ? '♔ White' : c === 'b' ? '♚ Black' : '⚄ Random'}
                  </button>
                ))}
              </div>
            </div>

            {/* Opponent strength */}
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">
                Opponent Strength
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ELO_LEVELS.map((level) => (
                  <button
                    key={level.elo}
                    onClick={() => update('opponentElo', level.elo)}
                    className={`py-2 px-3 rounded-lg border text-sm transition-all ${
                      settings.opponentElo === level.elo
                        ? 'bg-blue-600 border-blue-500 text-white font-semibold'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500'
                    }`}
                  >
                    <div className="font-bold">{level.elo}</div>
                    <div className="text-xs opacity-70">{level.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Analysis settings */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">
                  Board Theme
                </label>
                <select
                  value={settings.boardTheme}
                  onChange={(e) => update('boardTheme', e.target.value as GameSettings['boardTheme'])}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
                >
                  <option value="default">Classic</option>
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                  <option value="brown">Brown</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">
                  Animation
                </label>
                <select
                  value={settings.animationSpeed}
                  onChange={(e) => update('animationSpeed', e.target.value as GameSettings['animationSpeed'])}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
                >
                  <option value="slow">Slow</option>
                  <option value="normal">Normal</option>
                  <option value="fast">Fast</option>
                </select>
              </div>
            </div>

            {/* Toggles */}
            <div className="flex gap-4">
              {([
                { key: 'autoAnalyze', label: 'Auto-analyze' },
                { key: 'showArrows', label: 'Show arrows' },
              ] as const).map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    onClick={() => update(key, !settings[key])}
                    className={`w-10 h-5 rounded-full transition-colors relative ${
                      settings[key] ? 'bg-blue-600' : 'bg-zinc-700'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        settings[key] ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                  <span className="text-sm text-zinc-300">{label}</span>
                </label>
              ))}
            </div>

            {/* Start button */}
            <button
              onClick={() => initGame(settings)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors text-lg shadow-lg shadow-blue-900/30"
            >
              Start Game
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function GameControls() {
  const { phase, resetGame, result } = useGameStore();

  if (phase === 'setup') return null;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={resetGame}
        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-lg border border-zinc-700 transition-colors"
      >
        New Game
      </button>
      {result && (
        <div className="text-sm font-semibold text-zinc-300 px-3 py-2 bg-zinc-800 rounded-lg border border-zinc-700">
          {result.result === '1/2-1/2'
            ? '½-½ Draw'
            : result.result === '1-0'
            ? '1-0 White wins'
            : '0-1 Black wins'}
          {result.reason && (
            <span className="text-zinc-500 ml-2 font-normal">({result.reason})</span>
          )}
        </div>
      )}
    </div>
  );
}
