import { create } from 'zustand';
import type { GameSettings } from '../types';

interface SettingsState {
  settings: GameSettings;
  isOpen: boolean;
  updateSettings: (settings: Partial<GameSettings>) => void;
  setOpen: (open: boolean) => void;
}

const DEFAULT: GameSettings = {
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

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: DEFAULT,
  isOpen: false,
  updateSettings: (s) => set((prev) => ({ settings: { ...prev.settings, ...s } })),
  setOpen: (open) => set({ isOpen: open }),
}));
