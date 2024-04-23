'use client'

import React, {useState, useEffect} from 'react'
import {Box} from '@mui/material'

export default function Cell(props){

  const [value, setValue] = useState(props.value)

  useEffect (() => {
    setValue(props.value)
  }, [props.value])


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
      data-testid={`cell-${props.x}-${props.y}`}
      // onClick={() => handleClick()}
      onClick={() => props.handleBoardUpdate(props.x, props.y, props.currentTurn, props.botMove)}
    >
      {value}
    </Box>
  )
}