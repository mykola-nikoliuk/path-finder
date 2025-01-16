import React, { Ref, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
const characterSize = 32;

const startPosition = { x: 26, y: 0 };
const endPosition = { x: 14, y: 14 };

function App() {
  const grid = useGridMapEmitter(GRID_SIZE, GridCell.Empty, LOCAL_STORAGE_GRID_KEY);
  const [gridVersion, setGridVersion] = useState(0);
  const pathFinder = useMemo(() => new PathFinder(grid), []);
  const character = useMemo(() => new Character(startPosition), []);
  const characterRef = useRef<HTMLDivElement>();

  const saveGrid = useCallback(debounce((grid: GridMapEmitter<GridCell>) => {
    window.localStorage.setItem(LOCAL_STORAGE_GRID_KEY, GridMapEmitter.stringify(grid));
  }, 1000), []);

  const setCharacterPosition = useCallback((position: Position) => {
    const characterView = characterRef.current;

    if (!characterView) return;

    const deltaSize = cellSize

    characterView.style.left = `${position.x * cellSize - deltaSize / 2}px`;
    characterView.style.top = `${position.y * cellSize - deltaSize / 2}px`;
  }, []);

  const drawPath = useCallback((pathFinder: PathFinder) => {
    grid.replaceValue([GridCell.Trail, GridCell.Start, GridCell.End], GridCell.Empty);

    const [start, ...path] = pathFinder.getPath();

    grid.set(start, GridCell.Start);
    grid.setBatch(path, GridCell.Trail);
    grid.set(path[path.length - 1], GridCell.End);
  }, []);

  useEffect(() => {
    const onMapUpdate = () => {
      setGridVersion(version => version + 1);
      saveGrid(grid);
    }
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
      <GameGrid grid={grid} gridVersion={gridVersion} size={cellSize} onClick={onCellClick} background={mapBackground} />
      <CharacterView size={characterSize} characterRef={characterRef as Ref<HTMLDivElement>} />
    </div>
  );
}

export default App;
