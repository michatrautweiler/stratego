import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import { Stratego}  from './Stratego';
import { Spielbrett } from "./Spielbrett";
import * as serviceWorker from './serviceWorker';

// single player
//const StrategoClient = Client({ game: Stratego, board: Spielbrett });

// bot
/*
const App = Client({ game: Stratego, board: Spielbrett, 
  ai: {
    enumerate: (G, ctx) => {
      let moves = [];
      if (ctx.phase === "MobilMachung") {
        // phase MobilMachung
        // alle AdA, alle felder
        var platziereFigur = function(figur) {
          for (var platz = 0; platz < G.schlacht.anzahlFelder(); platz++) {
            if (G.schlacht.istAufstellbar(figur, platz)) {
              moves.push({ move: 'platziere', args: [figur, platz, "bot"] });
            }
          }
        };
        platziereFigur(G.armeen[1].ada()[0]);
        //G.armeen[1].ada().forEach(platziereFigur);
      } 
      else { */
        // phase Kampf
        /*
        
        for (var feld=0; feld < G.schlacht.anzahlFelder(); feld++) {
          var figur = G.schlacht.holeFigur(feld);
          if (figur && (figur.besitzer === 1)) {
            // bewege meine Figur
            var schonDa;
            var ziel = G.schlacht.rechts(feld);
            if (G.schlacht.istErreichbar(figur,ziel)) {
              schonDa = G.schlacht.holeFigur(ziel);
              if (!schonDa) moves.push({ move: 'bewege', args: [figur, ziel, 1] });
              else if (schonDa.besitzer === 0) moves.push({ move: 'schlage', args: [figur, schonDa, ziel] });
            }
            
            ziel = G.schlacht.links(feld);
            if (G.schlacht.istErreichbar(figur,ziel)) {
              schonDa = G.schlacht.holeFigur(ziel);
              if (!schonDa) moves.push({ move: 'bewege', args: [figur, ziel, 1] });
              else if (schonDa.besitzer === 0) moves.push({ move: 'schlage', args: [figur, schonDa, ziel] });
            }
            
            ziel = G.schlacht.rauf(feld);
            if (G.schlacht.istErreichbar(figur,ziel)) {
              schonDa = G.schlacht.holeFigur(ziel);
              if (!schonDa) moves.push({ move: 'bewege', args: [figur, ziel, 1] });
              else if (schonDa.besitzer === 0) moves.push({ move: 'schlage', args: [figur, schonDa, ziel] });
            }
            
            ziel = G.schlacht.runter(feld);
            if (G.schlacht.istErreichbar(figur,ziel)) {
              schonDa = G.schlacht.holeFigur(ziel);
              if (!schonDa) moves.push({ move: 'bewege', args: [figur, ziel, 1] });
              else if (schonDa.besitzer === 0) moves.push({ move: 'schlage', args: [figur, schonDa, ziel] });
            }
          } 
        }*/ /*
      }
      return moves;
    },
  }, 
});
*/

// multi player, local
const StrategoClient = Client({
  game: Stratego,
  board: Spielbrett,
  multiplayer: Local()
});

const App = () => (
  <table><tr><td>
    <StrategoClient playerID="0" />
    </td><td>
    <StrategoClient playerID="1" />
    </td></tr>
  </table>
);


ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
