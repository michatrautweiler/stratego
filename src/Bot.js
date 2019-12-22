export function validMoves(G, ctx) {
      let moves = [];
      if (ctx.phase === "MobilMachung") {
        // phase MobilMachung
        // alle AdA, alle felder
        var adas = G.armeen[1].ada();
        for (var f=0; f < adas.length; f++ ) {
          var figur = adas[f];
          for (var platz = 0; platz < G.schlacht.anzahlFelder(); platz++) {
            if (G.schlacht.istAufstellbar(figur, platz)) {
              moves.push({ move: 'platziere', args: [figur, platz, "bot"] });
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
            
            ziel = G.schlacht.rauf(feld);
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

            var ziel = G.schlacht.rechts(feld);
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