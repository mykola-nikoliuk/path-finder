import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import noop from 'lodash/noop';
import { GridMap } from '../../models/GridMap';
import { GameCell } from '../GameCell';
import { GridCell, Position } from '../../types';

interface GameGridProps {
  grid: GridMap<GridCell>;
  background?: string;
  onClick?: (position: Position, shiftKey: boolean) => void;
  size: number;
}

export const GameGrid = ({ grid, size, onClick = noop, background = '' }: GameGridProps) => {

  const { width, height} = grid.size;

  const onClickHandler = useCallback((e: MouseEvent, position: Position) => {
    onClick(position, e.shiftKey);
  }, []);

  const cells = useMemo(() => {
    const cells = [];
    const totalCells = width * height;

    for (let i = 0; i < totalCells; i++) {
      let position = {
        x: i % width,
        y: Math.floor(i / width)
      };
      const color = cellToColor(grid.get(position));
      cells.push(<GameCell key={i} size={size} color={color} onClick={e => onClickHandler(e, position)} />)
    }

    return cells;
  }, undefined);

  return <StyledGameGrid width={size * width} $background={background}>
    {cells}
  </StyledGameGrid>
}

const StyledGameGrid = styled.div<{ width: number, $background: string }>`
  display: flex;
  flex-wrap: wrap;
  width: ${({ width }) => width}px;
  border-left: solid 1px grey;
  border-top: solid 1px grey;
  background-image: url("${({$background}) => $background}");
  background-size: 100% 100%;
`;

function cellToColor(gameCell: GridCell) {
  switch (gameCell) {
    case GridCell.Block:
      return 'grey';

    case GridCell.Trail:
      return 'lightblue';

    case GridCell.Start:
      return 'lightgreen';

    case GridCell.End:
      return 'lightcoral';

    default:
      return 'transparent';
  }
}
