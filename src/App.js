import { Client } from 'boardgame.io/react';

const Stratego = {
  setup: () => ({ 
    help: "Los! Wähle eine Figur deiner Armee.",
    figur: null,
    schlacht,
    armeen: [armeeGelb, armeeBlau]
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
      if (G.figur) {
        G.help = "Zuerst Figur " + G.figur + " auf Schlachtfeld aufstellen";
      } else {
        var armee = G.armeen[ctx.playOrderPos];
        G.help = "Armee " + armee.farbe + " macht mobil: " + id;
        G.figur = armee.macheMobil(id);
      }
    },
  },
};

const App = Client({ game: Stratego });

export default App;

// Figuren
var flaggeGelb = {typ:"flagge", armee:"gelb", rang:0};
var flaggeBlau = {typ:"flagge", armee:"blau", rang:0};

const anzahlSoldaten = 4;
var soldatenGelb = Array(anzahlSoldaten);
var soldatenBlau = Array(anzahlSoldaten);

for (var i=anzahlSoldaten; i>0; i--) {
  var soldatGelb = {typ:"soldat", armee:"gelb", rang:1};
  soldatenGelb[i-1] = soldatGelb;
  var soldatBlau = {typ:"soldat", armee:"blau", rang:1};
  soldatenBlau[i-1] = soldatBlau;
}
var armeeGelb = {farbe: "gelb", flagge: flaggeGelb, soldaten: soldatenGelb, macheMobil: function(rang) {
    return holeFigur(this,rang);
  }
};
var armeeBlau = {farbe: "blau", flagge: flaggeBlau, soldaten: soldatenBlau, macheMobil: function(rang) {
    return holeFigur(this,rang);
  }
};

// Spielbrett
var schlacht = {
  reihe1: Array(4).fill(null),
  reihe2: Array(4).fill(null),
  reihe3: Array(4).fill(null),
  reihe4: Array(4).fill(null),
  stelleAuf: function(figur, platz) {
    if (platz < 4) this.reihe1[platz] = figur;
  }
};

function holeFigur(armee, rang) {
  if (rang === 0) {
    var f = armee.flagge; // this!
    armee.flagge = null;
    return f;
  }
  else {
    var s = armee.soldaten[armee.soldaten.length-1];
    armee.soldaten[armee.soldaten.length-1] = null;
    return s;
  }
}
