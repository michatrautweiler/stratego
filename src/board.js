/*
 * Copyright 2017 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from 'react';
import PropTypes from 'prop-types';
import './board.css';

export class StrategoBoard extends React.Component {
  static propTypes = {
    G: PropTypes.any.isRequired,
    ctx: PropTypes.any.isRequired,
    moves: PropTypes.any.isRequired,
    events: PropTypes.any.isRequired,
    playerID: PropTypes.string,
    isActive: PropTypes.bool,
    isMultiplayer: PropTypes.bool,
  };

  onClick = (id,rang) => {
    if (isNaN(rang)) {
      this.props.moves.clickBoard(id, this.props.playerID);
    } else {
      this.props.moves.clickArmee(rang, this.props.playerID);
    }
  };
  bereit = () => {
    this.props.events.endStage();
  }

  isActive(id) {
    if (!this.props.isActive) return false;
    //if (this.props.G.schlacht.reihe1[id] !== null) return false;
    return true;
  }

  render() {
    //
    // Schlachtfeld
    //
    let tbody = [];
    let size = this.props.G.schlacht.feldGroesse;
    for (let i = 0; i < size; i++) {
      let cells = [];
      for (let j = 0; j < size; j++) {
        const feldId = size * i + j;
        let f = this.props.G.schlacht.holeFigur(feldId);
        if (f) {
          let png = "./figur" + f.rang + f.farbe + ".svg"; // cwd is folder public
          cells.push(
            <td
              key={feldId}
              class="active"
              onClick={() => this.onClick(feldId, null)}
            >
              <img src={png} width="48" height="64" alt={png}/>
            </td>
          );
          
        } else {
          cells.push(
            <td
              key={feldId}
              onClick={() => this.onClick(feldId)}
            >
            </td>
          );
        }
      }
      tbody.push(<tr key={i}>{cells}</tr>);
    }
    //
    // deine Armee 
    //
    let meineReserve = this.props.G.armeen[this.props.playerID];
    let farbe = meineReserve.farbe;
    let deck = [];
	let rows = 0;
	let cols = meineReserve.gattungen().length;

	for (let k=0; k < cols; k++) {
	  var t = meineReserve.mannStaerke(k);
	  if (t > rows) rows = t;
	}
    if (this.props.ctx.phase !== "Kampf") {
		for (let i = 0; i < rows; i++) {
		  let zeile = [];
		  for (let rang = 0; rang < cols; rang++) {
			if (meineReserve.mannStaerke(rang) > i) {
			const deckId = (size * size + size * i + rang) * (this.props.playerID + 1);
			let png = "./figur" + rang + farbe + ".svg"; //TODO: remove rang from onClick
			  zeile.push(
				<td
				  key={deckId} class="deck"
				  //className={i===0 ? 'active' : ''}
				  onClick={() => this.onClick(deckId, rang)}
				>
				   <img src={png} width="48" height="64" alt={png}/>
				 </td>
			  );
			} else {
			  zeile.push(<td class="deck"/>);
			}
		  }
		  deck.push(<tr key={i}>{zeile}</tr>);
		}
    } // Aufstellen
    let winner = null;
    if (this.props.ctx.gameover) {
      winner =
        this.props.ctx.gameover.winner !== undefined ? (
          <div id="winner">Winner: {this.props.ctx.gameover.winner}</div>
        ) : (
            <div id="winner">Draw!</div>
          );
    }
    let knopf = null;
    if (rows === 0) {
      if (this.props.ctx.activePlayers[this.props.playerID] != "Warten")
        knopf = <button onClick={() => this.bereit()}>bereit zur Schlacht</button>;
      else
        knopf = "bereit zur Schlacht";
    }
    return (
      <div><p>Schlachtfeld Sicht {farbe}</p> 
        <table width="300" id="board">
          <tbody>{tbody}</tbody>
        </table>
        <p>{knopf}</p>
        <table id="deck">
          <tbody>{deck}</tbody>
        </table>
        {winner}
      </div>
    );
  }
}