import { Figur }  from './Figur';
import { Flagge }  from './Flagge';
import { Bombe }  from './Bombe';


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
    this.bomben = [];
    for (i = this.anzahlBomben(); i>0; i--) {
      var bombe = new Bombe("bombe",farbe,"B",i, player);
      this.bomben.unshift(bombe); // num=1 at [0]
    }
  }
  
  anzahlSoldaten() { return 3; }
  anzahlBomben() { return 2; }
  
  gattungen() {
    return ["flagge","soldat","bombe"];
  }
  
  macheMobil(gattung) {
    if (gattung === "flagge") {
      return this.flagge;
    } else if (gattung === "soldat") {
      return this.soldaten[this.soldaten.length-1];  
    } else if (gattung === "bombe") {
      return this.bomben[this.bomben.length-1];
    } else return null;
  }
  
  entferne(figur) {
    // suchfunktion
    var findByNum = function(soldat) {
      return soldat.num === figur.num;
    }
    
    if (figur.rang === 0) {
      var f = this.flagge;
      this.flagge = null;
      return f;
    } else if (figur.rang === 1) {
      var tot = this.soldaten.find(findByNum);
      if (!tot) {
        this.unknownSoldat = this.figur;
        return null;
      } else {
        // found! remove
        var pos = this.soldaten.indexOf(tot);
        this.entfernt = this.soldaten.splice(pos, 1);
        return tot;
      }
    } else if (figur.rang === "B") {
      var tot = this.bomben.find(findByNum);
      if (!tot) {
        this.unknownBomb = this.figur;
        return null;
      } else {
        // found! remove
        var pos = this.bomben.indexOf(tot);
        this.entfernt = this.bomben.splice(pos, 1);
        return tot;
      }
    } else {
      this.unknownRank = this.figur;
      return null;
    }
  }
  
  istKampfUnfaehig() {
    // hat Flagge verloren
    if (this.typ === "reserve") return false;
    if (!this.flagge) return true; 
    
    // hat keine bewegbaren Figuren mehr
    var figur;
    for (figur of this.ada()) {
      if (figur.istMobil()) return false;
      //TODO: kann die Figur auf dem Schlachtfeld einen gueltigen Zug machen?
    }
    return true;
  }
  
  ada() {
    var figuren = [];
    figuren.push(this.flagge);
    figuren = figuren.concat(this.soldaten);
    return figuren;
  }

  mannStaerke(gattung) {
    if (gattung === "flagge") {
      if (this.flagge === null) return 0; else return 1;
    }
    else if (gattung === "soldat") {
      return this.soldaten.length;
    } else if (gattung === "bombe") {
      return this.bomben.length;
    }
    else return 0;
}
  

  hinzu(figur) {
    // suchfunktion
    var istGleicheFigur = function(soldat) {
      return soldat.num === figur.num;
    }
    
    if (figur.rang === 0) {
      this.flagge = figur;
    }
    else if (figur.rang === 1) {
      if (!this.soldaten.find(istGleicheFigur))
      this.soldaten.push(figur);
    } else if (figur.rang === "B") {
      if (!this.bomben.find(istGleicheFigur))
      this.bomben.push(figur);
    }
  }
 
  istAufgestellt() {
    if (this.typ === "aktiv") return true;
    var anzahlMann = 0;
    var gattung;
    for (gattung of this.gattungen()) {
      anzahlMann += this.mannStaerke(gattung);
    }
    return anzahlMann === 0;
  }
}