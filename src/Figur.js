export class Figur {

  constructor(gattung,farbe,rang, num, player) {
    this.gattung = gattung;
    this.farbe = farbe;
    this.rang = rang;
    this.num = num;
    this.besitzer = player;
  }

  schlage(gegner) {
    if (gegner.gattung === "bombe") {
      return -1; // verloren
    } else {
      return this.rang - gegner.rang;
    }
  }
  
  istMobil() {
    return true; 
  }
  
  equals(figur) {
    if (!figur) return false;
    if (this.gattung !== figur.gattung) return false;
    if (this.rang !== figur.rang) return false;
    if (this.num !== figur.num) return false;
    if (this.besitzer !== figur.besitzer) return false;
    return true;
  }
  
}