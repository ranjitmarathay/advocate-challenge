  // This function checks all the horizontal rows for a winner
export const checkWinnerHorizontal = (board) => {
  // console.log("Checking columns:", board);
  for (const row of board) {
    if (row.every(cellValue => cellValue === "X")) {
      return "X";
    }
    if (row.every(cellValue => cellValue === "O")) {
      return "O";
    }
  }
  return null
}

  // This function checks all the vertical columns for a winner
export const checkWinnerVertical = (boardColumns) => {
  // console.log("Checking columns:", boardColumns);
  for (const column of boardColumns) {
    if (column.every((cellValue) => cellValue === "X")) {
      return "X"
    }
    if (column.every((cellValue) => cellValue === "O")) {
      return "O"
    }
  }
  return null
}

  // This function checks both diagonals for a winner
export const checkWinnerDiagonal = (boardDiagonals) => {
  // console.log("Checking diagonals:", boardDiagonals);
  for (const diagonal of boardDiagonals) {
    if (diagonal.every((cellValue) => cellValue === "X")) {
      return "X"
    }
    if (diagonal.every((cellValue) => cellValue === "O")) {
      return "O"
    }
  }
  return null
}