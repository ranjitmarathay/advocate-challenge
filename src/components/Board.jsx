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


  // This useEffect allows the bot to move when the game is in progress
  useEffect(() => {
    let shouldBotMove = false;
    let timeoutId;
  
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
  
    if (gameStart && shouldBotMove && turnLog.length < boardSize * boardSize && winner === null) {
      timeoutId = setTimeout(() => {
        let found = false;
        let attempts = 0;
        let randomX, randomY;
  
        while (!found && attempts < 100) {
          randomX = Math.floor(Math.random() * boardSize);
          randomY = Math.floor(Math.random() * boardSize);
          console.log("guessing", randomX, randomY);
          if (board[randomY][randomX] === null) {
            found = true;
          }
          attempts++;
        }
  
        if (found) {
          setBoard((prevBoard) => {
            const newBoard = prevBoard.map((row, index) => index === randomY ? row.slice() : row);
            newBoard[randomY][randomX] = currentTurn;
            return newBoard;
          });
          console.log("Current Turn", currentTurn);
          setCurrentTurn(currentTurn === "X" ? "O" : "X");
          console.log("Current Turn", currentTurn);
          setTurnLog((prevLog) => [...prevLog, {
            x: randomX,
            y: randomY,
            value: currentTurn,
            botMove: true
          }]);
        }
      }, 200);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [gameStart, gameMode, currentTurn, board, winner, turnLog]);
  
  // This function checks all the horizontal rows for a winner
  const checkWinnerHorizontal = () => {
    console.log("check horizontal for winner")
    for (const row of board) {
      console.log(row);
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
    console.log("check vertical for winner")
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
    console.log("check diagonal for winner")
    let diagonal1 = []
    let diagonal2 = []

    for (let i = 0 ; i < board.length ; i++){
      diagonal1.push(board[i][i])
      diagonal2.push(board[i][board.length - 1 - i])
    }
    console.log(diagonal1, diagonal2)
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
    // find three in a row vertical, horizontal, or diagonal
    if(turnLog.length >= (boardSize-1 * 2)){
      console.log("check winner")
      const horizontalWinner = checkWinnerHorizontal()
      const verticalWinner = checkWinnerVertical()
      const diagonalWinner = checkWinnerDiagonal()
      console.log(horizontalWinner, verticalWinner, diagonalWinner)
      const winner = horizontalWinner || verticalWinner || diagonalWinner
      console.log("winner", winner)

      if (winner === "X" || winner === "O") {
        setWinner(winner)
      } else if (winner === null && turnLog.length === boardSize * boardSize) {
        console.log("no winner", winner)
        console.log("turnLog.length", turnLog.length)
        console.log("draw")
        setWinner("draw")
      } else {
        console.log("turnLog.length", turnLog.length)
        console.log("no winner yet")
      }
    }
  },[turnLog])

  // This function simulates a click on the cell
  const handleCellClick = (value, x, y) =>{
    if (value === null && winner === null && botMove === false) {
      const turn = {
        x: x,
        y: y,
        value: currentTurn
      }
      
      let newBoard = board
      newBoard[y][x] = currentTurn

      setBoard(newBoard)
      

      console.log(turn, currentTurn)
      setTurnLog([
        ...turnLog,
        turn
      ])

      setCurrentTurn(
        currentTurn === "X" ? "O" : "X"
      )
    }
  }

  // This function creates the board and the cells
  const createBoard = () => {
    return (
      board.map((row, i) => (
        <Box key={i} sx={{ display: 'flex', gridTemplateColumns: 'repeat(3, 0fr)' }}>
          {row.map((cellValue, j) => (
            <Cell 
              key={`${i}-${j}`}
              value={cellValue} 
              handleCellClick={handleCellClick}
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
          <TextField
            label="Board Size"
            type="number"
            variant="outlined"
            value={boardSize}
            onChange={(event) => setBoardSize(event.target.value)}
            inputProps={{ readOnly: true, }}
            size="large"
            sx={{ minWidth: 100 }}
          />
          <ButtonGroup variant="outlined" aria-label="Basic button group">
            <Button onClick={() => setBoardSize(prevSize => Math.max(prevSize - 1, 3))}>-</Button>
            <Button onClick={() => setBoardSize(prevSize => Math.min(prevSize + 1, 10))}>+</Button>
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
            <FormControlLabel value="HumanVHuman" control={<Radio />} label="Human vs Human" />
            <FormControlLabel value="HumanVBot" control={<Radio />} label="Human vs Bot" />
            <FormControlLabel value="BotVBot" control={<Radio />} label="Bot vs Bot" />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {gameStart ? null : <Button variant="contained" onClick={() => setGameStart(true)}>Start Game</Button>}
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
      <Grid item xs={12} sx={{paddingTop: "50px", display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: 'center'}} spacing={2}>
        {winner && <Box sx={{ display: 'flex', justifyContent: 'center' }}> 
          <Typography variant="h6">
            {winner === "draw" ? "Draw" : `Winner: ${winner}`}
          </Typography>
        </Box>}
        {winner && <Button variant="contained" sx={{ display: 'flex', justifyContent: 'center' }} onClick={() => window.location.reload()}>New Game</Button>}
      </Grid>
      <Grid item xs={12} sx={{paddingTop: "150px", display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: 'center'}} spacing={2}>
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