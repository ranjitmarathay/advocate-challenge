import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Board from './Board';

describe('Horizontal Win for X', () => {
  test('should declare player X as the winner with a horizontal line', async () => {

    render(<Board />);

    fireEvent.click(screen.getByTestId("start-button"));
    // Simulate player X moves
    fireEvent.click(screen.getByTestId('cell-0-1')); // X
    fireEvent.click(screen.getByTestId('cell-1-1')); // O
    fireEvent.click(screen.getByTestId('cell-0-2')); // X
    fireEvent.click(screen.getByTestId('cell-2-2')); // O
    fireEvent.click(screen.getByTestId('cell-0-0')); // X wins on the top row

    expect(screen.getByText('Winner: X')).toBeInTheDocument();
  });
});

describe('Vertical Win for X', () => {
  test('should declare player X as the winner with a vertical line', () => {
    render(<Board />);
    fireEvent.click(screen.getByTestId("start-button"));
    
    // Simulate player X moves for a vertical win in the first column
    fireEvent.click(screen.getByTestId('cell-0-0')); // X
    fireEvent.click(screen.getByTestId('cell-0-1')); // O
    fireEvent.click(screen.getByTestId('cell-1-0')); // X
    fireEvent.click(screen.getByTestId('cell-0-2')); // O
    fireEvent.click(screen.getByTestId('cell-2-0')); // X wins on the first column

    expect(screen.getByText('Winner: X')).toBeInTheDocument();
  });
});



describe('Diagonal Win for X', () => {
  test('should declare player X as the winner with a diagonal line (top-left to bottom-right)', () => {
    render(<Board />);
    fireEvent.click(screen.getByTestId("start-button"));
    
    // Simulate player X moves for a diagonal win from top-left to bottom-right
    fireEvent.click(screen.getByTestId('cell-0-0')); // X
    fireEvent.click(screen.getByTestId('cell-0-1')); // O
    fireEvent.click(screen.getByTestId('cell-1-1')); // X
    fireEvent.click(screen.getByTestId('cell-0-2')); // O
    fireEvent.click(screen.getByTestId('cell-2-2')); // X wins diagonally

    // Check for winner announcement
    expect(screen.getByText('Winner: X')).toBeInTheDocument();
  });
});

describe("Board Size", () => {
  test('increment size of board', () => {
    render(<Board />);

    const boardSizeInput = screen.getByTestId('board-size');
    fireEvent.click(screen.getByTestId("increase-board-size"));
    expect(boardSizeInput).toHaveTextContent('4 x 4');

    fireEvent.click(screen.getByTestId("increase-board-size"));
    expect(boardSizeInput).toHaveTextContent('5 x 5')

    fireEvent.click(screen.getByTestId("decrease-board-size"));
    expect(boardSizeInput).toHaveTextContent('4 x 4');

    fireEvent.click(screen.getByTestId("decrease-board-size"));
    expect(boardSizeInput).toHaveTextContent('3 x 3');
  })
})