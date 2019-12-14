import { Client } from 'boardgame.io/react';
import { StrategoBoard } from "./board";

const Stratego = {
  setup: () => ({ 
    help: "Los! Wähle eine Figur deiner Armee.",
    figur: null,
    schlacht: new Schlachtfeld(4),
    armeen: [armeeRot, armeeBlau],
    kampf: Array(2).fill(null)
  }),

  moves: {
    clickBoard: (G, ctx, id) => {
      if (G.figur) {
        G.schlacht.stelleAuf(G.figur, id);
        // TODO: Figur aus Armee entfernen
        var armee = G.armeen[ctx.currentPlayer];
        armee.entferne(G.figur.rang);
        G.figur = null;
      }
    },
    clickArmee: (G, ctx, id) => {
      G.help = "Armee " + ctx.currentPlayer;
      //if (G.figur) {
      //  G.help = "Zuerst Figur " + G.figur + " auf Schlachtfeld aufstellen";
      //} else {
        var armee = G.armeen[ctx.playOrderPos];
        G.help = id + " Armee " + armee.farbe + " macht mobil!";
        G.figur = armee.macheMobil(id);
      //}
    },
  },
  endIf: (G, ctx) => {
    if (IsVictory(G.kampf)) {
      return { winner: ctx.currentPlayer };
    }
    // todo if (IsDraw(G.cells)) {}
  },
};

const App = Client({ game: Stratego, board: StrategoBoard });

export default App;

const anzahlSoldaten = 4;


var armeeRot = new Armee("rot");
var armeeBlau = new Armee("blau");


// Figur
function Figur(typ,farbe,rang) {
  this.typ = typ;
  this.farbe = farbe;
  this.rang = rang;
}

// Armee
function Armee(farbe) {
  this.farbe = farbe;
  this.flagge = new Figur("flagge",farbe,0);
  this.soldaten = new Array(anzahlSoldaten);
  for (var i=anzahlSoldaten; i>0; i--) {
    var soldat = new Figur("soldat",farbe,1);
    this.soldaten[i-1] = soldat;
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
Armee.prototype.entferne = function(rang) {
  if (rang == 0) this.flagge = null;
  else if (rang == 1) this.soldaten.pop();
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




function IsVictory(kampf) {
  if (kampf[0] === null) return;
  if (kampf[1] === null) return;
  
  // Flagge ist im Kampf 
  if (kampf[0].rang === 0) return true;
  if (kampf[1].rang === 0) return true;
}
