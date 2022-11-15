import React from 'react';
import ReactDOM from 'react-dom/client';
import StepHistory from './step-history';
import './index.css';


/**
 * A Function Component 
 * accepts props from a parent and only tells how these are rendered
 * returned value is equivalent to a React.Component's render()
 * No logic and extending `React.Component` necessary
 */
function Square (props) {
  const squareClassName = 'square' +
    (props.winningSquare? ' winner' : '');
  return (
    <button
      className={squareClassName}
      onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

/**
 * Parent Component, contains `Square`s and the app's state
 * state includes player's Squares and which player's turn it is
 * edit: state transferred to `Game` which handles the history 
 */
class Board extends React.Component {
  renderSquare(i, winningSquare) {
    return <Square 
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      winningSquare={winningSquare}/>;
  }

  render() {
    const winningLine = this.props.winningLine;
    const boardClass = winningLine.length > 0 ? 'end-game' : ''
    return (
      <div className={boardClass}>
        <div className="board-row">
          {this.renderSquare(0, winningLine.includes(0))}
          {this.renderSquare(1, winningLine.includes(1))}
          {this.renderSquare(2, winningLine.includes(2))}
        </div>
        <div className="board-row">
          {this.renderSquare(3, winningLine.includes(3))}
          {this.renderSquare(4, winningLine.includes(4))}
          {this.renderSquare(5, winningLine.includes(5))}
        </div>
        <div className="board-row">
          {this.renderSquare(6, winningLine.includes(6))}
          {this.renderSquare(7, winningLine.includes(7))}
          {this.renderSquare(8, winningLine.includes(8))}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  getPlayerX = () => 'X';
  getPlayerO = () => 'O';
  constructor(props) {
    super(props);
    const blankBoard = Array(9).fill(null);
    const startingPlayer = this.getPlayerX();

    this.state = {
      history: new StepHistory(blankBoard, startingPlayer),
      winner: null,
      repickSquare: false,
    }
  }
  /**
   * Update Board's next player, squares, history, and winner. Prevents clicking another user's Square
   * @param {number} index the index of the `Square` pressed on `Board`
   * @returns {void}
   */
   handleBoardClick(index) {
    if(this.getWinner() !== null) return;

    const currentSquares = this.getCurrentSquares();
    if(currentSquares[index] !== null) {
      this.setState({repickSquare: true});
      return;
    } else if (this.state.repickSquare === true) {
      this.setState({repickSquare: false});
    }

    const currentPlayer = this.getCurrentPlayer();
    currentSquares[index] = currentPlayer;
    const nextPlayer = currentPlayer === this.getPlayerX() ? this.getPlayerO() : this.getPlayerX();
    const winner = this.calculateWinner(currentSquares);

    this.setState({
      history: this.state.history.recordStep(currentSquares, nextPlayer, winner),
    });
  }

  getCurrentSquares(){
    return this.state.history.getCurrentStep().squares;
  }
  getCurrentPlayer(){
    return this.state.history.getCurrentStep().currentPlayer;
  }
  getWinner(){
    return this.state.history.getCurrentStep().winner;
  }


  /**
   * Check who won
   * @param {String[]} squares the player's squares on board
   * @returns {String | 'tie' | null} the square indices of the winning line and the winning player/'tie'/null if no one won
   */
   calculateWinner(squares) {
    for (const playerValue of squares) {
      if(playerValue !== null && this.calculateWinningLine(playerValue, squares).length > 0) {
        return playerValue;
      }
    }

    if(squares.indexOf(null) === -1) return 'tie';
    
    return null;
  }

  calculateWinningLine(playerValue, squares) {
    if(playerValue === null || playerValue === undefined) throw new Error('playerValue cannot be null or undefined');
    const lines = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6],
    ];
    for (const line of lines) {
      const [a,b,c] = line;
      if(squares[a] === playerValue
        && squares[a] === squares[b]
        && squares[b] === squares[c])
        return line;
    }
    return [];
  }

  jumpToStep(stepNumber) {
    const history = this.state.history.jumpToStep(stepNumber);
    this.setState({
      history,
      repickSquare: false,
    });
  }
  
  render() {
    const currentSquares = this.getCurrentSquares();
    const winner = this.getWinner();
    const winningLine = (winner === null)
      ? []
      : this.calculateWinningLine(winner, currentSquares);

    const status = winner === null
      ? `Next Player: ${this.getCurrentPlayer()}`
      : `Winner: ${winner}`;
    const repickSquare = this.state.repickSquare
      ? 'Choose a different Square!'
      : '';

    const currentStepNumber = this.state.history.stepNumber
    const moves = this.state.history.steps
      .map((step,stepNumber) => {
        const label =  stepNumber > 0
          ? `Go to Step#${stepNumber}`
          : 'Game Start';
        const buttonClass = currentStepNumber === stepNumber ? 'current-step' : ''
          return (
            <li>
              <button className={buttonClass} onClick={()=>this.jumpToStep(stepNumber)}>{label}</button>
            </li>)
      });

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={currentSquares}
            onClick={(i) => this.handleBoardClick(i)}
            winningLine={winningLine}
            />
        </div>
        <div className="game-info">
          <div className={repickSquare? 'toast show' : 'toast'}>{repickSquare}</div>
          <div className="status">{status}</div>
          <ol className='history'>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
