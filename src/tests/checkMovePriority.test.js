import { checkWinnerHorizontal, checkWinnerVertical } from './../components/checkWinner';
import { checkMovePriority, findBlockingMove } from './../components/gameLogic'; // adjust the import path as necessary
import { generateTestCase } from './../utils/testUtils';

describe('checkMovePriority horizontal winning', () => {
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

describe('checkMovePriority horizontal winning non blocking', () => {
  test('should prioritize moves based on game state', () => {
    const board = [
      ['O', 'O', null], 
      ['X', 'X', null], 
      [null, null, null]
    ];
    const boardColumns = [
      ['O', 'X', null], 
      ['O', 'X', null], 
      [null, null, null]
    ];
    const boardDiagonals = [
      ['O', 'X', null], 
      [null, 'X', null]
    ];
    const currentTurn = 'O';
    const results = checkMovePriority(board, boardColumns, boardDiagonals, currentTurn);
    console.log(results)
    // Check if the top left corner is given a higher priority, being a corner and empty
    expect(results[0]).toEqual({ moveX: 2, moveY: 0, priority: 1 });
  });
});

describe('checkMovePriority two diagonal winning', () => {
  test('should prioritize moves based on game state', () => {
    const board = [
      ['O', 'O', null], 
      ['X', 'O', 'X'], 
      [null, null, null]
    ];
    const boardColumns = [
      ['O', 'X', null], 
      ['O', 'O', null], 
      [null, 'X', null]
    ];
    const boardDiagonals = [
      ['O', 'O', null], 
      [null, 'O', null]
    ];
    const currentTurn = 'O';
    const results = checkMovePriority(board, boardColumns, boardDiagonals, currentTurn);
    // Check if the top left corner is given a higher priority, being a corner and empty
    expect(results[0]).toEqual({ moveX: 2, moveY: 0, priority: 1 });
  });
});

describe('checkMovePriority 1', () => {
  test('should prioritize moves based on game state', () => {
    const board = [
      ['O', 'O', null], 
      ['X', 'X', null], 
      ['O', 'O', null]
    ];
    const boardColumns = [
      ['O', 'X', 'O'], 
      ['O', 'X', 'O'], 
      [null, null, null]
    ];
    const boardDiagonals = [
      ['O', 'X', null], 
      ['O', 'X', null]
    ];
    const currentTurn = 'O';
    
    const blockingMoves = findBlockingMove(board, boardColumns, boardDiagonals, currentTurn);
    const possibleMoves = checkMovePriority(board, boardColumns, boardDiagonals, currentTurn);
    const allMoves = blockingMoves.concat(possibleMoves).sort((a, b) => b.priority - a.priority)
  
    
    expect(allMoves[0]).toEqual({ moveX: 2, moveY: 0, priority: 1 });
    expect(allMoves[1]).toEqual({ moveX: 2, moveY: 2, priority: 1 });
    expect(allMoves[2]).toEqual({ moveX: 2, moveY: 1, priority: 0.75 });
  });
});


describe('auomated checkMovePriority', () => {
  test('should prioritize moves based on game state', () => {
    const board = [
      ['O', 'O', null], 
      ['X', 'X', null], 
      ['O', 'O', null]
    ];
    const boardColumns = [
      ['O', 'X', 'O'], 
      ['O', 'X', 'O'], 
      [null, null, null]
    ];
    const boardDiagonals = [
      ['O', 'X', null], 
      ['O', 'X', null]
    ];
    const currentTurn = 'O';
    
    const blockingMoves = findBlockingMove(board, boardColumns, boardDiagonals, currentTurn);
    const possibleMoves = checkMovePriority(board, boardColumns, boardDiagonals, currentTurn);
  });
})