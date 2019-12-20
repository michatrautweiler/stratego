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
      if (this.props.ctx.phase === "MobilMachung") {
        if (this.props.G.schlacht.istAufstellbar(willHin, feld))
        this.props.moves.platziere(willHin, feld, me);

      } else {
        // Kampf
        if (this.props.G.schlacht.istErreichbar(willHin, feld)) {
          if (schonDa) {
            if (schonDa.besitzer !== willHin.besitzer) {
              this.props.moves.schlage(willHin, schonDa, feld);
            } else {
              // Feld ist besetzt
            }
          } else {
            // Feld ist frei
            this.props.moves.bewege(willHin, feld, me);
          }
        } // erreichbar        
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
  
  stelleAuf = (gattung) => {
    let me = this.props.playerID;
    if (!me) me = this.props.ctx.currentPlayer;
    // Klick auf Figur in Reserve / ausserhalb Spielbrett / Schlachtfeld
    // setzt Figur in Bewegung / wŠhlt Figur aus
    this.figurInBewegung[me] = this.props.G.armeen[me].macheMobil(gattung);  
  }
  
  bereit = () => {
    this.props.events.endStage();
  }
  
  isActive(id) {
    if (!this.props.isActive) return false;
    return true;
  }
  
  setup(me) {
    var armee = this.props.G.armeen[me];
    this.props.moves.platziere(armee.flagge, 0, me);
    this.props.moves.platziere(armee.bomben[2], 1, me);
    this.props.moves.platziere(armee.bomben[1], 6, me);
    this.props.moves.platziere(armee.bomben[0], 7, me);
    this.props.moves.platziere(armee.mineure[2], 3, me);
    this.props.moves.platziere(armee.mineure[1], 4, me);
    this.props.moves.platziere(armee.mineure[0], 5, me);
    this.props.moves.platziere(armee.soldaten[4], 8, me);
    this.props.moves.platziere(armee.soldaten[3], 9, me);
    this.props.moves.platziere(armee.soldaten[2], 10, me);
    this.props.moves.platziere(armee.soldaten[1], 11, me);
    this.props.moves.platziere(armee.soldaten[0], 2, me);

  }

  render() {
    //
    // Schlachtfeld
    //
    let tbody = [];
    let me = this.props.playerID;
    if (!me) me = this.props.ctx.currentPlayer;
    let notMe = 1;
    if (me == 1) notMe = 0;
    let size = this.props.G.schlacht.groesse();
    for (let i = 0; i < size; i++) {
      let cells = [];
      for (let j = 0; j < size; j++) {
        const feldId = size * i + j;
        let f = this.props.G.schlacht.holeFigur(feldId);
        if (f) {
          let png = "./figur_hidden_" + f.farbe + ".svg"; // cwd is folder public
        
          if (f.besitzer == me) { // typeof me is string
            png = "./figur_" + f.gattung + "_" + f.farbe + ".svg";
          } else if (   this.props.G.kampf 
                     && this.props.G.kampf[notMe]
                     && f.equals(this.props.G.kampf[notMe])
                    ) 
          {
            // reveal figure of opponent after fight  
            png = "./figur_" + f.gattung + "_" + f.farbe + ".svg";
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
    let reserven = [];
	let rows = 0;
    var cols;
	for (cols of meineReserve.gattungen()) {
	  var t = meineReserve.mannStaerke(cols);
	  if (t > rows) rows = t;
	}
    if (this.props.ctx.phase === "MobilMachung") {
	  for (let i = 0; i < rows; i++) {
		let zeile = [];
		var gattung;
		var j=0;
		for (gattung of meineReserve.gattungen()) {
		  if (meineReserve.mannStaerke(gattung) > i) {
			const feld = (size * size + size * i + j) * (me + 1);
			const art = gattung;
			let png = "./figur_" + art + "_" + farbe + ".svg"; 
			  
			zeile.push(
			  <td
				key={feld} class="deck"
				//className={i===0 ? 'active' : ''}
			    onClick={() => this.stelleAuf(art)}
			  >
			    <img src={png} width="48" height="64" alt={png}/>
			  </td>
		    );
		  } else {
		    zeile.push(<td class="deck"/>);
	      }
	      j++;
	    }
	    deck.push(<tr key={i}>{zeile}</tr>);
	  }
	  reserven[me] = deck;
	  reserven[notMe] = null;
      info = <i>dein Gegner ist am aufstellen seiner Figuren...</i>;
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
    var setup = <button onClick={() => this.setup(me)}>set me up</button>;
    
    return (
      <div><p>Schlachtfeld Sicht {farbe}</p> 
        <table id="deckGelb">
          <tbody>{reserven[0]}</tbody>
        </table>
        <table width="400" id="board">
          <tbody>{tbody}</tbody>
        </table>{setup}
        <table id="deckRot">
          <tbody>{reserven[1]}</tbody>
        </table>
        <p>{info}</p>
        {winner}
      </div>
    );
  }
}