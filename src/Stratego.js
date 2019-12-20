import { Armee }  from './Armee';
import { Schlacht }  from './Schlacht';


export const Stratego = {
  setup: () => ({ 
    log: [],
    schlacht: new Schlacht(6),
    armeen: [reserveRot, reserveGelb],
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
      start: true, onBegin: (G,ctx) => { G.log.unshift("Los geht's!")},
      endIf: (G, ctx) => { return G.armeen[0].istAufgestellt() && G.armeen[1].istAufgestellt() },
      next: 'Kampf'
    },
    Kampf: { 
      moves: { bewege, schlage, gebeAuf }, 
      onBegin: (G,ctx) => { G.armeen = [armeeRot, armeeGelb] },
      turn: { moveLimit: 1 }
    }
  }, /* TODO refactor G to players, secret for easy removal
  playerView: (G, ctx, playerID) => {
    if (ctx.numMoves < 1) return G;
    var anzahlFelder = G.schlacht.groesse() * G.schlacht.groesse();
    var secretSchlacht = new Schlachtfeld(anzahlFelder);
    for (var feld=0; feld < anzahlFelder; feld++) {
      var figur = G.schlacht.holeFigur(feld);
      if (figur) {
        //if (figur.farbe === "rot") { //FIXME compare ids
          if (playerID == 0) {
            var dummyRot = new Figur("dummy", "rot", "X", 0);
            secretSchlacht.stelleAuf(dummyRot, feld);
          } else {
            secretSchlacht.stelleAuf(figur, feld);
          }
        //}
      }
    }
    var Gsecret = {
      help: "secret",
      figur: G.figur,
      schlacht: secretSchlacht,
      armeen: G.armeen,
      kampf: G.kampf
    };
    return Gsecret;
  }, */

  endIf: (G, ctx) => {
    var rotVerliert = G.armeen[0].istKampfUnfaehig();
    var gelbVerliert = G.armeen[1].istKampfUnfaehig();
    if (rotVerliert && gelbVerliert) return { winner: "Patt. Niemand " };
    if (rotVerliert) return { winner: G.armeen[1].farbe };
    if (gelbVerliert) return { winner: G.armeen[0].farbe };
  }
};

//
// moves
//
function platziere(G, ctx, willHin, feld, player) {
  var schonDa = G.schlacht.holeFigur(feld);
  if (schonDa === willHin) {
    // G.help = schonDa.typ + " " + schonDa.farbe + " doppelt";
    return; // avoid handling same event twice (once from each client)
  } else if (schonDa) {
    G.log.unshift("besetzt von " + schonDa.typ + " " + schonDa.farbe); 
    //TODO: handle occupied fields
    return;
  }
  var reservist = G.armeen[willHin.besitzer].entferne(willHin);
  if (reservist === willHin) { // verhindert doppeltes platzieren
    G.schlacht.stelleAuf(willHin, feld);  
    G.log.unshift(feld + ": platziert " + willHin.gattung + " " + willHin.farbe);
    if (reservist.farbe === "rot") {
      armeeRot.hinzu(willHin);
    } else {
      armeeGelb.hinzu(willHin);        
    }
  }
}

function bewege(G, ctx, willHin, feld, player) {
  G.kampf = [];
  var schonDa = G.schlacht.holeFigur(feld);
  if (schonDa === willHin) {
    return; // avoid handling same event twice (once from each client)
  } else if (schonDa) {
    G.log.unshift(feld + ": besetzt von " + schonDa.gattung + " " + schonDa.farbe); 
    //TODO: handle occupied fields => schlage
  } else {
    // Feld ist frei
    G.schlacht.verschiebe(willHin, feld);  
    G.log.unshift(feld + ": bewege " + willHin.gattung + " " + willHin.farbe);
  }
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
    if (sieger > 0) {
      // gewonnen, schonDa muss weg
      G.schlacht.gestorben(feld); // FIXME: superfluous
      G.schlacht.verschiebe(willHin, feld);
      G.armeen[schonDa.besitzer].entferne(schonDa);
      G.log.unshift(feld + ": " + willHin.gattung + " " + willHin.farbe + " gewinnt ");
    } else if (sieger < 0) {
      // verloren, willHin abräumen aus Armee und Spielfeld 
      G.schlacht.gestorben(G.schlacht.findeFigur(willHin));
      G.armeen[willHin.besitzer].entferne(willHin);
      G.log.unshift(feld + ": "+ willHin.gattung + " " + willHin.farbe + " verliert ");
    } else {
      // kein Sieger
      G.schlacht.gestorben(feld);
      G.schlacht.gestorben(G.schlacht.findeFigur(willHin));
      G.armeen[schonDa.besitzer].entferne(schonDa);
      G.armeen[willHin.besitzer].entferne(willHin);
      G.log.unshift(feld + ": beide verlieren");
    }
  } else {
    //TODO Feld ist frei => bewege
    G.log.unshift(schonDa.typ + " ?bewege?");
  }
}

function gebeAuf(G, ctx) {
  G.help = G.armeen[ctx.currentPlayer] + " gibt auf!";
  G.armeen[ctx.currentPlayer].entferne(0);
  ctx.endTurn();
}

//
// main
//
var reserveRot = new Armee("rot", "reserve", 0);
var reserveGelb = new Armee("gelb", "reserve", 1);
var armeeRot = new Armee("rot", "aktiv", 0);
var armeeGelb = new Armee("gelb", "aktiv", 1);


