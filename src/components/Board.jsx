'use client'

import React, {useState, useEffect} from 'react'
import Cell from './Cell'
import {Box, Grid, Typography, Button, Slider, Stack, ButtonGroup, TextField, Link, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub';
import { findBlockingMove, checkMovePriority, shufflePriorityGroupedItems } from './gameLogic';
import { checkWinnerHorizontal, checkWinnerVertical, checkWinnerDiagonal } from './checkWinner';

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
    if (winner === null && board[y][x] === null) {
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
        let moveX, moveY;        
        
        const blockingMoves = findBlockingMove(board, boardColumns, boardDiagonals, currentTurn);
        const possibleMoves = checkMovePriority(board, boardColumns, boardDiagonals, currentTurn)
        const allMoves = blockingMoves.concat(possibleMoves).sort((a, b) => b.priority - a.priority)
        // 
        const shuffledMoves = shufflePriorityGroupedItems(allMoves)
        
        moveX = shuffledMoves[0].moveX
        moveY = shuffledMoves[0].moveY
        
        if (board[moveY][moveX] === null) {
          found = true;
        }
 
        // Once a valid move has been found then the bot will make the move
        if (found) {
          handleBoardUpdate(moveX, moveY, currentTurn, true);
        } else {
          // If no valid move has been found then the bot will alert the user. 
          // Code shouldn't get here, unless something is really broken.
          alert("No valid move found for bot. Current move:", currentTurn);
          console.error("No valid move found for bot. Current move:", currentTurn);
        }
      }, 200);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [gameStart, gameMode, currentTurn, board, winner, turnLog]);
  
  // This useEffect checks if there is a winner everytime the turnLog array changes, as long as the turnLog array is at least the same length as the board size -1 * 2 (minimum requirement to win)
  useEffect(() => {
    // If turnLog.length is greater than or equal to boardSize -1 * 2, check if there is a winner
    
    console.log(turnLog, boardSize - 1 * 2)
    if(turnLog.length >= (boardSize - 1 * 2)){
      
      const horizontalWinner = checkWinnerHorizontal(board)
      const verticalWinner = checkWinnerVertical(boardColumns)
      const diagonalWinner = checkWinnerDiagonal(boardDiagonals)
      
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