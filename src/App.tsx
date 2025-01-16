import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import './App.css';
import { GameGrid } from './components/GameGrid/GameGrid';
import { GridCell, Position } from './types';
import { useGridMapEmitter } from './hooks/useGridMapEmitter';
import { GridMapEmitter } from './models/GridMapEmitter';
import { PathFinder } from './models/PathFinder';
import { debounce } from 'lodash';
import mapBackground from './components/GameGrid/mapBackground.jpg'

const GRID_SIZE = { width: 60, height: 90};
const LOCAL_STORAGE_GRID_KEY = 'grid';

function App() {
  const grid = useGridMapEmitter(GRID_SIZE, GridCell.Empty, LOCAL_STORAGE_GRID_KEY);
  const pathFinder = useMemo(() => new PathFinder(grid), []);

  const saveGrid = useCallback(debounce((grid: GridMapEmitter<GridCell>) => {
    window.localStorage.setItem(LOCAL_STORAGE_GRID_KEY, GridMapEmitter.stringify(grid));
  }, 1000), []);

  const drawPath = useCallback((pathFinder: PathFinder) => {
    grid.replaceValue([GridCell.Trail, GridCell.Start, GridCell.End], GridCell.Empty);

    const [start, ...path] = pathFinder.getPath();

    grid.set(start, GridCell.Start);
    grid.setBatch(path, GridCell.Trail);
    grid.set(path[path.length - 1], GridCell.End);
  }, []);

  useEffect(() => {
    grid.emitter.on(GridMapEmitter.events.update, () => {
      saveGrid(grid);
    });

    pathFinder.setPoints({x: 26, y: 0}, {x: 14, y: 14});

    drawPath(pathFinder);
  }, [grid]);

  const onCellClick = useCallback((position: Position, shiftKey: Boolean) => {
    const cell = grid.get(position);
    if (!shiftKey) {
      grid.set(position, cell !== GridCell.Block ? GridCell.Block : GridCell.Empty);
      pathFinder.recalculate();
      drawPath(pathFinder);
    } else {
      pathFinder.setNextPoint(position);
      drawPath(pathFinder);
    }
  }, []);

  return (
    <div className="App">
      <GameGrid grid={grid} size={12} onClick={onCellClick} background={mapBackground}/>
    </div>
  );
}

export default App;
