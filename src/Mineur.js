import { Figur }  from './Figur';

export class Mineur extends Figur {
  
  schlage(gegner) {
    if (gegner.gattung === "bomben") {
      return 1; // gewonnen
    } else {
      return this.rang - gegner.rang;
    }
  }
}