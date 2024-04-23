'use client'

import React, {useState, useEffect} from 'react'
import Cell from './Cell'
import {Box, Grid, Typography, Button, Slider, Stack, ButtonGroup, TextField, Link, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Board(){

  // All State Variables
  const [boardSize, setBoardSize] = useState(3)

  const [board, setBoard] = useState([[null, null, null], [null, null, null], [null, null, null]])

  const [gameMode, setGameMode] = useState('HumanVHuman');

  const [gameStart, setGameStart] = useState(false)

  const [currentTurn, setCurrentTurn] = useState("X")

  const [turnLog, setTurnLog] = useState([])

  const [winner, setWinner] = useState(null)

  const [botMove, setBotMove] = useState(gameMode === 'BotVBot' ? true : false)

  // This useEffect ensures that when we start a new game all the required default values are set
  useEffect(() => {
    if (gameStart) {
      setWinner(null);
      setTurnLog([]);
      setBoard(Array.from({length: boardSize}, () => Array.from({length: boardSize}, () => null)));
      setCurrentTurn("X");
    }
  }, [gameStart, boardSize]);


  const findBlockingMove = (board, currentTurn) => {
    // find a blocking move for the bot
    // a blocking move is where there are only "X" or only "O" in a row or column with only free spot remaining
    // const findBlockingMove = (board, currentTurn) => {
      const opponent = currentTurn === 'X' ? 'O' : 'X';
      const boardSize = board.length;

      var possibleMoves = []

      // Represent the grid as columns

      for (let i = 0; i < boardSize; i++) {
        let column = [];
        for (let j = 0; j < boardSize; j++) {
          column.push(board[j][i]);
        }

        let freeSpot = column.indexOf(null);
        let opponentCount = column.filter(cell => cell === opponent).length;

        if (freeSpot !== -1 && opponentCount === boardSize - 1) {
          console.log({x: i, y: freeSpot})
          possibleMoves.push({x: i, y: freeSpot});
        }
      }


      // Represent the grid as rows
      for (let i = 0; i < boardSize; i++) {
        let row = board[i];
        // console.log(row)
        let freeSpot = row.indexOf(null);
        let opponentCount = row.filter(cell => cell === opponent).length;
    
        if (freeSpot !== -1 && opponentCount === boardSize - 1) {
          console.log({x: freeSpot, y: i})
          possibleMoves.push({x: freeSpot, y: i});
        }
      }
      
      // Represent the grid as diagonals

      let diagonal1 = []
      let diagonal2 = []
  
      for (let i = 0 ; i < board.length ; i++){
        diagonal1.push(board[i][i])
        diagonal2.push(board[board.length - 1 - i][i])
      }

      console.log("diagonals", diagonal1, diagonal2)

      // Check the first diagonal
      let opponentCount1 = diagonal1.filter(cell => cell === opponent).length;
      let freeSpot1 = diagonal1.indexOf(null);
      if (opponentCount1 === boardSize - 1 && freeSpot1 !== -1) {
          // All but one square is the opponent, and one is free
          console.log({x: freeSpot1, y: freeSpot1})
          possibleMoves.push({x: freeSpot1, y: freeSpot1});
      }
      
      // Check the second diagonal
      let opponentCount2 = diagonal2.filter(cell => cell === opponent).length;
      let freeSpot2 = diagonal2.indexOf(null);
      if (opponentCount2 === boardSize - 1 && freeSpot2 !== -1) {
          // All but one square is the opponent, and one is free
          console.log({x: freeSpot2, y: boardSize - 1 - freeSpot2})
          possibleMoves.push({x: freeSpot2, y: boardSize - 1 - freeSpot2});
      }

      if (possibleMoves.length > 0) {
        // console.log(possibleMoves)
        return possibleMoves;
      } else {
        return undefined;
      }
  
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
        if (blockingMove){
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
            console.log("guessing", moveX, moveY);
            if (board[moveY][moveX] === null) {
              found = true;
              break;
            }
            attempts++;
          }
        }
  
        // Once a valid move has been found then the bot will make the move
        if (found) {
          // Update the board with the updated X or O
          setBoard((prevBoard) => {
            const newBoard = prevBoard.map((row, index) => index === moveY ? row.slice() : row);
            newBoard[moveY][moveX] = currentTurn;
            return newBoard;
          });
          // Update the current turn to the other player
          setCurrentTurn(currentTurn === "X" ? "O" : "X");
          // Add this move to the turn log
          setTurnLog((prevLog) => [...prevLog, {
            x: moveX,
            y: moveY,
            value: currentTurn,
            botMove: true
          }]);
        } else {
          // The code shouldn't get here, because if there aren't any valid moves left the game should end.
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
        console.log("X wins");
        return "X";
      }
      if (row.every(cellValue => cellValue === "O")) {
        console.log("O wins");
        return "O";
      }
    }
    return null
  }

  // This function checks all the vertical columns for a winner
  const checkWinnerVertical = () => {
    // console.log("check vertical for winner")
    for (let i = 0 ; i < board.length ; i++){
      let column = []
      for (let j = 0 ; j < board.length ; j++){
        column.push(board[j][i])
      }
      if (column.every((cellValue) => cellValue === "X")) {
        console.log("X wins")
        return "X"
      }
      if (column.every((cellValue) => cellValue === "O")) {
        console.log("O wins")
        return "O"
      }
    }
    return null
  }

  // This function checks both diagonals for a winner
  const checkWinnerDiagonal = () => {
    // console.log("check diagonal for winner")
    let diagonal1 = []
    let diagonal2 = []

    for (let i = 0 ; i < board.length ; i++){
      diagonal1.push(board[i][i])
      diagonal2.push(board[i][board.length - 1 - i])
    }
    if (diagonal1.every((cellValue) => cellValue === "X")) {
      console.log("X wins diagonal 1")
      return "X"
    }
    if (diagonal1.every((cellValue) => cellValue === "O")) {
      console.log("O wins diagonal 1")
      return "O"
    }
    if (diagonal2.every((cellValue) => cellValue === "X")) {
      console.log("X wins diagonal 2")
      return "X"
    }
    if (diagonal2.every((cellValue) => cellValue === "O")) {
      console.log("O wins diagonal 2")
      return "O"
    }

    return null

  }

  // This useEffect checks if there is a winner everytime the turnLog array changes, as long as the turnLog array is at least the same length as the board size -1 * 2 (minimum requirement to win)
  useEffect(() => {
    // If turnLog.length is greater than or equal to boardSize -1 * 2, check if there is a winner
    console.log(turnLog, boardSize - 1 * 2)
    if(turnLog.length >= (boardSize - 1 * 2)){
      console.log("check winner")
      const horizontalWinner = checkWinnerHorizontal()
      const verticalWinner = checkWinnerVertical()
      const diagonalWinner = checkWinnerDiagonal()
      // console.log(horizontalWinner, verticalWinner, diagonalWinner)
      const winner = horizontalWinner || verticalWinner || diagonalWinner

      if (winner === "X" || winner === "O") {
        console.log("[WINNER]", winner)
        setWinner(winner)
      } else if (winner === null && turnLog.length === boardSize * boardSize) {
        console.log("[DRAW] no winner", winner, "turnLog.length", turnLog.length)
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
      <Grid item xs={12} sx={{paddingTop: "50px", display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: 'center'}}>
        {winner && <Box sx={{ display: 'flex', justifyContent: 'center' }}> 
          <Typography variant="h6">
            {winner === "draw" ? "Draw" : `Winner: ${winner}`}
          </Typography>
        </Box>}
        {winner && <Button variant="contained" sx={{ display: 'flex', justifyContent: 'center' }} onClick={() => window.location.reload()}>New Game</Button>}
      </Grid>
      <Grid item xs={12} sx={{paddingTop: "150px", display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: 'center'}}>
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