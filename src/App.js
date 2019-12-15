export const Stratego = {
  setup: () => ({ 
    help: "Los! Wähle eine Figur deiner Armee.",
    figur: Array(2).fill(null),
    schlacht: new Schlachtfeld(4),
    armeen: [reserveRot, reserveGelb],
    kampf: Array(2).fill(null)
  }),
  
  phases: {
    MobilMachung: { 
      turn: {
        activePlayers: { all: 'Aufstellen' },
        stages: {
          Aufstellen: {
            moves: { clickBoard, clickArmee }, next: 'Warten'
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
      moves: bewegen, schlagen, aufgeben, 
      onBegin: (G,ctx) => { G.armeen = [armeeRot, armeeGelb] } 
    }
  },

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

// moves
/*function platzieren(G, ctx, id) {
  clickArmee(G, ctx, id);
  clickBoard(G, ctx, id);
}*/
function clickBoard(G, ctx, feldId, player) {
  var schonDa = G.schlacht.holeFigur(feldId);
  var willHin = G.figur[player];
  if (willHin) {
    if (schonDa) {
      if (schonDa === willHin) return; // avoid handling same event twice (once from each client)
      else {
        G.help ="schon besetzt"; //TODO: handle occupied fields
      }
    }
    G.schlacht.stelleAuf(willHin, feldId);  
          
    if (willHin.farbe === "rot") {
      reserveRot.entferne(willHin);
      armeeRot.platziere(willHin, feldId);
    } else {
      reserveGelb.entferne(willHin);
      armeeGelb.platziere(willHin, feldId);        
    }
    G.figur[player] = null;
  }
}

function clickArmee(G, ctx, rang, player) {
  G.help = rang + " Armee " + G.armeen[player].farbe + " macht mobil";
  G.figur[player] = G.armeen[player].macheMobil(rang);
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

function bewegen(G, ctx) {

}

function schlagen(G, ctx) {

}

function aufgeben(G, ctx) {
  G.help = G.armeen[ctx.currentPlayer] + " gibt auf!";
  G.armeen[ctx.currentPlayer] = null;
  ctx.endTurn();
}

// main
const anzahlSoldaten = 1;

var reserveRot = new Armee("rot");
var reserveGelb = new Armee("gelb");
var armeeRot = new Armee("rot");
var armeeGelb = new Armee("gelb");

// Figur
function Figur(typ,farbe,rang, num) {
  this.typ = typ;
  this.farbe = farbe;
  this.rang = rang;
  this.num = num;
}

// Armee
function Armee(farbe) {
  this.farbe = farbe;
  this.flagge = new Figur("flagge",farbe,0,1);
  this.soldaten = new Array();
  for (var i=anzahlSoldaten; i>0; i--) {
    var soldat = new Figur("soldat",farbe,1,i);
    this.soldaten.push(soldat);
  }
}
  

Armee.prototype.macheMobil = function(rang) {
  if (rang == 0) {
    return this.flagge;
  }
  else if (rang == 1) {
    return this.soldaten[this.soldaten.length-1];  
  } else return null;
}
Armee.prototype.entferne = function(figur) {
  if (figur.rang == 0) this.flagge = null;
  else if (figur.rang == 1) {
    this.soldaten.pop();
  }
  else {}
}

Armee.prototype.mannStaerke = function(rang) {
  if (rang == 0) {
    if (this.flagge === null) return 0; else return 1;
  }
  else if (rang == 1) {
    return this.soldaten.length;
  }
  else return 0;
}
Armee.prototype.gattungen = function() {
  return ["flagge","soldaten"];
}
Armee.prototype.platziere = function(figur, id) {
  if (figur.rang == 0) {
    this.flagge = figur;
  }
  else if (figur.rang == 1) {
    this.soldaten.push(figur);
  }
}

// Spielbrett
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



// game rules
function IsVictory(kampf) {
  if (kampf[0] === null) return;
  if (kampf[1] === null) return;
  
  // Flagge ist im Kampf 
  if (kampf[0].rang === 0) return true;
  if (kampf[1].rang === 0) return true;
}
