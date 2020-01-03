import { Figur }  from './Figur';
import { Flagge }  from './Flagge';
import { Bombe }  from './Bombe';
import { Mineur }  from './Mineur';


export class Armee {

  constructor(farbe, typ, player) {
    if (!typ) { this.populate(farbe); return this; }
    this.typ = typ;
    this.farbe = farbe;
    this.flagge = [new Flagge("flagge",farbe,0,1, player)];
    this.marschall = [new Figur("marschall",farbe,11,1, player)];
    this.soldaten = [];
    for (let i = this.anzahlSoldaten(); i>0; i--) {
      let soldat = new Figur("soldaten",farbe,3,i, player);
      this.soldaten.unshift(soldat);
    }
    this.bomben = [];
    for (let i = this.anzahlBomben(); i>0; i--) {
      let bombe = new Bombe("bomben",farbe,"B",i, player);
      this.bomben.unshift(bombe);
    }
    this.mineure = [];
    for (let i = this.anzahlMineure(); i>0; i--) {
      let mineur = new Mineur("mineure",farbe,2,i, player);
      this.mineure.unshift(mineur);
    }
  }
  
  anzahlSoldaten() { return 3; }
  anzahlBomben() { return 2; }
  anzahlMineure() { return 2; }
  
  gattungen() {
    return ["flagge","soldaten","bomben","mineure","marschall"];
  }
  
  mannschaft() {
    return {
      typ: this.typ,
      farbe: this.farbe,
      flagge: this.flagge,
      soldaten: this.soldaten,
      bomben: this.bomben,
      mineure: this.mineure,
      marschall : this.marschall
    };
  }
  
  populate(mannschaft) {
    this.typ = mannschaft.typ;
    this.farbe = mannschaft.farbe;
    this.flagge = mannschaft.flagge;
    this.soldaten = mannschaft.soldaten;
    this.bomben = mannschaft.bomben;
    this.mineure = mannschaft.mineure;
    this.marschall = mannschaft.marschall;
  }
  
  macheMobil(gattung) {
    let index =  this[gattung].length -1;
    return this[gattung][index];
  }
  
  entferne(figur) {
    // suchfunktion
    let findByNum = function(soldat) {
      return soldat.num === figur.num;
    }
    let tot = this[figur.gattung].find(findByNum);
    if (!tot) {
      this.unknownSoldat = this.figur;
      return null;
    } else {
      // found! remove
      let pos = this[figur.gattung].indexOf(tot);
      let entfernt = this[figur.gattung].splice(pos, 1);
      return tot;
    }
  }
  
  istKampfUnfaehig() {
    // hat Flagge verloren
    if (this.typ === "reserve") return false;
    if (!this.flagge || this.flagge.length < 1  || !this.flagge[0]) return true; 
    
    // hat keine bewegbaren Figuren mehr
    let figur;
    for (figur of this.ada()) {
      if (figur.istMobil()) return false;
      //TODO: kann die Figur auf dem Schlachtfeld einen gueltigen Zug machen?
    }
    return true;
  }
  
  ada() {
    let figuren = [];
    for (var gattung in this) {
      if (Array.isArray(this[gattung])) {
        figuren = figuren.concat(this[gattung]);
      }
    }
    return figuren;
  }

  mannStaerke(gattung) {
    if (Array.isArray(this[gattung])) {
      return this[gattung].length;
    } else return 0;
  }
  

  hinzu(figur) {
    //TODO: delete me
    // suchfunktion
    let istGleicheFigur = function(soldat) {
      return soldat.num === figur.num;
    }
    if (!this[figur.gattung].find(istGleicheFigur)) {
      this[figur.gattung].push(figur);
    }
    return;
  }
 
  istAufgestellt() {
    if (this.typ === "aktiv") return true;
    let anzahlMann = 0;
    let gattung;
    for (gattung in this) {
      anzahlMann += this.mannStaerke(gattung);
    }
    return anzahlMann === 0;
  }
}