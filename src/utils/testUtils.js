function generateRandomBoard(specifiedRow, type) {
  let board = Array(specifiedRow.length).fill(null).map(() => Array(specifiedRow.length).fill(null));
  let rowIndex;
  if (type === 'diagonal'){
    rowIndex = Math.floor(Math.random() * 2); // Random index for the row placement
  }
  rowIndex = Math.floor(Math.random() * 3); // Random index for the row placement
  const columnIndex = specifiedRow.indexOf(null)
  board[rowIndex] = [...specifiedRow];

  // Fill the rest of the board avoiding any 'wins'
  board.forEach((row, i) => {
    if (i !== rowIndex) {
      for (let j = 0; j < 3; j++) {
        if (!row[j]) {
          const possibleValues = ['X', 'O'];
          row[j] = possibleValues[Math.floor(Math.random() * 2)];
        }
      }
    }
  });


  return {board, rowIndex, columnIndex};
}

function generateColumnsAndDiagonals(board) {
  const columns = Array(3).fill(null).map(() => Array(3).fill(null));
  const diagonals = [[], []];

  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      columns[j][i] = cell; // Populate columns
      if (i === j) {
        diagonals[0].push(cell); // Main diagonal
      }
      if (i + j === 2) {
        diagonals[1].push(cell); // Anti-diagonal
      }
    });
  });

  return { columns, diagonals };
}


const generateTestCase = (row) => {
  const {board, rowIndex, columnIndex} = generateRandomBoard(row);
  const { columns, diagonals } = generateColumnsAndDiagonals(board);

  return { rowIndex, columnIndex, board, columns, diagonals };
}