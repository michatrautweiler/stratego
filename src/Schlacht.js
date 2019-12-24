export class Schlacht {

  constructor(dim) {
    this.feldGroesse = dim;
    this.feld = new Array(dim * dim).fill(null);
  }
  
  stelleAuf(figur, platz) {
    if (platz < 0 || platz > this.feld.length) { this.nirvana = figur; }
    this.feld[platz] = figur;
  }
  
  holeFigur(platz) {   
    return this.feld[platz];
  }
  
  groesse() {
    return this.feldGroesse;
  }
  
  anzahlFelder() {
    return this.groesse() * this.groesse();
  }
  
  findeFigur(figur) {   
    var i = this.feld.indexOf(figur);
    if (i < 0) {
      // suchfunktion
      for (var index = 0; index < this.anzahlFelder(); index++) {
        if (figur.equals(this.feld[index])) {
          return index;
        }
      }
      if (i < 0) { this.unknownFigure = figur; }
    } else {
      return i;
    }
  }
  
  verschiebe(figur, zuFeld) {
    var vonFeld = this.findeFigur(figur);
    this.stelleAuf(figur, zuFeld);
    this.feld[vonFeld] = null;
  }
 
  gestorben(platz) {
    this.feld[platz] = null;
  }
  
  istAufstellbar(figur, platz) {
    if (!figur) return false;
    if (this.feld[platz]) return false;
    var dmz = 2* this.feldGroesse;
    if (figur.besitzer === 1) {
      return 2*platz < this.anzahlFelder() - dmz;
    } else {
      return 2*platz >= this.anzahlFelder() + dmz;
    }
  }
  
  istErreichbar(figur, ziel) {
   if (ziel < 0) return false;
   if (ziel >= this.anzahlFelder()) return false;
   // Seen
   if (this.anzahlFelder() > 99) {
     if (ziel === 42) return false;
     if (ziel === 43) return false;
     if (ziel === 52) return false;
     if (ziel === 53) return false;
     if (ziel === 46) return false;
     if (ziel === 47) return false;
     if (ziel === 56) return false;
     if (ziel === 57) return false;
   }
   
   //TODO use links(), rechts(),...
   if (!figur.istMobil()) return false;
   var standort = this.findeFigur(figur);
   // nicht über Rand
   if ((ziel - standort) === 1 && (ziel % this.feldGroesse === 0)) return false;
   if ((ziel - standort) === -1 && (standort % this.feldGroesse === 0)) return false;
   // 1 Feld weit
   if ((ziel - standort) === 1) return true;
   if ((ziel - standort) === -1) return true;
   if ((ziel - standort) === this.feldGroesse) return true;
   if ((ziel - standort) ===  (0 - this.feldGroesse)) return true;
   // TODO scout
  }
  
  links(feld) {
   if (feld % this.feldGroesse === 0) return -1;
   else return feld - 1;
  }
  
  rechts(feld) {
   if (feld % this.feldGroesse === (this.feldGroesse-1)) return -1;
   else return feld + 1;
  }
  
  rauf(feld) {
   if (feld < this.feldGroesse) return -1;
   else return feld - this.feldGroesse;
  }
  
  runter(feld) {
   if (feld >= (this.anzahlFelder() - this.feldGroesse)) return -1;
   else return feld + this.feldGroesse;
  }
}