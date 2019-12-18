export class Figur {

  constructor(typ,farbe,rang, num, player) {
    this.typ = typ;
    this.farbe = farbe;
    this.rang = rang;
    this.num = num;
    this.besitzer = player;
  }

  gewinnt(gegner) {
    return this.rang > gegner.rang;
    // TODO: draw, spy, miner
  }
}