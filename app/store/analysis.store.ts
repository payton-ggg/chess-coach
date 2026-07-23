import { create } from 'zustand';
import type { EngineEval } from '../types';

interface EvalEntry {
  fen: string;
  eval: EngineEval;
}

interface AnalysisState {
  evalHistory: EvalEntry[];
  isEngineReady: boolean;
  isAnalyzing: boolean;

  setEngineReady: (ready: boolean) => void;
  setAnalyzing: (analyzing: boolean) => void;
  pushEval: (entry: EvalEntry) => void;
  clearEvals: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  evalHistory: [],
  isEngineReady: false,
  isAnalyzing: false,

  setEngineReady: (ready) => set({ isEngineReady: ready }),
  setAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  pushEval: (entry) =>
    set((s) => ({ evalHistory: [...s.evalHistory, entry] })),
  clearEvals: () => set({ evalHistory: [] }),
}));
