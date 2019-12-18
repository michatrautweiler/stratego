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
}