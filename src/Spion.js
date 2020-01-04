import { Figur }  from './Figur';

export class Spion extends Figur {

  schlage(gegner) {
    if (gegner.gattung === "marschall") {
      return 1; // gewonnen!
    } else {
      return this.rang - gegner.rang;
    }
  }
  
}