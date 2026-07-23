"use client";

import { useEffect, useRef, useCallback } from "react";
import type { EngineEval } from "../types";

const STOCKFISH_CDN = "./stockfish.js";

type Job = () => void;

let worker: Worker | null = null;
let ready = false;
const waitingForReady: Array<() => void> = [];
const jobQueue: Job[] = [];
let busy = false;

function runNext() {
  if (busy || jobQueue.length === 0) return;
  busy = true;
  jobQueue.shift()!();
}

function enqueue(job: Job) {
  jobQueue.push(job);
  runNext();
}

function getWorker(): Promise<Worker> {
  return new Promise((resolve) => {
    if (worker && ready) {
      resolve(worker);
      return;
    }

    if (!worker) {
      worker = new Worker(STOCKFISH_CDN);

      const initHandler = (e: MessageEvent<string>) => {
        if (typeof e.data !== "string") return;
        if (e.data.includes("uciok")) {
          worker!.postMessage("isready");
        }
        if (e.data.includes("readyok")) {
          ready = true;
          worker!.removeEventListener("message", initHandler);
          resolve(worker!);
          waitingForReady.forEach((fn) => fn());
          waitingForReady.length = 0;
        }
      };

      worker.addEventListener("message", initHandler);
      worker.postMessage("uci");
    } else {
      waitingForReady.push(() => resolve(worker!));
    }
  });
}

export function useStockfish() {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    getWorker().then((w) => {
      workerRef.current = w;
    });
  }, []);

  const analyze = useCallback(
    (fen: string, depth: number, timeMs: number): Promise<EngineEval> =>
      new Promise((resolve) => {
        getWorker().then((w) => {
          workerRef.current = w;
          enqueue(() => {
            let score = 0,
              mate: number | null = null;
            let pv: string[] = [],
              bestMove = "",
              resultDepth = 0;

            const handler = (e: MessageEvent<string>) => {
              if (typeof e.data !== "string") return;
              const line = e.data;

              if (line.startsWith("info depth")) {
                const dm = line.match(/depth (\d+)/);
                const sm = line.match(/score cp (-?\d+)/);
                const mm = line.match(/score mate (-?\d+)/);
                const pm = line.match(/ pv (.+)/);
                if (dm) resultDepth = +dm[1];
                if (sm) {
                  score = +sm[1];
                  mate = null;
                }
                if (mm) {
                  mate = +mm[1];
                  score = 0;
                }
                if (pm) {
                  pv = pm[1].trim().split(" ");
                  bestMove = pv[0];
                }
              }

              if (line.startsWith("bestmove")) {
                const bm = line.split(" ")[1];
                if (bm && bm !== "(none)") bestMove = bm;
                w.removeEventListener("message", handler);
                busy = false;
                resolve({ score, mate, bestMove, pv, depth: resultDepth });
                runNext();
              }
            };

            w.addEventListener("message", handler);
            w.postMessage(`position fen ${fen}`);
            w.postMessage(`go depth ${depth} movetime ${timeMs}`);
          });
        });
      }),
    [],
  );

  const getBestMove = useCallback(
    (
      fen: string,
      depth: number,
      timeMs: number,
      elo?: number,
    ): Promise<string> =>
      new Promise((resolve) => {
        getWorker().then((w) => {
          workerRef.current = w;
          enqueue(() => {
            if (elo) {
              w.postMessage(
                "setoption name Skill Level value " +
                  Math.round(((elo - 600) / (2800 - 600)) * 20),
              );
            } else {
              w.postMessage("setoption name Skill Level value 20");
            }

            const handler = (e: MessageEvent<string>) => {
              if (typeof e.data !== "string") return;
              if (e.data.startsWith("bestmove")) {
                const bm = e.data.split(" ")[1];
                w.removeEventListener("message", handler);
                busy = false;
                resolve(bm && bm !== "(none)" ? bm : "");
                runNext();
              }
            };

            w.addEventListener("message", handler);
            w.postMessage(`position fen ${fen}`);
            w.postMessage(`go depth ${depth} movetime ${timeMs}`);
          });
        });
      }),
    [],
  );

  return { analyze, getBestMove };
}
