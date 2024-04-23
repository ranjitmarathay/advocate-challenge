import { checkWinnerHorizontal, checkWinnerVertical, checkWinnerDiagonal } from '../components/checkWinner';

describe('Game Winning Conditions', () => {
  describe('checkWinnerHorizontal', () => {
    it('should detect horizontal win for X', () => {
      const board = [
        ['X', 'X', 'X'],
        [null, 'O', 'O'],
        ['O', 'X', 'O']
      ];
      expect(checkWinnerHorizontal(board)).toBe('X');
    });

    it('should detect horizontal win for O', () => {
      const board = [
        ['X', 'X', 'O'],
        ['O', 'O', 'O'],
        ['O', 'X', 'X']
      ];
      expect(checkWinnerHorizontal(board)).toBe('O');
    });

    it('should return null when there is no horizontal win', () => {
      const board = [
        ['X', 'O', 'X'],
        ['O', 'X', 'O'],
        ['O', 'X', 'O']
      ];
      expect(checkWinnerHorizontal(board)).toBeNull();
    });
  });

  describe('checkWinnerVertical', () => {
    it('should detect vertical win for X', () => {
      const boardColumns = [
        ['X', 'X', 'X'],
        ['O', 'O', 'X'],
        ['X', 'O', 'O']
      ];
      expect(checkWinnerVertical(boardColumns)).toBe('X');
    });

    it('should detect vertical win for O', () => {
      const boardColumns = [
        ['X', 'X', 'O'],
        ['O', 'O', 'O'],
        ['X', 'X', 'O']
      ];
      expect(checkWinnerVertical(boardColumns)).toBe('O');
    });

    it('should return null when there is no vertical win', () => {
      const boardColumns = [
        ['X', 'O', 'X'],
        ['O', 'X', 'O'],
        ['O', 'X', 'X']
      ];
      expect(checkWinnerVertical(boardColumns)).toBeNull();
    });
  });

  describe('checkWinnerDiagonal', () => {
    it('should detect diagonal win for X', () => {
      const boardDiagonals = [
        ['X', 'X', 'X'],  // Main diagonal
        ['O', 'X', 'O']   // Counter diagonal
      ];
      expect(checkWinnerDiagonal(boardDiagonals)).toBe('X');
    });

    it('should detect diagonal win for O', () => {
      const boardDiagonals = [
        ['X', 'O', 'X'],
        ['O', 'O', 'O']
      ];
      expect(checkWinnerDiagonal(boardDiagonals)).toBe('O');
    });

    it('should return null when there is no diagonal win', () => {
      const boardDiagonals = [
        ['X', 'X', 'O'],
        ['O', 'X', 'X']
      ];
      expect(checkWinnerDiagonal(boardDiagonals)).toBeNull();
    });
  });
});
