'use client'

import React, {useState, useEffect} from 'react'
import {Box} from '@mui/material'

export default function Cell(props){

  const [value, setValue] = useState(props.value)

  useEffect (() => {
    setValue(props.value)
  }, [props.value])


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
      onClick={() => props.handleBoardUpdate(props.x, props.y, props.currentTurn, props.botMove)}
    >
      {value}
    </Box>
  )
}