'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { EngineEval } from '../types';

interface UseStockfishReturn {
  analyze: (fen: string, depth: number, timeMs: number) => Promise<EngineEval>;
  getBestMove: (fen: string, depth: number, timeMs: number, elo?: number) => Promise<string>;
  isReady: boolean;
}

// Singleton worker ref (shared across hook instances)
let workerInstance: Worker | null = null;
let workerReady = false;
const pendingInit: Array<() => void> = [];

function getWorker(): Promise<Worker> {
  return new Promise((resolve) => {
    if (workerInstance && workerReady) {
      resolve(workerInstance);
      return;
    }
    if (workerInstance) {
      pendingInit.push(() => resolve(workerInstance!));
      return;
    }

    const worker = new Worker('/stockfish.js');
    workerInstance = worker;

    worker.onmessage = (e: MessageEvent) => {
      if (e.data === 'readyok' || e.data === 'uciok') {
        if (!workerReady) {
          workerReady = true;
          worker.postMessage('isready');
          resolve(worker);
          pendingInit.forEach((fn) => fn());
          pendingInit.length = 0;
        }
      }
    };

    worker.postMessage('uci');
  });
}

export function useStockfish(): UseStockfishReturn {
  const isReadyRef = useRef(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    getWorker().then((w) => {
      workerRef.current = w;
      isReadyRef.current = true;
    });
  }, []);

  const analyze = useCallback((fen: string, depth: number, timeMs: number): Promise<EngineEval> => {
    return new Promise((resolve) => {
      const worker = workerRef.current;
      if (!worker) {
        resolve({ score: 0, mate: null, bestMove: '', pv: [], depth: 0 });
        return;
      }

      let bestMove = '';
      let score = 0;
      let mate: number | null = null;
      let pv: string[] = [];
      let resultDepth = 0;

      const handler = (e: MessageEvent) => {
        const line: string = e.data;

        if (line.startsWith('info depth')) {
          const depthMatch = line.match(/depth (\d+)/);
          const scoreMatch = line.match(/score cp (-?\d+)/);
          const mateMatch = line.match(/score mate (-?\d+)/);
          const pvMatch = line.match(/ pv (.+)/);

          if (depthMatch) resultDepth = parseInt(depthMatch[1]);
          if (scoreMatch) score = parseInt(scoreMatch[1]);
          if (mateMatch) { mate = parseInt(mateMatch[1]); score = 0; }
          if (pvMatch) pv = pvMatch[1].trim().split(' ');
          if (pv.length > 0) bestMove = pv[0];
        }

        if (line.startsWith('bestmove')) {
          const bm = line.split(' ')[1];
          if (bm && bm !== '(none)') bestMove = bm;
          worker.removeEventListener('message', handler);
          resolve({ score, mate, bestMove, pv, depth: resultDepth });
        }
      };

      worker.addEventListener('message', handler);
      worker.postMessage('stop');
      worker.postMessage(`position fen ${fen}`);
      worker.postMessage(`go depth ${depth} movetime ${timeMs}`);
    });
  }, []);

  const getBestMove = useCallback(
    (fen: string, depth: number, timeMs: number, elo?: number): Promise<string> => {
      return new Promise((resolve) => {
        const worker = workerRef.current;
        if (!worker) { resolve(''); return; }

        const handler = (e: MessageEvent) => {
          const line: string = e.data;
          if (line.startsWith('bestmove')) {
            const bm = line.split(' ')[1];
            worker.removeEventListener('message', handler);
            resolve(bm && bm !== '(none)' ? bm : '');
          }
        };

        worker.addEventListener('message', handler);
        worker.postMessage('stop');

        if (elo) {
          // Limit engine strength via UCI_Elo
          worker.postMessage('setoption name UCI_LimitStrength value true');
          worker.postMessage(`setoption name UCI_Elo value ${elo}`);
        } else {
          worker.postMessage('setoption name UCI_LimitStrength value false');
        }

        worker.postMessage(`position fen ${fen}`);
        worker.postMessage(`go depth ${depth} movetime ${timeMs}`);
      });
    },
    []
  );

  return { analyze, getBestMove, isReady: isReadyRef.current };
}
