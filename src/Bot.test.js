import { validMoves } from "./Bot";
import { Figur }  from './Figur';
import { Flagge }  from './Flagge';
import { Armee }  from './Armee';
import { Schlacht }  from './Schlacht';

it('should list all lower fields for all figures controlled by bot', () => {
  // original state.
  const G = {
    log: [],
    schlacht: new Schlacht(4),
    armeen: [null, new Armee("blau", "reserve", 1)],
  };
  const ctx = { phase: "MobilMachung"};
  G.armeen[1].bomben = [];
  G.armeen[1].mineure = [];
  while (G.armeen[1].soldaten.length < 2) G.armeen[1].soldaten.push(new Figur("soldat","blau",3,G.armeen[1].soldaten.length, 1));
  while (G.armeen[1].soldaten.length > 2) G.armeen[1].soldaten.pop();
  G.armeen.flagge = new Flagge("flagge", "blau", 1);

  // make move.
  var moves = validMoves(G, ctx);

  // verify new state.
  expect(moves.length).toEqual(12);
  expect(moves).toEqual([
    { move: 'platziere', args: [G.armeen[1].flagge, 12, "bot"] },
    { move: 'platziere', args: [G.armeen[1].flagge, 13, "bot"] },
    { move: 'platziere', args: [G.armeen[1].flagge, 14, "bot"] },
    { move: 'platziere', args: [G.armeen[1].flagge, 15, "bot"] },
    { move: 'platziere', args: [G.armeen[1].soldaten[0], 12, "bot"] },
    { move: 'platziere', args: [G.armeen[1].soldaten[0], 13, "bot"] },
    { move: 'platziere', args: [G.armeen[1].soldaten[0], 14, "bot"] },
    { move: 'platziere', args: [G.armeen[1].soldaten[0], 15, "bot"] },
    { move: 'platziere', args: [G.armeen[1].soldaten[1], 12, "bot"] },
    { move: 'platziere', args: [G.armeen[1].soldaten[1], 13, "bot"] },
    { move: 'platziere', args: [G.armeen[1].soldaten[1], 14, "bot"] },
    { move: 'platziere', args: [G.armeen[1].soldaten[1], 15, "bot"] },

  ]);
});