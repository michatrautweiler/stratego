export const Stratego = {
  setup: () => ({ 
    help: "Los! Wähle eine Figur deiner Armee.",
    schlacht: new Schlachtfeld(4),
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
    if (G.armeen[0] === null) {
      return {winner: 0};
    } else if (G.armeen[1] === null) {
      return {winner: 1};
    }
    else if (IsVictory(G.kampf)) {
      return { winner: ctx.currentPlayer };
    }
    // todo if (IsDraw(G.cells)) {}
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
    G.help = "besetzt von " + schonDa.typ + " " + schonDa.farbe; 
    //TODO: handle occupied fields
  }
  var reservist = G.armeen[player].entferne(willHin);
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
  var schonDa = G.schlacht.holeFigur(feld);
  if (schonDa === willHin) {
    // G.help = schonDa.typ + " " + schonDa.farbe + " doppelt";
    return; // avoid handling same event twice (once from each client)
  } else if (schonDa) {
    G.help = "besetzt von " + schonDa.typ + " " + schonDa.farbe; 
    //TODO: handle occupied fields => schlage
  }
}

function schlage(G, ctx) {

}

function gebeAuf(G, ctx) {
  G.help = G.armeen[ctx.currentPlayer] + " gibt auf!";
  G.armeen[ctx.currentPlayer] = null;
  ctx.endTurn();
}

// main
const anzahlSoldaten = 1;

var reserveRot = new Armee("rot", "reserve");
var reserveGelb = new Armee("gelb", "reserve");
var armeeRot = new Armee("rot", "aktiv");
var armeeGelb = new Armee("gelb", "aktiv");

// Figur
function Figur(typ,farbe,rang, num) {
  this.typ = typ;
  this.farbe = farbe;
  this.rang = rang;
  this.num = num;
}


// Armee
function Armee(farbe, typ) {
  this.typ = typ;
  this.farbe = farbe;
  this.flagge = new Figur("flagge",farbe,0,1);
  this.soldaten = [];
  for (var i=anzahlSoldaten; i>0; i--) {
    var soldat = new Figur("soldat",farbe,1,i);
    this.soldaten.push(soldat);
  }
}
  

Armee.prototype.macheMobil = function(rang) {
  if (rang === 0) {
    return this.flagge;
  }
  else if (rang === 1) {
    return this.soldaten[this.soldaten.length-1];  
  } else return null;
}
Armee.prototype.entferne = function(figur) {
  if (figur.rang === 0) {
    var f = this.flagge;
    this.flagge = null;
    return f;
  } else if (figur.rang === 1) {
    return this.soldaten.pop();
  }
  else {
    return null;
  }
}

Armee.prototype.mannStaerke = function(rang) {
  if (rang === 0) {
    if (this.flagge === null) return 0; else return 1;
  }
  else if (rang === 1) {
    return this.soldaten.length;
  }
  else return 0;
}
Armee.prototype.gattungen = function() {
  return ["flagge","soldat"];
}
Armee.prototype.hinzu = function(figur) {
  if (figur.rang === 0) {
    this.flagge = figur;
  }
  else if (figur.rang === 1) {
    var istGleicheFigur = function(soldat) {
       return soldat.num === figur.num;
    }
    if (!this.soldaten.find(istGleicheFigur))
    this.soldaten.push(figur);
  }
}

//
// Spielbrett
//
function Schlachtfeld(dim) {
  this.feldGroesse = dim;
  this.feld = new Array(dim * dim).fill(null);
}
Schlachtfeld.prototype.stelleAuf = function(figur, platz) {
  this.feld[platz] = figur;
};
Schlachtfeld.prototype.holeFigur = function(platz) {   
  return this.feld[platz];
};
Schlachtfeld.prototype.groesse = function() {
  return this.feldGroesse;
}


// game rules
function IsVictory(kampf) {
  if (kampf[0] === null) return;
  if (kampf[1] === null) return;
  
  // Flagge ist im Kampf 
  if (kampf[0].rang === 0) return true;
  if (kampf[1].rang === 0) return true;
}
