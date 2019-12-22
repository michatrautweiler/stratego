import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import { Stratego}  from './Stratego';
import { Spielbrett } from "./Spielbrett";
import { validMoves } from "./Bot";
import * as serviceWorker from './serviceWorker';

// single player
//const StrategoClient = Client({ game: Stratego, board: Spielbrett });

// bot

const App = Client({ game: Stratego, board: Spielbrett, 
  ai: {
    enumerate: (G, ctx) => {
      return validMoves(G, ctx);
    },
  }, 
});
/*

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
*/

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

