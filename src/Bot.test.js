import { validMoves } from "./Bot";
import { Figur }  from './Figur';
import { Flagge }  from './Flagge';
import { Armee }  from './Armee';
import { Schlacht }  from './Schlacht';

it('should list bewege moves for a figure controlled by bot', () => {
  // original state.
  const G = {
    log: [],
    feld: new Array(9).fill(null),
    schlacht: null,
    armeen: [new Armee("weiss", "aktiv", 0), new Armee("blau", "aktiv", 1)],
  };
  G.schlacht = new Schlacht(G.feld);
  G.schlacht.dim = 3;
  const ctx = { phase: "Kampf"};
  for (let i=0; i<2; i++) {
    G.armeen[i].bomben = [];
    G.armeen[i].mineure = [];
    while (G.armeen[i].soldaten.length < 1) G.armeen[i].soldaten.push(new Figur("soldat","blau",3,G.armeen[i].soldaten.length, i));
    while (G.armeen[i].soldaten.length > 1) G.armeen[i].soldaten.pop();
  }
  
  G.schlacht.stelleAuf(G.armeen[1].flagge, 0);
  G.schlacht.stelleAuf(G.armeen[1].soldaten[0], 1);
  G.schlacht.stelleAuf(G.armeen[0].flagge, 8);
  G.schlacht.stelleAuf(G.armeen[0].soldaten[0], 7);
  
  
  // make move.
  let moves = validMoves(G, ctx);

  // verify new state.
  expect(moves.length).toEqual(2);
  expect(moves).toEqual([
    { move: 'bewege', args: [G.armeen[1].soldaten[0], 2, "bot"] },
    { move: 'bewege', args: [G.armeen[1].soldaten[0], 4, "bot"] },
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
    schlacht: null,
    armeen: [new Armee("weiss", "aktiv", 0), new Armee("blau", "aktiv", 1)],
  };
  const ctx = { phase: "Kampf"};
  for (let i=0; i<2; i++) {
    G.armeen[i].bomben = [];
    G.armeen[i].mineure = [];
    while (G.armeen[i].soldaten.length < 1) G.armeen[i].soldaten.push(new Figur("soldat","blau",3,G.armeen[i].soldaten.length, i));
    while (G.armeen[i].soldaten.length > 1) G.armeen[i].soldaten.pop();
  }
  G.schlacht = new Schlacht(G.feld);
  G.schlacht.dim = 3;
  G.schlacht.stelleAuf(G.armeen[0].flagge[0], 1);
  G.schlacht.stelleAuf(G.armeen[0].soldaten[0], 3);
  G.schlacht.stelleAuf(G.armeen[1].flagge[0], 8);
  G.schlacht.stelleAuf(G.armeen[1].soldaten[0], 4);
  
  // make move.
  let moves = validMoves(G, ctx);

  // verify new state.
  expect(moves.length).toEqual(4);
  expect(moves).toEqual([
    { move: 'schlage', args: [G.armeen[1].soldaten[0], G.armeen[0].flagge[0], 1] },
    { move: 'schlage', args: [G.armeen[1].soldaten[0], G.armeen[0].soldaten[0], 3] },
    { move: 'bewege', args: [G.armeen[1].soldaten[0], 5, "bot"] },
    { move: 'bewege', args: [G.armeen[1].soldaten[0], 7, "bot"] },
  ]);
});

it('should list all start fields for all figures controlled by bot', () => {
  // original state.
  const G = {
    log: [],
    feld: new Array(16).fill(null),
    schlacht: null,
    armeen: [null, new Armee("blau", "reserve", 1)],
  };
  const ctx = { phase: "MobilMachung"};
  G.armeen[1].bomben = [];
  G.armeen[1].mineure = [];
  while (G.armeen[1].soldaten.length < 2) G.armeen[1].soldaten.push(new Figur("soldat","blau",3,G.armeen[1].soldaten.length, 1));
  while (G.armeen[1].soldaten.length > 2) G.armeen[1].soldaten.pop();
  G.armeen.flagge = [new Flagge("flagge", "blau", 1)];
  G.schlacht = new Schlacht(G.feld);
  G.schlacht.dim = 4;
  // make move.
  let moves = validMoves(G, ctx);

  // verify new state.
  expect(moves.length).toEqual(12);
  expect(moves).toEqual([
    { move: 'platziere', args: [G.armeen[1].flagge[0], 0, "bot"] },
    { move: 'platziere', args: [G.armeen[1].flagge[0], 1, "bot"] },
    { move: 'platziere', args: [G.armeen[1].flagge[0], 2, "bot"] },
    { move: 'platziere', args: [G.armeen[1].flagge[0], 3, "bot"] },
    { move: 'platziere', args: [G.armeen[1].soldaten[0], 0, "bot"] },
    { move: 'platziere', args: [G.armeen[1].soldaten[0], 1, "bot"] },
    { move: 'platziere', args: [G.armeen[1].soldaten[0], 2, "bot"] },
    { move: 'platziere', args: [G.armeen[1].soldaten[0], 3, "bot"] },
    { move: 'platziere', args: [G.armeen[1].soldaten[1], 0, "bot"] },
    { move: 'platziere', args: [G.armeen[1].soldaten[1], 1, "bot"] },
    { move: 'platziere', args: [G.armeen[1].soldaten[1], 2, "bot"] },
    { move: 'platziere', args: [G.armeen[1].soldaten[1], 3, "bot"] },

  ]);
});