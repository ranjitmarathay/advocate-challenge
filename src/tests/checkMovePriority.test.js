import { checkMovePriority } from './../components/gameLogic'; // adjust the import path as necessary

describe('checkMovePriority', () => {
  test('should prioritize moves based on game state', () => {
    const board = [
      ['O', 'O', null], 
      [null, 'X', null], 
      [null, null, null]
    ];
    const boardColumns = [
      ['O', null, null], 
      ['O', 'X', null], 
      [null, null, null]
    ];
    const boardDiagonals = [
      ['O', 'X', null], 
      [null, null, null]
    ];
    const currentTurn = 'O';
    const results = checkMovePriority(board, boardColumns, boardDiagonals, currentTurn);
    console.log(results)
    // Check if the top left corner is given a higher priority, being a corner and empty
    expect(results[0]).toEqual({ moveX: 2, moveY: 0, priority: 1 });
  });
});
