import { checkDiagonalBlockingMove } from '../components/gameLogic';

describe('checkDiagonalBlockingMove', () => {
  test('should identify a blocking opportunity on primary diagonal', () => {
    const diagonal = [null, 'O', 'O'];
    const opponent = 'O';
    const index = 0;
    const boardSize = 3;
    expect(checkDiagonalBlockingMove(diagonal, opponent, index, boardSize)).toEqual({ moveX: 0, moveY: 0, priority: 0.75 });
  });

  test('should identify a blocking opportunity on secondary diagonal', () => {
    const diagonal = ['O', null, 'O'];
    const opponent = 'O';
    const index = 1;
    const boardSize = 3;
    expect(checkDiagonalBlockingMove(diagonal, opponent, index, boardSize)).toEqual({ moveX: 1, moveY: boardSize - 2, priority: 0.75 });
  });

  test('should return null when no blocking move is needed', () => {
    const diagonal = ['X', 'O', 'O'];
    const opponent = 'O';
    const index = 0;
    const boardSize = 3;
    expect(checkDiagonalBlockingMove(diagonal, opponent, index, boardSize)).toBeNull();
  });
});
