import { Client } from 'boardgame.io/react';
import { StrategoBoard } from "./board";

const Stratego = {
  setup: () => ({ 
    help: "Los! Wähle eine Figur deiner Armee.",
    figur: null,
    schlacht,
    armeen: [armeeRot, armeeBlau],
    kampf: Array(2).fill(null),
    anzahlFiguren: [1,4,3,1] //index=rang, wert=anzahl 
  }),

  moves: {
    clickBoard: (G, ctx, id) => {
      if (G.figur) {
        G.schlacht.stelleAuf(G.figur, id);
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

// Figuren
var flaggeRot = {typ:"flagge", armee:"rot", rang:0};
var flaggeBlau = {typ:"flagge", armee:"blau", rang:0};

const anzahlSoldaten = 4; //anzahlFiguren[1]
var soldatenRot = Array(anzahlSoldaten);
var soldatenBlau = Array(anzahlSoldaten);

for (var i=anzahlSoldaten; i>0; i--) {
  var soldatRot = {typ:"soldat", armee:"rot", rang:1};
  soldatenRot[i-1] = soldatRot;
  var soldatBlau = {typ:"soldat", armee:"blau", rang:1};
  soldatenBlau[i-1] = soldatBlau;
}
var armeeRot = {farbe: "rot", flagge: flaggeRot, soldaten: soldatenRot, macheMobil: function(rang) {
    return holeFigurVonArmee(this,rang);
  }
};
var armeeBlau = {farbe: "blau", flagge: flaggeBlau, soldaten: soldatenBlau, macheMobil: function(rang) {
    return holeFigurVonArmee(this,rang);
  }
};

// Spielbrett
var schlacht = {
  reihe1: Array(4).fill(null),
  reihe2: Array(4).fill(null),
  reihe3: Array(4).fill(null),
  reihe4: Array(4).fill(null),
  stelleAuf: function(figur, platz) {
    if (platz < 4) this.reihe1[platz] = figur; //FIXME Schlachtfeldgrösse
    else if (platz < 8) this.reihe2[platz] = figur;
    else if (platz < 12) this.reihe3[platz] = figur;
    else if (platz < 16) this.reihe4[platz] = figur;
  },
  holeFigur: function(platz) {
    var f = null; // FIXME schlachtfeldgrösse
    if (platz < 4) f = this.reihe1[platz];
    else if (platz < 8) f = this.reihe2[platz];
    else if (platz < 12) f = this.reihe3[platz];
    else if (platz < 16) f = this.reihe4[platz];
    return f;
  }
};

function holeFigurVonArmee(armee, rang) {
  if (rang == 0) {
    var f = armee.flagge; // this!
    //armee.flagge = null; erst beim platzier1en
    return f;
  }
  else if (rang == 1) {
    var s = armee.soldaten[armee.soldaten.length-1];
    //armee.soldaten[armee.soldaten.length-1] = null;
    return s;
  } else return null;
}

function IsVictory(kampf) {
  if (kampf[0] === null) return;
  if (kampf[1] === null) return;
  
  // Flagge ist im Kampf 
  if (kampf[0].rang === 0) return true;
  if (kampf[1].rang === 0) return true;
}
