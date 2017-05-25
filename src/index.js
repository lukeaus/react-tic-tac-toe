import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: generateBoard()
      }],
      stepNumber: 0,
      xIsNext: true,
      options: ['X', 'O'],
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }

  /*
   * Pass a step with only a single move in it. Return the index of that move.
   */
  getMoveIndex(squares) {
    let index = -1;
    this.state.options.map( option => {
      if (squares.indexOf(option) > -1) {
        index = squares.indexOf(option);
      }
    });
    return index
  }

  getMoveDiff(squares, prevStepSquares) {
    const board = generateBoard();
    for (let i=0; i < squares.length; i++) {
      if (squares[i] !== prevStepSquares[i]) {
        board[i] = squares[i];
        return board
      }
    }
  }

  /*
   * Given an index (e.g. 3) return coords (x, y) (e.g. (2, 2) on a 3x3 board)
   */
  boardIndexToCoords(index) {
    const xRow = Math.floor(index / 3);
    const yCol = index - (xRow * 3);
    return '(' + xRow + ', ' + yCol + ')';
  }

  getMoveDesc(step, moveIndex, history) {
    if (!moveIndex) {
      return 'Game Start'
    } else {
      let thisMoveStep;
      const prevMoveIndex = moveIndex - 1;
      if (prevMoveIndex === -1) {
        thisMoveStep = step.squares
      } else {
        thisMoveStep = this.getMoveDiff(step.squares, history[prevMoveIndex].squares)
      }
      return 'Move #' + moveIndex + ' ' + this.boardIndexToCoords(this.getMoveIndex(thisMoveStep));
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, moveIndex) => {
      const desc = this.getMoveDesc(step, moveIndex, history);
      return (
        <li key={moveIndex}>
          <a href="#" onClick={() => this.jumpTo(moveIndex)}>{desc}</a>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function generateBoard() {
  return Array(9).fill(null)
}

