import React, { useCallback, useEffect, useRef } from 'react';
import './App.css';
import { GameGrid } from './components/GameGrid';
import { GridCell, Position } from './types';
import { useGridMapEmitter } from './hooks/useGridMapEmitter';
import { GridMapEmitter } from './models/GridMapEmitter';
import { PathFinder } from './models/PathFinder';

const GRID_SIZE = { width: 30, height: 30};
const LOCAL_STORAGE_GRID_KEY = 'grid';

function App() {
  const isEdit = useRef(true);

  const grid = useGridMapEmitter(GRID_SIZE, GridCell.Empty, LOCAL_STORAGE_GRID_KEY);

  useEffect(() => {
    grid.emitter.on(GridMapEmitter.events.update, () => {
      window.localStorage.setItem(LOCAL_STORAGE_GRID_KEY, GridMapEmitter.stringify(grid));
    });

    grid.replaceValue(GridCell.Trail, GridCell.Empty);

    const pathFinder = new PathFinder(grid);
    pathFinder.setFrom({x: 0, y: 0});
    pathFinder.setTo({x: 14, y: 14});
    const path = pathFinder.getPath();

    console.log(path);
    grid.setBatch(path, GridCell.Trail);
  }, [grid]);

  const onCellClick = useCallback((position: Position) => {
    const cell = grid.get(position);
    if (isEdit.current) {
      grid.set(position, cell === GridCell.Empty ? GridCell.Block : GridCell.Empty);
    } else {

    }
  }, []);

  return (
    <div className="App">
      <GameGrid grid={grid} size={24} onClick={onCellClick}/>
    </div>
  );
}

export default App;
