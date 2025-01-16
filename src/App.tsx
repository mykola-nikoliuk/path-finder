import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { GameGrid } from './components/GameGrid/GameGrid';
import { GridCell, Position } from './types';
import { useGridMapEmitter } from './hooks/useGridMapEmitter';
import { GridMapEmitter } from './models/GridMapEmitter';
import { PathFinder } from './models/PathFinder';
import { debounce } from 'lodash';
import mapBackground from './components/GameGrid/mapBackground.jpg'
import { CharacterView } from './components/CharacterView/CharacterView';
import { Character } from './models/Character';

const GRID_SIZE = { width: 60, height: 90 };
const LOCAL_STORAGE_GRID_KEY = 'grid';
const cellSize = 24;

const startPosition = { x: 26, y: 0 };
const endPosition = { x: 14, y: 14 };

function App() {
  const grid = useGridMapEmitter(GRID_SIZE, GridCell.Empty, LOCAL_STORAGE_GRID_KEY);
  const pathFinder = useMemo(() => new PathFinder(grid), []);
  const character = useMemo(() => new Character(startPosition), []);
  const [charterPosition, setCharacterPosition] = useState<Position>(character.position);

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
    const onMapUpdate = () => saveGrid(grid);
    grid.emitter.on(GridMapEmitter.events.update, onMapUpdate);

    character.on(Character.events.moved, setCharacterPosition);

    pathFinder.setPoints(startPosition, endPosition);

    drawPath(pathFinder);
    character.goPath(pathFinder.getPath());

    return () => {
      grid.emitter.off(GridMapEmitter.events.update, onMapUpdate);
      character.off(Character.events.moved, setCharacterPosition);
    }
  }, [grid]);

  const onCellClick = useCallback((position: Position, shiftKey: Boolean) => {
    const cell = grid.get(position);
    if (!shiftKey) {
      grid.set(position, cell !== GridCell.Block ? GridCell.Block : GridCell.Empty);
    } else {
      pathFinder.setPoints(character.position, position);
      character.goPath(pathFinder.getPath());
      drawPath(pathFinder);
    }
  }, []);

  return (
    <div className="App">
      <GameGrid grid={grid} size={cellSize} onClick={onCellClick} background={mapBackground}>
        <CharacterView size={32} cellSize={cellSize} position={charterPosition} />
      </GameGrid>
    </div>
  );
}

export default App;
