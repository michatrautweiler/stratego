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
      var flagge = G.armeen[1].macheMobil(0);
      moves.push({ move: 'platziere', args: [flagge, 0, 1] });
      var soldat1 = G.armeen[1].macheMobil(1);
      moves.push({ move: 'platziere', args: [soldat1, 1, 1] });
      var soldat2 = G.armeen[1].macheMobil(1);
      moves.push({ move: 'platziere', args: [soldat2, 4, 1] });
      
      for (var rang=0; rang < G.armeen[1].gattungen().length; rang++) {
        if (G.armeen[1].mannStaerke(rang)) {
          var figur = G.armeen[1].macheMobil(rang);
          for (var feld=0; feld < G.schlacht.groesse; feld++) {
            moves.push({ move: 'platziere', args: [figur, feld, 1] });
          }
        }
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
