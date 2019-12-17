import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import { Stratego}  from './App';
import { StrategoBoard } from "./board";
import * as serviceWorker from './serviceWorker';

// single player
//const StrategoClient = Client({ game: Stratego, board: StrategoBoard });
const App = Client({ game: Stratego, board: StrategoBoard, 
  ai: {
    enumerate: (G, ctx) => {
      let moves = [];
      for (var rang=0; rang < G.armeen[1].gattungen().length; rang++) {
        if (G.armeen[1].mannStaerke(rang)) {
          moves.push({ move: 'clickArmee', args: [rang,1] });
        }
      }
      for (var feld=0; feld < G.schlacht.groesse; feld++) {
        moves.push({ move: 'clickBoard', args: [feld,1] });
      }
      return moves;
    },
  }, 
});

// multi player, local
/*
const App = Client({
  game: Stratego,
  board: StrategoBoard,
//  multiplayer: Local()
});

const App = () => (
  <table><tr><td>
    <StrategoClient playerID="0" />
    </td><td>
    <StrategoClient playerID="1" />
    </td></tr>
  </table>
);
*/

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
