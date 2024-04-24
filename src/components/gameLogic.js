import {checkWinnerHorizontal, checkWinnerVertical, checkWinnerDiagonal} from './checkWinner'

export const checkDiagonalBlockingMove = (diagonal, opponent, index, boardSize) => {
  let opponentCount = diagonal.filter(cell => cell === opponent).length;
  let freeSpot = diagonal.indexOf(null);
  // console.log(opponentCount, freeSpot, index)
  
  if (opponentCount === boardSize - 1 && freeSpot !== -1) {
      // All but one square is the opponent, and one is free
      if (index === 0) {
        // console.log({moveX: freeSpot, moveY: freeSpot})
        return {moveX: freeSpot, moveY: freeSpot, priority: 0.75};
      } else{
        // console.log({moveX: freeSpot, moveY: boardSize - 1 - freeSpot})
        return {moveX: freeSpot, moveY: boardSize - 1 - freeSpot, priority: 0.75};
      }
  }
  return null
}

export const findBlockingMove = (board, boardColumns, boardDiagonals, currentTurn) => {
  // find a blocking move for the bot
  // a blocking move is where there are only "X" or only "O" in a row or column with only free spot remaining
    const opponent = currentTurn === 'X' ? 'O' : 'X';
    const boardSize = board.length; 

    var possibleMoves = []

    // Check columns for a blocking move
    for (let i = 0; i < boardColumns.length; i++) {
      let column = boardColumns[i];
      let freeSpot = column.indexOf(null);
      let opponentCount = column.filter(cell => cell === opponent).length;

      if (freeSpot !== -1 && opponentCount === boardSize - 1) {
        console.log({moveX: i, moveY: freeSpot})
        possibleMoves.push({moveX: i, moveY: freeSpot, priority: parseFloat(process.env.NEXT_PUBLIC_BLOCK_PRIORITY) || 0.75});
      }
    }

    // Check rows for a blocking move
    for (let i = 0; i < boardSize; i++) {
      let row = board[i];
      let freeSpot = row.indexOf(null);
      let opponentCount = row.filter(cell => cell === opponent).length;
  
      if (freeSpot !== -1 && opponentCount === boardSize - 1) {
        // console.log({moveX: freeSpot, moveY: i})
        possibleMoves.push({moveX: freeSpot, moveY: i, priority: parseFloat(process.env.NEXT_PUBLIC_BLOCK_PRIORITY) || 0.75});
      }
    }


    // Check diagonals for blocking moves
    for (let i = 0; i < 2; i++) {
      let diagonalMoves = checkDiagonalBlockingMove(boardDiagonals[i], opponent, i, boardSize)
      if (diagonalMoves){
        possibleMoves.push(diagonalMoves)
      }
    }

    return possibleMoves
}

// Check if there is a move that will win the game
export const checkMovePriority = (board, boardColumns, boardDiagonals, currentTurn) => {
  var moves = []
  const boardSize = board.length;
  let tempBoard = board.map(row => [...row]);
  let tempColumns = boardColumns.map(column => [...column]);
  let tempDiagonals = [ [...boardDiagonals[0]], [...boardDiagonals[1]] ];

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] === null) {
        // let tempBoard = board.map(row => [...row]);
        // let tempColumns = boardColumns.map(column => [...column]);
        // let tempDiagonals = [ [...boardDiagonals[0]], [...boardDiagonals[1]] ];

        tempBoard[i][j] = currentTurn;
        tempColumns[j][i] = currentTurn;

        if (i === j) {
          tempDiagonals[0][j] = currentTurn;
        }
        if (i + j === boardSize - 1) {
          tempDiagonals[1][j] = currentTurn;
        }

        let priority = parseFloat(process.env.NEXT_PUBLIC_EDGE_PRIORITY) || 0.25;

        if (checkWinnerHorizontal(tempBoard) === currentTurn || 
            checkWinnerVertical(tempColumns) === currentTurn || 
            checkWinnerDiagonal(tempDiagonals) === currentTurn) {
          priority = parseFloat(process.env.NEXT_PUBLIC_WIN_PRIORITY) || 1; // Winning move
        } else if ((i === 0 || i === boardSize - 1) && (j === 0 || j === boardSize - 1)) {
          priority = parseFloat(process.env.NEXT_PUBLIC_LOW_PRIORITY) || 0.5; // Corner
        }

        moves.push({ moveX: j, moveY: i, priority: priority });

        // reset temp boards
        tempBoard[i][j] = null;
        tempColumns[j][i] = null;

        if (i === j) {
          tempDiagonals[0][j] = null;
        }
        if (i + j === boardSize - 1) {
          tempDiagonals[1][j] = null;
        }
      }
    }
  }
  return moves;
};

export function shufflePriorityGroupedItems(items) {
  // Sort items by priority
  items.sort((a, b) => b.priority - a.priority);

  let currentPriority = null;
  let tempArray = [];
  const shuffledItems = [];

  // Group and shuffle items with the same priority
  for (const item of items) {
      if (item.priority !== currentPriority) {
          if (tempArray.length > 0) {
              shuffleArray(tempArray); 
              shuffledItems.push(...tempArray); 
              tempArray = []; 
          }
          currentPriority = item.priority; 
      }
      tempArray.push(item);
  }

  if (tempArray.length > 0) {
      shuffleArray(tempArray);
      shuffledItems.push(...tempArray);
  }

  return shuffledItems;
}

// Helper function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}
