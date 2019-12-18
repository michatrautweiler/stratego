import { Armee }  from './Armee';
import { Schlacht }  from './Schlacht';


export const Stratego = {
  setup: () => ({ 
    log: Array(1),
    help: "Los! Wähle eine Figur deiner Armee.",
    schlacht: new Schlacht(4),
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
            moves: { platziere }, next: 'Warten'
          }, Warten: { }
        }
      },
      start: true, 
      endIf: (G, ctx) => { 
        return bereitZurSchlacht(G, ctx);
      },
      next: 'Kampf'
    },
    Kampf: { 
      moves: { bewege, schlage, gebeAuf }, 
      onBegin: (G,ctx) => { G.armeen = [armeeRot, armeeGelb] }
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
    if (IsVictory(G.kampf)) {
      return { winner: G.kampf[ctx.currentPlayer].farbe };
    }
    // TODO DRAW: eine bewegbaren Figuren
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
    G.help = willHin.farbe + " " + willHin.typ + " auf " + feld;
    if (reservist.farbe === "rot") {
      armeeRot.hinzu(willHin);
    } else {
      armeeGelb.hinzu(willHin);        
    }
  }
}


function bereitZurSchlacht(G, ctx) {
  if (ctx.activePlayers === null) {
    return false;
  } else {
    var p1 = ctx.activePlayers["0"];
    var p0 = ctx.activePlayers["1"];
    if (p0 === p1) {
      return p0 === "Warten";  
    }
  }
}

function bewege(G, ctx, willHin, feld, player) {
  G.log.unshift("bewege");
  var schonDa = G.schlacht.holeFigur(feld);
  if (schonDa === willHin) {
    //G.help = schonDa.typ + " " + schonDa.farbe + " doppelt";
    return; // avoid handling same event twice (once from each client)
  } else if (schonDa) {
    G.log.unshift("besetzt von " + schonDa.typ + " " + schonDa.farbe); 
    //TODO: handle occupied fields => schlage
  } else {
    // Feld ist frei
    G.schlacht.verschiebe(willHin, feld);  
    G.log.unshift(willHin.farbe + " " + willHin.typ + " auf " + feld);
  }
  G.kampf = [];
}

function schlage(G, ctx, willHin, schonDa) {
  G.kampf = [];
  G.log.unshift("schlage");
  if (schonDa === willHin) {
    G.log.unshift(willHin.typ + " " + willHin.farbe + " doppelt");
    return; // avoid handling same event twice (once from each client)
  } else if (schonDa) {
    G.log.unshift("Kampf gegen " + schonDa.typ + " " + schonDa.farbe);
    G.kampf[schonDa.besitzer] = schonDa;
    G.kampf[willHin.besitzer] = willHin;
    // Sieger bestimmen, Verlierer entfernen aus Armee
    if (willHin.gewinnt(schonDa)) {
      // gewonnen, schonDa muss weg
      G.armeen[schonDa.besitzer].entferne(schonDa);
      var feld = G.schlacht.findeFigur(schonDa);
      G.schlacht.gestorben(feld); // FIXME: superfluous
      G.schlacht.verschiebe(willHin, feld);
      G.log.unshift(willHin.farbe + " " + willHin.typ + " gewinnt " + feld);
    } else {
      // verloren, willHin abräumen aus Armee und Spielfeld 
      G.schlacht.gestorben(G.schlacht.findeFigur(willHin));
      G.armeen[willHin.besitzer].entferne(willHin);
      G.log.unshift(willHin.farbe + " " + willHin.typ + " verliert ");
    }
  } else {
    //TODO Feld ist frei => bewege
    G.log.unshift(schonDa.typ + " ?bewege?");
  }
}

function gebeAuf(G, ctx) {
  G.help = G.armeen[ctx.currentPlayer] + " gibt auf!";
  G.armeen[ctx.currentPlayer] = null;
  ctx.endTurn();
}

//
// main
//
var reserveRot = new Armee("rot", "reserve", 0);
var reserveGelb = new Armee("gelb", "reserve", 1);
var armeeRot = new Armee("rot", "aktiv", 0);
var armeeGelb = new Armee("gelb", "aktiv", 1);


//
// game rules
//
function IsVictory(kampf) {
  if (!kampf) return;
  if (!kampf[0]) return;
  if (!kampf[1]) return;
  
  // Flagge ist im Kampf 
  if (kampf[0].rang === 0) return true;
  if (kampf[1].rang === 0) return true;
}