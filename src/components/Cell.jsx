'use client'

import React, {useState, useEffect} from 'react'
import {Box} from '@mui/material'

export default function Cell(props){

  const [value, setValue] = useState(props.value)

  useEffect (() => {
    setValue(props.value)
  }, [props.value])


  const handleValueChange = () => {
    if (value === null && props.winner === null) {
      const turn = {
        x: props.x,
        y: props.y,
        value: props.currentTurn
      }
      
      let newBoard = props.board
      newBoard[props.y][props.x] = props.currentTurn

      props.setBoard(newBoard)
      

      console.log(turn, props.currentTurn)
      props.setTurnLog([
        ...props.turnLog,
        turn
      ])

      setValue(props.currentTurn)
      props.setCurrentTurn(
        props.currentTurn === "X" ? "O" : "X"
      )
    }
  }

  // const handleClick = () => {
  //   props.handleCellClick(props.value, props.x, props.y)
  //   setValue(props.currentTurn)
  // }

  const handleClick = () => {
    if (value === null && props.winner === null) {
      const turn = {
        x: props.x,
        y: props.y,
        value: props.currentTurn
      };

      props.setBoard((prevBoard) => {
        const newBoard = prevBoard.map((row, index) => index === props.y ? row.slice() : row);
        newBoard[props.y][props.x] = props.currentTurn;
        return newBoard;
      });

      console.log(turn, props.currentTurn);
      props.setTurnLog((prevLog) => [...prevLog, turn]);
      props.setCurrentTurn(props.currentTurn === "X" ? "O" : "X");
    }
  };

  return (
    <Box 
      display="flex"
      justifyContent="center"
      alignItems="center"
      width={100}
      height={100}
      borderColor={"black"}
      border={1}
      // onClick={() => handleValueChange()}
      onClick={() => handleClick()}
    >
      {value}
    </Box>
  )
}