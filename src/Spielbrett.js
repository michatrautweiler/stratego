/*
 * Copyright 2017 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from 'react';
import PropTypes from 'prop-types';
import './Spielbrett.css';

export class Spielbrett extends React.Component {
  static propTypes = {
    G: PropTypes.any.isRequired,
    ctx: PropTypes.any.isRequired,
    moves: PropTypes.any.isRequired,
    events: PropTypes.any.isRequired,
    playerID: PropTypes.string,
    isActive: PropTypes.bool,
    isMultiplayer: PropTypes.bool,
  };
  figurInBewegung = { "0": null, "1": null };

  onClick = (feld) => {
    let me = this.props.playerID;
    if (!me) me = this.props.ctx.currentPlayer;
    var willHin = this.figurInBewegung[me];
    if (willHin) {
      // Figur die schon in Bewegung / in der Hand ist aufs Feld setzen
      var schonDa = this.props.G.schlacht.holeFigur(feld);
      if (schonDa === willHin) {
        this.figurInBewegung[me] = null;
        return; // avoid handling same event twice (once from each client)
      }
      if (this.props.ctx.phase === "Kampf") {
        if (this.props.G.schlacht.istErreichbar(willHin, feld)) {
          if (schonDa) {
            if (schonDa.besitzer !== willHin.besitzer) {
              this.props.moves.schlage(willHin, schonDa);
            } else {
              // Feld ist besetzt
            }
          } else {
            // Feld ist frei
            this.props.moves.bewege(willHin, feld, me);
          }
        } // erreichbar
      } else {
        this.props.moves.platziere(willHin, feld, me);
      }
      this.figurInBewegung[me] = null;
    } else {
      // Figur auf Feld in Bewegung setzen / in die Hand nehmen
      var figur = this.props.G.schlacht.holeFigur(feld);
      if (figur) { //ctx.currentPlayer typeof string
        if (figur.besitzer == me) this.figurInBewegung[me] = figur;
      }
    }
  };
  
  stelleAuf = (feld, rang) => {
    let me = this.props.playerID;
    if (!me) me = this.props.ctx.currentPlayer;
    if (rang > -1) {
      // Klick auf Figur in Reserve / ausserhalb Spielbrett / Schlachtfeld
      // setzt Figur in Bewegung / wählt Figur aus
      this.figurInBewegung[me] = this.props.G.armeen[me].macheMobil(rang); 
    } 
  }
  
  bereit = () => {
    this.props.events.endStage();
  }
  
  isActive(id) {
    if (!this.props.isActive) return false;
    return true;
  }

  render() {
    //
    // Schlachtfeld
    //
    let tbody = [];
    let me = this.props.playerID;
    if (!me) me = this.props.ctx.currentPlayer;
    let size = this.props.G.schlacht.groesse();
    for (let i = 0; i < size; i++) {
      let cells = [];
      for (let j = 0; j < size; j++) {
        const feldId = size * i + j;
        let f = this.props.G.schlacht.holeFigur(feldId);
        if (f) {
          let png = "./figurX" + f.farbe + ".svg"; // cwd is folder public
          if (f.besitzer == me) { // typeof me is string
            png = "./figur" + f.rang + f.farbe + ".svg";
          }
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
            > {feldId}
            </td>
          );
        }
      }
      tbody.push(<tr key={i}>{cells}</tr>);
    }
    //
    // deine Armee / Reserve
    //
    let info = null;
    let meineReserve = this.props.G.armeen[me];
    let farbe = meineReserve.farbe;
    let deck = [];
	let rows = 0;
	let cols = meineReserve.gattungen().length;

	for (let k=0; k < cols; k++) {
	  var t = meineReserve.mannStaerke(k);
	  if (t > rows) rows = t;
	}
    if (this.props.ctx.phase === "MobilMachung") {
	  for (let i = 0; i < rows; i++) {
		let zeile = [];
		for (let rang = 0; rang < cols; rang++) {
		  if (meineReserve.mannStaerke(rang) > i) {
			const feld = (size * size + size * i + rang) * (me + 1);
			let png = "./figur" + rang + farbe + ".svg"; 
			  
			zeile.push(
			  <td
				key={feld} class="deck"
				//className={i===0 ? 'active' : ''}
			    onClick={() => this.stelleAuf(feld, rang)}
			  >
			    <img src={png} width="48" height="64" alt={png}/>
			  </td>
		    ); //TODO: remove rang from onClick
		  } else {
		    zeile.push(<td class="deck"/>);
	      }
	    }
	    deck.push(<tr key={i}>{zeile}</tr>);
	  }
      info = <i>dein Gegner ist am aufstellen seiner Figuren...</i>;
      let notMe = (me + 1) % 2;
      if (this.props.G.armeen[0].istAufgestellt()) {
        info =  <b>dein Gegner wartet bis du alle Figuren aufgestellt hast!</b>;
      }
    } // MobilMachung
    //
    // game controls & info
    //
    let winner = null;
    if (this.props.ctx.gameover) {
      winner =
        this.props.ctx.gameover.winner !== undefined ? (
          <div id="winner">{this.props.ctx.gameover.winner} gewinnt!</div>
        ) : (
            <div id="winner">Draw!</div>
          );
    }
    
    return (
      <div><p>Schlachtfeld Sicht {farbe}</p> 
        <table width="300" id="board">
          <tbody>{tbody}</tbody>
        </table>
        <table id="deck">
          <tbody>{deck}</tbody>
        </table>
        <p>{info}</p>
        {winner}
      </div>
    );
  }
}