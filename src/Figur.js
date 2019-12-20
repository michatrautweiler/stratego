export class Figur {

  constructor(typ,farbe,rang, num, player) {
    this.typ = typ;
    this.farbe = farbe;
    this.rang = rang;
    this.num = num;
    this.besitzer = player;
  }

  schlage(gegner) {
    return this.rang - gegner.rang;
    // TODO: draw, spy, miner
  }
  
  istMobil() {
    return true; 
  }
  
  equals(figur) {
    if (!figur) return false;
    if (this.typ !== figur.typ) return false;
    if (this.rang !== figur.rang) return false;
    if (this.num !== figur.num) return false;
    if (this.besitzer !== figur.besitzer) return false;
    return true;
  }
  
}