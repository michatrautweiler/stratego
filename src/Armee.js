import { Figur }  from './Figur';
import { Flagge }  from './Flagge';


export class Armee {

  constructor(farbe, typ, player) {
    this.typ = typ;
    this.farbe = farbe;
    this.flagge = new Flagge("flagge",farbe,0,1, player);
    this.soldaten = [];
    for (var i = this.anzahlSoldaten(); i>0; i--) {
      var soldat = new Figur("soldat",farbe,1,i, player);
      this.soldaten.unshift(soldat); // num=1 at [0]
    }
  }
  
  anzahlSoldaten() { return 2; }
  
  macheMobil(rang) {
    if (rang === 0) {
      return this.flagge;
    } else if (rang === 1) {
      return this.soldaten[this.soldaten.length-1];  
    } else return null;
  }
  
  entferne(figur) {
  if (figur.rang === 0) {
    var f = this.flagge;
    this.flagge = null;
    return f;
  } else if (figur.rang === 1) {
    var findByNum = function(soldat) {
      return soldat.num === figur.num;
    }
    var tot = this.soldaten.find(findByNum);
    if (!tot) {
      this.unknownSoldier = this.figur;
      return null;
    } else {
      // found! remove
      var pos = this.soldaten.indexOf(tot);
      this.entfernt = this.soldaten.splice(pos, 1);
      return tot;
    }
  }
  else {
    this.unknownRank = this.figur;
    return null;
  }
}


  mannStaerke(rang) {
  if (rang === 0) {
    if (this.flagge === null) return 0; else return 1;
  }
  else if (rang === 1) {
    return this.soldaten.length;
  }
  else return 0;
}

  gattungen() {
  return ["flagge","soldat"];
}

  hinzu(figur) {
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
 
 istAufgestellt() {
   if (this.typ === "aktiv") return true;
   var anzahlMann = 0;
   for (var rang = 0; rang < this.gattungen().length; rang++) {
     anzahlMann += this.mannStaerke(rang);
   }
   return anzahlMann === 0;
 }
}