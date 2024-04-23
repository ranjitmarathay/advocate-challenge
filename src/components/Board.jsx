'use client'

import React, {useState, useEffect} from 'react'
import Cell from './Cell'
import {Box, Grid, Typography, Button, Slider, Stack, ButtonGroup, TextField, Link, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Board(){

  // All State Variables
  const [boardSize, setBoardSize] = useState(3)

  const [board, setBoard] = useState([[null, null, null], [null, null, null], [null, null, null]])

  const [boardColumns, setBoardColumns] = useState([[null, null, null], [null, null, null], [null, null, null]])
  const [boardDiagonals, setBoardDiagonals] = useState([[null, null, null], [null, null, null]])

  const [gameMode, setGameMode] = useState('HumanVHuman');

  const [gameStart, setGameStart] = useState(false)

  const [currentTurn, setCurrentTurn] = useState("X")

  const [turnLog, setTurnLog] = useState([])

  const [winner, setWinner] = useState(null)

  const [botMove, setBotMove] = useState(gameMode === 'BotVBot' ? true : false)

  // This useEffect ensures that when we start a new game all the required default values are set

  const resetBoard = () => {
    setWinner(null);
    setTurnLog([]);
    setBoard(Array.from({length: boardSize}, () => Array.from({length: boardSize}, () => null)));
    setBoardColumns(Array.from({length: boardSize}, () => Array.from({length: boardSize}, () => null)))
    setBoardDiagonals(Array.from({length: boardSize-1}, () => Array.from({length: boardSize}, () => null)))
    setCurrentTurn("X");
  }
  useEffect(() => {
    if (gameStart) {
      resetBoard()
    }
  }, [gameStart, boardSize]);

  const handleBoardUpdate = (x, y, value, botMove) => {
    if (winner === null, board[y][x] === null) {
      const turn = {
        x: x,
        y: y,
        value: currentTurn,
        botMove: botMove
      };
      setBoard((prevBoard) => {
        const newBoard = prevBoard.map((row, index) => index === y ? row.slice() : row);
        // console.log("handleBoardUpdate setBoardRow newBoard", newBoard, x, y)
        if (newBoard[turn.y][turn.x] === null) {
          newBoard[turn.y][turn.x] = value; 
        }
        return newBoard;
      });

      setBoardColumns((prevBoard) => {
        const newBoard = prevBoard.map(row => [...row]);
        if (newBoard[turn.x][turn.y] === null) {
          newBoard[turn.x][turn.y] = value
        }
        return newBoard;
      });

      setBoardDiagonals((prevBoard) => {
        const newBoard = prevBoard.map((row, index) => index === y ? row.slice() : row);
        // console.log("handleBoardUpdate setBoardColumns newBoard", newBoard, x, y)
        if (x === y){
          newBoard[0][turn.x] = value
        } 
        if (x === boardSize - 1 - y){
          newBoard[1][turn.x] = value
        }
        return newBoard;
      });
      
      setCurrentTurn(value === "X" ? "O" : "X");

      setTurnLog((prevLog) => [...prevLog, turn]);
    }
  }

  const checkDiagonalBlockingMove = (diagonal, opponent, index) => {
    let opponentCount = diagonal.filter(cell => cell === opponent).length;
    let freeSpot = diagonal.indexOf(null);
    console.log(opponentCount, freeSpot, index)
    
    if (opponentCount === boardSize - 1 && freeSpot !== -1) {
        // All but one square is the opponent, and one is free
        if (index === 0) {
          console.log({x: freeSpot, y: freeSpot})
          return {x: freeSpot, y: freeSpot};
        } else{
          console.log({x: freeSpot, y: boardSize - 1 - freeSpot})
          return {x: freeSpot, y: boardSize - 1 - freeSpot};
        }
    }
    return null
  }

  const findBlockingMove = (board, currentTurn) => {
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
          console.log({x: i, y: freeSpot})
          possibleMoves.push({x: i, y: freeSpot});
        }
      }


      
      // Check rows for a blocking move
      for (let i = 0; i < boardSize; i++) {
        let row = board[i];
        let freeSpot = row.indexOf(null);
        let opponentCount = row.filter(cell => cell === opponent).length;
    
        if (freeSpot !== -1 && opponentCount === boardSize - 1) {
          console.log({x: freeSpot, y: i})
          possibleMoves.push({x: freeSpot, y: i});
        }
      }


      // Check diagonals for blocking moves
      for (let i = 0; i < 2; i++) {
        let diagonalMoves = checkDiagonalBlockingMove(boardDiagonals[i], opponent, i)
        console.log("diagonalMoves", diagonalMoves)
        if (diagonalMoves){
          possibleMoves.push(diagonalMoves)
        }
      }

      return possibleMoves
  }

  // This useEffect allows the bot to move when the game is in progress
  useEffect(() => {
    let shouldBotMove = false;
    let timeoutId;
  
    // Determine if the bot should move based on the game mode
    switch (gameMode) {
      case 'HumanVBot':
        shouldBotMove = currentTurn === "O";
        break;
      case 'BotVBot':
        shouldBotMove = currentTurn === "X" || currentTurn === "O";
        break;
      default:
        shouldBotMove = false;
        break;
    }
  
    // It's the bot's turn if the game has started, the bot should move and turnLog is still less than the board size and there is no winner 
    if (gameStart && shouldBotMove && turnLog.length < boardSize * boardSize && winner === null) {
      timeoutId = setTimeout(() => {
        let found = false;
        let attempts = 0;
        let moveX, moveY;
        // The bot will keep guessing until it finds a valid move
        // Find a blocking move if there is one -> move there
        console.log("[Finding blocking move]")
        const blockingMove = findBlockingMove(board, currentTurn);
        if (blockingMove.length > 0){
          blockingMove.forEach(move => {
            console.log("[Blocking Move]", move)
            moveX = move.x;
            moveY = move.y;
            console.log("blocking move", moveX, moveY);
            if (board[moveY][moveX] === null) {
              found = true;
            }
          })
        } else{
          while (!found && attempts < 100) {     
            moveX = Math.floor(Math.random() * boardSize);
            moveY = Math.floor(Math.random() * boardSize);
            // console.log("guessing", moveX, moveY);
            if (board[moveY][moveX] === null) {
              found = true;
              break;
            }
            attempts++;
          }
        }
  
        // Once a valid move has been found then the bot will make the move
        if (found) {
          handleBoardUpdate(moveX, moveY, currentTurn, true);
        } else {
          // If no valid move has been found then the bot will alert the user. 
          // Code shouldn't get here, unless something is really broken.
          alert("No valid move found for bot. Current move:", currentTurn);
        }
      }, 200);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [gameStart, gameMode, currentTurn, board, winner, turnLog]);
  
  // This function checks all the horizontal rows for a winner
  const checkWinnerHorizontal = () => {
    // console.log("check horizontal for winner")
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
  const checkWinnerVertical = () => {
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
  const checkWinnerDiagonal = () => {
    console.log("Checking diagonals:", boardDiagonals);
    for (const diagonal of boardDiagonals) {
      if (diagonal.every((cellValue) => cellValue === "X")) {
        return "X"
      }
      if (diagonal.every((cellValue) => cellValue === "O")) {
        return "O"
      }
    }
    console.log("No complete diagonal found");
    return null
  }

  // This useEffect checks if there is a winner everytime the turnLog array changes, as long as the turnLog array is at least the same length as the board size -1 * 2 (minimum requirement to win)
  // It also maintains arrays for columns and diagonals
  useEffect(() => {
    // If turnLog.length is greater than or equal to boardSize -1 * 2, check if there is a winner
    
    console.log(turnLog, boardSize - 1 * 2)
    if(turnLog.length >= (boardSize - 1 * 2)){
      
      const horizontalWinner = checkWinnerHorizontal()
      const verticalWinner = checkWinnerVertical()
      const diagonalWinner = checkWinnerDiagonal()
      
      const winner = horizontalWinner || verticalWinner || diagonalWinner

      if (winner === "X" || winner === "O") {
        setWinner(winner)
      } else if (winner === null && turnLog.length === boardSize * boardSize) {
        setWinner("draw")
      } else {
        console.log("[NO WINNER YET] turnLog.length", turnLog.length)
      }
    }
  },[turnLog])

  // This function creates the board and the cells
  const createBoard = () => {
    return (
      board.map((row, i) => (
        <Box key={i} sx={{ display: 'flex', gridTemplateColumns: 'repeat(3, 0fr)' }}>
          {row.map((cellValue, j) => (
            <Cell 
              key={`${i}-${j}`}
              value={cellValue} 
              x={j} 
              y={i} 
              setTurnLog={setTurnLog}
              currentTurn={currentTurn}
              turnLog={turnLog}
              setCurrentTurn={setCurrentTurn}
              board={board}
              setBoard={setBoard}
              winner={winner}
              handleBoardUpdate={handleBoardUpdate}
              botMove={botMove}
            />
          ))}
        </Box>
      ))
    )
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h3">
            Tic Tac Toe
          </Typography>
        </Box>
      </Grid>
      { gameStart ? (
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h6">
            Current Turn: {currentTurn}
          </Typography>
        </Box>
      </Grid>) : null }
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Stack direction="column" alignItems="center" spacing={2}>
          <Typography data-testid="board-size" sx={{fontSize: '1.5rem'}}>
            {boardSize} x {boardSize}
          </Typography>
          <ButtonGroup variant="outlined" aria-label="Basic button group">
            <Button data-testid="decrease-board-size" onClick={() => setBoardSize(prevSize => Math.max(prevSize - 1, 3))}>-</Button>
            <Button data-testid="increase-board-size" onClick={() => setBoardSize(prevSize => Math.min(prevSize + 1, 10))}>+</Button>
          </ButtonGroup>
        </Stack>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Select Game Mode</FormLabel>
          <RadioGroup
            row
            aria-label="game mode"
            name="gameMode"
            value={gameMode}
            onChange={(e) => setGameMode(e.target.value)}
          >
            <FormControlLabel value="HumanVHuman" data-testid="human-v-human" control={<Radio />} label="Human vs Human" />
            <FormControlLabel value="HumanVBot" data-testid="human-v-bot" control={<Radio />} label="Human vs Bot" />
            <FormControlLabel value="BotVBot" data-testid="bot-v-bot" control={<Radio />} label="Bot vs Bot" />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {gameStart ? null : <Button variant="contained" data-testid="start-button" onClick={() => setGameStart(true)}>Start Game</Button>}
      </Grid>
      {gameStart ? (
        <Grid item xs={12}>
          <Box sx={{ display: 'grid', justifyContent: 'center', alignItems: 'center'}}>
            {createBoard()}
          </Box>
        </Grid>
      ) : null}
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h6">
            {gameMode === "HumanVBot" && currentTurn === "O" && winner === null ? "Bot Turn"  : ""}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sx={{paddingBottom: "100px", display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: 'center'}}>
        {winner && <Box sx={{ display: 'flex', justifyContent: 'center' }}> 
          <Typography variant="h6">
            {winner === "draw" ? "Draw" : `Winner: ${winner}`}
          </Typography>
        </Box>}
        {winner && <Button variant="contained" sx={{ display: 'flex', justifyContent: 'center' }} onClick={() => resetBoard()}>New Game</Button>}
      </Grid>
      <Grid item xs={12} sx={{display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: 'center'}}>
        <Box sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'grey.200',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <GitHubIcon sx={{ mr: 1 }} />
          <Typography variant="body1">
            made by 
            <Link 
              href="https://github.com/ranjitmarathay" 
              sx={{ ml: 0.5 }}>
              Ranjit Marathay
            </Link>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  )
}