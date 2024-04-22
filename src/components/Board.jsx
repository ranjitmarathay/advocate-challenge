'use client'

import React, {useState, useEffect} from 'react'
import Cell from './Cell'
import {Box, Grid, Typography, Button, Switch, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from '@mui/material'

export default function Board(props){

  const [board, setBoard] = useState([[null, null, null], [null, null, null], [null, null, null]])

  const [gameMode, setGameMode] = useState('HumanVHuman');

  const [gameStart, setGameStart] = useState(false)

  const [currentTurn, setCurrentTurn] = useState("X")

  const [turnLog, setTurnLog] = useState([])

  const [winner, setWinner] = useState(null)

  const [botMove, setBotMove] = useState(gameMode === 'BotVBot' ? true : false)

  useEffect(() => {
    if (gameStart) {
      setWinner(null);
      setTurnLog([]);
      setBoard(Array.from({length: props.size}, () => Array.from({length: props.size}, () => null)));
      setCurrentTurn("X");
    }
  }, [gameStart, props.size]);
  
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
  
    if (gameStart && shouldBotMove && turnLog.length < props.size * props.size && winner === null) {
      timeoutId = setTimeout(() => {
        let found = false;
        let attempts = 0;
        let randomX, randomY;
  
        while (!found && attempts < 100) {
          randomX = Math.floor(Math.random() * props.size);
          randomY = Math.floor(Math.random() * props.size);
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
      }, 500);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [gameStart, gameMode, currentTurn, board, winner, turnLog]);
  

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

  useEffect(() => {
    // find three in a row vertical, horizontal, or diagonal
    if(turnLog.length >= 5){
      console.log("check winner")
      const horizontalWinner = checkWinnerHorizontal()
      const verticalWinner = checkWinnerVertical()
      const diagonalWinner = checkWinnerDiagonal()
      console.log(horizontalWinner, verticalWinner, diagonalWinner)
      const winner = horizontalWinner || verticalWinner || diagonalWinner
      console.log("winner", winner)

      if (winner === "X" || winner === "O") {
        setWinner(winner)
      } else if (winner === null && turnLog.length === props.size * props.size) {
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

      // setValue(currentTurn)
      setCurrentTurn(
        currentTurn === "X" ? "O" : "X"
      )
    }
  }

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
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h6">
            Current Turn: {currentTurn}
          </Typography>
        </Box>
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
    </Grid>
  )
}