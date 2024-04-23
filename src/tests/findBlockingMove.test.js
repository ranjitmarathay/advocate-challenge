import { findBlockingMove } from './../components/gameLogic'; // adjust the import path as necessary

describe('findBlockingMove', () => {
  test('should identify blocking moves correctly', () => {
    const board = [
      ['X', null, 'X'],
      ['O', 'O', null],
      [null, 'X', 'O']
    ];
    const boardColumns = [
      ['X', 'O', null],
      [null, 'O', 'X'],
      ['X', null, 'O']
    ];
    const boardDiagonals = [
      ['X', 'O', 'O'],
      ['X', null, 'O']
    ];
    const currentTurn = 'X';
    const expectedOutput = [
      { moveX: 2, moveY: 1, priority: 0.75 }, // block O in middle row
    ];
    expect(findBlockingMove(board, boardColumns, boardDiagonals, currentTurn)).toEqual(expect.arrayContaining(expectedOutput));
  });
});
