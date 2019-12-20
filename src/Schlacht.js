export class Schlacht {

  constructor(dim) {
    this.feldGroesse = dim;
    this.feld = new Array(dim * dim).fill(null);
  }
  
  stelleAuf(figur, platz) {
    this.feld[platz] = figur;
  }
  
  holeFigur(platz) {   
    return this.feld[platz];
  }
  
  groesse() {
    return this.feldGroesse;
  }
  
  findeFigur(figur) {   
    var i = this.feld.indexOf(figur);
    if (i < 0) {
      // suchfunktion
      var sucheIndex = function(index, inhalt) {
        if (figur.equals(inhalt)) {
          i = index;
        }
      }
      this.feld.forEach(sucheIndex);
      if (i < 0) this.unknownFigure = figur;
      else return i;
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
  
  istAufstellbar(figur, feld) {
    var dmz = 2* this.feldGroesse;
    var max = this.feldGroesse * this.feldGroesse;
    if (figur.besitzer === 0) {
      return 2*feld < max - dmz;
    } else {
      return 2*feld >= max + dmz;
    }
  }
  
  istErreichbar(figur, ziel) {
   //TODO use links(), rechts(),...
   if (!figur.istMobil()) return false;
   var standort = this.findeFigur(figur);
   // nicht über Rand
   if ((ziel - standort) === 1 && (ziel % this.feldGroesse == 0)) return false;
   if ((ziel - standort) === -1 && (standort % this.feldGroesse == 0)) return false;
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
   if (feld % this.feldGroesse === 3) return -1;
   else return feld + 1;
  }
  
  rauf(feld) {
   if (feld < this.feldGroesse) return -1;
   else return feld - this.feldGroesse;
  }
  
  runter(feld) {
   if (feld >= (this.feldGroesse * this.feldGroesse - this.feldGroesse)) return -1;
   else return feld + this.feldGroesse;
  }
}