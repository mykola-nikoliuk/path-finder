import React, { MouseEventHandler, Ref, useCallback, useEffect, useRef } from 'react';
import noop from 'lodash/noop';
import { GridMap } from '../../models/GridMap';
import { GridCell, Position } from '../../types';

interface GameGridProps {
  grid: GridMap<GridCell>;
  background?: string;
  onClick?: (position: Position, shiftKey: boolean) => void;
  size: number;
}

export const GameGrid = ({ grid, size, onClick = noop, background = '' }: GameGridProps) => {
  const { width, height } = grid.size;
  const ref = useRef<HTMLCanvasElement>();
  const canvasWidth = width * size;
  const canvasHeight = height * size;
  let backgroundImage: HTMLImageElement | null;

  const draw = useCallback(() => {

    if (!ref.current) return;

    const ctx = ref.current.getContext('2d');


    if (!ctx) return;

    if (background && backgroundImage) {
      ctx.drawImage(backgroundImage, 0, 0, backgroundImage.width, backgroundImage.height, 0, 0, canvasWidth, canvasHeight);
    }

    const totalCells = width * height;

    for (let i = 0; i < totalCells; i++) {
      let position = {
        x: i % width,
        y: Math.floor(i / width)
      };

      const color = cellToColor(grid.get(position));
      ctx.fillStyle = color;

      ctx.fillRect(position.x * size, position.y * size, size, size);
    }

  }, [size]);

  useEffect(() => {
    draw();
  });

  useEffect(() => {
    if (!background) backgroundImage = null;

    const image = new Image();

    image.onload = () => {
      backgroundImage = image;
      draw();
    }

    image.src = background;

    return () => {
      image.onload = noop;
    }
  }, [background]);

  const onClickHandler = useCallback<MouseEventHandler>((e) => {
    const computedStyle = (e.target as Element).getBoundingClientRect();
    const position = {
      x: (e.clientX - computedStyle.left) / size | 0,
      y: (e.clientY - computedStyle.top) / size | 0,
    };
    console.log(position);
    onClick(position, e.shiftKey);
  }, []);

  return <canvas ref={ref as Ref<HTMLCanvasElement>} width={size * width} height={size * height} onClick={onClickHandler} />
}


function cellToColor(gameCell: GridCell) {
  switch (gameCell) {
    case GridCell.Block:
      return '#0008';

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
