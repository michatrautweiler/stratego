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
    playerID: PropTypes.string,
    isActive: PropTypes.bool,
    isMultiplayer: PropTypes.bool,
  };

  onClick = id => {
    //if (this.isActive(id)) {
      if (isNaN(id)) {
        let rang = id.substring(7,8);
        this.props.moves.clickArmee(rang);
      } else {
        // update model
        this.props.moves.clickBoard(id);
        // update UI
      }
    //}
  };

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
    let size = 4;
    for (let i = 0; i < size; i++) {
      let cells = [];
      for (let j = 0; j < size; j++) {
        const id = size * i + j;
        let f = this.props.G.schlacht.holeFigur(id);
        if (f) {
          let png = "./figur" + f.rang + "rot.png"; // cwd is folder public
          cells.push(
            <td
              key={id}
              class="active"
              onClick={() => this.onClick(id)}
            >
              <img src={png} width="64" height="64" alt={png}/>
            </td>
          );
          
        } else {
          cells.push(
            <td
              key={id}
              onClick={() => this.onClick(id)}
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
    let deck = [];
    let rows = Math.max(...this.props.G.anzahlFiguren);
    let cols = this.props.G.anzahlFiguren.length;
    for (let i = 0; i < rows; i++) {
      let stack = [];
      for (let j = 0; j < cols; j++) {
        if (this.props.G.anzahlFiguren[j] > i) {
        const id = size * size + size * i + j;
        let png = "./figur" + j + "rot.png"; // cwd is folder public
          stack.push(
            <td
              key={id} class="deck"
              //className={i===0 ? 'active' : ''}
              onClick={() => this.onClick(png)}
            >
               <img src={png} width="64" height="64" alt={png}/>
             </td>
          );
        } else {
          stack.push(<td class="deck"/>);
        }
      }
      deck.push(<tr key={i}>{stack}</tr>);
    }

    let winner = null;
    if (this.props.ctx.gameover) {
      winner =
        this.props.ctx.gameover.winner !== undefined ? (
          <div id="winner">Winner: {this.props.ctx.gameover.winner}</div>
        ) : (
            <div id="winner">Draw!</div>
          );
    }

    return (
      <div><p>Stratego Schlachtfeld</p> 
        <table id="board">
          <tbody>{tbody}</tbody>
        </table><p>deine Armee</p>
        <table id="deck">
          <tbody>{deck}</tbody>
        </table>
        {winner}
      </div>
    );
  }
}