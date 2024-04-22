'use client'

import React, {useState, useEffect} from 'react'
import Cell from './Cell'
import {Box, Grid, Typography, Button, Switch} from '@mui/material'

export default function Board(props){

  const [board, setBoard] = useState([[null, null, null], [null, null, null], [null, null, null]])

  const [currentTurn, setCurrentTurn] = useState("X")

  const [turnLog, setTurnLog] = useState([])

  const [winner, setWinner] = useState(null)

  const [botMode, setBotMode] = useState(false)

  const [botMove, setBotMove] = useState(false)

  useEffect(() => {
    let size = props.size
    let tempBoard = Array.from({length: size}, () => Array.from({length: size}, () => null))
    setBoard(tempBoard)
  }, [props.size])


  useEffect(() => {
    if (botMode && currentTurn === "O" && turnLog.length < props.size * props.size && winner === null) {
      setBotMove(true)
      let found = false
      let attempts = 0
      let randomX, randomY

      while (!found && attempts < 100) {
        randomX = Math.floor(Math.random() * 3)
        randomY = Math.floor(Math.random() * 3)
        console.log("random", randomX, randomY, "attempt", attempts);
        if (board[randomY][randomX] === null) {
          console.log("found", randomX, randomY)
          found = true
        }
        attempts++
      }

      if (found){
        setBoard((prevBoard) => {
          const newBoard = prevBoard.map((row, index) => index === randomY ? row.slice() : row);
          newBoard[randomY][randomX] = "O";
          return newBoard;
        });
        setCurrentTurn("X");
        setTurnLog((prevLog) => [...prevLog, {
          x: randomX,
          y: randomY,
          value: "O",
          botMove: true
        }])
      } else{
        console.log("error, no cell found")
      }
    } else{
      console.log("no bot move")
      setBotMove(false)
    }
  }, [botMode, currentTurn, board])


  const checkWinnerHorizontal = () => {
    board.forEach((row) => {
      console.log(row)
      if (row.every((cellValue) => cellValue === "X")) {
        console.log("X wins")
        return "X"
      }
      if (row.every((cellValue) => cellValue === "O")) {
        console.log("O wins")
        return "O"
      }
    })
    return null
  }

  const checkWinnerVertical = () => {
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
        <Typography variant="h6">
          Bot Mode: {botMode ? "Activated" : "Off"}
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Switch
          checked={botMode}
          onChange={() => setBotMode(!botMode)}
          disabled={board.some((row) => row.some((cell) => cell !== null))}
        />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ display: 'grid', justifyContent: 'center', alignItems: 'center'}}>
          {createBoard()}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h6">
            {botMode && currentTurn === "O" && winner === null ? "Bot Turn"  : ""}
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