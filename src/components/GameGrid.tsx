import React, { useMemo } from 'react';
import styled from 'styled-components';
import noop from 'lodash/noop';
import { GridMap } from '../models/GridMap';
import { GameCell } from './GameCell';
import { GridCell, Position } from '../types';


interface GameGridProps {
  grid: GridMap<GridCell>;
  onClick?: (position: Position) => void;
  size: number;
}

export const GameGrid = ({ grid, size, onClick = noop }: GameGridProps) => {

  const { width, height} = grid.size;

  const cells = useMemo(() => {
    const cells = [];
    const totalCells = width * height;

    for (let i = 0; i < totalCells; i++) {
      let position = {
        x: i % width,
        y: Math.floor(i / width)
      };
      const color = cellToColor(grid.get(position));
      cells.push(<GameCell key={i} size={size} color={color} onClick={() => onClick(position)} />)
    }

    return cells;
  }, undefined);

  return <StyledGameGrid width={size * width + width - 1}>
    {cells}
  </StyledGameGrid>
}

const StyledGameGrid = styled.div<{ width: number }>`
  display: flex;
  flex-wrap: wrap;
  width: ${({ width }) => width}px;
  gap: 1px
`;

function cellToColor(gameCell: GridCell) {
  switch (gameCell) {
    case GridCell.Block:
      return 'yellow';

    case GridCell.Trail:
      return 'red';

    default:
      return 'grey';
  }
}
