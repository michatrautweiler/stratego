import { Figur }  from './Figur';

export class Bombe extends Figur {
  
  istMobil() {
    return false; 
  }
  
  schlage(gegner) {
    if (gegner.gattung === "mineure") return -1;
    else return 1;
  }
}