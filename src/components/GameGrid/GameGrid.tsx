import React, {
  MouseEventHandler,
  Ref,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import noop from 'lodash/noop';
import { GridMap } from '../../models/GridMap';
import { GridCell, Position } from '../../types';
import { throttle } from 'lodash';

interface GameGridProps {
  grid: GridMap<GridCell>;
  size: number;
  background?: string;
  showWalls?: boolean;
  onClick?: (position: Position, shiftKey: boolean) => void;
}

export const GameGrid = ({ grid, size, onClick = noop, background = '', showWalls = false }: GameGridProps) => {
  const { width, height } = grid.size;
  const ref = useRef<HTMLCanvasElement>();
  const canvasWidth = width * size;
  const canvasHeight = height * size;
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);

  const draw = useCallback(() => {
    if (!ref.current) return;

    const ctx = ref.current.getContext('2d');


    if (!ctx) return;

    if (backgroundImage) {
      ctx.drawImage(backgroundImage, 0, 0, backgroundImage.width, backgroundImage.height, 0, 0, canvasWidth, canvasHeight);
    }

    const totalCells = width * height;

    for (let i = 0; i < totalCells; i++) {
      let position = {
        x: i % width,
        y: Math.floor(i / width)
      };

      const cellType = grid.get(position);
      const color = cellToColor(cellType);
      ctx.fillStyle = color;

      switch (cellType) {
        case GridCell.Block:
          if (showWalls) {
            ctx.fillRect(position.x * size, position.y * size, size, size);
          }
          break;

        default:
          ctx.beginPath();
          ctx.roundRect(position.x * size + size / 4, position.y * size + size / 4, size / 2, size / 2, size / 4);
          ctx.fill();
          ctx.closePath();
      }
    }

  }, [size, backgroundImage, canvasHeight, canvasWidth, grid, height, width, showWalls]);

  useEffect(() => {
    draw();
  });

  useEffect(() => {
    if (!background) setBackgroundImage(null);

    const image = new Image();

    image.onload = () => {
      setBackgroundImage(image);
    }

    image.src = background;

    return () => {
      image.onload = noop;
    }
  }, [background]);

  const onClickHandler = useCallback<MouseEventHandler>((e) => {
    const position = getPosition(e, size);
    onClick(position, e.shiftKey);
  }, [size, onClick]);

  const onMouseMove = useMemo<MouseEventHandler>(() => throttle((e) => {
    if (e.buttons === 1) {
      const position = getPosition(e, size);
      onClick(position, e.shiftKey);
    }
  }, 25), [size, onClick])

  return <canvas ref={ref as Ref<HTMLCanvasElement>} width={size * width} height={size * height} onClick={onClickHandler} onMouseMove={onMouseMove} />
}

function getPosition(e: React.MouseEvent<Element>, size: number) {
  const computedStyle = (e.target as Element).getBoundingClientRect();

  return {
    x: (e.clientX - computedStyle.left) / size | 0,
    y: (e.clientY - computedStyle.top) / size | 0,
  };
}

function cellToColor(gameCell: GridCell) {
  switch (gameCell) {
    case GridCell.Block:
      return '#0008';

    case GridCell.End:
      // return 'lightcoral';

    case GridCell.Trail:
      return 'darkgreen';

    case GridCell.Start:
      return 'green';

    default:
      return 'transparent';
  }
}
