import { schlacht } from './Stratego';


export function validMoves(G, ctx) {
      let moves = [];
      schlacht.populate(G.feld);
      if (ctx.phase === "MobilMachung") {
        // phase MobilMachung
        // alle AdA, alle felder
        var adas = G.armeen[1].ada();
        for (var f=0; f < adas.length; f++ ) {
          var zuPlatzieren = adas[f];
          for (var platz = 0; platz < schlacht.anzahlFelder(); platz++) {
            if (schlacht.istAufstellbar(zuPlatzieren, platz)) {
              moves.push({ move: 'platziere', args: [zuPlatzieren, platz, "bot"] });
            }
          }
        }
        
      } 
      else { 
        // phase Kampf
        
        for (let platz=0; platz < schlacht.anzahlFelder(); platz++) {
          var figur = schlacht.holeFigur(platz);
          if (figur && (figur.besitzer === 1)) {
            // bewege meine Figur
            var schonDa;
            
            var ziel = schlacht.rauf(platz);
            if (schlacht.istErreichbar(figur,ziel)) {
              schonDa = schlacht.holeFigur(ziel);
              if (!schonDa) moves.push({ move: 'bewege', args: [figur, ziel, "bot"] });
              else if (schonDa.besitzer === 0) moves.push({ move: 'schlage', args: [figur, schonDa, ziel] });
            }
            
            ziel = schlacht.links(platz);
            if (schlacht.istErreichbar(figur,ziel)) {
              schonDa = schlacht.holeFigur(ziel);
              if (!schonDa) moves.push({ move: 'bewege', args: [figur, ziel, "bot"] });
              else if (schonDa.besitzer === 0) moves.push({ move: 'schlage', args: [figur, schonDa, ziel] });
            }

            ziel = schlacht.rechts(platz);
            if (schlacht.istErreichbar(figur,ziel)) {
              schonDa = schlacht.holeFigur(ziel);
              if (!schonDa) moves.push({ move: 'bewege', args: [figur, ziel, "bot"] });
              else if (schonDa.besitzer === 0) moves.push({ move: 'schlage', args: [figur, schonDa, ziel] });
            }
            
            ziel = schlacht.runter(platz);
            if (schlacht.istErreichbar(figur,ziel)) {
              schonDa = schlacht.holeFigur(ziel);
              if (!schonDa) moves.push({ move: 'bewege', args: [figur, ziel, "bot"] });
              else if (schonDa.besitzer === 0) moves.push({ move: 'schlage', args: [figur, schonDa, ziel] });
            }
          } 
        }
      }
      schlacht.empty();
      return moves;
}