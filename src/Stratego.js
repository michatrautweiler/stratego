import { Armee }  from './Armee';
import { Schlacht }  from './Schlacht';


export const Stratego = {
  setup: () => ({ 
    log: [],
    feld: Array(100).fill(null),
    players: {
    '0': { armee: new Armee("rot", "reserve", 0).mannschaft() },
    '1': { armee: new Armee("gelb", "reserve", 1).mannschaft() }
    },
    kampf: Array(2).fill(null)
  }),
  turn: {
    moveLimit: 1,
  },
  
  phases: {
    MobilMachung: { 
      turn: {
        activePlayers: { all: 'Aufstellen' },
        stages: {
          Aufstellen: {
            moves: { platziere },
          }
        }
      },
      start: true, onBegin: (G,ctx) => { G.log.unshift("Macht eure Armeen bereit!") },
      endIf: (G, ctx) => { return new Armee(G.players['0'].armee).istAufgestellt() && new Armee(G.players['1'].armee).istAufgestellt() },
      next: 'Kampf'
    },
    Kampf: { 
      moves: { bewege, schlage, gebeAuf }, 
      onBegin: (G,ctx) => { G.armeen = [armeeRot.mannschaft(), armeeGelb.mannschaft() ]; G.log.unshift("Auf in den Kampf!") },
    }
  }, 
  /* TODO refactor G to players, secret for easy removal
  playerView: (G, ctx, playerID) => {
   */

  endIf: (G, ctx) => {
    var rotVerliert = new Armee(G.players['0'].armee).istKampfUnfaehig();
    var gelbVerliert = new Armee(G.players['1'].armee).istKampfUnfaehig();
    if (rotVerliert && gelbVerliert) return { draw: true, msg: "Patt. Niemand " };
    if (rotVerliert) return { winner: 1, msg: G.armeen[1].farbe };
    if (gelbVerliert) return { winner: 0, msg: G.armeen[0].farbe };
  }
};

//
// moves
//
function platziere(G, ctx, willHin, feld, player) {
  schlacht.populate(G.feld);
  var schonDa = schlacht.holeFigur(feld);
  if (schonDa === willHin || !willHin) {
    schlacht.empty();
    return; // avoid handling same event twice (once from each client)
  } else if (schonDa) {
    G.log.unshift(feld + ": besetzt von " + schonDa.gattung + " " + schonDa.farbe); 
    //TODO: handle occupied fields
    schlacht.empty();
    return;
  }
  var reservist = new Armee(G.players[willHin.besitzer].armee).entferne(willHin);
  if (willHin === reservist) { // verhindert doppeltes platzieren
    schlacht.stelleAuf(willHin, feld);  
    G.log.unshift(feld + ": platziert " + willHin.gattung + " " + willHin.farbe);
    if (reservist.farbe === "rot") {
      armeeRot.hinzu(willHin);
    } else {
      armeeGelb.hinzu(willHin);        
    }
  }
  schlacht.empty();
}

function bewege(G, ctx, willHin, feld, player) {
  G.kampf = [];
  schlacht.populate(G.feld);
  var schonDa = schlacht.holeFigur(feld);
  if (schonDa === willHin) {
    schlacht.empty();
    return; // avoid handling same event twice (once from each client)
  } else if (schonDa) {
    G.log.unshift(feld + ": besetzt von " + schonDa.gattung + " " + schonDa.farbe); 
    //TODO: handle occupied fields => schlage
  } else {
    // Feld ist frei
    schlacht.verschiebe(willHin, feld);  
    G.log.unshift(feld + ": bewege " + willHin.gattung + " " + willHin.farbe);
  }
  schlacht.empty();
}

function schlage(G, ctx, willHin, schonDa, feld) {
  G.kampf = [];
  G.log.unshift(feld + ": schlage " + willHin.gattung + " " + willHin.farbe);
  if (schonDa === willHin) {
    G.log.unshift(feld + ": " + willHin.gattung + " " + willHin.farbe + " doppelt");
    return; // avoid handling same event twice (once from each client)
  } else if (schonDa) {
    G.log.unshift(feld + ": Kampf gegen " + schonDa.gattung + " " + schonDa.farbe);
    G.kampf[schonDa.besitzer] = schonDa;
    G.kampf[willHin.besitzer] = willHin;
    // Sieger bestimmen, Verlierer entfernen aus Armee
    var sieger = willHin.schlage(schonDa);
    schlacht.populate(G.feld);
    if (sieger > 0) {
      // gewonnen, schonDa muss weg
      schlacht.gestorben(feld); // FIXME: superfluous
      schlacht.verschiebe(willHin, feld);
      new Armee(G.players[schonDa.besitzer].armee).entferne(schonDa);
      G.log.unshift(feld + ": " + willHin.gattung + " " + willHin.farbe + " gewinnt ");
    } else if (sieger < 0) {
      // verloren, willHin abräumen aus Armee und Spielfeld 
      schlacht.gestorben(schlacht.findeFigur(willHin));
      new Armee(G.players[willHin.besitzer].armee).entferne(willHin);
      G.log.unshift(feld + ": "+ willHin.gattung + " " + willHin.farbe + " verliert ");
    } else {
      // kein Sieger
      schlacht.gestorben(feld);
      schlacht.gestorben(schlacht.findeFigur(willHin));
      new Armee(G.players[schonDa.besitzer].armee).entferne(schonDa);
      new Armee(G.players[willHin.besitzer].armee).entferne(willHin);
      G.log.unshift(feld + ": beide verlieren");
    }
  } else {
    //TODO Feld ist frei => bewege
    G.log.unshift(schonDa.gattung + " ?bewege?");
  }
  schlacht.empty();
}

function gebeAuf(G, ctx) {
  G.log.unshift(G.armeen[ctx.currentPlayer] + " gibt auf!");
  G.players[ctx.currentPlayer].quit = G.armeen[ctx.currentPlayer].flagge;  
  G.players[ctx.currentPlayer].armee.flagge = null;
  ctx.events.endTurn();
}


//
// main
//
export const schlacht = new Schlacht(10);

var armeeRot = new Armee("rot", "aktiv", 0);
var armeeGelb = new Armee("gelb", "aktiv", 1);


