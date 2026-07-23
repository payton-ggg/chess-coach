// A compact opening database (ECO codes + names)
// Extended subset covering the most common openings

export interface Opening {
  eco: string;
  name: string;
  moves: string; // SAN moves string
  ply: number;
}

const OPENINGS: Opening[] = [
  // A00-A09 — Unusual openings
  { eco: 'A00', name: "Bird's Opening", moves: 'f4', ply: 1 },
  { eco: 'A01', name: "Nimzo-Larsen Attack", moves: 'b3', ply: 1 },
  { eco: 'A02', name: "Bird: 1...f5", moves: 'f4 f5', ply: 2 },
  { eco: 'A04', name: "Réti Opening", moves: 'Nf3', ply: 1 },
  { eco: 'A05', name: "Réti: 1.Nf3 Nf6", moves: 'Nf3 Nf6', ply: 2 },
  { eco: 'A06', name: "Réti: Old Indian Attack", moves: 'Nf3 d5', ply: 2 },
  { eco: 'A07', name: "King's Indian Attack", moves: 'Nf3 d5 g3', ply: 3 },
  { eco: 'A09', name: "Réti Accepted", moves: 'Nf3 d5 c4 dxc4', ply: 4 },
  // A10-A39 — English Opening
  { eco: 'A10', name: "English Opening", moves: 'c4', ply: 1 },
  { eco: 'A20', name: "English: 1...e5", moves: 'c4 e5', ply: 2 },
  { eco: 'A30', name: "English: Symmetrical", moves: 'c4 c5', ply: 2 },
  { eco: 'A40', name: "Queen's Pawn: Unusual", moves: 'd4', ply: 1 },
  { eco: 'A41', name: "Modern Defense 1.d4", moves: 'd4 g6', ply: 2 },
  { eco: 'A43', name: "Benoni Defense", moves: 'd4 c5', ply: 2 },
  { eco: 'A45', name: "Trompowski Attack", moves: 'd4 Nf6 Bg5', ply: 3 },
  { eco: 'A46', name: "Torre Attack", moves: 'd4 Nf6 Nf3 e6 Bg5', ply: 5 },
  { eco: 'A50', name: "Queen's Indian Accelerated", moves: 'd4 Nf6 c4 b6', ply: 4 },
  // B00-B09
  { eco: 'B00', name: "King's Pawn Opening", moves: 'e4', ply: 1 },
  { eco: 'B01', name: "Scandinavian Defense", moves: 'e4 d5', ply: 2 },
  { eco: 'B02', name: "Alekhine's Defense", moves: 'e4 Nf6', ply: 2 },
  { eco: 'B06', name: "Modern Defense", moves: 'e4 g6', ply: 2 },
  { eco: 'B07', name: "Pirc Defense", moves: 'e4 d6 d4 Nf6', ply: 4 },
  { eco: 'B09', name: "Pirc: Austrian Attack", moves: 'e4 d6 d4 Nf6 Nc3 g6 f4', ply: 7 },
  // B10-B19 — Caro-Kann
  { eco: 'B10', name: 'Caro-Kann Defense', moves: 'e4 c6', ply: 2 },
  { eco: 'B12', name: 'Caro-Kann: Advance Variation', moves: 'e4 c6 d4 d5 e5', ply: 5 },
  { eco: 'B13', name: "Caro-Kann: Exchange Variation", moves: 'e4 c6 d4 d5 exd5 cxd5', ply: 6 },
  { eco: 'B17', name: "Caro-Kann: Steinitz Variation", moves: 'e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nd7', ply: 8 },
  // B20-B99 — Sicilian
  { eco: 'B20', name: 'Sicilian Defense', moves: 'e4 c5', ply: 2 },
  { eco: 'B21', name: 'Sicilian: Grand Prix Attack', moves: 'e4 c5 Nc3', ply: 3 },
  { eco: 'B22', name: 'Sicilian: Alapin', moves: 'e4 c5 c3', ply: 3 },
  { eco: 'B23', name: 'Sicilian: Closed', moves: 'e4 c5 Nc3 Nc6', ply: 4 },
  { eco: 'B27', name: 'Sicilian: Hungarian', moves: 'e4 c5 Nf3 g6', ply: 4 },
  { eco: 'B30', name: 'Sicilian: Old Sicilian', moves: 'e4 c5 Nf3 Nc6', ply: 4 },
  { eco: 'B32', name: 'Sicilian: Labourdonnais-Loewenthal', moves: 'e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 e5', ply: 8 },
  { eco: 'B40', name: 'Sicilian: French Variation', moves: 'e4 c5 Nf3 e6', ply: 4 },
  { eco: 'B50', name: 'Sicilian: Modern', moves: 'e4 c5 Nf3 d6', ply: 4 },
  { eco: 'B54', name: 'Sicilian: Dragon', moves: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6', ply: 10 },
  { eco: 'B57', name: 'Sicilian: Sozin', moves: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Bc4', ply: 11 },
  { eco: 'B60', name: 'Sicilian: Richter-Rauzer', moves: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6 Bg5', ply: 11 },
  { eco: 'B70', name: 'Sicilian: Dragon', moves: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6', ply: 10 },
  { eco: 'B80', name: 'Sicilian: Scheveningen', moves: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 e6', ply: 10 },
  { eco: 'B90', name: 'Sicilian: Najdorf', moves: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6', ply: 10 },
  { eco: 'B96', name: 'Sicilian: Najdorf, Polugaevsky', moves: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bg5 e6 f4 b5', ply: 14 },
  // C00-C19 — French
  { eco: 'C00', name: 'French Defense', moves: 'e4 e6', ply: 2 },
  { eco: 'C01', name: 'French: Exchange Variation', moves: 'e4 e6 d4 d5 exd5 exd5', ply: 6 },
  { eco: 'C02', name: 'French: Advance Variation', moves: 'e4 e6 d4 d5 e5', ply: 5 },
  { eco: 'C10', name: 'French: Rubinstein', moves: 'e4 e6 d4 d5 Nc3 dxe4', ply: 6 },
  { eco: 'C11', name: 'French: Classical', moves: 'e4 e6 d4 d5 Nc3 Nf6', ply: 6 },
  { eco: 'C15', name: 'French: Winawer', moves: 'e4 e6 d4 d5 Nc3 Bb4', ply: 6 },
  // C20-C59 — e4 e5
  { eco: 'C20', name: "King's Pawn Game", moves: 'e4 e5', ply: 2 },
  { eco: 'C21', name: 'Center Game', moves: 'e4 e5 d4 exd4', ply: 4 },
  { eco: 'C23', name: 'Bishop\'s Opening', moves: 'e4 e5 Bc4', ply: 3 },
  { eco: 'C25', name: 'Vienna Game', moves: 'e4 e5 Nc3', ply: 3 },
  { eco: 'C30', name: "King's Gambit", moves: 'e4 e5 f4', ply: 3 },
  { eco: 'C31', name: "King's Gambit Declined: Falkbeer", moves: 'e4 e5 f4 d5', ply: 4 },
  { eco: 'C33', name: "King's Gambit Accepted", moves: 'e4 e5 f4 exf4', ply: 4 },
  { eco: 'C40', name: "King's Knight Opening", moves: 'e4 e5 Nf3', ply: 3 },
  { eco: 'C41', name: "Philidor Defense", moves: 'e4 e5 Nf3 d6', ply: 4 },
  { eco: 'C42', name: "Petrov's Defense", moves: 'e4 e5 Nf3 Nf6', ply: 4 },
  { eco: 'C44', name: 'Scotch Game', moves: 'e4 e5 Nf3 Nc6 d4', ply: 5 },
  { eco: 'C45', name: 'Scotch: Classical', moves: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Qh4', ply: 8 },
  { eco: 'C46', name: "Three Knights Game", moves: 'e4 e5 Nf3 Nc6 Nc3', ply: 5 },
  { eco: 'C47', name: "Four Knights: Scotch", moves: 'e4 e5 Nf3 Nc6 Nc3 Nf6 d4', ply: 7 },
  { eco: 'C50', name: "Italian Game", moves: 'e4 e5 Nf3 Nc6 Bc4', ply: 5 },
  { eco: 'C51', name: "Evans Gambit", moves: 'e4 e5 Nf3 Nc6 Bc4 Bc5 b4', ply: 7 },
  { eco: 'C53', name: "Italian: Classical", moves: 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3', ply: 7 },
  { eco: 'C54', name: "Italian: Giuoco Piano", moves: 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4', ply: 9 },
  { eco: 'C55', name: "Two Knights Defense", moves: 'e4 e5 Nf3 Nc6 Bc4 Nf6', ply: 6 },
  { eco: 'C57', name: "Two Knights: Fried Liver", moves: 'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5 Nxf7', ply: 11 },
  { eco: 'C58', name: "Two Knights: Polerio", moves: 'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Na5', ply: 10 },
  // C60-C99 — Ruy Lopez
  { eco: 'C60', name: 'Ruy Lopez', moves: 'e4 e5 Nf3 Nc6 Bb5', ply: 5 },
  { eco: 'C63', name: 'Ruy Lopez: Schliemann', moves: 'e4 e5 Nf3 Nc6 Bb5 f5', ply: 6 },
  { eco: 'C65', name: 'Ruy Lopez: Berlin', moves: 'e4 e5 Nf3 Nc6 Bb5 Nf6', ply: 6 },
  { eco: 'C67', name: 'Ruy Lopez: Berlin Defense', moves: 'e4 e5 Nf3 Nc6 Bb5 Nf6 O-O Nxe4 d4', ply: 9 },
  { eco: 'C70', name: 'Ruy Lopez: Modern Steinitz', moves: 'e4 e5 Nf3 Nc6 Bb5 a6', ply: 6 },
  { eco: 'C80', name: 'Ruy Lopez: Open', moves: 'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4', ply: 10 },
  { eco: 'C84', name: 'Ruy Lopez: Closed', moves: 'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7', ply: 10 },
  { eco: 'C90', name: 'Ruy Lopez: Marshall', moves: 'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 O-O d4', ply: 15 },
  // D00-D69 — Queen's Pawn
  { eco: 'D00', name: "Queen's Pawn", moves: 'd4 d5', ply: 2 },
  { eco: 'D01', name: "Richter-Veresov Attack", moves: 'd4 d5 Nc3 Nf6 Bg5', ply: 5 },
  { eco: 'D02', name: "Queen's Pawn: Symmetrical", moves: 'd4 d5 Nf3', ply: 3 },
  { eco: 'D04', name: "Colle System", moves: 'd4 d5 Nf3 Nf6 e3', ply: 5 },
  { eco: 'D06', name: "Queen's Gambit", moves: 'd4 d5 c4', ply: 3 },
  { eco: 'D07', name: "QGD: Chigorin Defense", moves: 'd4 d5 c4 Nc6', ply: 4 },
  { eco: 'D08', name: "QGD: Albin Counter-Gambit", moves: 'd4 d5 c4 e5', ply: 4 },
  { eco: 'D10', name: "QGD: Slav Defense", moves: 'd4 d5 c4 c6', ply: 4 },
  { eco: 'D12', name: "Queen's Gambit Declined: Slav", moves: 'd4 d5 c4 c6 Nf3 Nf6 e3 Bf5', ply: 8 },
  { eco: 'D20', name: "Queen's Gambit Accepted", moves: 'd4 d5 c4 dxc4', ply: 4 },
  { eco: 'D30', name: "Queen's Gambit Declined", moves: 'd4 d5 c4 e6', ply: 4 },
  { eco: 'D31', name: "QGD: Semi-Slav", moves: 'd4 d5 c4 e6 Nc3 c6', ply: 6 },
  { eco: 'D37', name: "QGD: Classical", moves: 'd4 Nf6 c4 e6 Nc3 d5 Nf3 Be7', ply: 8 },
  { eco: 'D43', name: "Semi-Slav: Anti-Meran", moves: 'd4 d5 c4 c6 Nc3 Nf6 Nf3 e6 Bg5', ply: 9 },
  { eco: 'D44', name: "Semi-Slav: Botvinnik", moves: 'd4 d5 c4 c6 Nc3 Nf6 Nf3 e6 Bg5 dxc4', ply: 10 },
  { eco: 'D45', name: "Semi-Slav: Meran", moves: 'd4 d5 c4 c6 Nc3 Nf6 e3 e6 Nf3 Nbd7', ply: 10 },
  { eco: 'D50', name: "QGD: Cambridge Springs", moves: 'd4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7', ply: 8 },
  { eco: 'D61', name: "QGD: Orthodox Classical", moves: 'd4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3 O-O Nf3 Nbd7', ply: 12 },
  { eco: 'D70', name: "Grünfeld Defense", moves: 'd4 Nf6 c4 g6 Nc3 d5', ply: 6 },
  { eco: 'D80', name: "Grünfeld: Russian", moves: 'd4 Nf6 c4 g6 Nc3 d5 Nf3 Bg7 Qb3', ply: 9 },
  // E00-E99 — Indian Defenses
  { eco: 'E00', name: "Catalan Opening", moves: 'd4 Nf6 c4 e6 g3', ply: 5 },
  { eco: 'E10', name: "Queen's Indian: Accelerated", moves: 'd4 Nf6 c4 e6 Nf3 b5', ply: 6 },
  { eco: 'E12', name: "Queen's Indian Defense", moves: 'd4 Nf6 c4 e6 Nf3 b6', ply: 6 },
  { eco: 'E20', name: "Nimzo-Indian Defense", moves: 'd4 Nf6 c4 e6 Nc3 Bb4', ply: 6 },
  { eco: 'E32', name: "Nimzo-Indian: Classical", moves: 'd4 Nf6 c4 e6 Nc3 Bb4 Qc2', ply: 7 },
  { eco: 'E40', name: "Nimzo-Indian: Nimzovich", moves: 'd4 Nf6 c4 e6 Nc3 Bb4 e3', ply: 7 },
  { eco: 'E60', name: "King's Indian Defense", moves: 'd4 Nf6 c4 g6', ply: 4 },
  { eco: 'E62', name: "King's Indian: Fianchetto", moves: 'd4 Nf6 c4 g6 Nc3 Bg7 Nf3 O-O g3', ply: 9 },
  { eco: 'E70', name: "King's Indian: Averbakh", moves: 'd4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2 O-O Bg5', ply: 11 },
  { eco: 'E80', name: "King's Indian: Sämisch", moves: 'd4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3', ply: 9 },
  { eco: 'E90', name: "King's Indian: Classical", moves: 'd4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2', ply: 11 },
  { eco: 'E97', name: "King's Indian: Orthodox", moves: 'd4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5', ply: 12 },
];

export function findOpening(sanMoves: string[]): Opening | null {
  if (sanMoves.length === 0) return null;

  let bestMatch: Opening | null = null;

  for (const op of OPENINGS) {
    const opMoves = op.moves.split(' ');
    if (opMoves.length > sanMoves.length) continue;
    const matches = opMoves.every((m, i) => m === sanMoves[i]);
    if (matches) {
      if (!bestMatch || opMoves.length > bestMatch.moves.split(' ').length) {
        bestMatch = op;
      }
    }
  }

  return bestMatch;
}
