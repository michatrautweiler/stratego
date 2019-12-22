export function validMoves(G, ctx) {
      let moves = [];
      if (ctx.phase === "MobilMachung") {
        // phase MobilMachung
        // alle AdA, alle felder
        var adas = G.armeen[1].ada();
        for (var f=0; f < adas.length; f++ ) {
          var zuPlatzieren = adas[f];
          for (var platz = 0; platz < G.schlacht.anzahlFelder(); platz++) {
            if (G.schlacht.istAufstellbar(zuPlatzieren, platz)) {
              moves.push({ move: 'platziere', args: [zuPlatzieren, platz, "bot"] });
            }
          }
        }
        
      } 
      else { 
        // phase Kampf
        
        for (var feld=0; feld < G.schlacht.anzahlFelder(); feld++) {
          var figur = G.schlacht.holeFigur(feld);
          if (figur && (figur.besitzer === 1)) {
            // bewege meine Figur
            var schonDa;
            
            var ziel = G.schlacht.rauf(feld);
            if (G.schlacht.istErreichbar(figur,ziel)) {
              schonDa = G.schlacht.holeFigur(ziel);
              if (!schonDa) moves.push({ move: 'bewege', args: [figur, ziel, "bot"] });
              else if (schonDa.besitzer === 0) moves.push({ move: 'schlage', args: [figur, schonDa, ziel] });
            }
            
            ziel = G.schlacht.links(feld);
            if (G.schlacht.istErreichbar(figur,ziel)) {
              schonDa = G.schlacht.holeFigur(ziel);
              if (!schonDa) moves.push({ move: 'bewege', args: [figur, ziel, "bot"] });
              else if (schonDa.besitzer === 0) moves.push({ move: 'schlage', args: [figur, schonDa, ziel] });
            }

            ziel = G.schlacht.rechts(feld);
            if (G.schlacht.istErreichbar(figur,ziel)) {
              schonDa = G.schlacht.holeFigur(ziel);
              if (!schonDa) moves.push({ move: 'bewege', args: [figur, ziel, "bot"] });
              else if (schonDa.besitzer === 0) moves.push({ move: 'schlage', args: [figur, schonDa, ziel] });
            }
            
            ziel = G.schlacht.runter(feld);
            if (G.schlacht.istErreichbar(figur,ziel)) {
              schonDa = G.schlacht.holeFigur(ziel);
              if (!schonDa) moves.push({ move: 'bewege', args: [figur, ziel, "bot"] });
              else if (schonDa.besitzer === 0) moves.push({ move: 'schlage', args: [figur, schonDa, ziel] });
            }
          } 
        }
      }
      return moves;
}