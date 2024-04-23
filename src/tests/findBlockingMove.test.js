import { SignalWifiStatusbarNullOutlined } from '@mui/icons-material';
import { findBlockingMove } from './../components/gameLogic'; // adjust the import path as necessary

describe('findBlockingMove horizontal 0', () => {
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

describe('findBlockingMove vertical 0', () => {
  test('should identify blocking moves correctly', () => {
    const board = [
      ['X', null, SignalWifiStatusbarNullOutlined],
      ['X', 'O', null],
      [null, null, 'O']
    ];
    const boardColumns = [
      ['X', 'X', null],
      [null, 'O', null],
      [null, null, 'O']
    ];
    const boardDiagonals = [
      ['X', 'O', 'O'],
      [null, 'O', null]
    ];
    const currentTurn = 'O';
    const expectedOutput = [
      { moveX: 0, moveY: 2, priority: 0.75 }, // block O in middle row
    ];
    expect(findBlockingMove(board, boardColumns, boardDiagonals, currentTurn)).toEqual(expect.arrayContaining(expectedOutput));
  });
});


describe('findBlockingMove vertical 1', () => {
  test('should identify blocking moves correctly', () => {
    const board = [
      [null, null, 'X'],
      [null, 'O', null],
      [null, 'O', null]
    ];
    const boardColumns = [
      [null, null, null],
      [null, 'O', 'O'],
      ['X', null, null]
    ];
    const boardDiagonals = [
      [null, 'O', null],
      [null, 'O', 'X']
    ];
    const currentTurn = 'X';
    const expectedOutput = [
      { moveX: 1, moveY: 0, priority: 0.75 }, // block O in middle row
    ];
    expect(findBlockingMove(board, boardColumns, boardDiagonals, currentTurn)).toEqual(expect.arrayContaining(expectedOutput));
  });
});

describe('findBlockingMove vertical 2', () => {
  test('should identify blocking moves correctly', () => {
    const board = [
      [null, null, 'X'],
      [null, null, 'X'],
      [null, 'O', null]
    ];
    const boardColumns = [
      [null, null, null],
      [null, null, 'O'],
      ['X', 'X', null]
    ];
    const boardDiagonals = [
      [null, null, null],
      [null, null, 'X']
    ];
    const currentTurn = 'O';
    const expectedOutput = [
      { moveX: 2, moveY: 2, priority: 0.75 },
    ];
    expect(findBlockingMove(board, boardColumns, boardDiagonals, currentTurn)).toEqual(expect.arrayContaining(expectedOutput));
  });
});


describe('findBlockingMove vertical 3', () => {
  test('no possible move', () => {
    const board = [
      [null, null, 'X'],
      [null, null, 'X'],
      [null, 'O', null]
    ];
    const boardColumns = [
      [null, null, null],
      [null, null, 'O'],
      ['X', 'X', null]
    ];
    const boardDiagonals = [
      [null, null, null],
      [null, null, 'X']
    ];
    const currentTurn = 'X';
    const expectedOutput = [];
    expect(findBlockingMove(board, boardColumns, boardDiagonals, currentTurn)).toEqual(expect.arrayContaining(expectedOutput));
  });
});
