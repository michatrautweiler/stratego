import { validMoves } from "./Bot";
import { Figur }  from './Figur';
import { Armee }  from './Armee';
import { Schlacht }  from './Schlacht';
import { schlacht } from './Stratego';


it('should list bewege moves for a figure controlled by bot', () => {
  // original state.
  const G = {
    log: [],
    feld: new Array(9).fill(null),
    players: {
      '0': { armee: new Armee("weiss", "aktiv", 0).mannschaft() },
      '1': { armee: new Armee("blau", "aktiv", 1).mannschaft() }
    }
  };
  const ctx = { phase: "Kampf", currentPlayer: "1" };
  
  for (let i=0; i<2; i++) {
    G.players[i].armee.bomben = [];
    G.players[i].armee.mineure = [];
    while (G.players[i].armee.soldaten.length < 1) G.players[i].armee.soldaten.push(new Figur("soldaten","blau",3,G.players[i].armee.soldaten.length, i));
    while (G.players[i].armee.soldaten.length > 1) G.players[i].armee.soldaten.pop();
  }
  
  schlacht.populate(G.feld);
  schlacht.dim = 3;
  schlacht.stelleAuf(G.players[1].armee.flagge[0], 0);
  schlacht.stelleAuf(G.players[1].armee.soldaten[0], 1);
  schlacht.stelleAuf(G.players[0].armee.flagge[0], 8);
  schlacht.stelleAuf(G.players[0].armee.soldaten[0], 7);
  schlacht.empty();
  
  // make move.
  let moves = validMoves(G, ctx);

  // verify new state.
  expect(moves.length).toEqual(2);
  expect(moves).toEqual([
    { move: 'bewege', args: [G.players[1].armee.soldaten[0], 2, "bot"] },
    { move: 'bewege', args: [G.players[1].armee.soldaten[0], 4, "bot"] },
  ]);
});

it('should list schlage moves for a figure controlled by bot', () => {
  /* original state.
   *  +---+---+---+  F = Flagge Gegner
   *  |   | F |   |  S = Soldat Gegner
   *  +---+---+---+  f = Flagge bot
   *  | S | s |   |  s = Soldat bot
   *  +---+---+---+  
   *  |   |   | f |  Note that a 3*3 field is missing 
   *  +---+---+---+  valid start positions due to DMZ.
  */
  const G = {
    log: [],
    feld: new Array(9).fill(null),
    players: {
      '0': { armee: new Armee("weiss", "aktiv", 0).mannschaft() },
      '1': { armee: new Armee("blau", "aktiv", 1).mannschaft() }
    }
  };
  const ctx = { phase: "Kampf", currentPlayer: "1" };
  
  for (let i=0; i<2; i++) {
    G.players[i].armee.bomben = [];
    G.players[i].armee.mineure = [];
    while (G.players[i].armee.soldaten.length < 1) G.players[i].armee.soldaten.push(new Figur("soldaten","blau",3,G.players[i].armee.soldaten.length, i));
    while (G.players[i].armee.soldaten.length > 1) G.players[i].armee.soldaten.pop();
  }
  schlacht.populate(G.feld);
  schlacht.dim = 3;
  schlacht.stelleAuf(G.players[0].armee.flagge[0], 1);
  schlacht.stelleAuf(G.players[0].armee.soldaten[0], 3);
  schlacht.stelleAuf(G.players[1].armee.flagge[0], 8);
  schlacht.stelleAuf(G.players[1].armee.soldaten[0], 4);
  schlacht.empty();

  // make move.
  let moves = validMoves(G, ctx);

  // verify new state.
  expect(moves.length).toEqual(4);
  expect(moves).toEqual([
    { move: 'schlage', args: [G.players[1].armee.soldaten[0], G.players[0].armee.flagge[0], 1] },
    { move: 'schlage', args: [G.players[1].armee.soldaten[0], G.players[0].armee.soldaten[0], 3] },
    { move: 'bewege', args: [G.players[1].armee.soldaten[0], 5, "bot"] },
    { move: 'bewege', args: [G.players[1].armee.soldaten[0], 7, "bot"] },
  ]);
});

it('should list all start fields for all figures controlled by bot', () => {
  // original state.
  const G = {
    log: [],
    feld: new Array(16).fill(null),
    players: {
      '0': { armee: new Armee("weiss", "aktiv", 0).mannschaft() },
      '1': { armee: new Armee("blau", "aktiv", 1).mannschaft() }
    }
  };
  const ctx = { phase: "MobilMachung", currentPlayer: "1"};
  G.players[1].armee.bomben = [];
  G.players[1].armee.mineure = [];
  while (G.players[1].armee.soldaten.length < 2) G.players[1].armee.soldaten.push(new Figur("soldaten","blau",3,G.players[1].armee.soldaten.length, 1));
  while (G.players[1].armee.soldaten.length > 2) G.players[1].armee.soldaten.pop();
  G.players[1].armee.flagge = [new Figur("flagge", "blau", 1,1,1)];
  schlacht.dim = 4;
  
  // make move.
  let moves = validMoves(G, ctx);

  // verify new state.
  expect(moves.length).toEqual(12);
  expect(moves).toEqual([
    { move: 'platziere', args: [G.players[1].armee.flagge[0], 0, "bot"] },
    { move: 'platziere', args: [G.players[1].armee.flagge[0], 1, "bot"] },
    { move: 'platziere', args: [G.players[1].armee.flagge[0], 2, "bot"] },
    { move: 'platziere', args: [G.players[1].armee.flagge[0], 3, "bot"] },
    { move: 'platziere', args: [G.players[1].armee.soldaten[0], 0, "bot"] },
    { move: 'platziere', args: [G.players[1].armee.soldaten[0], 1, "bot"] },
    { move: 'platziere', args: [G.players[1].armee.soldaten[0], 2, "bot"] },
    { move: 'platziere', args: [G.players[1].armee.soldaten[0], 3, "bot"] },
    { move: 'platziere', args: [G.players[1].armee.soldaten[1], 0, "bot"] },
    { move: 'platziere', args: [G.players[1].armee.soldaten[1], 1, "bot"] },
    { move: 'platziere', args: [G.players[1].armee.soldaten[1], 2, "bot"] },
    { move: 'platziere', args: [G.players[1].armee.soldaten[1], 3, "bot"] },

  ]);
});