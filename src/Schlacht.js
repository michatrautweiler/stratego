export class Schlacht {

  constructor(dim) {
    this.feldGroesse = dim;
    this.feld = new Array(dim * dim).fill(null);
  }
  
  stelleAuf = function(figur, platz) {
    this.feld[platz] = figur;
  }
  
  holeFigur = function(platz) {   
    return this.feld[platz];
  }
  
  groesse = function() {
    return this.feldGroesse;
  }
  
  findeFigur = function(figur) {   
    return this.feld.indexOf(figur);
  }
  
  verschiebe = function(figur, zuFeld) {
    var vonFeld = this.findeFigur(figur);
    this.stelleAuf(figur, zuFeld);
    this.feld[vonFeld] = null;
  }
 
  gestorben = function(platz) {
    this.feld[platz] = null;
  }
  
  istErreichbar = function(figur, ziel) {
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
}